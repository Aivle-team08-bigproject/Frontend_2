import { useCallback, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Footer from '../../shared/Footer'
import GNB from '../../shared/GNB'
import SubNav from '../../shared/SubNav'
import DataStateNotice from '../../shared/DataStateNotice'
import { useAsyncData } from '../../shared/hooks'
import { deleteNotice, fetchNotice } from '../../shared/api'
import { fetchCurrentUser } from '../../shared/currentUser'
import { PRACTITIONER_NAV_ITEMS } from '../PractitionerDashboard/data'
import {
  NoticeContent, NoticeDetailCard, NoticeDetailTitle, NoticeMain, NoticeMeta, NoticePage,
  NoticeActions, SecondaryButton,
} from './Notice.styles'

export default function NoticeDetailPage() {
  const { noticeId } = useParams()
  const navigate = useNavigate()
  const id = Number(noticeId)
  const fetcher = useCallback(() => fetchNotice(id), [id])
  const { data, loading, error } = useAsyncData(fetcher)
  const currentUser = useAsyncData(fetchCurrentUser)
  const [actionError, setActionError] = useState('')
  const isAdmin = currentUser.data?.roleCode === 'ADMIN'

  async function remove() {
    if (!window.confirm('이 공지사항을 삭제할까요? 삭제된 공지는 관리자 목록에서 보관 상태로 유지됩니다.')) return
    setActionError('')
    try {
      await deleteNotice(id)
      navigate('/notices')
    } catch (caught) {
      setActionError(caught instanceof Error ? caught.message : '공지사항을 삭제하지 못했습니다.')
    }
  }

  return (
    <NoticePage>
      <GNB />
      <SubNav activeTo="/notices" items={PRACTITIONER_NAV_ITEMS} />
      <NoticeMain>
        <Link to="/notices">← 공지사항 목록</Link>
        <DataStateNotice loading={loading} error={error} empty={!loading && !error && !data} subject="공지사항" />
        {data && (
          <NoticeDetailCard>
            <NoticeDetailTitle>{data.title}</NoticeDetailTitle>
            <NoticeMeta>{data.author_name} · {new Date(data.published_at).toLocaleDateString('ko-KR')}</NoticeMeta>
            <NoticeContent>{data.content}</NoticeContent>
            {isAdmin && <NoticeActions>
              <SecondaryButton type="button" onClick={() => navigate(`/notices/${id}/edit`)}>수정</SecondaryButton>
              <SecondaryButton type="button" onClick={remove}>삭제</SecondaryButton>
            </NoticeActions>}
          </NoticeDetailCard>
        )}
        {actionError && <div role="alert">{actionError}</div>}
      </NoticeMain>
      <Footer />
    </NoticePage>
  )
}
