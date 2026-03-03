import { ImageRequireSource } from 'react-native'
import { VoxButton } from '@/components/Button'
import VoxCard, { VoxCardAuthorProps, VoxCardDateProps, VoxCardFrameProps } from '@/components/VoxCard/VoxCard'
import { Eye } from '@tamagui/lucide-icons'
import { XStack } from 'tamagui'

import eventRestrictedImagePlaceholder from '@/assets/images/eventRestrictedImagePlaceholder.png'

type VoxCardBasePayload = {
  id: string
  title: string
  image?: string | ImageRequireSource
  isOnline: boolean
  date: VoxCardDateProps
}

export type PartialEventVoxCardProps = {
  onShow?: () => void
  payload: VoxCardBasePayload & VoxCardAuthorProps
} & VoxCardFrameProps

const PartialEventCard = ({ payload, onShow, ...props }: PartialEventVoxCardProps) => {
  const image = payload.image ?? eventRestrictedImagePlaceholder
  return (
    <VoxCard {...props}>
      <VoxCard.Content minHeight={200} justifyContent="space-between">
        <VoxCard.Content p={0}>
          <VoxCard.Chip theme="blue">Evenement</VoxCard.Chip>
          <VoxCard.Title>{payload.title}</VoxCard.Title>
          {image && <VoxCard.Image image={image} />}
        </VoxCard.Content>
        <VoxCard.Date {...payload.date} />
        {payload.author && <VoxCard.Author author={payload.author} />}
        <XStack justifyContent={'flex-start'}>
          <VoxButton variant="outlined" onPress={onShow} iconLeft={Eye}>
            Voir l'événement
          </VoxButton>
        </XStack>
      </VoxCard.Content>
    </VoxCard>
  )
}

export default PartialEventCard
