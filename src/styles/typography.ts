import { TextStyle } from 'react-native';
import * as Colors from './colors';
import * as Spacing from './spacing';


const largeTitleFontSize = 40
const titleFontSize = 28
const title2FontSize = 22
const title3FontSize = 20
const headlineFontSize = 17
const bodyFontSize = 16
const footnoteFontSize = 13
const calloutFontSize = 16
const subheadFontSize = 15
const caption1FontSize = 12
const caption2FontSize = 11

const robotoRegular = 'PublicSans-Regular'
const robotoMedium = 'PublicSans-Medium'
const maaxMedium = 'PublicSans-Bold'
const maaxMediumItalic = 'PublicSans-BoldItalic'
const maaxBold = 'PublicSans-Bold'

export const footnote: TextStyle = {
  fontSize: footnoteFontSize,
  fontFamily: robotoRegular,
  color: Colors.lightText,
  lineHeight: 18,
}

export const footnoteLight: TextStyle = {
  fontSize: footnoteFontSize,
  fontFamily: robotoRegular,
  color: Colors.lightText,
  lineHeight: 18,
}

export const largeTitle: TextStyle = {
  fontSize: largeTitleFontSize,
  fontFamily: 'SharpGrotesk-SemiBold25',
  color: Colors.darkText,
  lineHeight: 41,
  letterSpacing: 0.56,
}

export const highlightedLargeTitle: TextStyle = {
  ...largeTitle,
  color: Colors.accent,
}

export const largeTitleBold: TextStyle = {
  ...largeTitle,
}

export const title: TextStyle = {
  fontSize: titleFontSize,
  fontFamily: maaxMedium,
  color: Colors.darkText,
}

export const highlightedTitle: TextStyle = {
  fontSize: titleFontSize,
  fontFamily: maaxMedium,
  color: Colors.accent,
}

export const title2: TextStyle = {
  fontSize: title2FontSize,
  fontFamily: maaxMedium,
  color: Colors.darkText,
  lineHeight: 28,
}

export const title3: TextStyle = {
  fontSize: title3FontSize,
  fontFamily: robotoMedium,
  color: Colors.darkText,
  lineHeight: 24,
}

export const headline: TextStyle = {
  fontSize: headlineFontSize,
  fontFamily: maaxMedium,
  color: Colors.darkText,
  lineHeight: 22,
}

export const thinHeadline: TextStyle = {
  fontSize: headlineFontSize,
  fontFamily: robotoRegular,
  color: Colors.darkText,
  lineHeight: 22,
}

export const subheadline: TextStyle = {
  fontSize: subheadFontSize,
  fontFamily: robotoMedium,
  color: Colors.darkText,
  lineHeight: 20,
}

export const body: TextStyle = {
  fontSize: bodyFontSize,
  fontFamily: robotoRegular,
  lineHeight: 22,
  color: Colors.darkText,
}

export const lightBody: TextStyle = {
  ...body,
  color: Colors.lightText,
}

export const callout: TextStyle = {
  fontSize: calloutFontSize,
  fontFamily: robotoMedium,
  color: Colors.darkText,
  lineHeight: 21,
}

export const caption1: TextStyle = {
  fontSize: caption1FontSize,
  fontFamily: robotoRegular,
  lineHeight: 16,
}

export const lightCaption1: TextStyle = {
  fontSize: caption1FontSize,
  fontFamily: robotoRegular,
  color: Colors.lightText,
}

export const lightCaption1OnLightBackground: TextStyle = {
  fontSize: caption1FontSize,
  fontFamily: robotoRegular,
  color: Colors.lightTextOnLightBackground,
}

export const tagCaption: TextStyle = {
  fontSize: caption2FontSize,
  fontFamily: robotoRegular,
  color: Colors.darkText,
  textTransform: 'uppercase',
  lineHeight: 13,
}

export const inputText: TextStyle = {
  fontSize: subheadFontSize,
  fontFamily: robotoRegular,
  color: Colors.darkText,
}

export const spinner = {
  color: Colors.veryLightText,
  fontFamily: robotoMedium,
}

export const errorMessage: TextStyle = {
  color: Colors.inputTextErrorMessage,
  fontFamily: robotoRegular,
  fontSize: caption1FontSize,
  lineHeight: 16,
}

export const tabLabel: TextStyle = {
  fontFamily: robotoRegular,
  fontSize: caption1FontSize,
}

export const homeBannerTitle: TextStyle = {
  fontSize: 45,
  lineHeight: 41,
  fontFamily: maaxMedium,
}

export const homeBannerTitleItalic: TextStyle = {
  ...homeBannerTitle,
  fontFamily: maaxMediumItalic,
}

export const markdownStyle = {
  body: {
    fontFamily: body.fontFamily,
    fontSize: body.fontSize,
    color: Colors.darkText,
  },
  heading1: {
    fontFamily: title.fontFamily,
    fontSize: title.fontSize,
    color: Colors.titleText,
    marginTop: Spacing.margin,
  },
  heading2: {
    fontFamily: title2.fontFamily,
    fontSize: title2.fontSize,
    color: Colors.titleText,
    marginTop: Spacing.margin,
  },
  heading3: {
    fontFamily: title3.fontFamily,
    fontSize: title3.fontSize,
    color: Colors.titleText,
    marginTop: Spacing.margin,
  },
  heading4: {
    fontFamily: headline.fontFamily,
    fontSize: headline.fontSize,
    color: Colors.darkText,
  },
  heading5: {
    fontFamily: headline.fontFamily,
    fontSize: headline.fontSize,
    color: Colors.darkText,
  },
  heading6: {
    fontFamily: headline.fontFamily,
    fontSize: headline.fontSize,
    color: Colors.darkText,
  },
  strong: {
    fontFamily: headline.fontFamily,
    fontSize: headline.fontSize,
    color: Colors.darkText,
  },
}
