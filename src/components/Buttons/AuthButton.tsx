import { ComponentProps } from 'react'
import { Link } from 'expo-router'

import { VoxButton } from '@/components/Button'

import { useSession } from '@/ctx/SessionProvider'

export const SignInButton = (props: Omit<ComponentProps<typeof VoxButton>, 'children'> & { redirectUri?: string }) => {
  const { signIn } = useSession()
  const { redirectUri, ...buttonProps } = props

  return (
    <VoxButton onPress={() => signIn(redirectUri ? { state: redirectUri } : undefined)} variant="text" size="md" {...buttonProps}>
      Me connecter
    </VoxButton>
  )
}

export const SignUpButton = (props: Omit<ComponentProps<typeof VoxButton>, 'children'>) => {
  return (
    <Link href="/(signup)/bienvenue" asChild>
      <VoxButton variant="text" size="md" theme="blue" {...props}>
        Je crée mon compte
      </VoxButton>
    </Link>
  )
}

export default {
  SignInButton,
  SignUpButton,
}
