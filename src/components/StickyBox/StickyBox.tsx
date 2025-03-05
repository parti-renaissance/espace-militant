import { ScrollView } from 'tamagui'

type StickyBoxProps = {
  offsetTop?: '$xsmall' | '$small' | '$medium' | '$large' | '$xlarge' | '$xxlarge' | '$xxxlarge'
  offsetBottom?: '$xsmall' | '$small' | '$medium' | '$large' | '$xlarge' | '$xxlarge' | '$xxxlarge'
  children: React.ReactNode
}

export default function StickyBox(props: StickyBoxProps) {
  return <ScrollView>{props.children}</ScrollView>
}
