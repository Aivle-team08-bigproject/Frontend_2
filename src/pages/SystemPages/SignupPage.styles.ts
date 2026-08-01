import styled from 'styled-components'
import { Link } from 'react-router-dom'

export const LoginScreen = styled.main`
  min-height: 100vh; display: grid; place-items: center; padding: 40px 20px;
  background: radial-gradient(circle at 10% 45%, rgba(0,132,133,.08), transparent 38%), linear-gradient(120deg,#f5fbfb 0%,#fff 72%);
`
export const LoginCard = styled.section`
  width: min(680px,100%); padding: 42px 48px; border: 1px solid #f1f3f5; border-radius: 24px; background: #fff; box-shadow: 0 24px 60px rgba(15,90,82,.1);
  @media (max-width: 640px) { padding: 30px 22px; }
`
export const SignupHeader = styled.header`display:flex; flex-direction:column; align-items:center; gap:8px; color:#008485; font-size:12px; font-weight:800;`
export const BackLink = styled(Link)`align-self:flex-start; color:#495057; font-size:13px; font-weight:600; text-decoration:none;`
export const Title = styled.h1`margin:8px 0 0; color:#1a1a1b; font-size:28px; letter-spacing:-.04em;`
export const SignupNote = styled.p`margin:0; color:#6c757d; font-size:12px; line-height:1.6;`
export const Form = styled.form`display:flex; flex-direction:column; gap:16px; margin-top:28px;`
export const FormGrid = styled.div`display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:16px; @media(max-width:640px){grid-template-columns:1fr;}`
export const Field = styled.label`display:flex; flex-direction:column; gap:7px; color:#495057; font-size:13px; font-weight:700;`
export const Input = styled.input`height:46px; padding:0 13px; border:1px solid #dee2e6; border-radius:10px; outline:0; background:#f8f9fa; color:#1a1a1b; font:inherit; font-weight:400; &:focus{border-color:#008485; box-shadow:0 0 0 3px rgba(0,132,133,.1);}`
export const Dropdown = styled.div`position:relative; display:flex; flex-direction:column; gap:7px; color:#495057; font-size:13px; font-weight:700;`
export const DropdownButton = styled.button`display:flex; align-items:center; justify-content:space-between; width:100%; height:46px; padding:0 13px; border:1px solid #dee2e6; border-radius:10px; outline:0; background:#f8f9fa; color:#1a1a1b; font:inherit; font-weight:400; text-align:left; cursor:pointer; &:focus{border-color:#008485; box-shadow:0 0 0 3px rgba(0,132,133,.1);}`
export const DropdownValue = styled.span<{ $selected: boolean }>`color:${({ $selected }) => $selected ? '#1a1a1b' : '#868e96'};`
export const DropdownIcon = styled.span<{ $open: boolean }>`color:#008485; font-size:18px; line-height:1; transform:rotate(${({ $open }) => $open ? '180deg' : '0deg'}); transition:transform .18s ease;`
export const DropdownMenu = styled.div`position:absolute; z-index:10; top:76px; left:0; width:100%; padding:7px; border:1px solid #d9eeee; border-radius:12px; background:#fff; box-shadow:0 16px 30px rgba(15,90,82,.14);`
export const DropdownSearch = styled.input`width:100%; height:36px; box-sizing:border-box; margin-bottom:5px; padding:0 10px; border:1px solid #e9ecef; border-radius:8px; outline:0; background:#f8f9fa; color:#1a1a1b; font:inherit; font-size:12px; &:focus{border-color:#008485;}`
export const DropdownOption = styled.button<{ $selected?: boolean }>`display:flex; align-items:center; justify-content:space-between; width:100%; min-height:38px; padding:0 10px; border:0; border-radius:8px; background:${({ $selected }) => $selected ? '#e8f7f7' : 'transparent'}; color:${({ $selected }) => $selected ? '#007879' : '#495057'}; font:inherit; font-size:12px; font-weight:${({ $selected }) => $selected ? '700' : '400'}; text-align:left; cursor:pointer; &:hover:not(:disabled){background:#f1fafa; color:#007879;} &:disabled{color:#adb5bd; cursor:default;}`
export const ConsentBox = styled.div`display:flex; flex-direction:column; gap:12px; padding:16px; border:1px solid #e9ecef; border-radius:12px; background:#fbfcfc;`
export const ConsentLabel = styled.label`display:flex; align-items:center; gap:8px; color:#495057; font-size:13px; line-height:1.5; cursor:pointer; input{width:17px;height:17px;accent-color:#008485;} strong{color:#008485;}`
export const ConsentDetails = styled.p`margin:-5px 0 0 25px; color:#6c757d; font-size:11px; line-height:1.6;`
export const LegalLink = styled(Link)`margin-left:auto; color:#008485; font-size:12px; font-weight:700; white-space:nowrap;`
export const PrimaryButton = styled.button`height:48px; border:0; border-radius:11px; background:#008c8d; color:#fff; font-size:15px; font-weight:800; cursor:pointer; &:hover{background:#007879;}`
export const ErrorText = styled.p`margin:0; color:#dc2626; font-size:12px; text-align:center;`
export const SuccessBox = styled.div`margin:30px 0 24px; padding:22px; border:1px solid #b7ead5; border-radius:14px; background:#effbf6; color:#087f5b; text-align:center; strong{font-size:16px;} p{margin:8px 0 0; color:#495057; font-size:13px;}`
