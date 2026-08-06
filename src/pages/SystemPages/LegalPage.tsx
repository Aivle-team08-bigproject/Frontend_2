import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Footer from '../../shared/Footer'
import Logo from '../../shared/Logo'
import {
  DocumentBody,
  DocumentFacts,
  DocumentHeader,
  DocumentLayout,
  DocumentMeta,
  DocumentNav,
  DocumentTitle,
  FactRow,
  Section,
  SectionBody,
  SectionTitle,
  TableScroll,
  LegalTable as StyledLegalTable,
  TableHead,
  TableCell,
  TableRow,
  TableHeaderCell,
  TableOfContents,
  PrintButton,
  DocumentFooter,
} from './LegalPage.styles'

type LegalType = 'terms' | 'privacy'

type SectionData = {
  id: string
  title: string
  body: string
  table?: {
    headers: string[]
    rows: string[][]
  }
}

const termsSections: SectionData[] = [
  { id: 'terms-1', title: '제1조 총칙 및 목적', body: '이 약관은 하나카드 주식회사(이하 “회사”)가 임직원 및 내부 업무상 초대된 사용자에게 제공하는 하나 데이터 플랫폼(이하 “서비스”)의 이용 조건, 절차, 권리·의무와 책임사항을 정함을 목적으로 합니다.' },
  { id: 'terms-2', title: '제2조 용어의 정의', body: '“회원”은 회사가 정한 절차에 따라 가입 신청과 관리자 승인을 완료한 사람을 말합니다. “데이터 활용 요청”은 회원이 업무 목적의 데이터 활용을 위해 서비스에 등록하는 요청을 말하며, “산출물”은 요청에 따라 서비스가 제공하는 분석·가공 결과를 말합니다.' },
  { id: 'terms-3', title: '제3조 서비스의 제공 범위와 변경', body: '회사는 데이터 활용 요청 등록, 요청 진행상태 확인, 검토·승인 및 산출물 확인 기능을 제공합니다. 회사는 보안, 운영, 정책 또는 기술상의 필요에 따라 서비스의 일부 또는 전부를 변경·중단할 수 있으며, 중요한 변경은 서비스 내 공지로 안내합니다.' },
  { id: 'terms-4', title: '제4조 회원가입·승인·계정 관리', body: '회원가입 신청에는 정확한 회사 이메일, 이름, 휴대폰 번호, 부서 및 직급 정보를 사용해야 합니다. 가입 신청은 관리자 승인 후 활성화되며, 회원은 비밀번호와 인증정보를 직접 관리하고 제3자에게 공유해서는 안 됩니다.' },
  { id: 'terms-5', title: '제5조 권한과 서비스 이용 범위', body: '회원은 회사가 부여한 역할과 권한의 범위에서만 서비스에 접근할 수 있습니다. 회원은 자신에게 부여되지 않은 데이터, 요청, 관리자 기능 또는 다른 회원의 개인정보에 접근·조회·변경을 시도해서는 안 됩니다.' },
  { id: 'terms-6', title: '제6조 데이터 활용 요청과 결과물', body: '회원은 업무상 필요한 목적과 승인된 범위에서만 데이터 활용 요청을 등록해야 합니다. 원천 데이터와 산출물은 회사 업무 목적에 한해 사용하며, 외부 반출·재배포·개인적 이용·제3자 제공은 별도 승인 없이 할 수 없습니다.' },
  { id: 'terms-7', title: '제7조 금지행위와 보안 의무', body: '회원은 허위 정보 등록, 계정 양도·대여, 권한 우회, 악성 코드·스크립트 전송, 서비스 취약점 탐색, 승인되지 않은 원천 데이터 업로드, 화면·파일·로그의 무단 복사 및 외부 공유를 해서는 안 됩니다. 보안사고나 이상 접근을 발견하면 즉시 관리자에게 신고해야 합니다.' },
  { id: 'terms-8', title: '제8조 이용 제한·정지·탈퇴', body: '회사는 약관·보안정책 위반, 계정 침해, 장기간 미사용, 임직원 자격 상실 또는 서비스 운영상 필요가 있는 경우 이용을 제한하거나 계정을 정지·비활성화할 수 있습니다. 회원은 관리자에게 계정 정리 또는 탈퇴를 요청할 수 있으며, 보존이 필요한 기록은 관련 정책과 법령에 따라 별도 보관될 수 있습니다.' },
  { id: 'terms-9', title: '제9조 개인정보 및 기밀정보 보호', body: '회사는 개인정보 처리방침에 따라 회원의 개인정보를 처리합니다. 회원은 서비스에서 확인한 개인정보, 원천 데이터, 산출물 및 회사 기밀정보를 업무 목적 외로 이용하거나 외부에 공개해서는 안 됩니다.' },
  { id: 'terms-10', title: '제10조 지식재산권과 결과물의 권리', body: '서비스 화면, 소프트웨어, 문서, 디자인 및 운영 콘텐츠의 권리는 회사 또는 정당한 권리자에게 있습니다. 데이터 활용 요청으로 생성된 산출물의 이용권과 소유권은 회사의 내부 정책, 별도 계약 및 원천 데이터의 권리관계에 따릅니다.' },
  { id: 'terms-11', title: '제11조 면책·손해배상·책임 제한', body: '회원의 약관 위반, 계정 관리 소홀, 승인 범위를 벗어난 데이터 이용으로 발생한 손해는 해당 회원 또는 책임 있는 주체가 부담할 수 있습니다. 회사는 천재지변, 불가항력, 외부 통신망 장애 등 회사의 합리적인 통제를 벗어난 사유로 발생한 서비스 중단에 대해 관계 법령이 허용하는 범위에서 책임을 제한합니다.' },
  { id: 'terms-12', title: '제12조 약관 변경·통지·준거법·분쟁 처리', body: '약관의 시행일, 개정일 및 주요 변경 내용은 서비스에서 안내합니다. 회원에게 불리하거나 중요한 변경은 적용일 전에 별도 공지하며, 서비스 이용 문의와 분쟁은 하나카드 개인정보보호 담당부서(privacy@hanacard.co.kr, 02-0000-0000)와 회사 내부 절차를 통해 처리합니다. 본 약관은 대한민국 법령에 따릅니다.' },
]

const privacySections: SectionData[] = [
  { id: 'privacy-1', title: '1. 개인정보 처리자 및 보호책임자', body: '개인정보 처리자는 하나카드 주식회사입니다. 개인정보보호 담당부서는 개인정보 보호 업무와 권리행사 문의를 담당합니다.', table: { headers: ['구분', '내용'], rows: [['처리자', '하나카드 주식회사'], ['주소', '서울특별시 중구 을지로 66'], ['담당부서', '하나카드 개인정보보호 담당부서'], ['문의·권리행사', 'privacy@hanacard.co.kr / 02-0000-0000']] } },
  { id: 'privacy-2', title: '2. 수집하는 개인정보 항목 및 처리 목적', body: '회사는 서비스 제공에 필요한 최소한의 개인정보를 수집·이용하며, 수집 목적의 범위를 넘어 이용하지 않습니다.', table: { headers: ['구분', '개인정보 항목', '필수', '처리 근거', '처리 목적', '보유기간'], rows: [['가입 신청', '이름', '필수', '정보주체 동의', '계정 식별·가입 심사', '최종 처리일 후 1년'], ['가입 신청', '회사 이메일', '필수', '동의·서비스 이용계약', '회사 계정 식별·도메인 검증·로그인 ID', '계정 삭제 또는 자격 종료 후 3년'], ['가입 신청', '휴대폰 번호', '필수', '정보주체 동의', '가입 심사·계정 확인·보안 안내', '계정 삭제 또는 자격 종료 후 3년'], ['가입 신청', '부서·직급', '필수', '동의·내부 업무 운영', '가입 승인·권한·업무 범위 설정', '계정 삭제 또는 자격 종료 후 3년'], ['인증', '비밀번호 hash', '필수', '서비스 이용계약·안전성 확보 의무', '사용자 인증', '계정 삭제 또는 자격 종료 시까지'], ['동의 증빙', '동의 유형·버전·시각·요청 IP', '필수', '동의 사실 증빙·안전성 확보 의무', '동의 이력·분쟁·감사 대응', '계정 삭제 또는 자격 종료 후 3년'], ['자동 수집', 'IP·user-agent·접속 시각', '자동', '안전성 확보 의무·보안 목적', '세션 관리·이상 행위 탐지·감사', '수집일 후 1년']] } },
  { id: 'privacy-3', title: '3. 보유 및 이용 기간', body: '가입 거절·미승인 신청은 최종 처리일로부터 1년, 로그인·보안 로그는 수집일로부터 1년, 계정·동의·감사 이력은 계정 삭제 또는 임직원 자격 종료 후 3년간 보유합니다. 관계 법령이 더 긴 기간을 요구하는 경우 해당 기간을 우선합니다.' },
  { id: 'privacy-4', title: '4. 파기 절차와 방법', body: '보유기간이 끝나거나 처리 목적이 달성되면 개인정보를 지체 없이 파기합니다. 전자적 파일은 복구할 수 없는 방법으로 삭제하고, 별도 출력물은 분쇄 또는 소각합니다. 법령상 보존이 필요한 정보는 별도 보관 후 해당 기간 종료 시 파기합니다.' },
  { id: 'privacy-5', title: '5. 개인정보의 제3자 제공', body: '회사는 개인정보를 원칙적으로 제3자에게 제공하지 않습니다. 다만 정보주체의 별도 동의가 있거나 법령에 근거한 적법한 요청이 있는 경우에는 필요한 범위에서 제공할 수 있습니다.', table: { headers: ['제공받는 자', '제공 목적', '제공 항목', '보유기간'], rows: [['없음', '해당 없음', '해당 없음', '해당 없음'], ['법령상 요청 기관', '법령상 의무 이행', '요청된 최소 항목', '관계 법령 및 요청 기준']] } },
  { id: 'privacy-6', title: '6. 개인정보 처리위탁', body: '회사는 서비스 운영에 필요한 업무를 다음과 같이 위탁합니다. 수탁자는 위탁받은 목적과 범위 내에서만 개인정보를 처리하며, 회사는 수탁자에 대한 관리·감독을 실시합니다.', table: { headers: ['수탁자', '위탁 업무', '처리 항목', '보유·처리 기간', '접근 통제'], rows: [['Neon Cloud, Inc.', 'PostgreSQL DB 저장·백업·복구', '계정·가입·동의·접속기록', '서비스 이용 및 계약 종료 시까지', '운영 관리자 최소 권한'], ['AWS 운영 인프라', '애플리케이션·네트워크·백업 인프라 운영', '서비스 처리 중 개인정보·로그', '위탁계약 및 로그 정책에 따름', '운영 담당자 직무별 권한'], ['하나카드 사내 인프라 운영팀', '애플리케이션·보안·감사 운영', '계정·권한·접속·감사 로그', '수집일 또는 계정 종료 후 1~3년', '직무별 접근 및 감사 로그']] } },
  { id: 'privacy-7', title: '7. 개인정보의 국외 이전', body: 'Neon Cloud PostgreSQL의 저장·백업 과정에서 개인정보가 미국으로 이전될 수 있습니다. 이전받는 자와 이전 항목, 목적, 보유기간은 다음과 같습니다.', table: { headers: ['이전받는 자·국가', '이전 일시·방법', '이전 항목', '이전 목적', '보유기간', '이전 근거'], rows: [['Neon Cloud, Inc. / 미국', '가입·로그인·갱신 시 네트워크 전송 및 DB 저장·백업', '계정·가입·동의·IP·user-agent·세션 기록', 'DB 운영·백업·장애 복구·보안 감사', '국내 보유기간과 동일', '정보주체 동의 및 서비스 이용계약 이행']] } },
  { id: 'privacy-8', title: '8. 쿠키·세션 및 자동 수집 정보', body: '서비스는 로그인 세션과 보안을 위해 쿠키·브라우저 저장소·접속기록을 사용합니다. 개인정보를 포함한 저장값은 인증 목적 외로 이용하지 않습니다.', table: { headers: ['항목', '목적', '보유기간', '이용자 제어'], rows: [['refresh token cookie', '로그인 세션 유지·access token 갱신', '세션 만료 또는 logout까지', '로그아웃·전체 로그아웃·브라우저 쿠키 삭제'], ['access token 저장값', '인증된 요청 처리', 'token 만료까지', '로그아웃·브라우저 저장소 삭제'], ['IP·user-agent·접속 시각', '보안·감사·이상 행위 탐지', '수집일 후 1년', '권리행사 또는 담당부서 문의']] } },
  { id: 'privacy-9', title: '9. 정보주체의 권리와 행사방법', body: '회원은 개인정보 열람, 정정, 삭제, 처리정지를 요청할 수 있습니다. privacy@hanacard.co.kr 또는 02-0000-0000으로 요청하면 본인 확인, 대상 정보 확인, 처리 결과 통지 순서로 법정 처리기간 내 처리합니다. 대리 요청은 위임 관계와 대리인의 신원을 확인합니다.' },
  { id: 'privacy-10', title: '10. 안전성 확보조치', body: '회사는 비밀번호의 일방향 암호화 저장, TLS 전송구간 보호, 업무상 필요한 최소 권한, 관리자 기능의 권한 검증, 접속기록 관리, 개인정보 마스킹, 세션 만료·계정 잠금 등 기술적·관리적 보호조치를 적용합니다.' },
  { id: 'privacy-11', title: '11. 처리방침 변경 이력', body: '본 처리방침의 시행일과 최종 수정일은 2026년 8월 1일이며 버전은 PRIVACY-2026-08입니다. 변경 시 변경 내용, 시행일 및 이전 버전을 서비스에서 확인할 수 있도록 안내합니다.' },
  { id: 'privacy-12', title: '12. 문의·신고·권리행사 연락처', body: '개인정보 보호 및 권리행사 문의는 하나카드 개인정보보호 담당부서 privacy@hanacard.co.kr 또는 02-0000-0000으로 접수할 수 있습니다. 개인정보 침해 신고·상담은 관계 기관의 공식 신고 채널을 이용할 수 있습니다.' },
]

function LegalTable({ table }: { table: NonNullable<SectionData['table']> }) {
  return <TableScroll><StyledLegalTable><TableHead><TableRow>{table.headers.map((header) => <TableHeaderCell key={header}>{header}</TableHeaderCell>)}</TableRow></TableHead><tbody>{table.rows.map((row, rowIndex) => <TableRow key={`${rowIndex}-${row[0]}`}>{row.map((cell, cellIndex) => <TableCell key={`${rowIndex}-${cellIndex}`}>{cell}</TableCell>)}</TableRow>)}</tbody></StyledLegalTable></TableScroll>
}

export default function LegalPage({ type }: { type: LegalType }) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const isStandaloneTab = searchParams.get('standalone') === '1'
  const withStandalone = (path: string) => (isStandaloneTab ? `${path}?standalone=1` : path)
  const sections = type === 'terms' ? termsSections : privacySections
  const title = type === 'terms' ? '서비스 이용약관' : '개인정보 처리방침'
  const version = type === 'terms' ? 'TERMS-2026-08' : 'PRIVACY-2026-08'
  return (
    <DocumentLayout>
      <DocumentHeader>
        {isStandaloneTab ? (
          <button type="button" onClick={() => window.close()}>✕ 닫기</button>
        ) : (
          <button type="button" onClick={() => navigate(-1)}>← 이전</button>
        )}
        <Logo size="sm" to="/login" />
        <span>PUBLIC INFORMATION</span>
      </DocumentHeader>
      <DocumentBody>
        <DocumentNav><Link to={withStandalone('/legal/terms')} className={type === 'terms' ? 'active' : ''}>서비스 이용약관</Link><Link to={withStandalone('/legal/privacy')} className={type === 'privacy' ? 'active' : ''}>개인정보 처리방침</Link><PrintButton type="button" onClick={() => window.print()}>인쇄</PrintButton></DocumentNav>
        <DocumentTitle>{title}</DocumentTitle>
        <DocumentMeta>문서 버전 {version} · 시행일 2026년 8월 1일 · 최종 수정일 2026년 8월 1일 · <a href="#document-history">이전 버전 보기</a></DocumentMeta>
        {type === 'privacy' && <DocumentFacts><FactRow><strong>처리자</strong><span>하나카드 주식회사</span></FactRow><FactRow><strong>보유기간</strong><span>신청·로그 1년 · 계정·동의·감사 이력 3년</span></FactRow><FactRow><strong>제3자 제공</strong><span>원칙적으로 없음</span></FactRow><FactRow><strong>위탁·국외 이전</strong><span>Neon Cloud PostgreSQL·AWS·사내 인프라 / 미국 저장·백업</span></FactRow><FactRow><strong>문의</strong><span>privacy@hanacard.co.kr · 02-0000-0000</span></FactRow></DocumentFacts>}
        <TableOfContents aria-label="문서 목차"><strong>문서 목차</strong>{sections.map((section) => <a key={section.id} href={`#${section.id}`}>{section.title}</a>)}</TableOfContents>
        {sections.map((section) => <Section id={section.id} key={section.id}><SectionTitle>{section.title}</SectionTitle><SectionBody>{section.body}</SectionBody>{section.table && <LegalTable table={section.table} />}</Section>)}
        <DocumentFooter id="document-history"><strong>이전 버전 및 문서 문의</strong><span>이전 버전은 개인정보보호 담당부서에 요청할 수 있습니다. 문의: privacy@hanacard.co.kr / 02-0000-0000</span></DocumentFooter>
      </DocumentBody>
      <Footer />
    </DocumentLayout>
  )
}
