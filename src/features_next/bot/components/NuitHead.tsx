import { Image } from 'expo-image'
import { View } from 'tamagui'

import nuitHeadSource from '../../../assets/images/nuit-ia-head.gif'

const NUIT_HEAD_ASPECT_RATIO = 898 / 1031

type Props = {
  width?: number
}

export function NuitHead({ width = 64 }: Props) {
  return (
    <View width={width} aspectRatio={NUIT_HEAD_ASPECT_RATIO}>
      <Image source={nuitHeadSource} style={{ width: '100%', height: '100%' }} contentFit="contain" />
    </View>
  )
}

export default NuitHead
