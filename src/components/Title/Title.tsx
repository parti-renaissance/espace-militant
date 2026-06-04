import { createElement, type ComponentProps, type ReactNode } from 'react'
import { createStyledContext, isWeb, styled, Text as TamaguiText, View, withStaticProperties, XStack } from 'tamagui'

import { PLAAK_44_BOLD } from '../../../theme/fonts'

export const TitleContext = createStyledContext({
  size: 'h1' as 'h1' | 'h2',
})

const TitleFrame = styled(XStack, {
  name: 'Title',
  context: TitleContext,
  flexDirection: 'row',
  flexWrap: 'wrap',
  alignItems: 'baseline',
  columnGap: 4,
  rowGap: 4,
  maxWidth: '100%',
  variants: {
    size: {
      h1: {},
      h2: {},
    },
  } as const,
  defaultVariants: {
    size: 'h1',
  },
})

const TitleText = styled(TamaguiText, {
  name: 'TitleText',
  context: TitleContext,
  fontFamily: PLAAK_44_BOLD,
  fontWeight: '400',
  color: '$textPrimary',
  flexShrink: 0,
  whiteSpace: 'normal',
  variants: {
    size: {
      h1: {
        fontSize: 32,
        lineHeight: 32,
        letterSpacing: -0.96,
      },
      h2: {
        fontSize: 20,
        lineHeight: 20,
        letterSpacing: -0.6,
      },
    },
  } as const,
  defaultVariants: {
    size: 'h1',
  },
})

const TitleLineBreak = styled(View, {
  name: 'TitleLineBreak',
  width: '100%',
  height: 0,
})

const TitleHighlightFrame = styled(XStack, {
  name: 'TitleHighlight',
  position: 'relative',
  alignSelf: 'flex-start',
  flexShrink: 0,
  alignItems: 'baseline',
  variants: {
    size: {
      h1: {
        paddingHorizontal: 6,
      },
      h2: {
        paddingHorizontal: 4,
      },
    },
  } as const,
  defaultVariants: {
    size: 'h1',
  },
})

const TitleHighlightBackground = styled(View, {
  name: 'TitleHighlightBackground',
  position: 'absolute',
  left: 0,
  right: 0,
  top: -3,
  variants: {
    size: {
      h1: {
        top: -3,
        height: 35,
      },
      h2: {
        top: -1,
        height: 22,
      },
    },
  } as const,
  backgroundColor: '$yellow3',
  zIndex: 0,
  pointerEvents: 'none',
  defaultVariants: {
    size: 'h1',
  },
})

const TitleHighlightText = styled(TitleText, {
  name: 'TitleHighlightText',
  position: 'relative',
  zIndex: 1,
})

function TitleHighlight({ children, ...props }: TitleHighlightProps) {
  const { size } = TitleContext.useStyledContext()

  return (
    <TitleHighlightFrame size={size} {...props}>
      <TitleHighlightBackground size={size} />
      <TitleHighlightText size={size}>{children}</TitleHighlightText>
    </TitleHighlightFrame>
  )
}

function TitleComponent({ children, size = 'h1', 'aria-label': ariaLabel, ...props }: TitleProps) {
  const frame = (
    <TitleContext.Provider size={size}>
      <TitleFrame size={size} {...props}>
        {children}
      </TitleFrame>
    </TitleContext.Provider>
  )

  if (isWeb) {
    return createElement(size, ariaLabel ? { 'aria-label': ariaLabel } : undefined, frame)
  }

  return (
    <TitleContext.Provider size={size}>
      <TitleFrame size={size} role="heading" aria-level={size === 'h1' ? 1 : 2} aria-label={ariaLabel} {...props}>
        {children}
      </TitleFrame>
    </TitleContext.Provider>
  )
}

const Title = withStaticProperties(TitleComponent, {
  Props: TitleContext.Provider,
  Text: TitleText,
  Break: TitleLineBreak,
  Highlight: TitleHighlight,
})

export default Title

export type TitleSize = 'h1' | 'h2'

export type TitleProps = ComponentProps<typeof TitleFrame> & {
  children?: ReactNode
  size?: TitleSize
}

export type TitleHighlightProps = ComponentProps<typeof TitleHighlightFrame> & {
  children?: ReactNode
}
