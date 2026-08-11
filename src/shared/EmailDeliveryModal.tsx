import { type FormEvent, useEffect, useRef, useState } from 'react'
import { fetchCurrentEmployee, issueCustomerApiKey, requestSampleEmailDelivery, type CustomerApiKeyResponse } from './api'
import { subscribeEmailDeliveryStatus, type EmailDeliveryStatusFrame } from './emailDeliveryStream'
import {
  EmailCancelButton,
  EmailInput,
  EmailStatus,
  EmailSubmitButton,
  ModalActions,
  ModalBody,
  ModalCard,
  ModalCloseButton,
  ModalHeader,
  ModalHint,
  ModalLabel,
  ModalOverlay,
  ModalResultIcon,
  ModalSpinner,
  ModalStatusPanel,
  ModalStatusText,
  ModalTitle,
} from './EmailDeliveryModal.styles'

type EmailPhase = 'form' | 'submitting' | 'tracking' | 'success' | 'failure'

const EMAIL_SUCCESS_STATUSES = new Set(['SENT', 'DELIVERED'])
const EMAIL_FAILURE_STATUSES = new Set(['FAILED', 'BOUNCED', 'COMPLAINT'])

type EmailDeliveryModalProps = {
  runId: number
  deliveryType: 'SELECTION_SAMPLE' | 'FINAL_ARTIFACT'
  title: string
  hint: string
  open: boolean
  onClose: () => void
  apiCredentials?: CustomerApiKeyResponse | null
  onApiCredentialsIssued?: (credentials: CustomerApiKeyResponse) => void
}

/** 샘플/최종 산출물 메일 발송 공용 모달. 제출 → SSE 추적 → 완료/실패 표시까지 담당한다. */
export default function EmailDeliveryModal({ runId, deliveryType, title, hint, open, onClose, apiCredentials, onApiCredentialsIssued }: EmailDeliveryModalProps) {
  const [emailRecipient, setEmailRecipient] = useState('')
  const [emailPhase, setEmailPhase] = useState<EmailPhase>('form')
  const [emailError, setEmailError] = useState<string | null>(null)
  const [emailFailureCode, setEmailFailureCode] = useState<string | null>(null)
  const emailUnsubscribeRef = useRef<(() => void) | null>(null)

  function stopTracking() {
    emailUnsubscribeRef.current?.()
    emailUnsubscribeRef.current = null
  }

  useEffect(() => {
    if (!open) return
    setEmailError(null)
    setEmailFailureCode(null)
    setEmailPhase('form')
    if (!emailRecipient.trim()) {
      fetchCurrentEmployee()
        .then((employee) => setEmailRecipient(employee.email))
        .catch(() => {
          // 자동 채우기 실패 시 사용자가 직접 입력하면 된다.
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  function trackDelivery(deliveryId: string) {
    stopTracking()
    emailUnsubscribeRef.current = subscribeEmailDeliveryStatus(
      runId,
      deliveryId,
      (frame: EmailDeliveryStatusFrame) => {
        if (EMAIL_SUCCESS_STATUSES.has(frame.status)) {
          setEmailPhase('success')
          stopTracking()
        } else if (EMAIL_FAILURE_STATUSES.has(frame.status)) {
          setEmailPhase('failure')
          setEmailFailureCode(frame.failure_code)
          stopTracking()
        }
      },
      () => {
        setEmailPhase('failure')
        setEmailFailureCode(null)
        setEmailError('발송 상태를 확인하는 중 연결이 끊어졌습니다.')
        stopTracking()
      },
    )
  }

  function handleClose() {
    stopTracking()
    onClose()
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (emailPhase === 'submitting' || !emailRecipient.trim()) return
    setEmailPhase('submitting')
    setEmailError(null)
    setEmailFailureCode(null)
    try {
      let credentials = apiCredentials
      if (deliveryType === 'FINAL_ARTIFACT' && !credentials) {
        credentials = await issueCustomerApiKey(runId)
        onApiCredentialsIssued?.(credentials)
      }
      const result = await requestSampleEmailDelivery(runId, {
        recipient: emailRecipient.trim(),
        delivery_type: deliveryType,
        api_endpoint_url: credentials?.endpoint_url,
        api_key: credentials?.api_key,
      })
      if (EMAIL_SUCCESS_STATUSES.has(result.status)) {
        setEmailPhase('success')
      } else if (EMAIL_FAILURE_STATUSES.has(result.status)) {
        setEmailPhase('failure')
        setEmailFailureCode(result.failure_code)
      } else {
        setEmailPhase('tracking')
        trackDelivery(result.delivery_id)
      }
    } catch (err) {
      setEmailPhase('form')
      setEmailError(err instanceof Error ? err.message : '메일 발송 요청에 실패했습니다.')
    }
  }

  if (!open) return null

  return (
    <ModalOverlay>
      <ModalCard>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <ModalCloseButton type="button" onClick={handleClose} aria-label="닫기">
            ✕
          </ModalCloseButton>
        </ModalHeader>

        {(emailPhase === 'form' || emailPhase === 'submitting') && (
          <ModalBody onSubmit={handleSubmit}>
            <ModalLabel htmlFor="email-recipient">받는 사람 이메일</ModalLabel>
            <EmailInput
              id="email-recipient"
              type="email"
              value={emailRecipient}
              onChange={(event) => setEmailRecipient(event.target.value)}
              placeholder="받는 사람 이메일"
              autoComplete="email"
              disabled={emailPhase === 'submitting'}
              required
            />
            <ModalHint>{hint}</ModalHint>
            {emailError && <EmailStatus $error>{emailError}</EmailStatus>}
            <ModalActions>
              <EmailCancelButton type="button" onClick={handleClose} disabled={emailPhase === 'submitting'}>
                취소
              </EmailCancelButton>
              <EmailSubmitButton type="submit" disabled={emailPhase === 'submitting' || !emailRecipient.trim()}>
                {emailPhase === 'submitting' ? '접수 중...' : '발송 요청'}
              </EmailSubmitButton>
            </ModalActions>
          </ModalBody>
        )}

        {emailPhase === 'tracking' && (
          <ModalStatusPanel>
            <ModalSpinner />
            <ModalStatusText>메일 발송 처리 중입니다...</ModalStatusText>
          </ModalStatusPanel>
        )}

        {emailPhase === 'success' && (
          <ModalStatusPanel>
            <ModalResultIcon>✓</ModalResultIcon>
            <ModalStatusText>{emailRecipient}(으)로 메일 발송이 완료되었습니다.</ModalStatusText>
          </ModalStatusPanel>
        )}

        {emailPhase === 'failure' && (
          <ModalStatusPanel>
            <ModalResultIcon $error>✕</ModalResultIcon>
            <ModalStatusText $error>
              메일 발송에 실패했습니다{emailFailureCode ? ` (${emailFailureCode})` : ''}.
            </ModalStatusText>
            {emailError && <ModalStatusText $error>{emailError}</ModalStatusText>}
          </ModalStatusPanel>
        )}
      </ModalCard>
    </ModalOverlay>
  )
}
