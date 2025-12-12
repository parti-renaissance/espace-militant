import * as S from '@/features_next/publications/components/Editor/schemas/messageBuilderSchema'

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
      },
      trailing: {
        borderTopWidth: 0,
        borderBottomRightRadius: 16,
        borderBottomLeftRadius: 16,
      },
      leading: {
        borderBottomWidth: 0,
      },
      middle: {
        borderTopWidth: 0,
        borderBottomWidth: 0,
      },
      alone: {
        borderRadius: 0,
        borderBottomRightRadius: 16,
        borderBottomLeftRadius: 16,
      },
    },
  },
  image: {
    global: {
      container: {
        paddingBottom: 16,
        paddingTop: 16,
        paddingLeft: 16,
        paddingRight: 16,
      },
      base: {
        borderRadius: 8,
        width: '100%',
      },
    },
    leading: {
      wrapper: {},
      container: {
        paddingBottom: 8,
        paddingTop: 0,
        paddingLeft: 0,
        paddingRight: 0,
      },
      base: {
        width: '100%',
        borderRadius: 0,
      },
    },
    trailing: {
      container: { paddingBottom: 40 },
    },
    alone: {
      wrapper: {},
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
      container: { paddingTop: 8, paddingBottom: 8, paddingLeft: 16, paddingRight: 16 },
    },
    trailing: {
      container: { paddingTop: 8, paddingBottom: 40, paddingLeft: 16, paddingRight: 16 },
    },
    middle: {
      container: { paddingTop: 8, paddingBottom: 8, paddingLeft: 16, paddingRight: 16 },
    },
    alone: {
      container: { paddingTop: 8, paddingBottom: 40, paddingLeft: 16, paddingRight: 16 },
    }
  },
  button: {
    global: {
      wrapper: { paddingTop: 8, paddingBottom: 8, paddingLeft: 16, paddingRight: 16 },
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
    trailing: {
      wrapper: { paddingBottom: 40 },
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
  attachment: {
    global: {
      wrapper: { paddingTop: 8, paddingBottom: 8, paddingLeft: 16, paddingRight: 16 },
      container: {
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        paddingTop: 22,
        paddingBottom: 22,
        paddingLeft: 12,
        paddingRight: 12,
      },
      base: {},
    },
    leading: {
      wrapper: { paddingTop: 8, paddingBottom: 8, paddingLeft: 16, paddingRight: 16 },
    },
    trailing: {
      wrapper: { paddingTop: 8, paddingBottom: 40, paddingLeft: 16, paddingRight: 16 },
    },
    middle: {
      wrapper: { paddingTop: 8, paddingBottom: 8, paddingLeft: 16, paddingRight: 16 },
    },
    alone: {
      wrapper: { paddingTop: 8, paddingBottom: 40, paddingLeft: 16, paddingRight: 16 },
    },
  },
} satisfies S.MessageStyle
