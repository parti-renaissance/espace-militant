import { PropsWithChildren, ReactNode } from 'react'
import { ImageSourcePropType } from 'react-native'
import Text from '@/components/base/Text'
import SpacedContainer from '@/components/SpacedContainer/SpacedContainer'
import VoxCard from '@/components/VoxCard/VoxCard'
import { Image, ImageProps, TextProps, View, withStaticProperties } from 'tamagui'

export interface ProfileCallToActionProps extends PropsWithChildren {
  title?: string
  image?: ImageSourcePropType
  background?: ImageSourcePropType
  Buttons?: () => ReactNode | ReactNode[]
  content?: string
  contentStyle?: TextProps['style']
  backgroundColor?: string
  noPadding?: boolean
  height?: number | string
  noBorder?: boolean
}

function Layout({ children, backgroundColor, height, noPadding = false, noBorder = false }: Readonly<ProfileCallToActionProps>) {
  return (
    <VoxCard padding={noPadding ? undefined : '$medium'} backgroundColor={backgroundColor ?? '$white1'} height={height} overflow={'hidden'}>
      {children && <SpacedContainer>{children}</SpacedContainer>}
    </VoxCard>
  )
}

const CardImage = ({ source, height, ...rest }: Readonly<ImageProps>) => {
  return (
    <SpacedContainer>
      <Image source={source} height={height} width="auto" resizeMode={'contain'} {...rest} />
    </SpacedContainer>
  )
}

const BackgroundImageBottomRight = ({ source, height, ...rest }: Readonly<ImageProps>) => {
  return <Image source={source} height={height ?? 150} width={150} resizeMode={'contain'} position={'absolute'} right={0} bottom={-12} {...rest} />
}

interface CardContentProps extends PropsWithChildren {
  title?: string
  contentStyle?: TextProps['style']
  titleStyle?: TextProps['style']
  content?: string
  textAlign?: 'center' | 'left' | 'right'
  padding?: number | string
  // Remove content spacing
  compact?: boolean
}

const CardContent = ({ contentStyle, titleStyle, title, content, children, textAlign, padding, compact }: Readonly<CardContentProps>) => {
  const RenderText = () => (
    <Text fontSize="$2" fontWeight="$7" textAlign={textAlign} style={contentStyle}>
      {content}
    </Text>
  )

  return (
    <View padding={padding} pt={'$medium'}>
      {title && (
        <SpacedContainer>
          <Text textAlign={textAlign} style={titleStyle}>
            {title}
          </Text>
        </SpacedContainer>
      )}

      {content &&
        (compact ? (
          <RenderText />
        ) : (
          <SpacedContainer>
            <RenderText />
          </SpacedContainer>
        ))}

      {children && <SpacedContainer>{children}</SpacedContainer>}
    </View>
  )
}

const Actions = ({ children }: Readonly<PropsWithChildren>) => <View flexDirection={'row'}>{children}</View>

export const ProfileCallToActionLayout = withStaticProperties(Layout, {
  Image: CardImage,
  Content: CardContent,
  Actions,
  BackgroundImageBottomRight,
})
