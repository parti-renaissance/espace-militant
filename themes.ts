import { createThemeBuilder } from '@tamagui/theme-builder'
import type { Variable } from '@tamagui/web'
import { black, blue, gray, green, orange, purple, white, yellow } from './theme/colors.hsl'

const colorTokens = {
  light: {
    blue,
    gray,
    green,
    orange,
    purple,
    yellow,
    white,
  },
}

const lightShadowColor = 'rgba(0,0,0,0.04)'
const lightShadowColorStrong = 'rgba(0,0,0,0.085)'

const transparenciesPercents = [0, 8, 12, 16, 24, 32, 40, 48, 56, 64, 72, 80] as const
type PercentValue = (typeof transparenciesPercents)[number]
const transparent = (hsl: string, opacity = 0) => hsl.replace(`%)`, `%, ${opacity})`).replace(`hsl(`, `hsla(`)
const lightColors = {
  ...addSetOfTransparenciesToColor(colorTokens.light.blue.blue5, 'blue', true),
  ...colorTokens.light.blue,
  ...addSetOfTransparenciesToColor(colorTokens.light.gray.gray5, 'gray', true),
  ...colorTokens.light.gray,
  ...addSetOfTransparenciesToColor(colorTokens.light.green.green5, 'green', true),
  ...colorTokens.light.green,
  ...addSetOfTransparenciesToColor(colorTokens.light.orange.orange5, 'orange', true),
  ...colorTokens.light.orange,
  ...addSetOfTransparenciesToColor(colorTokens.light.purple.purple5, 'purple', true),
  ...colorTokens.light.purple,
  ...addSetOfTransparenciesToColor(colorTokens.light.yellow.yellow5, 'yellow', true),
  ...colorTokens.light.yellow,
  ...addSetOfTransparenciesToColor(white.white1, 'white', true),
  ...colorTokens.light.white,
}

const whiteTransparencies = addSetOfTransparenciesToColor(white.white1, 'white', false)
const blackTransparencies = addSetOfTransparenciesToColor(black.black1, 'black', false)

export const palettes = (() => {
  const lightPalette = [...Object.values(whiteTransparencies), ...Object.values(white), ...Object.values(blackTransparencies).reverse()]

  const getColorPalette = (colors: (typeof colorTokens)['light'][keyof (typeof colorTokens)['light']], neutral: number = 6): string[] => {
    const colorPalette = Object.values(colors) as string[]
    // add our transparent colors first/last
    // and make sure the last (foreground) color is white/black rather than colorful
    // this is mostly for consistency with the older theme-base
    return [
      ...transparenciesPercents.map((percent) => transparent(colorPalette[0], percent / 100)),
      ...colorPalette,
      ...[...transparenciesPercents].reverse().map((percent) => transparent(colorPalette[neutral], percent / 100)),
    ]
  }
  const lightPalettes = objectFromEntries(objectKeys(colorTokens.light).map((key) => [`light_${key}`, getColorPalette(colorTokens.light[key])] as const))

  const colorPalettes = {
    ...lightPalettes,
  }

  return {
    light: lightPalette,
    ...colorPalettes,
  }
})()

const text = {
  light: {
    textPrimary: 'hsl(211,24%, 17%)',
    textSecondary: 'hsl(208, 13%, 45%)',
    textDisabled: 'hsl(210, 13%, 52%)',
    textSurface: 'hsl(240, 9%, 98%)',
    textOutline32: 'hsl(210, 13%, 88%)',
    textOutline20: 'hsl(204, 13%, 92%)',
    textOutline: 'hsl(210, 13%, 94%)',
    textDanger: orange.orange5,
  },
}

export const templates = (() => {
  const transparencies = transparenciesPercents.length - 1

  // templates use the palette and specify index
  // negative goes backwards from end so -1 is the last item
  const base = {
    background0: 0,
    background025: 1,
    background05: 2,
    background075: 3,
    'color/8': -1,

    color1: transparencies + 1,
    color2: transparencies + 2,
    color3: transparencies + 3,
    color4: transparencies + 4,
    color5: transparencies + 5,
    color6: transparencies + 6,
    color7: transparencies + 7,
    color8: transparencies + 8,
    color9: transparencies + 9,
    color10: transparencies + 10,
    color11: transparencies + 11,
    color12: transparencies + 12,
    color025: -1,
    color05: -2,
    color075: -3,
    // the background, color, etc keys here work like generics - they make it so you
    // can publish components for others to use without mandating a specific color scale
    // the @tamagui/button Button component looks for `$background`, so you set the
    // dark_red_Button theme to have a stronger background than the dark_red theme.
    background: transparencies + 1,
    backgroundHover: transparencies + 2,
    backgroundPress: transparencies + 3,
    backgroundFocus: transparencies + 1,
    borderColor: transparencies + 4,
    borderColorHover: transparencies + 5,
    borderColorFocus: transparencies + 2,
    borderColorPress: transparencies + 4,
    color: transparencies + 12,
    colorSecondary: transparencies + 6,
    colorDisabled: transparencies + 5,
    colorHover: -transparencies - 2,
    colorPress: -transparencies - 1,
    colorFocus: -transparencies - 2,
    colorTransparent: -0,
    placeholderColor: -transparencies - 4,
    outlineColor: -1,
  }

  const InternAlertSurface = {
    background: transparencies + 1,
    borderColor: transparencies + 6,
    color: transparencies + 8,
  }

  const surface1 = {
    background: base.background + 1,
    backgroundHover: base.backgroundHover + 1,
    backgroundPress: base.backgroundPress + 1,
    backgroundFocus: base.backgroundFocus + 1,
    borderColor: base.borderColor + 1,
    borderColorHover: base.borderColorHover + 1,
    borderColorFocus: base.borderColorFocus + 1,
    borderColorPress: base.borderColorPress + 1,
  }

  const surface2 = {
    background: base.background + 2,
    backgroundHover: base.backgroundHover + 2,
    backgroundPress: base.backgroundPress + 2,
    backgroundFocus: base.backgroundFocus + 2,
    borderColor: base.borderColor + 2,
    borderColorHover: base.borderColorHover + 2,
    borderColorFocus: base.borderColorFocus + 2,
    borderColorPress: base.borderColorPress + 2,
  }

  const surfaceSwitch = {
    background: transparencies + 3,
  }

  const surfaceSwitchThumb = {
    background: transparencies + 1,
  }

  const badgeSurface = {
    background: transparencies + 2,
    color: transparencies + 7,
  }

  const buttonSurface = {
    background: transparencies + 7,
    backgroundHover: transparencies + 8,
    backgroundPress: transparencies + 9,
    color: transparencies + 2,
    colorHover: transparencies + 3,
    colorPress: transparencies + 4,
  }

  const buttonContainedSurface = {
    background: transparencies + 5,
    backgroundHover: transparencies + 6,
    backgroundPress: transparencies + 7,
    color: white.white1,
    colorPress: white.white1,
    colorHover: white.white1,
  }

  const inverseButtonContainedSurface = {
    background: transparencies + 1,
    backgroundHover: transparencies + 2,
    backgroundPress: transparencies + 3,
    color: transparencies + 6,
    colorHover: transparencies + 8,
    colorPress: transparencies + 8,
  }

  const inverseButtonSoftSurface = {
    background: gray.gray1,
    backgroundHover: gray.gray2,
    backgroundPress: gray.gray3,
    color: text.light.textDisabled,
    colorHover: text.light.textPrimary,
    colorPress: text.light.textPrimary,
  }

  const buttonSoftSurface = {
    background: transparencies + 1,
    backgroundHover: transparencies + 2,
    backgroundPress: transparencies + 3,
    color: transparencies + 8,
    colorPress: transparencies + 8,
    colorHover: transparencies + 8,
    colorPop: transparencies + 9,
  }

  const buttonOutlinedSurface = {
    background: -0,
    backgroundHover: transparencies + 1,
    backgroundPress: transparencies + 2,
    borderColor: transparencies + 6,
    borderColorHover: transparencies + 8,
    borderColorPress: transparencies + 8,
    color: transparencies + 6,
    colorPress: transparencies + 7,
    colorHover: transparencies + 7,
  }

  const buttonTextSurface = {
    background: -0,
    backgroundHover: transparencies + 1,
    color: transparencies + 6,
    colorPress: transparencies + 7,
    colorHover: transparencies + 7,
  }

  const surface3 = {
    background: base.background + 3,
    backgroundHover: base.backgroundHover + 3,
    backgroundPress: base.backgroundPress + 3,
    backgroundFocus: base.backgroundFocus + 3,
    borderColor: base.borderColor + 3,
    borderColorHover: base.borderColorHover + 3,
    borderColorFocus: base.borderColorFocus + 3,
    borderColorPress: base.borderColorPress + 3,
  }

  const surfaceInput = {
    background: 1,
    backgroundHover: 4,
    backgroundPress: 5,
    backgroundFocus: 4,
    borderColor: base.colorDisabled,
    borderColorHover: base.colorSecondary,
    borderColorFocus: base.color,
    borderColorPress: base.color,
    oulineColor: 5,
    color: base.color,
    colorHover: base.colorSecondary,
    colorFocus: base.color,
    colorPress: base.color,
    colorDisabled: base.colorDisabled,
  }

  const surfaceRadio = {
    background: -2,
    backgroundHover: -1,
    backgroundPress: transparencies + 3,
    backgroundFocus: 1,
    borderColor: 4,
    borderColorHover: -1,
    borderColorFocus: transparencies + 8,
    borderColorPress: base.color,
    oulineColor: 5,
    color: base.colorSecondary,
    colorHover: base.colorSecondary,
    colorFocus: base.color,
    colorPress: base.color,
    colorDisabled: base.colorDisabled,
  }

  const surfaceInputActive = {
    background: 5,
    backgroundHover: 7,
    backgroundPress: 8,
    backgroundFocus: 9,
    borderColor: base.color,
    borderColorHover: base.colorSecondary,
    borderColorFocus: base.color,
    borderColorPress: base.color,
    oulineColor: 5,
    color: base.color,
    colorHover: base.colorSecondary,
    colorFocus: base.color,
    colorPress: base.color,
    colorDisabled: base.color,
  }

  const surfaceActive = {
    background: base.background + 5,
    backgroundHover: base.background + 5,
    backgroundPress: base.backgroundPress + 5,
    backgroundFocus: base.backgroundFocus + 5,
    borderColor: base.borderColor + 5,
    borderColorHover: base.borderColor + 5,
    borderColorFocus: base.borderColorFocus + 5,
    borderColorPress: base.borderColorPress + 5,
  }

  const inverseSurface1 = {
    color: surface1.background,
    colorHover: surface1.backgroundHover,
    colorPress: surface1.backgroundPress,
    colorFocus: surface1.backgroundFocus,
    background: base.color,
    backgroundHover: base.colorHover,
    backgroundPress: base.colorPress,
    backgroundFocus: base.colorFocus,
    borderColor: base.color - 2,
    borderColorHover: base.color - 3,
    borderColorFocus: base.color - 4,
    borderColorPress: base.color - 5,
  }

  const inverseActive = {
    ...inverseSurface1,
    background: base.color - 2,
    backgroundHover: base.colorHover - 2,
    backgroundPress: base.colorPress - 2,
    backgroundFocus: base.colorFocus - 2,
    borderColor: base.color - 2 - 2,
    borderColorHover: base.color - 3 - 2,
    borderColorFocus: base.color - 4 - 2,
    borderColorPress: base.color - 5 - 2,
  }

  const alt1 = {
    color: base.color - 1,
    colorHover: base.colorHover - 1,
    colorPress: base.colorPress - 1,
    colorFocus: base.colorFocus - 1,
  }

  const alt2 = {
    color: base.color - 2,
    colorHover: base.colorHover - 2,
    colorPress: base.colorPress - 2,
    colorFocus: base.colorFocus - 2,
  }

  return {
    base,
    alt1,
    alt2,
    surface1,
    surface2,
    surface3,
    inverseSurface1,
    inverseActive,
    surfaceActive,
    surfaceInput,
    surfaceInputActive,
    InternAlertSurface,
    surfaceRadio,
    surfaceSwitch,
    surfaceSwitchThumb,
    badgeSurface,
    buttonSurface,
    buttonOutlinedSurface,
    buttonTextSurface,
    buttonContainedSurface,
    inverseButtonContainedSurface,
    inverseButtonSoftSurface,
    buttonSoftSurface,
  }
})()

const shadows = {
  light: {
    shadowColor: lightShadowColorStrong,
    shadowColorHover: lightShadowColorStrong,
    shadowColorPress: lightShadowColor,
    shadowColorFocus: lightShadowColor,
  },
}

const nonInherited = {
  light: {
    ...lightColors,
    ...shadows.light,
    ...text.light,
  },
}

const overlayThemeDefinitions = [
  {
    parent: 'light',
    theme: {
      background: 'rgba(0,0,0,0.5)',
    },
  },
  {
    parent: 'dark',
    theme: {
      background: 'rgba(0,0,0,0.9)',
    },
  },
]

const inverseSurface1 = [
  {
    parent: 'active',
    template: 'inverseActive',
  },
  {
    parent: '',
    template: 'inverseSurface1',
  },
] as any

const surfaceSwitchThumb = [
  {
    parent: 'active',
    template: 'inverseActive',
  },
  {
    parent: '',
    template: 'surfaceSwitchThumb',
  },
] as any

const surface1 = [
  {
    parent: 'active',
    template: 'surfaceActive',
  },
  {
    parent: '',
    template: 'surface1',
  },
] as any

const surface2 = [
  {
    parent: 'active',
    template: 'surfaceActive',
  },
  {
    parent: '',
    template: 'surface2',
  },
] as any

const surfaceSwitch = [
  {
    parent: 'active',
    template: 'surfaceActive',
  },
  {
    parent: '',
    template: 'surfaceSwitch',
  },
] as any

const surface3 = [
  {
    parent: 'active',
    template: 'surfaceActive',
  },
  {
    parent: '',
    template: 'surface3',
  },
] as any

const surfaceInput1 = [
  {
    parent: 'active',
    template: 'surfaceInputActive',
  },
  {
    template: 'surfaceInput',
  },
] as any

const badgeSurface = [
  {
    template: 'badgeSurface',
  },
] as any

const buttonSurface = [
  {
    template: 'buttonSurface',
  },
] as any

const buttonContainedSurface = [
  {
    parent: '',
    template: 'buttonContainedSurface',
  },
] as any

const inverseButtonContainedSurface = [
  {
    parent: '',
    template: 'inverseButtonContainedSurface',
  },
] as any

const inverseButtonSoftSurface = [
  {
    parent: '',
    template: 'inverseButtonSoftSurface',
  },
] as any

const buttonSoftSurface = [
  {
    parent: '',
    template: 'buttonSoftSurface',
  },
] as any

const buttonOutlinedSurface = [
  {
    parent: '',
    template: 'buttonOutlinedSurface',
  },
] as any

const buttonTextSurface = [
  {
    parent: '',
    template: 'buttonTextSurface',
  },
] as any

// --- themeBuilder ---

const themeBuilder = createThemeBuilder()
  .addPalettes(palettes)
  .addTemplates(templates)
  .addThemes({
    light: {
      template: 'base',
      palette: 'light',
      nonInheritedValues: nonInherited.light,
    },
  })
  .addChildThemes({
    orange: {
      palette: 'orange',
      template: 'base',
    },
    yellow: {
      palette: 'yellow',
      template: 'base',
    },
    green: {
      palette: 'green',
      template: 'base',
    },
    blue: {
      palette: 'blue',
      template: 'base',
    },
    purple: {
      palette: 'purple',
      template: 'base',
    },
    pink: {
      palette: 'pink',
      template: 'base',
    },
    red: {
      palette: 'red',
      template: 'base',
    },
    gray: {
      palette: 'gray',
      template: 'base',
    },
  })
  .addChildThemes({
    alt1: {
      template: 'alt1',
    },
    alt2: {
      template: 'alt2',
    },
    active: {
      template: 'surface3',
    },
  })
  .addChildThemes(
    {
      ListItem: {
        template: 'surface1',
      },
      SelectTrigger: surface1,
      Card: surface1,
      Button: surface3,
      Checkbox: surface2,
      Switch: surfaceSwitch,
      SwitchThumb: surfaceSwitchThumb,
      TooltipContent: surface2,
      DrawerFrame: {
        template: 'surface1',
      },
      Progress: {
        template: 'surface1',
      },
      RadioGroupItem: surface2,
      TooltipArrow: {
        template: 'surface1',
      },
      SliderTrackActive: {
        template: 'surface3',
      },
      SliderTrack: {
        template: 'surface1',
      },
      SliderThumb: inverseSurface1,
      Tooltip: inverseSurface1,
      ProgressIndicator: inverseSurface1,
      SheetOverlay: overlayThemeDefinitions,
      DialogOverlay: overlayThemeDefinitions,
      ModalOverlay: overlayThemeDefinitions,
      Input: surface1,
      TextArea: surface1,
      VoxInput: surfaceInput1,
      VoxBadge: badgeSurface,
      VoxButtonContained: buttonContainedSurface,
      VoxButtonInverseContained: inverseButtonContainedSurface,
      VoxButtonInverseSoft: inverseButtonSoftSurface,
      VoxButtonSoft: buttonSoftSurface,
      VoxButtonOutlined: buttonOutlinedSurface,
      VoxButtonText: buttonTextSurface,
      VoxRadio: {
        template: 'surfaceRadio',
      },
      InternAlert: {
        template: 'InternAlertSurface',
      },
    },
    {
      avoidNestingWithin: ['alt1', 'alt2'],
    },
  )

// --- themes ---

const themesIn = themeBuilder.build()

export type Theme = Record<keyof typeof templates.base, string> & typeof nonInherited.light
export type ThemesOut = Record<keyof typeof themesIn, Theme>
export const themes = themesIn as ThemesOut

// --- utils ---

export function postfixObjKeys<A extends { [key: string]: Variable<string> | string }, B extends string>(
  obj: A,
  postfix: B,
): {
  [Key in `${keyof A extends string ? keyof A : never}${B}`]: Variable<string> | string
} {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [`${k}${postfix}`, v])) as any
}

// a bit odd but keeping backward compat for values >8 while fixing below
export function sizeToSpace(v: number) {
  if (v === 0) return 0
  if (v === 2) return 0.5
  if (v === 4) return 1
  if (v === 8) return 1.5
  if (v <= 16) return Math.round(v * 0.333)
  return Math.floor(v * 0.7 - 12)
}

export function objectFromEntries<ARR_T extends EntriesType>(arr: ARR_T): EntriesToObject<ARR_T> {
  return Object.fromEntries(arr) as EntriesToObject<ARR_T>
}

export type EntriesType = [PropertyKey, unknown][] | ReadonlyArray<readonly [PropertyKey, unknown]>

export type DeepWritable<OBJ_T> = {
  -readonly [P in keyof OBJ_T]: DeepWritable<OBJ_T[P]>
}
export type UnionToIntersection<UNION_T> = // From https://stackoverflow.com/a/50375286
  (UNION_T extends any ? (k: UNION_T) => void : never) extends (k: infer I) => void ? I : never

export type UnionObjectFromArrayOfPairs<ARR_T extends EntriesType> =
  DeepWritable<ARR_T> extends (infer R)[] ? (R extends [infer key, infer val] ? { [prop in key & PropertyKey]: val } : never) : never
export type MergeIntersectingObjects<ObjT> = { [key in keyof ObjT]: ObjT[key] }
export type EntriesToObject<ARR_T extends EntriesType> = MergeIntersectingObjects<UnionToIntersection<UnionObjectFromArrayOfPairs<ARR_T>>>

export function objectKeys<O extends Object>(obj: O) {
  return Object.keys(obj) as Array<keyof O>
}

export function addSetOfTransparenciesToColor<CN extends string, Neutral extends boolean>(color: string, colorName: CN, isNeural: Neutral = false as Neutral) {
  const percentsArray = transparenciesPercents
  return percentsArray.reduce(
    (acc, percent, i) => {
      const keyName = i === 0 ? `${colorName}` : `${colorName}${0}`
      const neutralName = `${colorName}/`
      const name = isNeural ? neutralName : keyName
      acc[`${name}${percent}`] = transparent(color, percent / 100)
      return acc
    },
    {} as Record<Neutral extends false ? `${CN}0` | `${CN}0${Exclude<PercentValue, 0>}` : `${CN}/${PercentValue}`, string>,
  )
}
