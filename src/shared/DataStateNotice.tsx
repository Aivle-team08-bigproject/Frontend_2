import { DataNotice } from './layout.styles'

type Props = {
  loading: boolean
  error: unknown
  /** 조회는 성공했지만 표시할 항목이 없을 때 true. */
  empty?: boolean
  /** "요청 목록" 처럼 무엇을 불러오는지 알려주는 이름. */
  subject?: string
}

/**
 * 조회 상태 배너. 데이터가 없어도 화면은 빈 값으로 렌더링하고 이 배너만 얹는다.
 * 로딩/실패/빈 결과가 모두 아니면 아무것도 그리지 않는다.
 */
export default function DataStateNotice({ loading, error, empty, subject = '데이터' }: Props) {
  if (loading) return <DataNotice>{subject}를 불러오는 중입니다...</DataNotice>
  if (error) {
    const reason = error instanceof Error ? error.message : ''
    return (
      <DataNotice $error role="alert">
        {subject}를 불러오지 못했습니다. 빈 화면으로 표시합니다.{reason ? ` (${reason})` : ''}
      </DataNotice>
    )
  }
  if (empty) return <DataNotice>표시할 {subject}가 없습니다.</DataNotice>
  return null
}
