import { ComponentPropsWithoutRef, forwardRef } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { ChevronRight } from '@tamagui/lucide-icons'
import { styled, TamaguiElement, XStack } from 'tamagui'
import Text from '../base/Text'
import { useOpenExternalContent } from '@/hooks/useOpenExternalContent'
import * as magicLinkTypes from '@/services/magic-link/schema'
import type { IconComponent } from '@/models/common.model'

const ItemFrame = styled(XStack, {
  animation: '100ms',
  width: '100%',
  backgroundColor: '$white1',
  paddingHorizontal: 20,
  alignItems: 'center',
  cursor: 'pointer',
  height: 56,
  hoverStyle: {
    backgroundColor: '$gray1',
  },
  pressStyle: {
    backgroundColor: '$gray2',
  },

  variants: {
    size: {
      sm: {
        height: 56,
      },
      lg: {
        borderBottomWidth: 1,
        borderBottomColor: '$textOutline',
      },
    },
    disabled: {
      true: {
        cursor: 'not-allowed',
        opacity: 0.5,
        hoverStyle: {
          backgroundColor: '$white1',
        },
        pressStyle: {
          backgroundColor: '$white1',
        },
      },
    },

    active: {
      true: {
        backgroundColor: '$gray1',
        hoverStyle: {
          backgroundColor: '$gray1',
        },
        pressStyle: {
          backgroundColor: '$gray1',
        },
      },
    },
    last: {
      true: {
        borderColor: '$colorTransparent',
      },
    },
  } as const,

  defaultVariants: {
    size: 'sm',
  },
})

const ItemText = styled(Text, {
  animation: '100ms',
  variants: {
    size: {
      sm: {
        fontSize: 14,
      },
      lg: {
        fontSize: '$4',
      },
    },
    active: {
      true: {},
    },
  } as const,
  defaultVariants: {
    size: 'sm',
  },
})

const Item = forwardRef<
  TamaguiElement,
  ComponentPropsWithoutRef<typeof ItemFrame> & { 
    children: string | string[]
    icon: IconComponent
    showArrow?: boolean
    externalSlug?: magicLinkTypes.Slugs
  }
>(({ children, icon: Icon, showArrow, externalSlug, ...props }, ref) => {
  const externalLink = useOpenExternalContent({ 
    slug: externalSlug ?? 'adhesion',
  })
  
  const handlePress = externalSlug ? externalLink.open({}) : props.onPress
  const isDisabled = externalSlug ? externalLink.isPending : props.disabled
  
  return (
    <ItemFrame {...props} onPress={handlePress} disabled={isDisabled} ref={ref}>
      <Icon size={props.size === 'lg' ? 16 : '$1'} color="$textPrimary" marginRight={8} />
      <XStack width="100%" flexShrink={1}>
        <ItemText size={'sm'} active={props.active}>
          {children}
        </ItemText>
      </XStack>
      {showArrow && <ChevronRight size="$1" color="$textPrimary" />}
    </ItemFrame>
  )
})

export default Item
