import * as React from 'react'
import { Path, Svg } from 'react-native-svg'
import { View, XStack, YStackProps } from 'tamagui'

function CadreIllustration({ showText = true, showIcon = true, ...props }: YStackProps & { showText?: boolean; showIcon?: boolean }) {
  return (
    <XStack {...props} gap="$small" alignItems="center">
      {showIcon ? (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M13.344 1.21c.35.152.56.517.512.897l-.879 7.03H21a.863.863 0 01.663 1.415l-10 12a.862.862 0 01-1.519-.659l.88-7.03H3a.863.863 0 01-.662-1.415l10-12a.862.862 0 011.006-.239z"
            fill="#000"
          />
        </Svg>
      ) : null}
      <View display={showText ? 'flex' : 'none'}>
        <Svg width={73} height={15} viewBox="0 0 73 15" fill="none">
          <Path
            d="M7.32 14.46C3.12 14.46 0 11.54 0 7.26C0 2.9 3.12 0 7.24 0C9.72 0 11.52 1.04 12.7 2.64L11.16 4.24C10.34 3.06 9.1 2.18 7.28 2.18C4.52 2.18 2.44 4.32 2.44 7.26C2.44 10.14 4.52 12.28 7.36 12.28C9.16 12.28 10.44 11.46 11.4 10.18L12.9 11.82C11.66 13.38 9.96 14.46 7.32 14.46Z"
            fill="#000"
          />
          <Path
            d="M15.0244 14.24L20.5044 0.239999H22.9044L28.3644 14.24H25.8644L24.6844 11.26H18.7044L17.5444 14.24H15.0244ZM19.5644 9.06H23.8244L21.6844 3.48L19.5644 9.06Z"
            fill="#000"
          />
          <Path
            d="M31.9269 14.24V0.239999H36.3069C40.0869 0.239999 43.8869 1.84 43.8869 7.14C43.8869 12.46 40.0869 14.24 36.3069 14.24H31.9269ZM34.3069 12.08H35.8669C38.8469 12.08 41.4469 11.1 41.4469 7.14C41.4469 3.32 38.8469 2.4 35.8469 2.4H34.3069V12.08Z"
            fill="#000"
          />
          <Path
            d="M47.9995 14.24V0.239999H53.3395C56.5995 0.239999 58.6795 1.88 58.6795 4.8C58.6795 6.88 57.6195 8.38 55.8195 9.06L59.0395 14.24H56.2195L53.2795 9.46H50.3795V14.24H47.9995ZM50.3795 7.28H53.0395C55.0395 7.28 56.2995 6.62 56.2995 4.82C56.2995 3.12 55.0595 2.4 53.0395 2.4H50.3795V7.28Z"
            fill="#000"
          />
          <Path
            d="M62.998 14.24V0.239999H72.858V2.4H65.378V6H72.518V8.18H65.378V12.08H72.858V14.24H62.998Z"
            fill="#000"
          />
        </Svg>
      </View>
    </XStack>
  )
}

export default React.memo(CadreIllustration)
