import { checkSrc } from './icons'
import { Bar, CheckIcon, StepCircle, StepItem, StepLabel, StepLine } from './StepProgressBar.styles'

const steps = ['요구사항 분석', '샘플 데이터', '최종 산출물', '완료']

type StepProgressBarProps = {
  currentStep: number
}

export default function StepProgressBar({ currentStep }: StepProgressBarProps) {
  return (
    <Bar>
      {steps.map((label, index) => {
        const step = index + 1
        const state = step < currentStep ? 'done' : step === currentStep ? 'active' : 'pending'
        return (
          <StepItem key={label}>
            <StepCircle $state={state}>{state === 'done' ? <CheckIcon src={checkSrc} alt="완료" /> : step}</StepCircle>
            <StepLabel $state={state}>{label}</StepLabel>
            {step < steps.length && <StepLine />}
          </StepItem>
        )
      })}
    </Bar>
  )
}
