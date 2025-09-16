import React from 'react'
import SkeCard from '@/components/Skeleton/CardSkeleton'
import { useMedia, YStack } from 'tamagui'

const EventsListSkeleton: React.FC = () => {
  const media = useMedia()
  
  return (
    <YStack gap="$medium" paddingHorizontal={media.sm ? 0 : undefined}>
      <SkeCard>
        <SkeCard.Content>
          <SkeCard.Chip />
          <SkeCard.Title />
          <SkeCard.Date />
          <SkeCard.Author />
          <SkeCard.Author />
          <SkeCard.Actions />
        </SkeCard.Content>
      </SkeCard>
      <SkeCard>
        <SkeCard.Content>
          <SkeCard.Chip />
          <SkeCard.Image />
          <SkeCard.Title />
          <SkeCard.Date />
          <SkeCard.Author />
          <SkeCard.Author />
          <SkeCard.Actions />
        </SkeCard.Content>
      </SkeCard>
      <SkeCard>
        <SkeCard.Content>
          <SkeCard.Chip />
          <SkeCard.Image />
          <SkeCard.Title />
          <SkeCard.Date />
          <SkeCard.Author />
          <SkeCard.Author />
          <SkeCard.Actions />
        </SkeCard.Content>
      </SkeCard>
      <SkeCard>
        <SkeCard.Content>
          <SkeCard.Chip />
          <SkeCard.Title />
          <SkeCard.Date />
          <SkeCard.Author />
          <SkeCard.Author />
          <SkeCard.Actions />
        </SkeCard.Content>
      </SkeCard>
    </YStack>
  )
}

export default EventsListSkeleton
