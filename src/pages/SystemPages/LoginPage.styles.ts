import styled from 'styled-components'
import { Link } from 'react-router-dom'

export const LoginScreen = styled.main`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background:
    radial-gradient(circle at 10% 45%, rgba(0, 132, 133, 0.08), transparent 38%),
    linear-gradient(120deg, #f5fbfb 0%, #ffffff 72%);
`

export const LoginBody = styled.div`
  flex: 1;
  display: grid;
  place-items: center;
  padding: 40px 20px;
`

export const LoginCard = styled.section`
  width: min(460px, 100%);
  min-height: 618px;
  padding: 48px;
  border: 1px solid #f1f3f5;
  border-radius: 24px;
  background: #fff;
  box-shadow: 0 24px 60px rgba(15, 90, 82, 0.1);
`

export const Brand = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const Title = styled.h1`
  margin: 14px 0 4px;
  color: #1a1a1b;
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.04em;
`

export const Subtitle = styled.p`
  margin: 12px 0 0;
  color: #495057;
  font-size: 14px;
  font-weight: 500;
`

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-top: 32px;
`

export const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: #495057;
  font-size: 13px;
  font-weight: 600;
`

export const InputWrap = styled.span`
  display: flex;
  align-items: center;
  height: 48px;
  padding: 0 16px;
  gap: 12px;
  border: 1px solid #dee2e6;
  border-radius: 10px;
  background: #f8f9fa;

  &:focus-within {
    border-color: #008485;
    box-shadow: 0 0 0 3px rgba(0, 132, 133, 0.1);
  }
`

export const Icon = styled.span`
  display: grid;
  place-items: center;
  width: 18px;
  color: #5f6872;
`

export const Input = styled.input`
  width: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  color: #1a1a1b;
  font: inherit;
  font-weight: 400;

  &::placeholder {
    color: #adb5bd;
  }
`

export const FormMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #495057;
  font-size: 13px;
  font-weight: 500;
`

export const RememberLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;

  input {
    width: 17px;
    height: 17px;
    accent-color: #008485;
  }
`

export const TextButton = styled.button`
  padding: 0;
  border: 0;
  border-bottom: 1px solid currentColor;
  background: transparent;
  color: #008485;
  font: inherit;
  cursor: pointer;
`

export const LoginButton = styled.button`
  height: 47px;
  margin-top: 2px;
  border: 0;
  border-radius: 11px;
  background: #008c8d;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: wait;
  }
`

export const SignupLink = styled.button`
  height: 45px;
  border: 1px solid #008c8d;
  border-radius: 11px;
  background: #fff;
  color: #008485;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
`

export const ErrorText = styled.p`
  margin: -6px 0 0;
  color: #dc2626;
  font-size: 12px;
  text-align: center;
`

export const HelperText = styled.p`
  margin: 0;
  text-align: center;
  color: #adb5bd;
  font-size: 12px;
`

export const LegalLink = styled(Link)`
  color: #008485;
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 3px;
`

export const SuccessText = styled.p`
  margin: -6px 0 0;
  color: #087f5b;
  font-size: 12px;
  text-align: center;
`
