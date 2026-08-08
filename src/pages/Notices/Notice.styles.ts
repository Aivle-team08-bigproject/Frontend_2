import styled from 'styled-components'
import { colors } from '../../shared/theme'

export const NoticePage = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: ${colors.bg};
`

export const NoticeMain = styled.main`
  display: flex;
  flex: 1 0 auto;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px;

  @media (max-width: 600px) {
    padding: 24px 16px;
  }
`

export const NoticeHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`

export const NoticeTitle = styled.h1`
  margin: 0;
  color: ${colors.text};
  font-size: 26px;
  font-weight: 800;
`

export const NoticeCard = styled.div`
  overflow: hidden;
  border: 1px solid ${colors.border};
  border-radius: 16px;
  background: ${colors.white};
`

export const NoticeRow = styled.button`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 18px;
  width: 100%;
  padding: 20px 24px;
  border: 0;
  border-bottom: 1px solid ${colors.border};
  background: ${colors.white};
  text-align: left;
  cursor: pointer;

  &:last-child { border-bottom: 0; }
  &:hover, &:focus-visible { background: ${colors.bg}; outline: none; }
`

export const NoticeRowTitle = styled.span`
  overflow: hidden;
  color: ${colors.text};
  font-size: 15px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const NoticeMeta = styled.span`
  color: ${colors.textMuted};
  font-size: 13px;
  white-space: nowrap;
`

export const NoticeDetailCard = styled.article`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 32px;
  border: 1px solid ${colors.border};
  border-radius: 16px;
  background: ${colors.white};
`

export const NoticeDetailTitle = styled.h1`
  margin: 0;
  color: ${colors.text};
  font-size: 28px;
  line-height: 1.35;
`

export const NoticeContent = styled.div`
  color: ${colors.textSecondary};
  font-size: 15px;
  line-height: 1.8;
  white-space: pre-wrap;
`

export const NoticeActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  flex-wrap: wrap;
`

export const NoticeForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 24px;
  border: 1px solid ${colors.border};
  border-radius: 16px;
  background: ${colors.white};
`

export const NoticeInput = styled.input`
  width: 100%;
  padding: 12px 14px;
  border: 1px solid ${colors.border};
  border-radius: 8px;
  color: ${colors.text};
  font: inherit;
`

export const NoticeTextarea = styled.textarea`
  width: 100%;
  min-height: 180px;
  padding: 12px 14px;
  border: 1px solid ${colors.border};
  border-radius: 8px;
  color: ${colors.text};
  font: inherit;
  line-height: 1.6;
  resize: vertical;
`

export const SecondaryButton = styled.button`
  padding: 10px 16px;
  border: 1px solid ${colors.border};
  border-radius: 8px;
  background: ${colors.white};
  color: ${colors.textSecondary};
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
`

export const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`

export const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
`

export const PageButton = styled.button<{ $active?: boolean }>`
  min-width: 36px;
  padding: 8px 10px;
  border: 1px solid ${({ $active }) => ($active ? colors.primary : colors.border)};
  border-radius: 7px;
  background: ${({ $active }) => ($active ? colors.primary : colors.white)};
  color: ${({ $active }) => ($active ? colors.white : colors.textSecondary)};
  cursor: pointer;
`
