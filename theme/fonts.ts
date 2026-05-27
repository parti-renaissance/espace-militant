import { createFont } from 'tamagui'

export const PLAAK_44_BOLD = 'Plaak-44-Bold'

export const Maax = createFont({
  family: 'Maax',
  weight: {
    1: 400,
    2: 500,
    3: 700,
  },
  size: {
    1: 12,
    2: 14,
    3: 16,
    4: 18,
    5: 20,
    6: 24,
    7: 32,
    8: 48,
    true: 14,
  },
  lineHeight: {
    1: 16,
    2: 20,
    3: 24,
    4: 28,
    5: 32,
    6: 40,
    7: 48,
    8: 64,
  },
  face: {
    400: { normal: 'Maax-Medium', italic: 'Maax-MediumItalic' },
    700: { normal: 'Maax-Bold', italic: 'Maax-BoldItalic' },
  },
})

export const Plaak = createFont({
  family: PLAAK_44_BOLD,
  weight: {
    1: 400,
    true: 400,
  },
  size: {
    1: 32,
    true: 32,
  },
  lineHeight: {
    1: 23,
    true: 23,
  },
  face: {
    400: { normal: PLAAK_44_BOLD },
  },
})

export const PublicSans = createFont({
  family: 'Public Sans',
  defaultWeight: 400,
  weight: {
    1: '100',
    2: '200',
    3: '300',
    4: '400',
    5: '500',
    6: '600',
    7: '700',
    8: '800',
    9: '900',
  },
  size: {
    1: 12,
    2: 14,
    3: 16,
    4: 18,
    5: 20,
    6: 24,
    7: 32,
    8: 48,
  },
  lineHeight: {
    1: 16,
    2: 20,
    3: 24,
    4: 28,
    5: 32,
    6: 40,
    7: 48,
    8: 64,
  },
  face: {
    100: { normal: 'PublicSans-Thin', italic: 'PublicSans-ThinItalic' },
    200: { normal: 'PublicSans-ExtraLight', italic: 'PublicSans-ExtraLightItalic' },
    300: { normal: 'PublicSans-Light', italic: 'PublicSans-LightItalic' },
    400: { normal: 'PublicSans-Regular', italic: 'PublicSans-Italic' },
    500: { normal: 'PublicSans-Medium', italic: 'PublicSans-MediumItalic' },
    600: { normal: 'PublicSans-SemiBold', italic: 'PublicSans-SemiBoldItalic' },
    700: { normal: 'PublicSans-Bold', italic: 'PublicSans-BoldItalic' },
    800: {
      normal: 'PublicSans-ExtraBold',
      italic: 'PublicSans-ExtraBoldItalic',
    },
    900: { normal: 'PublicSans-Black', italic: 'PublicSans-BlackItalic' },
  },
})
