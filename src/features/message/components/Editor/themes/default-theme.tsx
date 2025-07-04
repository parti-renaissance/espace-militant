import * as S from '@/features/message/components/Editor/schemas/messageBuilderSchema'

export default {
  global: {
    wrapper: {
      margin: 0,
      marginLeft: 16,
      marginRight: 16,
      backgroundColor: '#f9f9fa',
    },
    container: {
      paddingTop: 16,
      paddingBottom: 16,
      maxWidth: 550,
    },

    item: {
      wrapper: {
        overflow: 'hidden',
        backgroundColor: 'white',
        // borderColor: '#EEF0F2',
        // borderStyle: 'solid',
        // paddingTop: 16,
        // paddingBottom: 16,
        // paddingLeft: 40,
        // paddingRight: 40,
      },
      trailing: {
        // borderWidth: 1,
        borderTopWidth: 0,
        borderBottomRightRadius: 16,
        borderBottomLeftRadius: 16,
      },
      leading: {
        // borderWidth: 1,
        borderBottomWidth: 0,
        // borderTopRightRadius: 16,
        //borderTopLeftRadius: 16,
      },
      middle: {
        // borderWidth: 1,
        borderTopWidth: 0,
        borderBottomWidth: 0,
      },

      alone: {
        // borderWidth: 1,
        borderRadius: 0,
        borderBottomRightRadius: 16,
        borderBottomLeftRadius: 16,
      },
    },
  },
  image: {
    global: {
      container: {
        paddingBottom: 24,
        paddingTop: 24,
        paddingLeft: 24,
        paddingRight: 24,
      },
      base: {
        borderRadius: 8,
        width: '100%',
      },
    },
    leading: {
      wrapper: { padding: 0, paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0 },
      container: {
        paddingBottom: 24,
        paddingTop: 0,
        paddingLeft: 0,
        paddingRight: 0,
      },
      base: {
        width: '100%',
        borderRadius: 0,
      },
    },
    alone: {
      wrapper: { padding: 0, paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0 },
      container: {},
      base: {
        width: '100%',
        borderRadius: 0,
      },
    },
  },
  richtext: {
    global: {
      container: { minHeight: 20 },
    },
    leading: {
      container: { paddingTop: 16, paddingBottom: 0, paddingLeft: 16, paddingRight: 16 },
    },
    trailing: {
      container: { paddingTop: 0, paddingBottom: 16, paddingLeft: 16, paddingRight: 16 },
    },
    middle: {
      container: { paddingLeft: 16, paddingRight: 16 },
    },
    alone: {
      container: { paddingTop: 16, paddingBottom: 16, paddingLeft: 16, paddingRight: 16 },
    }
  },
  button: {
    global: {
      container: {
        width: '100%',
        borderRadius: 28,
        cursor: 'pointer',

        paddingTop: 12,
        paddingBottom: 12,
        paddingRight: 12,
        paddingLeft: 12,
      },
      base: {
        fontSize: 16,
        textAlign: 'center',
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
