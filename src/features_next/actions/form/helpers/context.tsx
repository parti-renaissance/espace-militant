import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useNavigation, useRouter } from 'expo-router'
import { addHours } from 'date-fns'
import { zodResolver } from '@hookform/resolvers/zod'
import { type Control, type FieldPath, useForm } from 'react-hook-form'

import VoxSimpleModal from '@/components/VoxSimpleModal'
import { ActionFormError } from '@/services/actions/error'
import { useActionMutation, useCancelAction } from '@/services/actions/hook'
import { logActionMutation, logActionMutationError } from '@/services/actions/logActionMutation'
import { mapActionFormToPostRequest, mapRestActionFullToFormDefaults, type ActionFormValues } from '@/services/actions/paramsMapper'
import { ActionType, RestActionFull } from '@/services/actions/schema'

import { actionFormSchema } from '../../components/actionFormSchema'

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
  navigation: ReturnType<typeof useNavigation>
  cancelHref: string
  cancelModalRef: React.RefObject<React.ComponentRef<typeof VoxSimpleModal> | null>
  manualAddress: boolean
  onManualAddressToggle: () => void
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

export function ActionFormContextProvider({ edit, children }: ActionFormProps & { children: React.ReactNode }) {
  const router = useRouter()
  const navigation = useNavigation()
  const cancelModalRef = useRef<React.ComponentRef<typeof VoxSimpleModal>>(null)
  const [manualAddress, setManualAddress] = useState(false)

  const { control, handleSubmit, formState, reset, setError } = useForm<ActionFormValues>({
    resolver: zodResolver(actionFormSchema),
    defaultValues: edit
      ? mapRestActionFullToFormDefaults(edit)
      : {
          type: ActionType.PAP,
          date: addHours(new Date(), 1),
          post_address: { address: '', postal_code: '', city_name: '', country: '' },
          description: '',
        },
  })

  const actionMutation = useActionMutation({ actionId: edit?.uuid })
  const cancelMutation = useCancelAction()
  const editMode = Boolean(edit)

  useEffect(() => {
    if (formState.errors.post_address) {
      setManualAddress(true)
    }
  }, [formState.errors.post_address])

  const onManualAddressToggle = useCallback(() => {
    setManualAddress((v) => !v)
  }, [])

  const onSubmit = handleSubmit(
    (values) => {
      const payload = mapActionFormToPostRequest(values)
      logActionMutation(editMode ? 'form submit — update' : 'form submit — create', {
        editId: edit?.uuid,
        formValues: values,
        payload,
      })
      actionMutation
        .mutateAsync({ payload })
        .then((data) => {
          logActionMutation('form submit — success', { uuid: data.uuid })
          reset(values)
          router.replace({ pathname: '/actions/[id]', params: { id: data.uuid } })
        })
        .catch((e) => {
          logActionMutationError('form submit — catch', e)
          if (e instanceof ActionFormError) {
            e.violations.forEach((violation) => {
              setError(violation.propertyPath as FieldPath<ActionFormValues>, { message: violation.message })
            })
          }
        })
    },
    (validationErrors) => {
      logActionMutation('form submit — validation client', { errors: validationErrors })
    },
  )

  const onConfirmCancel = () => {
    if (!edit?.uuid) return
    cancelMutation.mutateAsync({ id: edit.uuid }).then(() => {
      cancelModalRef.current?.close()
      router.replace({ pathname: '/actions/[id]', params: { id: edit.uuid } })
    })
  }

  const cancelHref = edit ? `/actions/${edit.uuid}` : '/evenements/list?itemType=action'

  return (
    <ActionFormContext.Provider
      value={{
        control,
        editMode,
        edit,
        isPending: actionMutation.isPending,
        isCancelPending: cancelMutation.isPending,
        onSubmit,
        navigation,
        cancelHref,
        cancelModalRef,
        manualAddress,
        onManualAddressToggle,
        onConfirmCancel,
      }}
    >
      {children}
    </ActionFormContext.Provider>
  )
}
