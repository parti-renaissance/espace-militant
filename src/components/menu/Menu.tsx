import Item from '@/components/menu/Item'
import { styled, useMedia, withStaticProperties, YStack } from 'tamagui'

const MenuFrame = styled(YStack, {
  backgroundColor: '$white1',
  width: '100%',
})

const MenuFrameWithMedia = ({ children, ...props }: any) => {
  const media = useMedia()
  return (
    <MenuFrame
      {...props}
      overflow={media.gtSm ? 'hidden' : undefined}
      borderRadius={media.gtSm ? 16 : undefined}
      maxWidth={media.gtSm ? 280 : undefined}
      elevation={media.gtSm ? 1 : undefined}
    >
      {children}
    </MenuFrame>
  )
}

export default withStaticProperties(MenuFrameWithMedia, {
  Item,
})
