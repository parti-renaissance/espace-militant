import { WebView } from 'react-native-webview'

export default function VimeoPlayer(props: { url: string; height: number }) {
  return (
    <WebView
      style={{
        height: 500,
        flex: 1,
        backgroundColor: 'black',
      }}
      source={{ uri: props.url }}
    />
  )
}
