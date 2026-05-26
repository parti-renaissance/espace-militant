import { createContext, useContext, useRef } from 'react'
import { type Href, useLocalSearchParams, useRouter } from 'expo-router'
import { addHours } from 'date-fns'
import { zodResolver } from '@hookform/resolvers/zod'
import { type Control, type FieldPath, useForm } from 'react-hook-form'

import VoxSimpleModal from '@/components/VoxSimpleModal'
import { ActionFormError } from '@/services/actions/error'
import { useActionMutation, useCancelAction } from '@/services/actions/hook'
import { mapActionFormToPostRequest, mapRestActionFullToFormDefaults, type ActionFormValues } from '@/services/actions/paramsMapper'
import { ActionType, RestActionFull } from '@/services/actions/schema'

import { useActionConfirmAlert } from '../components/ActionConfirmAlert'
import { actionFormSchema } from './schema'

export type ActionFormProps = {
  edit?: RestActionFull
}

type ActionFormContextValue = {
  control: Control<ActionFormValues>
  editMode: boolean
  edit?: RestActionFull
  isPending: boolean
  isCancelPending: boolean
  onSubmit: () => void
  cancelHref: Href
  cancelModalRef: React.RefObject<React.ComponentRef<typeof VoxSimpleModal> | null>
  onConfirmCancel: () => void
}

const ActionFormContext = createContext<ActionFormContextValue | null>(null)

export function useActionFormContext() {
  const ctx = useContext(ActionFormContext)
  if (!ctx) {
    throw new Error('useActionFormContext must be used within ActionFormContextProvider')
  }
  return ctx
}

const isActionType = (value: string | undefined): value is ActionType =>
  value != null && (Object.values(ActionType) as string[]).includes(value)

export function ActionFormContextProvider({ edit, children }: ActionFormProps & { children: React.ReactNode }) {
  const router = useRouter()
  const { type: typeParam } = useLocalSearchParams<{ type?: string }>()
  const cancelModalRef = useRef<React.ComponentRef<typeof VoxSimpleModal>>(null)
  const initialType = !edit && isActionType(typeParam) ? typeParam : ActionType.PAP

  const { control, handleSubmit, reset, setError } = useForm<ActionFormValues>({
    resolver: zodResolver(actionFormSchema),
    defaultValues: edit
      ? mapRestActionFullToFormDefaults(edit)
      : {
          type: initialType,
          date: addHours(new Date(), 1),
          post_address: { address: '', postal_code: '', city_name: '', country: '' },
          description: '',
          send_invitation_email: true,
        },
  })

  const actionMutation = useActionMutation({ actionId: edit?.uuid })
  const cancelMutation = useCancelAction()
  const editMode = Boolean(edit)

  const finalSubmit = handleSubmit(
    (values) => {
      const payload = mapActionFormToPostRequest(values)
      actionMutation
        .mutateAsync({ payload })
        .then((data) => {
          reset(values)
          router.replace({
            pathname: '/actions/[id]',
            params: { id: data.uuid, greet: editMode ? undefined : 'new' },
          })
        })
        .catch((e) => {
          if (e instanceof ActionFormError) {
            e.violations.forEach((violation) => {
              const path = violation.propertyPath as FieldPath<ActionFormValues>
              const fieldPath =
                typeof path === 'string' && path.startsWith('post_address.') ? 'post_address' : path
              setError(fieldPath, { message: violation.message })
            })
          }
        })
    },
  )

  const { ConfirmAlert, present } = useActionConfirmAlert({
    onAccept: finalSubmit,
    control,
    isPending: actionMutation.isPending,
  })

  const modalBeforeSubmit = handleSubmit(() => present())
  const onSubmit = editMode ? finalSubmit : modalBeforeSubmit

  const onConfirmCancel = () => {
    if (!edit?.uuid) return
    cancelMutation.mutateAsync({ id: edit.uuid }).then(() => {
      cancelModalRef.current?.close()
      router.replace({ pathname: '/actions/[id]', params: { id: edit.uuid } })
    })
  }

  const cancelHref = (edit ? `/actions/${edit.uuid}` : '/evenements/list?itemType=action') as Href

  return (
    <ActionFormContext.Provider
      value={{
        control,
        editMode,
        edit,
        isPending: actionMutation.isPending,
        isCancelPending: cancelMutation.isPending,
        onSubmit,
        cancelHref,
        cancelModalRef,
        onConfirmCancel,
      }}
    >
      {children}
      {ConfirmAlert}
    </ActionFormContext.Provider>
  )
}
