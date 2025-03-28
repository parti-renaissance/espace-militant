import { ViewStyle } from 'react-native'
import { ScrollView } from 'tamagui'

type StickyBoxProps = {
  offsetTop?: '$xsmall' | '$small' | '$medium' | '$large' | '$xlarge' | '$xxlarge' | '$xxxlarge'
  offsetBottom?: '$xsmall' | '$small' | '$medium' | '$large' | '$xlarge' | '$xxlarge' | '$xxxlarge'
  children: React.ReactNode
  style?: ViewStyle
  webOnly?: boolean
}

export default function StickyBox(props: StickyBoxProps) {
  return props.webOnly ? props.children : <ScrollView>{props.children}</ScrollView>
}
