import styled from 'styled-components'
import { Link } from 'react-router-dom'

export const DocumentLayout = styled.main`
  min-height: 100vh;
  background: #f7fbfb;
  color: #1a1a1b;
`

export const DocumentHeader = styled.header`
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 48px;
  border-bottom: 1px solid #e9ecef;
  background: #fff;
  button { border: 0; background: transparent; color: #495057; font: inherit; cursor: pointer; }
  a { color: #1a1a1b; font-weight: 800; text-decoration: none; }
  span { color: #adb5bd; font-size: 12px; font-weight: 700; letter-spacing: .08em; }
  @media (max-width: 640px) { padding: 0 20px; span { display: none; } }
`

export const DocumentBody = styled.section`
  width: min(1080px, calc(100% - 40px));
  margin: 0 auto;
  padding: 40px 0 72px;
  @media print { width: 100%; padding: 0; }
`

export const DocumentNav = styled.nav`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 30px;
  a { padding: 10px 14px; border-radius: 999px; color: #6c757d; font-size: 13px; font-weight: 700; text-decoration: none; &.active { background: #e6f3f3; color: #008485; } }
  @media print { display: none; }
`

export const PrintButton = styled.button`
  margin-left: auto;
  padding: 9px 14px;
  border: 1px solid #ced4da;
  border-radius: 8px;
  background: #fff;
  color: #495057;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
`

export const DocumentTitle = styled.h1`
  margin: 0;
  font-size: 34px;
  letter-spacing: -.04em;
  @media (max-width: 640px) { font-size: 27px; }
`

export const DocumentMeta = styled.p`
  margin: 12px 0 24px;
  color: #6c757d;
  font-size: 13px;
  line-height: 1.6;
  a { color: #008485; font-weight: 700; }
`

export const DocumentFacts = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
  border: 1px solid #d7eeee;
  border-radius: 14px;
  background: #f4fbfb;
  overflow: hidden;
`

export const FactRow = styled.div`
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 16px;
  padding: 14px 18px;
  border-bottom: 1px solid #d7eeee;
  color: #495057;
  font-size: 13px;
  line-height: 1.6;
  &:last-child { border-bottom: 0; }
  strong { color: #008485; }
  @media (max-width: 640px) { grid-template-columns: 1fr; gap: 4px; }
`

export const TableOfContents = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: 8px 12px;
  margin: 0 0 24px;
  padding: 18px 20px;
  border: 1px solid #e9ecef;
  border-radius: 14px;
  background: #fff;
  strong { width: 100%; color: #1a1a1b; font-size: 14px; }
  a { color: #008485; font-size: 12px; font-weight: 700; text-decoration: none; &:hover { text-decoration: underline; } }
`

export const Section = styled.article`
  scroll-margin-top: 24px;
  margin-top: 14px;
  padding: 26px 28px;
  border: 1px solid #e9ecef;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 8px 24px rgba(15, 90, 82, .04);
  @media print { break-inside: avoid; box-shadow: none; }
  @media (max-width: 640px) { padding: 22px 18px; }
`

export const SectionTitle = styled.h2`
  margin: 0 0 10px;
  color: #1a1a1b;
  font-size: 18px;
`

export const SectionBody = styled.p`
  margin: 0;
  color: #495057;
  font-size: 14px;
  line-height: 1.85;
`

export const TableScroll = styled.div`
  width: 100%;
  margin-top: 18px;
  overflow-x: auto;
`

export const LegalTable = styled.table`
  width: 100%;
  min-width: 720px;
  border-collapse: collapse;
  color: #495057;
  font-size: 12px;
  line-height: 1.55;
`

export const TableHead = styled.thead`background: #edf7f7;`
export const TableRow = styled.tr`border-bottom: 1px solid #e9ecef; &:last-child { border-bottom: 0; }`
export const TableHeaderCell = styled.th`padding: 12px 10px; border-right: 1px solid #d7eeee; color: #007879; text-align: left; font-weight: 800; white-space: nowrap; &:last-child { border-right: 0; }`
export const TableCell = styled.td`padding: 12px 10px; border-right: 1px solid #e9ecef; vertical-align: top; &:last-child { border-right: 0; }`

export const DocumentFooter = styled.footer`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 28px;
  padding: 18px 20px;
  border-radius: 12px;
  background: #eef1f2;
  color: #6c757d;
  font-size: 12px;
  line-height: 1.6;
  strong { color: #495057; }
`

export const LegalLink = styled(Link)`
  color: #008485;
  font-weight: 700;
`
