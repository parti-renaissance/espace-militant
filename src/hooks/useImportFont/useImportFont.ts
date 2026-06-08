import { useFonts } from 'expo-font'

import FontLibWeb from '../../../assets/fonts/generated-lib-web-fonts'

function useFont(): [boolean] {
  const [isLoaded, error] = useFonts(FontLibWeb)

  if (error) {
    return [true]
  }

  return [isLoaded]
}

export default useFont
