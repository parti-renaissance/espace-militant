import { useCallback, useEffect, useRef, useState } from 'react'
import { StyleSheet } from 'react-native'
import { WebView } from 'react-native-webview'
import { YStack } from 'tamagui'

import Text from '@/components/base/Text'

import {
  FRIENDLY_CAPTCHA_API_ENDPOINT,
  FRIENDLY_CAPTCHA_SDK_VERSION,
  FRIENDLY_CAPTCHA_SITE_KEY,
} from '@/services/signup/constants'

type FriendlyCaptchaWidgetProps = {
  onToken: (token: string) => void
  onError?: () => void
  error?: string | null
}

function buildCaptchaHtml(siteKey: string) {
  const sdkCdn = `https://cdn.jsdelivr.net/npm/@friendlycaptcha/sdk@${FRIENDLY_CAPTCHA_SDK_VERSION}/+esm`
  return `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    body { margin: 0; padding: 8px; font-family: system-ui, sans-serif; background: transparent; }
    #mount { min-height: 80px; width: 100%; }
  </style>
</head>
<body>
  <div id="mount"></div>
  <script type="module">
    try {
      const { FriendlyCaptchaSDK } = await import(${JSON.stringify(sdkCdn)});
      const sdk = new FriendlyCaptchaSDK({ apiEndpoint: ${JSON.stringify(FRIENDLY_CAPTCHA_API_ENDPOINT)} });
      const mount = document.getElementById('mount');
      const widget = sdk.createWidget({
        element: mount,
        sitekey: ${JSON.stringify(siteKey)},
        apiEndpoint: ${JSON.stringify(FRIENDLY_CAPTCHA_API_ENDPOINT)},
        startMode: 'auto',
      });
      widget.addEventListener('frc:widget.complete', (e) => {
        const response = e.detail?.response;
        if (response && window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'token', token: response }));
        }
      });
      widget.addEventListener('frc:widget.error', (e) => {
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'error',
            message: e.detail?.error?.code || 'widget_error',
          }));
        }
      });
    } catch (err) {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'error',
          message: err?.message || 'sdk_load_failed',
        }));
      }
    }
  </script>
</body>
</html>`
}

export default function FriendlyCaptchaWidget({ onToken, onError, error }: FriendlyCaptchaWidgetProps) {
  const siteKey = FRIENDLY_CAPTCHA_SITE_KEY
  const tokenSentRef = useRef(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  const emitToken = useCallback(
    (token: string) => {
      if (tokenSentRef.current) return
      tokenSentRef.current = true
      onToken(token)
    },
    [onToken],
  )

  useEffect(() => {
    tokenSentRef.current = false
    setLoadError(null)
  }, [siteKey])

  const handleMessage = useCallback(
    (event: { nativeEvent: { data: string } }) => {
      try {
        const data = JSON.parse(event.nativeEvent.data) as { type?: string; token?: string; message?: string }
        if (data.type === 'token' && data.token) {
          emitToken(data.token)
        }
        if (data.type === 'error') {
          setLoadError(data.message ?? 'widget_error')
          onError?.()
        }
      } catch {
        // ignore malformed messages
      }
    },
    [emitToken, onError],
  )

  if (!siteKey) {
    return (
      <YStack gap="$xsmall">
        <Text.SM secondary color="$orange10">Configuration captcha manquante (EXPO_PUBLIC_FRIENDLY_CAPTCHA_SITE_KEY).</Text.SM>
        {error ? <Text.SM color="$orange10">{error}</Text.SM> : null}
      </YStack>
    )
  }

  if (loadError) {
    return (
      <YStack gap="$xsmall">
        <Text.SM secondary color="$orange10">
          Impossible de charger la vérification anti-robot. Réessayez plus tard.
        </Text.SM>
        {error ? <Text.SM color="$orange10">{error}</Text.SM> : null}
      </YStack>
    )
  }

  return (
    <YStack gap="$xsmall">
      <WebView
        source={{ html: buildCaptchaHtml(siteKey) }}
        style={styles.webview}
        onMessage={handleMessage}
        scrollEnabled={false}
        originWhitelist={['*']}
        javaScriptEnabled
        domStorageEnabled
        mixedContentMode="always"
      />
      {error ? <Text.SM color="$orange10">{error}</Text.SM> : null}
    </YStack>
  )
}

const styles = StyleSheet.create({
  webview: {
    height: 100,
    backgroundColor: 'transparent',
  },
})
