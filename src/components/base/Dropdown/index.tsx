import React, { ComponentRef, useCallback, useEffect } from 'react'
import { FlatList, Modal, TouchableOpacity } from 'react-native'
import Text from '@/components/base/Text'
import { useLazyRef } from '@/hooks/useLazyRef'
import type { IconComponent } from '@/models/common.model'
import { Check } from '@tamagui/lucide-icons'
import { styled, ThemeableStack, XStack, YStack } from 'tamagui'

export const DropdownItemFrame = styled(ThemeableStack, {
  padding: '$medium',
  gap: '$medium',
  backgroundColor: 'white',
  flexDirection: 'row',
  alignItems: 'center',
  alignContent: 'center',
  justifyContent: 'space-between',
  borderBottomWidth: 1,
  borderBottomColor: '$textOutline',
  focusable: true,
  hoverStyle: {
    backgroundColor: '$textSurface',
  },
  pressStyle: {
    backgroundColor: '$gray1',
  },
  variants: {
    selected: {
      true: {
        backgroundColor: '$gray1',
        hoverStyle: {
          backgroundColor: '$gray1',
        },
        pressStyle: {
          backgroundColor: '$gray3',
        },
      },
    },
    last: {
      true: {
        borderBottomWidth: 0,
      },
    },
    size: {
      xs: {
        minHeight: 40,
      },
      sm: {
        minHeight: 44,
      },
      md: {
        minHeight: 48,
      },
      lg: {
        minHeight: 56,
      },
      xl: {
        minHeight: 64,
      },
    },
  } as const,
  defaultVariants: {
    size: 'md',
  },
})

type ItemProps = {
  title: string | React.ReactNode[] | Element
  subtitle?: string
  onPress?: () => void
  selected?: boolean
  color?: string
  icon?: IconComponent
} & React.ComponentPropsWithoutRef<typeof DropdownItemFrame>

export const DropdownItem = ({ title, subtitle, color = '$textPrimary', theme, ...props }: ItemProps) => {
  return (
    <DropdownItemFrame {...props}>
      <YStack flex={1} gap="$small">
        <XStack alignSelf="flex-start" theme={theme} gap="$small">
          {props?.icon ? <XStack width={16}><props.icon color={theme ? '$color5' : color} size={16} /></XStack> : null}
          <Text.MD textAlign="left" color={theme ? '$color5' : color}>
            {title}
          </Text.MD>
        </XStack>
        {subtitle ? (
          <Text.SM secondary multiline>
            {subtitle}
          </Text.SM>
        ) : null}
      </YStack>
      {[props.selected].some((x) => x) ? <XStack>{props.selected ? <Check color={color} size={20} /> : null}</XStack> : null}
    </DropdownItemFrame>
  )
}

export const DropdownFrame = styled(ThemeableStack, {
  backgroundColor: 'white',
  borderRadius: 16,
  overflow: 'hidden',
  elevation: 1,
  shadowColor: '$gray1',
  borderWidth: 1,
  borderColor: '$textOutline',
  variants: {
    size: {
      xs: {
        maxHeight: 40 * 6,
      },
      sm: {
        maxHeight: 44 * 6,
      },
      md: {
        maxHeight: 48 * 6,
      },
      lg: {
        maxHeight: 56 * 6,
      },
      xl: {
        maxHeight: 64 * 6,
      },
      false: {
        maxHeight: 'unset',
      },
    },
  },
  defaultVariants: {
    size: 'xl',
  },
})

type DropdownProps<A extends string> = {
  items: Array<ItemProps & { id: A }>
  onSelect: (value: A) => void
  value?: string
} & React.ComponentPropsWithoutRef<typeof DropdownFrame>

const MemoItem = React.memo(DropdownItem)

export function Dropdown<A extends string>({ items, onSelect, value, ...props }: DropdownProps<A>) {
  const { current: handleSelect } = useLazyRef(() => (id: A) => () => onSelect(id))
  return (
    <DropdownFrame {...props}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <MemoItem
            {...item}
            size={typeof props.size === 'string' ? props.size : 'lg'}
            onPress={handleSelect(item.id)}
            selected={item.id === value}
            last={items.length - 1 === index}
          />
        )}
      />
    </DropdownFrame>
  )
}

export function DropdownWrapper<A extends string>({
  children,
  onSelect,
  ...props
}: DropdownProps<A> & { children: React.ReactNode; open?: boolean; onOpenChange?: (x: boolean) => void }) {
  const open = props.open ?? false
  const setOpen = props.onOpenChange ?? (() => {})
  const container = React.useRef<ComponentRef<typeof TouchableOpacity> | null>(null)
  const [dropdownTop, setDropdownTop] = React.useState(0)
  useEffect(() => {
    if (!container.current || !props.open) return
    container.current.measure((_fx, _fy, _w, h, _px, py) => {
      setDropdownTop(py + h)
    })
  }, [props.open])

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [])

  const handleSelect = useCallback((value: A) => {
    onSelect(value)
    setOpen(false)
  }, [])

  return (
    <TouchableOpacity ref={container}>
      <Modal visible={open} transparent animationType="fade" onRequestClose={handleClose}>
        <TouchableOpacity style={{ flex: 1 }} onPress={handleClose}>
          <Dropdown {...props} onSelect={handleSelect} position="absolute" top={dropdownTop} alignSelf="center" minWidth={230} />
        </TouchableOpacity>
      </Modal>
      {children}
    </TouchableOpacity>
  )
}
