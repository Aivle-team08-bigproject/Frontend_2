import { ProgressModal, ProgressModalBackdrop, ProgressModalMessage, ProgressModalTitle } from './UnimplementedProgressModal.styles'

export default function UnimplementedProgressModal({ stageLabel }: { stageLabel: string }) {
  return (
    <ProgressModalBackdrop role="dialog" aria-modal="true" aria-labelledby="progress-modal-title">
      <ProgressModal>
        <ProgressModalTitle id="progress-modal-title">{stageLabel} 진행 화면</ProgressModalTitle>
        <ProgressModalMessage>진행 중입니다. 완료 후 다시 접근 해주세요.</ProgressModalMessage>
      </ProgressModal>
    </ProgressModalBackdrop>
  )
}
