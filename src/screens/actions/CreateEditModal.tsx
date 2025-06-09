import { memo } from 'react'
import ModalOrPageBase from '@/components/ModalOrPageBase/ModalOrPageBase'
import ActionForm from './form/ActionForm'

type CreateEditModalProps = {
  open: boolean
  onClose: () => void
  activeAction?: string
  scope?: string
}

const CreateEditModal = (props: CreateEditModalProps) => {
  return (
    <ModalOrPageBase
      open={props.open}
      onClose={props.onClose}
      shouldDisplayCloseHeader
      shouldDisplayCloseButton
    >
      {props.open && <ActionForm onClose={props.onClose} uuid={props.activeAction} scope={props.scope} />}
    </ModalOrPageBase>
  )
}

export default memo(CreateEditModal)
