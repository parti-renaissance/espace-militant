import * as S from '@/features/message/components/Editor/schemas/messageBuilderSchema'

export default {
  global: {
    container: {
      // overflow: 'hidden',
    },
    item: {
      wrapper: {
        overflow: 'hidden',
        backgroundColor: 'white',
        borderColor: '#EEF0F2',
        borderStyle: 'solid',
        // paddingHorizontal: 40,
      },
      trailing: {
        borderWidth: 1,
        borderTopWidth: 0,
        borderBottomRightRadius: 16,
        borderBottomLeftRadius: 16,
      },
      leading: {
        borderWidth: 1,
        borderBottomWidth: 0,
        borderTopRightRadius: 16,
        borderTopLeftRadius: 16,
      },
      middle: {
        borderWidth: 1,
        borderTopWidth: 0,
        borderBottomWidth: 0,
      },

      alone: {
        borderWidth: 1,
        borderRadius: 16,
      },
    },
  },
  image: {
    frame: {
      container: {
        paddingVertical: 16,
        paddingHorizontal: 40,
      },
      base: {
        borderRadius: 8,
      },
    },
    borderless: {
      container: {},
      base: {},
    },
  },
  richtext: {
    global: {
      container: {
        paddingVertical: 16,
        paddingHorizontal: 40,
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
        marginHorizontal: 40,
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
