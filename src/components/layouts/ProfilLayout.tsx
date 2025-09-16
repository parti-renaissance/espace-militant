import React from 'react'
import BoundarySuspenseWrapper from '@/components/BoundarySuspenseWrapper'
import { useMedia, YStack } from 'tamagui'
import SkeCard from '../Skeleton/CardSkeleton'
import PageLayout from './PageLayout/PageLayout'

const Skeleton = () => (
  <SkeCard>
    <SkeCard.Content>
      <SkeCard.Chip />
      <SkeCard.Title />
      <SkeCard.Image />
      <SkeCard.Description />
    </SkeCard.Content>
  </SkeCard>
)

export default function ProfilLayout({ children }: { children: React.ReactNode }) {
  const media = useMedia()

  return media.gtSm ? (
    <PageLayout webScrollable>
      <PageLayout.MainSingleColumn>
        <BoundarySuspenseWrapper
          fallback={
            <YStack
              gap="$medium"
              pt={media.gtSm ? '$large' : undefined}
              pl={media.gtSm ? '$large' : undefined}
              pr={media.gtSm ? '$large' : undefined}
              pb={'$11'}
            >
              {[1, 2, 3].map((x) => (
                <Skeleton key={x} />
              ))}
            </YStack>
          }
        >
          {children}
        </BoundarySuspenseWrapper>
      </PageLayout.MainSingleColumn>
      <PageLayout.SideBarRight />
    </PageLayout>
  ) : (
    <BoundarySuspenseWrapper
      fallback={
        <YStack
          gap="$medium"
          pt={media.gtSm ? '$medium' : undefined}
          pl={media.gtSm ? '$medium' : undefined}
          pr={media.gtSm ? '$medium' : undefined}
          pb={'$11'}
        >
          {[1, 2, 3].map((x) => (
            <Skeleton key={x} />
          ))}
        </YStack>
      }
    >
      {children}
    </BoundarySuspenseWrapper>
  )
}
