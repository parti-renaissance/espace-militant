import { defineColorScale } from './legacyColorAliases'

/** Edit hex values here, then run `npx tsx theme/convertToHsl.ts`. */

export const gray = defineColorScale('gray', {
  gray50: '#FAF7F4',
  gray100: '#F6F0EA',
  gray200: '#E0DBD7',
  gray300: '#BDB7B2',
  gray400: '#A29C97',
  gray500: '#87817D',
  gray600: '#6E6764',
  gray700: '#554F4C',
  gray800: '#3E3835',
  gray900: '#27221F',
  gray950: '#130E0C',
})

export const purple = defineColorScale('purple', {
  purple50: '#F5F6FF',
  purple100: '#EBEDFF',
  purple200: '#D8DCFF',
  purple300: '#B9C2FF',
  purple400: '#8D9AFF',
  purple500: '#6679F5',
  purple600: '#4555D1',
  purple700: '#3340A3',
  purple800: '#26307D',
  purple900: '#1C235A',
  purple950: '#0F1230',
})

export const blue = defineColorScale('blue', {
  blue50: '#EAF4FF',
  blue100: '#D5EAFF',
  blue200: '#AAD4FF',
  blue300: '#70BBFF',
  blue400: '#3DA2FF',
  blue500: '#0094FF',
  blue600: '#0076D6',
  blue700: '#005DA8',
  blue800: '#004580',
  blue900: '#00315C',
  blue950: '#001A33',
})

export const teal = defineColorScale('teal', {
  teal50: '#EFFFFE',
  teal100: '#DDFDFB',
  teal200: '#B3F9F6',
  teal300: '#7CF1ED',
  teal400: '#5DE4E1',
  teal500: '#39CDCA',
  teal600: '#25A7A4',
  teal700: '#1A8381',
  teal800: '#146563',
  teal900: '#0F4A48',
  teal950: '#082928',
})

export const green = defineColorScale('green', {
  green50: '#F2FCF3',
  green100: '#E0F8E3',
  green200: '#BCEFC3',
  green300: '#90E49D',
  green400: '#4BDD80',
  green500: '#29C45D',
  green600: '#34A044',
  green700: '#267D33',
  green800: '#1C6026',
  green900: '#13461B',
  green950: '#0A2D10',
})

export const yellow = defineColorScale('yellow', {
  yellow50: '#FFFFE5',
  yellow100: '#FFFFCC',
  yellow200: '#FFFF99',
  yellow300: '#FFFF68',
  yellow400: '#FFE633',
  yellow500: '#FFCC00',
  yellow600: '#C79700',
  yellow700: '#A87C00',
  yellow800: '#805C00',
  yellow900: '#5A3F00',
  yellow950: '#332400',
})

export const orange = defineColorScale('orange', {
  orange50: '#FFF6F0',
  orange100: '#FFECD9',
  orange200: '#FFD7B0',
  orange300: '#FFBB82',
  orange400: '#FF9B62',
  orange500: '#F57B3A',
  orange600: '#D15B1E',
  orange700: '#A64312',
  orange800: '#7D300B',
  orange900: '#5C2106',
  orange950: '#331203',
})

export const red = defineColorScale('red', {
  red50: '#FDEBEE',
  red100: '#FDD7DB',
  red200: '#F9A4AC',
  red300: '#F37984',
  red400: '#EF4C5A',
  red500: '#E83644',
  red600: '#C72431',
  red700: '#A11722',
  red800: '#750F18',
  red900: '#4F080F',
  red950: '#2B0408',
})

export const pink = defineColorScale('pink', {
  pink50: '#FFF0F7',
  pink100: '#FFDFEE',
  pink200: '#FFBEE0',
  pink300: '#FFA0D2',
  pink400: '#FF7CC0',
  pink500: '#EC5DA0',
  pink600: '#C73D80',
  pink700: '#9E2861',
  pink800: '#781B47',
  pink900: '#521230',
  pink950: '#330A1E',
})

export const white = {
  white0: '#FFFFFF',
  white1: '#FFFFFF',
  white2: '#FDFCFB',
  white3: '#FBF9F7',
  white4: '#FAF8F5',
  white5: '#F8F6F3',
  white6: '#F7F5F1',
  white7: '#F6F3EF',
  white8: '#F5F1ED',
  white9: '#FAF7F4',
}

export const black = {
  black0: '#130E0C',
  black1: '#120E0D',
  black2: '#100C0B',
  black3: '#0F0B0A',
  black4: '#0E0A09',
  black5: '#0D0908',
  black6: '#0C0807',
  black7: '#0B0706',
  black8: '#0A0605',
  black9: '#050404',
}
