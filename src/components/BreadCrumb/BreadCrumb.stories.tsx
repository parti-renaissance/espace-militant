import { YStack } from 'tamagui'
import BreadCrumb from './BreadCrumb'

const items = [
  {
    id: 'coucou',
    label: 'coucou',
    // eslint-disable-next-line no-console
    onPress: () => console.log('coucou'),
  },
  {
    id: 'lol',
    label: 'lol',
    // eslint-disable-next-line no-console
    onPress: () => console.log('lol'),
  },
]

export default {
  title: 'Breadcrumb',
  component: BreadCrumb,
}

export function Default() {
  return (
    <YStack gap="$medium">
      <BreadCrumb items={items} />
      <BreadCrumb items={items} vertical={true} />
    </YStack>
  )
}
