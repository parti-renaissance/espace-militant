import { ComponentProps } from 'react'
import { VoxButton } from '@/components/Button'
import { useSession } from '@/ctx/SessionProvider'

export const SignInButton = (props: Omit<ComponentProps<typeof VoxButton>, 'children'> & { redirectUri?: string }) => {
  const { signIn } = useSession()
  return (
    <VoxButton onPress={() => signIn({ state: props.redirectUri })} variant="text" size="md" {...props}>
      Me connecter
    </VoxButton>
  )
}

export const SignUpButton = (props: Omit<ComponentProps<typeof VoxButton>, 'children'>) => {
  const { signUp } = useSession()
  return (
    <VoxButton onPress={() => signUp()} variant="outlined" size="md" theme="yellow" {...props}>
      Adhérer
    </VoxButton>
  )
}

export default {
  SignInButton,
  SignUpButton,
}
