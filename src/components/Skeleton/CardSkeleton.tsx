import React, { ComponentProps, ComponentPropsWithoutRef } from 'react'
import Chip from '@/components/Chip/Chip'
import { Circle, Separator, Square, Stack, StackProps, styled, Card as TCard, withStaticProperties, XStack, YStack } from 'tamagui'
import { ButtonFrameStyled } from '../Button'

const SkeletonColor = '#F7F7F7'

const CardFrame = styled(YStack, {
  backgroundColor: '$white1',
  $gtSm: {
    borderRadius: '$medium',
  },
} as const)

export type SkeCardFrameProps = ComponentProps<typeof TCard>
const SkeCardFrame = ({ children, ...props }: SkeCardFrameProps) => {
  return (
    <CardFrame {...props} overflow="hidden">
      <YStack gap="$medium">{children}</YStack>
    </CardFrame>
  )
}

export const SkeCardContent = styled(YStack, {
  padding: '$medium',
  gap: '$medium',
} as const)

const SkeCardChip = (props: Omit<ComponentProps<typeof Chip>, 'children'>) => {
  return (
    <XStack>
      <Chip {...props} backgroundColor={SkeletonColor} width="$6">
        {'\u00a0\u00a0'}
      </Chip>
    </XStack>
  )
}

const SkeCardTitle = () => {
  return <Stack height="$2" width="100%" bg={SkeletonColor} />
}

const SkeCardDate = () => {
  return (
    <XStack gap="$small" alignItems="center">
      <Square size="$2" bg={SkeletonColor} />
      <Stack height="$1" flex={1} bg={SkeletonColor} />
    </XStack>
  )
}

const SkeCardButton = (props: ComponentPropsWithoutRef<typeof ButtonFrameStyled>) => {
  return (
    <XStack>
      <ButtonFrameStyled bg={SkeletonColor} width={100} height={50} {...props}></ButtonFrameStyled>
    </XStack>
  )
}

const SkeActions = () => {
  return (
    <XStack gap="$small" justifyContent="space-between">
      <SkeCardButton />
      <SkeCardButton />
    </XStack>
  )
}

const SkeCardAuthor = () => {
  return (
    <XStack gap="$small" alignItems="center">
      <Circle size="$2" bg={SkeletonColor} />
      <Stack height="$1" flex={1} bg={SkeletonColor} />
    </XStack>
  )
}

const SkeCardImage = () => {
  return <YStack minHeight="$15" flex={1} bg={SkeletonColor} borderRadius="$1" />
}

export type SkeCardDescritionProps = {
  full?: boolean
}

const SkeCardLine = ({ width }: { width: number | string }) => <Stack height="$1" bg={SkeletonColor} width={width} />
const SkeCardDescription = ({ full }: SkeCardDescritionProps) => {
  return (
    <YStack gap="$small">
      {Array.from({ length: full ? 5 : 2 }).map((_, index) => (
        <Stack key={index} height="$1" bg={SkeletonColor} />
      ))}
    </YStack>
  )
}

const SkeCardSection = ({ children, ...props }: StackProps) => {
  return (
    <>
      <SkeCardSeparator />
      <Stack gap="$small" {...props}>
        <Stack height="$1" width="$6" bg="$gray1" />
        {children}
      </Stack>
    </>
  )
}

const SkeCardSeparator = (props: StackProps) => <Separator {...props} />

export const SkeCard = withStaticProperties(SkeCardFrame, {
  Content: SkeCardContent,
  Chip: SkeCardChip,
  Separator: SkeCardSeparator,
  Title: SkeCardTitle,
  Date: SkeCardDate,
  Actions: SkeActions,
  Image: SkeCardImage,
  Author: SkeCardAuthor,
  Section: SkeCardSection,
  Description: SkeCardDescription,
  Button: SkeCardButton,
  Line: SkeCardLine,
})

export default SkeCard
