import { NamedExoticComponent } from 'react'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import VoxCard from '@/components/VoxCard/VoxCard'
import type { IconProps } from '@tamagui/helpers-icon'
import { Href, Link } from 'expo-router'
import { isWeb, ThemeName, YStack } from 'tamagui'

type InfoCardPropsBase = {
  icon: NamedExoticComponent<IconProps>
  children: string | string[]
  theme?: ThemeName | null
}

type WithButton = {
  button: JSX.Element
  buttonText?: never
  href?: never
}

type WithHref = {
  button?: never
  buttonText: string
  href: Href
}

type InfoCardProps = InfoCardPropsBase & (WithButton | WithHref)

const InfoCard = (props: InfoCardProps) => {
  return (
    <VoxCard inside bg="$color1" theme={props.theme}>
      <VoxCard.Content justifyContent="space-between" alignItems="center">
        <props.icon size={24} color="$color5" />
        <YStack flexShrink={1}>
          <Text.SM multiline textAlign="center" color="$color7">
            {props.children}
          </Text.SM>
        </YStack>
        <YStack width="100%">
          {props.button ? (
            props.button
          ) : (
            <Link href={props.href} asChild={!isWeb}>
              <VoxButton full inverse bg={'white'} theme={props.theme}>
                {props.buttonText}
              </VoxButton>
            </Link>
          )}
        </YStack>
      </VoxCard.Content>
    </VoxCard>
  )
}

export default InfoCard
