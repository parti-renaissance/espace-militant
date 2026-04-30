import { ComponentProps, PropsWithChildren } from 'react'
import { Popover } from 'tamagui'

type InfoPopoverDirection = 'top' | 'bottom' | 'left' | 'right'
type InfoPopoverAlign = 'start' | 'center' | 'end'

type InfoPopoverProps = ComponentProps<typeof Popover> & {
  direction?: InfoPopoverDirection
  align?: InfoPopoverAlign
}
type InfoPopoverContentProps = ComponentProps<typeof Popover.Content>
type InfoPopoverPlacement = NonNullable<ComponentProps<typeof Popover>['placement']>

const resolvePlacement = (direction: InfoPopoverDirection, align: InfoPopoverAlign): InfoPopoverPlacement =>
  (align === 'center' ? direction : `${direction}-${align}`) as InfoPopoverPlacement

export function InfoPopover({ children, direction = 'bottom', align = 'center', ...props }: PropsWithChildren<InfoPopoverProps>) {
  const placement = resolvePlacement(direction, align)

  return (
    <Popover placement={placement} stayInFrame allowFlip keepChildrenMounted {...props}>
      {children}
    </Popover>
  )
}

export function InfoPopoverTrigger({ children, ...props }: PropsWithChildren<ComponentProps<typeof Popover.Trigger>>) {
  return <Popover.Trigger {...props}>{children}</Popover.Trigger>
}

export function InfoPopoverContent({ children, ...props }: PropsWithChildren<InfoPopoverContentProps>) {
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
