import { Stack } from 'tamagui'

import Text from './Text'

export default {
  title: 'Design System/Text',
  component: Text,
}

export function Default() {
  return (
    <Stack gap="$medium" p="$large" maxWidth={900}>
      <Stack gap="$small">
        <Text.LG multiline>Texte Large : Text.LG</Text.LG>
        <Text.MD multiline>Texte Medium : Text.MD</Text.MD>
        <Text.SM multiline>Texte Small : Text.SM</Text.SM>
        <Text.XSM>Texte Extra Small : Text.XSM</Text.XSM>
      </Stack>
    </Stack>
  )
}
