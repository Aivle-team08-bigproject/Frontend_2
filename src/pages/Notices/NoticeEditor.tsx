import { useEffect, useState, type FormEvent } from 'react'
import { PrimaryButton } from '../../shared/layout.styles'
import type { NoticeAdminItem, NoticeStatus, NoticeWritePayload } from '../../shared/api'
import {
  FormActions, NoticeDescription, NoticeFieldLabel, NoticeForm, NoticeInput, NoticePageIntro,
  NoticeSelect, NoticeTextarea, SecondaryButton,
} from './Notice.styles'

type Props = {
  mode: 'create' | 'edit'
  initial?: Partial<NoticeAdminItem>
  saving: boolean
  error: string
  onCancel: () => void
  onSubmit: (payload: NoticeWritePayload) => Promise<void>
}

const STATUS_LABEL: Record<NoticeStatus, string> = {
  DRAFT: '임시 저장',
  PUBLISHED: '게시',
  ARCHIVED: '보관',
}

function availableStatuses(mode: Props['mode'], current: NoticeStatus): NoticeStatus[] {
  if (mode === 'create') return ['DRAFT', 'PUBLISHED']
  if (current === 'DRAFT') return ['DRAFT', 'PUBLISHED', 'ARCHIVED']
  if (current === 'PUBLISHED') return ['PUBLISHED', 'ARCHIVED']
  return ['ARCHIVED']
}

export default function NoticeEditor({ mode, initial, saving, error, onCancel, onSubmit }: Props) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [content, setContent] = useState(initial?.content ?? '')
  const [status, setStatus] = useState<NoticeStatus>(initial?.status ?? 'DRAFT')
  const statuses = availableStatuses(mode, initial?.status ?? 'DRAFT')

  useEffect(() => {
    setTitle(initial?.title ?? '')
    setContent(initial?.content ?? '')
    setStatus(initial?.status ?? 'DRAFT')
  }, [initial?.id, initial?.title, initial?.content, initial?.status])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await onSubmit({ title: title.trim(), content: content.trim(), status })
  }

  return (
    <NoticeForm onSubmit={submit}>
      <NoticeFieldLabel>
        제목
        <NoticeInput value={title} onChange={(event) => setTitle(event.target.value)} maxLength={200} required />
      </NoticeFieldLabel>
      <NoticeFieldLabel>
        본문
        <NoticeTextarea value={content} onChange={(event) => setContent(event.target.value)} maxLength={20000} required />
      </NoticeFieldLabel>
      <NoticeFieldLabel>
        게시 상태
        <NoticeSelect value={status} onChange={(event) => setStatus(event.target.value as NoticeStatus)}>
          {statuses.map((value) => <option key={value} value={value}>{STATUS_LABEL[value]}</option>)}
        </NoticeSelect>
      </NoticeFieldLabel>
      <NoticePageIntro>
        <NoticeDescription>제목은 200자, 본문은 20,000자까지 입력할 수 있습니다.</NoticeDescription>
        {error && <NoticeDescription role="alert">{error}</NoticeDescription>}
      </NoticePageIntro>
      <FormActions>
        <SecondaryButton type="button" onClick={onCancel}>취소</SecondaryButton>
        <PrimaryButton type="submit" disabled={saving}>{saving ? '저장 중...' : mode === 'create' ? '저장하기' : '수정 저장'}</PrimaryButton>
      </FormActions>
    </NoticeForm>
  )
}
