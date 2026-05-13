import { ComponentProps, createContext, PropsWithChildren, useContext, useMemo, useState } from 'react'
import { Popover, TextProps } from 'tamagui'

import Text from '@/components/base/Text'

// --- Types & Context ---
type InfoPopoverContextValue = { pinned: boolean; setPinned: (p: boolean) => void }
const InfoPopoverContext = createContext<InfoPopoverContextValue | undefined>(undefined)

const useInfoPopover = () => {
  const context = useContext(InfoPopoverContext)
  if (!context) throw new Error('InfoPopoverTrigger/Content must be used within InfoPopover')
  return context
}

// --- Composants ---
export function InfoPopover({
  children,
  direction = 'bottom',
  align = 'center',
  ...props
}: PropsWithChildren<ComponentProps<typeof Popover> & { direction?: 'top' | 'bottom' | 'left' | 'right'; align?: 'start' | 'center' | 'end' }>) {
  const [pinned, setPinned] = useState(false)

  const placement = (align === 'center' ? direction : `${direction}-${align}`) as ComponentProps<typeof Popover>['placement']
  const contextValue = useMemo(() => ({ pinned, setPinned }), [pinned])

  return (
    <InfoPopoverContext.Provider value={contextValue}>
      <Popover
        hoverable
        stayInFrame
        allowFlip
        keepChildrenMounted
        {...props} // On spread les props ici (dont onOpenChange et open potentiel)
        placement={placement}
        open={pinned || props.open} // Le "pinned" force l'ouverture
        onOpenChange={(open) => {
          if (!open) setPinned(false)
          props.onOpenChange?.(open)
        }}
      >
        {children}
      </Popover>
    </InfoPopoverContext.Provider>
  )
}

export function InfoPopoverTrigger({ children, ...props }: PropsWithChildren<ComponentProps<typeof Popover.Trigger>>) {
  const { pinned, setPinned } = useInfoPopover()

  return (
    <Popover.Trigger
      cursor="pointer"
      {...props}
      onPress={(e) => {
        setPinned(!pinned)
        props.onPress?.(e)
      }}
    >
      {children}
    </Popover.Trigger>
  )
}

export function InfoPopoverContent({ children, ...props }: PropsWithChildren<ComponentProps<typeof Popover.Content>>) {
  return (
    <Popover.Content
      animation="quick"
      animateOnly={['transform', 'opacity']}
      enterStyle={{ opacity: 0, scale: 0.98 }}
      exitStyle={{ opacity: 0, scale: 0.98 }}
      borderWidth={1}
      borderColor="$gray8"
      backgroundColor="$gray7"
      m="$xsmall"
      p="$medium"
      {...props}
    >
      {children}
      <Popover.Arrow borderWidth={1} borderColor="$borderColor" />
    </Popover.Content>
  )
}

export function InfoPopoverText({ children, ...props }: PropsWithChildren<TextProps>) {
  return (
    <Text color="$white1" fontSize={16} {...props}>
      {children}
    </Text>
  )
}
