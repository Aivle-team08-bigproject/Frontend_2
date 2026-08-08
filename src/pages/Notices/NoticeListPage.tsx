import { useCallback, useMemo, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import Footer from '../../shared/Footer'
import GNB from '../../shared/GNB'
import SubNav from '../../shared/SubNav'
import DataStateNotice from '../../shared/DataStateNotice'
import { PrimaryButton } from '../../shared/layout.styles'
import { useAsyncData } from '../../shared/hooks'
import { createNotice, fetchNotices } from '../../shared/api'
import { fetchCurrentUser } from '../../shared/currentUser'
import { PRACTITIONER_NAV_ITEMS } from '../PractitionerDashboard/data'
import {
  FormActions, NoticeCard, NoticeForm, NoticeHeader, NoticeInput, NoticeMain, NoticeMeta,
  NoticePage, NoticeRow, NoticeRowTitle, NoticeTextarea, NoticeTitle, PageButton, Pagination,
  SecondaryButton,
} from './Notice.styles'

const PAGE_SIZE = 20

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString('ko-KR')
}

export default function NoticeListPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const fetcher = useCallback(() => fetchNotices(page, PAGE_SIZE), [page])
  const { data, loading, error } = useAsyncData(fetcher)
  const currentUser = useAsyncData(fetchCurrentUser)
  const isAdmin = currentUser.data?.roleCode === 'ADMIN'
  const totalPages = data ? Math.max(1, Math.ceil(data.total_count / PAGE_SIZE)) : 1
  const pages = useMemo(() => Array.from({ length: totalPages }, (_, index) => index + 1), [totalPages])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setFormError('')
    try {
      const created = await createNotice({ title: title.trim(), content: content.trim(), status: 'PUBLISHED' })
      navigate(`/notices/${created.id}`)
    } catch (caught) {
      setFormError(caught instanceof Error ? caught.message : '공지사항을 저장하지 못했습니다.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <NoticePage>
      <GNB />
      <SubNav activeTo="/notices" items={PRACTITIONER_NAV_ITEMS} />
      <NoticeMain>
        <NoticeHeader>
          <NoticeTitle>공지사항</NoticeTitle>
          {isAdmin && <PrimaryButton type="button" onClick={() => setShowForm((open) => !open)}>공지 작성</PrimaryButton>}
        </NoticeHeader>
        {showForm && isAdmin && (
          <NoticeForm onSubmit={submit}>
            <NoticeInput aria-label="공지 제목" placeholder="제목" value={title} onChange={(event) => setTitle(event.target.value)} maxLength={200} required />
            <NoticeTextarea aria-label="공지 내용" placeholder="공지 내용을 입력하세요" value={content} onChange={(event) => setContent(event.target.value)} maxLength={20000} required />
            {formError && <div role="alert">{formError}</div>}
            <FormActions>
              <SecondaryButton type="button" onClick={() => setShowForm(false)}>취소</SecondaryButton>
              <PrimaryButton type="submit" disabled={saving}>{saving ? '게시 중...' : '게시하기'}</PrimaryButton>
            </FormActions>
          </NoticeForm>
        )}
        <DataStateNotice loading={loading} error={error} empty={!loading && !error && data?.items.length === 0} subject="공지사항" />
        {data && data.items.length > 0 && (
          <NoticeCard>
            {data.items.map((notice) => (
              <NoticeRow key={notice.id} type="button" onClick={() => navigate(`/notices/${notice.id}`)}>
                <NoticeRowTitle>{notice.title}</NoticeRowTitle>
                <NoticeMeta>{notice.author_name} · {formatDate(notice.published_at)}</NoticeMeta>
              </NoticeRow>
            ))}
          </NoticeCard>
        )}
        {data && totalPages > 1 && <Pagination aria-label="공지사항 페이지 이동">
          {pages.map((value) => <PageButton key={value} type="button" $active={value === page} onClick={() => setPage(value)}>{value}</PageButton>)}
        </Pagination>}
      </NoticeMain>
      <Footer />
    </NoticePage>
  )
}
