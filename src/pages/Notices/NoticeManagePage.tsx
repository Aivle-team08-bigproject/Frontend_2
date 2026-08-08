import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Footer from '../../shared/Footer'
import GNB from '../../shared/GNB'
import SubNav from '../../shared/SubNav'
import DataStateNotice from '../../shared/DataStateNotice'
import { PrimaryButton } from '../../shared/layout.styles'
import { useAsyncData } from '../../shared/hooks'
import { fetchAdminNotices, type NoticeStatus } from '../../shared/api'
import { fetchCurrentUser } from '../../shared/currentUser'
import { PRACTITIONER_NAV_ITEMS } from '../PractitionerDashboard/data'
import {
  NoticeCard, NoticeHeader, NoticeMain, NoticeMeta, NoticePage, NoticePageIntro,
  NoticeRow, NoticeRowTitle, NoticeStatusBadge, NoticeTitle, SecondaryButton,
} from './Notice.styles'

const STATUS_LABEL: Record<NoticeStatus, string> = { DRAFT: '임시 저장', PUBLISHED: '게시', ARCHIVED: '보관' }

export default function NoticeManagePage() {
  const navigate = useNavigate()
  const currentUser = useAsyncData(fetchCurrentUser)
  const [status, setStatus] = useState<NoticeStatus | undefined>(undefined)
  const fetcher = useCallback(() => fetchAdminNotices(1, 100, status), [status])
  const notices = useAsyncData(fetcher)
  const isAdmin = currentUser.data?.roleCode === 'ADMIN'
  const statuses = useMemo(() => [undefined, 'DRAFT', 'PUBLISHED', 'ARCHIVED'] as const, [])

  useEffect(() => {
    if (!currentUser.loading && !isAdmin) navigate('/notices', { replace: true })
  }, [currentUser.loading, isAdmin, navigate])

  if (!currentUser.loading && !isAdmin) return null

  return (
    <NoticePage>
      <GNB />
      <SubNav activeTo="/notices" items={PRACTITIONER_NAV_ITEMS} />
      <NoticeMain>
        <NoticeHeader>
          <NoticePageIntro><NoticeTitle>공지사항 관리</NoticeTitle><NoticeMeta>초안·게시·보관 상태를 관리합니다.</NoticeMeta></NoticePageIntro>
          <PrimaryButton type="button" onClick={() => navigate('/notices/new')}>공지 작성</PrimaryButton>
        </NoticeHeader>
        <NoticeHeader>
          <NoticeMeta>상태 필터</NoticeMeta>
          <div>
            {statuses.map((value) => <SecondaryButton key={value ?? 'ALL'} type="button" onClick={() => setStatus(value)}>{value ? STATUS_LABEL[value] : '전체'}</SecondaryButton>)}
          </div>
        </NoticeHeader>
        <DataStateNotice loading={notices.loading} error={notices.error} empty={!notices.loading && !notices.error && notices.data?.items.length === 0} subject="관리자 공지사항" />
        {notices.data && notices.data.items.length > 0 && <NoticeCard>
          {notices.data.items.map((notice) => <NoticeRow key={notice.id} type="button" onClick={() => navigate(`/notices/${notice.id}/edit`)}>
            <NoticePageIntro><NoticeRowTitle>{notice.title}</NoticeRowTitle><NoticeMeta>{notice.author_name} · {new Date(notice.updated_at).toLocaleDateString('ko-KR')}</NoticeMeta></NoticePageIntro>
            <NoticeStatusBadge $status={notice.status}>{STATUS_LABEL[notice.status]}</NoticeStatusBadge>
          </NoticeRow>)}
        </NoticeCard>}
      </NoticeMain>
      <Footer />
    </NoticePage>
  )
}
