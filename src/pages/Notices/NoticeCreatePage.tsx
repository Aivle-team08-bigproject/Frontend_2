import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Footer from '../../shared/Footer'
import GNB from '../../shared/GNB'
import SubNav from '../../shared/SubNav'
import { useAsyncData } from '../../shared/hooks'
import { createNotice, type NoticeWritePayload } from '../../shared/api'
import { fetchCurrentUser } from '../../shared/currentUser'
import { PRACTITIONER_NAV_ITEMS } from '../PractitionerDashboard/data'
import { NoticeHeader, NoticeMain, NoticePage, NoticePageIntro, NoticeTitle } from './Notice.styles'
import NoticeEditor from './NoticeEditor'

export default function NoticeCreatePage() {
  const navigate = useNavigate()
  const currentUser = useAsyncData(fetchCurrentUser)
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
      const created = await createNotice(payload)
      navigate(payload.status === 'PUBLISHED' ? `/notices/${created.id}` : `/notices/${created.id}/edit`)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : '공지사항을 저장하지 못했습니다.')
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
          <NoticePageIntro>
            <NoticeTitle>공지사항 작성</NoticeTitle>
          </NoticePageIntro>
        </NoticeHeader>
        {isAdmin && <NoticeEditor mode="create" saving={saving} error={error} onCancel={() => navigate('/notices')} onSubmit={submit} />}
      </NoticeMain>
      <Footer />
    </NoticePage>
  )
}
