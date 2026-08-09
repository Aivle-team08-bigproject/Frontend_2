import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Footer from '../../shared/Footer'
import GNB from '../../shared/GNB'
import SubNav from '../../shared/SubNav'
import DataStateNotice from '../../shared/DataStateNotice'
import { PrimaryButton } from '../../shared/layout.styles'
import { useAsyncData } from '../../shared/hooks'
import { fetchNotices } from '../../shared/api'
import { fetchCurrentUser } from '../../shared/currentUser'
import { PRACTITIONER_NAV_ITEMS } from '../PractitionerDashboard/data'
import {
  NoticeCard, NoticeHeader, NoticeMain, NoticeMeta, NoticePage, NoticeRow, NoticeRowTitle,
  NoticeTitle, PageButton, Pagination, SecondaryButton,
} from './Notice.styles'

const PAGE_SIZE = 20

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString('ko-KR')
}

export default function NoticeListPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const fetcher = useCallback(() => fetchNotices(page, PAGE_SIZE), [page])
  const { data, loading, error } = useAsyncData(fetcher)
  const currentUser = useAsyncData(fetchCurrentUser)
  const isAdmin = currentUser.data?.roleCode === 'ADMIN'
  const totalPages = data ? Math.max(1, Math.ceil(data.total_count / PAGE_SIZE)) : 1
  const pages = useMemo(() => Array.from({ length: totalPages }, (_, index) => index + 1), [totalPages])

  return (
    <NoticePage>
      <GNB />
      <SubNav activeTo="/notices" items={PRACTITIONER_NAV_ITEMS} />
      <NoticeMain>
        <NoticeHeader>
          <NoticeTitle>공지사항</NoticeTitle>
          {isAdmin && <>
            <SecondaryButton type="button" onClick={() => navigate('/notices/manage')}>공지 관리</SecondaryButton>
            <PrimaryButton type="button" onClick={() => navigate('/notices/new')}>공지 작성</PrimaryButton>
          </>}
        </NoticeHeader>
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
