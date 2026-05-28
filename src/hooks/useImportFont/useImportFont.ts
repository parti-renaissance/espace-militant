import { useFonts } from 'expo-font'

import FontLibWeb from '../../../assets/fonts/generated-lib-web-fonts'

function useFont() {
  return useFonts(FontLibWeb)
}

export default useFont
