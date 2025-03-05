import StickyBox from 'react-sticky-box'
import { getTokenValue } from 'tamagui'

type StickyBoxProps = {
  offsetTop?: '$xsmall' | '$small' | '$medium' | '$large' | '$xlarge' | '$xxlarge'
  offsetBottom?: '$xsmall' | '$small' | '$medium' | '$large' | '$xlarge' | '$xxlarge'
  children: React.ReactNode
}

export default function WebStickyBox(props: StickyBoxProps) {
  const top = props.offsetTop ? getTokenValue(props.offsetTop, 'space') : 0
  const bottom = props.offsetBottom ? getTokenValue(props.offsetBottom, 'space') : 0
  return (
    <StickyBox offsetTop={top} offsetBottom={bottom}>
      {props.children}
    </StickyBox>
  )
}
