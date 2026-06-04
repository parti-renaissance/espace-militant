import { Fragment } from 'react'
import { styled, Text as TamaguiText, withStaticProperties } from 'tamagui'

const Text = styled(TamaguiText, {
  fontSize: '$2',

  defaultVariants: {
    regular: true,
    primary: true,
  },
  variants: {
    primary: {
      true: {
        color: '$textPrimary',
      },
      false: {
        color: '$color5',
      },
    },
    secondary: {
      true: {
        color: '$textSecondary',
      },
    },
    semibold: {
      true: {
        fontWeight: 600,
      },
    },
    medium: {
      true: {
        fontWeight: 500,
      },
    },
    bold: {
      true: {
        fontWeight: 700,
      },
    },
    regular: {
      true: {
        fontWeight: 400,
      },
    },
    link: {
      true: {
        cursor: 'pointer',
        textDecorationLine: 'underline',
        color: '$blue6',
        pressStyle: {
          opacity: 0.6,
        },
        hoverStyle: {
          opacity: 0.8,
        },
      },
    },
  } as const,
})

const LG = styled(Text, {
  fontSize: 16,
  semibold: true,
  primary: true,
  variants: {
    multiline: {
      true: {
        lineHeight: 24,
      },
    },
  },
})

const MD = styled(Text, {
  fontSize: 14,
  primary: true,
  variants: {
    multiline: {
      true: {
        lineHeight: 22,
      },
    },
  },
})

const SM = styled(Text, {
  fontSize: 12,
  regular: true,
  primary: true,
  variants: {
    multiline: {
      true: {
        lineHeight: 20,
      },
    },
  },
})

const XSM = styled(Text, {
  fontSize: 9,
  semibold: true,
})

const P = styled(SM, {
  secondary: true,
  regular: true,
  multiline: true,
})

const BR = () => <Fragment>{'\n'}</Fragment>
const TAB = () => <Fragment>{'\t'}</Fragment>

export default withStaticProperties(Text, {
  LG,
  MD,
  SM,
  XSM,
  P,
  BR,
  TAB,
})

