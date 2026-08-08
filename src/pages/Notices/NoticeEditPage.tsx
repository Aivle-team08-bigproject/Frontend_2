import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Footer from '../../shared/Footer'
import GNB from '../../shared/GNB'
import SubNav from '../../shared/SubNav'
import { useAsyncData } from '../../shared/hooks'
import { fetchAdminNotice, updateNotice, type NoticeWritePayload } from '../../shared/api'
import { fetchCurrentUser } from '../../shared/currentUser'
import { PRACTITIONER_NAV_ITEMS } from '../PractitionerDashboard/data'
import DataStateNotice from '../../shared/DataStateNotice'
import { NoticeHeader, NoticeMain, NoticePage, NoticePageIntro, NoticeTitle } from './Notice.styles'
import NoticeEditor from './NoticeEditor'

export default function NoticeEditPage() {
  const { noticeId } = useParams()
  const navigate = useNavigate()
  const id = Number(noticeId)
  const currentUser = useAsyncData(fetchCurrentUser)
  const fetcher = useCallback(() => fetchAdminNotice(id), [id])
  const notice = useAsyncData(fetcher)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const isAdmin = currentUser.data?.roleCode === 'ADMIN'

  useEffect(() => {
    if (!currentUser.loading && !isAdmin) navigate('/notices', { replace: true })
  }, [currentUser.loading, isAdmin, navigate])

  async function submit(payload: NoticeWritePayload) {
    setSaving(true)
    setError('')
    try {
      await updateNotice(id, payload)
      navigate(`/notices/${id}`)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : '공지사항을 수정하지 못했습니다.')
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
          <NoticePageIntro><NoticeTitle>공지사항 수정</NoticeTitle></NoticePageIntro>
        </NoticeHeader>
        <DataStateNotice loading={notice.loading} error={notice.error} empty={!notice.loading && !notice.error && !notice.data} subject="공지사항" />
        {isAdmin && notice.data && <NoticeEditor mode="edit" initial={notice.data} saving={saving} error={error} onCancel={() => navigate(`/notices/${id}`)} onSubmit={submit} />}
      </NoticeMain>
      <Footer />
    </NoticePage>
  )
}
