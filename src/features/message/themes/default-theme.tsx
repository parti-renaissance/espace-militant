import * as S from '@/features/message/schemas/messageBuilderSchema'

export default {
  global: {},
  image: {
    frame: {
      container: {
        padding: 16,
      },
      base: {
        borderRadius: 8,
      },
    },
  },
  richtext: {
    global: {
      container: {
        padding: 16,
      },
    },
  },
  button: {
    global: {
      container: {
        borderRadius: 28,
        cursor: 'pointer',
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 16,
      },
      base: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: 'bold',
        color: 'hsl(211,24%, 17%)',
      },
    },
    primary: {
      container: {
        backgroundColor: '#4291E1',
      },
      base: {
        color: 'white',
      },
    },
    secondary: {
      container: {
        backgroundColor: 'white',
        borderColor: '#4291E1',
        borderWidth: 2,
        borderStyle: 'solid',
      },
      base: {
        color: '#4291E1',
      },
    },
  },
} satisfies S.MessageStyle
