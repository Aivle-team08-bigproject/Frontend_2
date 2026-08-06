import styled from 'styled-components'

export const ErrorScreen = styled.main`
  min-height: 100vh;
  background: #f8f9fa;
  color: #1a1a1b;
`

export const ErrorHeader = styled.header`
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 48px;
  border: 1px solid #e9ecef;
  background: #fff;
`

export const SecurityArea = styled.span`
  color: #adb5bd;
  font-size: 13px;
  font-weight: 500;
`

export const ErrorContent = styled.section`
  min-height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 137px;
  text-align: center;
`

export const Illustration = styled.div<{ $danger?: boolean }>`
  width: 180px;
  height: 120px;
  display: grid;
  place-items: center;
  border-radius: 24px;
  background: ${({ $danger }) => ($danger ? '#fde8e8' : '#e5f3f3')};
`

export const GridIcon = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 24px);
  grid-template-rows: repeat(2, 24px);
  gap: 12px;

  span {
    border-radius: 6px;
    background: #9ad7d8;
  }
  span:nth-child(2) { background: #008c8d; }
  span:nth-child(4) { grid-column: 2; background: #cfe8e8; }
`

export const ErrorCode = styled.p<{ $danger?: boolean }>`
  margin: 34px 0 4px;
  color: ${({ $danger }) => ($danger ? '#dc2626' : '#008c8d')};
  font-size: 120px;
  line-height: 1;
  font-weight: 900;
  letter-spacing: 0.02em;
`

export const ErrorTitle = styled.h1`
  margin: 8px 0 4px;
  font-size: 24px;
  font-weight: 800;
`

export const ErrorDescription = styled.p`
  margin: 0;
  color: #495057;
  font-size: 15px;
`

export const ErrorReference = styled.p`
  margin: 40px 0 0;
  padding: 8px 16px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  background: #fff;
  color: #495057;
  font-size: 13px;
  font-weight: 600;

  strong { color: #dc2626; }
`

export const ErrorActions = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 40px;
`

export const PrimaryAction = styled.button`
  padding: 11px 22px;
  border: 1px solid #008c8d;
  border-radius: 999px;
  background: #008c8d;
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
`

export const SecondaryAction = styled.button<{ $danger?: boolean }>`
  padding: 11px 22px;
  border: 1px solid ${({ $danger }) => ($danger ? '#dc2626' : '#008c8d')};
  border-radius: 999px;
  background: transparent;
  color: ${({ $danger }) => ($danger ? '#dc2626' : '#008c8d')};
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
`

export const SupportText = styled.p`
  margin-top: 40px;
  color: #adb5bd;
  font-size: 13px;

  a { color: #495057; font-weight: 600; }
`
