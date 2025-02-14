import { YStack, YStackProps } from 'tamagui'

export const Container = YStack.styleable(({ children, full, ...props }: YStackProps & { full?: boolean }, ref) => {
  return (
    <YStack alignItems="center" {...props} ref={ref}>
      <YStack maxWidth={!full ? 1280 : undefined} width="100%" flexGrow={1}>
        {children}
      </YStack>
    </YStack>
  )
})

export default Container
