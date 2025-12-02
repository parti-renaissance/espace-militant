import { ComponentPropsWithoutRef } from 'react'
import AuthComponent from '@/components/AuthComponent'
import AuthDialog from '@/components/AuthDialog'

const title = 'Cet événement est réservé aux militants. Rejoignez-nous pour y participer.'

export function EventAuthComponent() {
  return <AuthComponent>{title}</AuthComponent>
}

export function EventAuthDialog(props: Omit<ComponentPropsWithoutRef<typeof AuthDialog>, 'title'>) {
  return <AuthDialog title={title} {...props} testID="event-item-sign-in-dialog" />
}
