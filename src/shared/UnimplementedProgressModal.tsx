import { useNavigate } from 'react-router-dom'
import { ProgressModal, ProgressModalActions, ProgressModalBackdrop, ProgressModalButton, ProgressModalMessage, ProgressModalTitle } from './UnimplementedProgressModal.styles'

type UnimplementedProgressModalProps = {
  stageLabel: string
  requestNo?: string
  runId?: string
}

export default function UnimplementedProgressModal({ stageLabel, requestNo, runId }: UnimplementedProgressModalProps) {
  const navigate = useNavigate()
  const canNavigate = Boolean(requestNo && runId)

  return (
    <ProgressModalBackdrop role="dialog" aria-modal="true" aria-labelledby="progress-modal-title">
      <ProgressModal>
        <ProgressModalTitle id="progress-modal-title">{stageLabel} 진행 화면</ProgressModalTitle>
        <ProgressModalMessage>진행 중입니다. 완료 후 다시 접근 해주세요.</ProgressModalMessage>
        {canNavigate && (
          <ProgressModalActions>
            <ProgressModalButton type="button" onClick={() => navigate(`/tasks/${requestNo}/runs/${runId}/detail`)}>
              작업 상세로
            </ProgressModalButton>
            <ProgressModalButton type="button" onClick={() => navigate('/dashboard/tasks')}>
              작업 리스트로
            </ProgressModalButton>
          </ProgressModalActions>
        )}
      </ProgressModal>
    </ProgressModalBackdrop>
  )
}
