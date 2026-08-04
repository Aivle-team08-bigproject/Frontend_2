// 백엔드는 app/common/time_utils.py의 utcnow()/as_utc()를 거쳐 모든 시각을
// timezone-aware UTC로 직렬화한다(ISO 8601 + 오프셋). 따라서 프론트에서는
// 문자열을 그대로 Date에 넘기면 되고, 임의로 'Z'를 덧붙이면 안 된다.

const timeFormatter = new Intl.DateTimeFormat('ko-KR', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
})

function parse(value: string): Date | null {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

/** `14:23:05` 형태의 시:분:초. 파싱 실패 시 원본 문자열을 그대로 돌려준다. */
export function formatTime(value: string): string {
  const date = parse(value)
  return date ? timeFormatter.format(date) : value
}

/** `2026.07.31` 형태의 날짜. 파싱 실패 시 원본 문자열을 그대로 돌려준다. */
export function formatDate(value: string): string {
  const date = parse(value)
  if (!date) return value
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
}
