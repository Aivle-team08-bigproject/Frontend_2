import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Footer from '../../shared/Footer'
import GNB from '../../shared/GNB'
import SubNav from '../../shared/SubNav'
import DataStateNotice from '../../shared/DataStateNotice'
import { PrimaryButton } from '../../shared/layout.styles'
import { useAsyncData } from '../../shared/hooks'
import { fetchNotice, updateNotice } from '../../shared/api'
import { fetchCurrentUser } from '../../shared/currentUser'
import { PRACTITIONER_NAV_ITEMS } from '../PractitionerDashboard/data'
import {
  FormActions, NoticeContent, NoticeDetailCard, NoticeDetailTitle, NoticeForm, NoticeInput,
  NoticeMain, NoticeMeta, NoticePage, NoticeTextarea, NoticeActions, SecondaryButton,
} from './Notice.styles'

export default function NoticeDetailPage() {
  const { noticeId } = useParams()
  const navigate = useNavigate()
  const id = Number(noticeId)
  const fetcher = useCallback(() => fetchNotice(id), [id])
  const { data, loading, error } = useAsyncData(fetcher)
  const currentUser = useAsyncData(fetchCurrentUser)
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const isAdmin = currentUser.data?.roleCode === 'ADMIN'

  useEffect(() => {
    if (data) {
      setTitle(data.title)
      setContent(data.content)
    }
  }, [data])

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setFormError('')
    try {
      await updateNotice(id, { title: title.trim(), content: content.trim() })
      setEditing(false)
      window.location.reload()
    } catch (caught) {
      setFormError(caught instanceof Error ? caught.message : '공지사항을 수정하지 못했습니다.')
    } finally {
      setSaving(false)
    }
  }

  async function archive() {
    if (!window.confirm('이 공지사항을 보관 처리할까요?')) return
    try {
      await updateNotice(id, { status: 'ARCHIVED' })
      navigate('/notices')
    } catch (caught) {
      setFormError(caught instanceof Error ? caught.message : '공지사항을 보관하지 못했습니다.')
    }
  }

  return (
    <NoticePage>
      <GNB />
      <SubNav activeTo="/notices" items={PRACTITIONER_NAV_ITEMS} />
      <NoticeMain>
        <Link to="/notices">← 공지사항 목록</Link>
        <DataStateNotice loading={loading} error={error} empty={!loading && !error && !data} subject="공지사항" />
        {data && !editing && (
          <NoticeDetailCard>
            <NoticeDetailTitle>{data.title}</NoticeDetailTitle>
            <NoticeMeta>{data.author_name} · {new Date(data.published_at).toLocaleDateString('ko-KR')}</NoticeMeta>
            <NoticeContent>{data.content}</NoticeContent>
            {isAdmin && <NoticeActions>
              <SecondaryButton type="button" onClick={() => navigate(`/notices/${id}/edit`)}>수정</SecondaryButton>
              <SecondaryButton type="button" onClick={archive}>보관</SecondaryButton>
            </NoticeActions>}
          </NoticeDetailCard>
        )}
        {data && editing && (
          <NoticeForm onSubmit={save}>
            <NoticeInput aria-label="공지 제목" value={title} onChange={(event) => setTitle(event.target.value)} maxLength={200} required />
            <NoticeTextarea aria-label="공지 내용" value={content} onChange={(event) => setContent(event.target.value)} maxLength={20000} required />
            {formError && <div role="alert">{formError}</div>}
            <FormActions>
              <SecondaryButton type="button" onClick={() => setEditing(false)}>취소</SecondaryButton>
              <PrimaryButton type="submit" disabled={saving}>{saving ? '저장 중...' : '저장'}</PrimaryButton>
            </FormActions>
          </NoticeForm>
        )}
      </NoticeMain>
      <Footer />
    </NoticePage>
  )
}
