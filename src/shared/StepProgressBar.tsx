import { Bar, StepCircle, StepItem, StepLabel, StepLine } from './StepProgressBar.styles'

const steps = [
  '요구사항 분석',
  '요구사항 분석 진행',
  '요구사항 완료 피드백',
  '데이터 선별 진행',
  '샘플데이터 및 피드백',
  '데이터 가공 진행',
  '최종 산출물 및 피드백',
  '작업완료',
]

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
            <StepCircle $state={state}>{step}</StepCircle>
            <StepLabel $state={state}>{label}</StepLabel>
            {step < steps.length && <StepLine />}
          </StepItem>
        )
      })}
    </Bar>
  )
}
