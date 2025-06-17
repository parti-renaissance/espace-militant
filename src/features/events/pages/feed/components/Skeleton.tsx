import React from 'react'
import SkeCard from '@/components/Skeleton/CardSkeleton'
import { YStack } from 'tamagui'

const EventsListSkeleton: React.FC = () => {
  return (
    <YStack gap="$medium" $sm={{ paddingHorizontal: 0 }}>
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
