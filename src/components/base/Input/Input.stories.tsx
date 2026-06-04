import { Lock } from '@tamagui/lucide-icons'
import { Stack } from 'tamagui'
import Input from './Input'

export default {
  title: 'Formulaire/Input',
  component: Input,
}

export function Default() {
  return (
    <Stack gap="$medium" bg="$gray3">
      <Input placeholder="Je suis une placeholder" />
      <Input placeholder="Je suis un input avec un label !" label="je suis un label" loading />
      <Input placeholder="Je suis une placeholder" label="je suis un label" iconRight={<Lock size="$1" />} />
      <Input placeholder="Je suis disabled" disabled />
      <Input fake value="coucou je suis fake" />
      <Input label="email" error="une erreur" value="J'ai écris n'imp !" />
    </Stack>
  )
}
