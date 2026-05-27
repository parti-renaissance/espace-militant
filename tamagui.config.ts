import { config as configBase } from '@tamagui/config/v3'
import { createTamagui, createTokens } from 'tamagui'
import { Maax, Plaak, PublicSans } from './theme/fonts'
import { themes } from './themes'

const myTokens = createTokens({
  ...configBase.tokens,
  space: {
    ...configBase.tokens.space,
    true: 16,
    xsmall: 4,
    small: 8,
    medium: 16,
    large: 24,
    xlarge: 32,
    xxlarge: 40,
    xxxlarge: 64,
    1: 0,
    2: 2,
    3: 4,
    4: 8,
    5: 12,
    6: 16,
    7: 20,
    8: 24,
    9: 32,
    10: 40,
    11: 64,
    12: 80,
    '-1': -0,
    '-2': '-2',
    '-3': '-4',
    '-4': '-8',
    '-5': '-12',
    '-6': '-16',
    '-7': '-20',
    '-8': '-24',
    '-9': '-32',
    '-10': '-40',
    '-11': '-64',
    '-12': '-80',
  },
})

export const config = createTamagui({
  ...configBase,
  settings: {
    webContainerType: 'normal',
  },
  themes,
  tokens: myTokens,
  media: configBase.media,
  defaultFont: 'PublicSans',
  fonts: { ...configBase.fonts, Maax, Plaak, PublicSans },
})

export default config

export type Conf = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}
