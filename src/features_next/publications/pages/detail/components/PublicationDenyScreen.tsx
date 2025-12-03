import React from 'react'
import { ScrollView, useMedia, YStack } from 'tamagui'
import Text from '@/components/base/Text'
import VoxCard from '@/components/VoxCard/VoxCard'
import { DetailedAPIErrorPayload, NotFoundError, DepartmentNotFoundError } from '@/core/errors'

export function PublicationDenyScreen({ error }: { error: DetailedAPIErrorPayload }) {
  const media = useMedia()
  const is404 = error instanceof NotFoundError || error instanceof DepartmentNotFoundError

  return (
    <ScrollView backgroundColor="$surface" flex={1}>
      <YStack gap="$medium" maxWidth={media.gtSm ? 600 : undefined} width={media.gtSm ? '100%' : undefined} marginHorizontal={media.gtSm ? 'auto' : undefined}>
        <VoxCard>
          <VoxCard.Content>
            <YStack gap="$medium" alignItems="center">
              <Text.LG semibold color="$red10">
                {is404 ? '404' : 'Accès refusé'}
              </Text.LG>
              <Text.MD secondary textAlign="center">
                {(error as Error).message || error.detail || 'Une erreur est survenue'}
              </Text.MD>
            </YStack>
          </VoxCard.Content>
        </VoxCard>
      </YStack>
    </ScrollView>
  )
}

