import { useEffect, useRef } from 'react'
import { YStack } from 'tamagui'
import { FriendlyCaptchaSDK } from '@friendlycaptcha/sdk'

import Text from '@/components/base/Text'

import { FRIENDLY_CAPTCHA_API_ENDPOINT, FRIENDLY_CAPTCHA_SITE_KEY } from '@/services/signup/constants'

type FriendlyCaptchaWidgetProps = {
  onToken: (token: string) => void
  onError?: () => void
  error?: string | null
}

let sdkInstance: FriendlyCaptchaSDK | null = null

function getSdk() {
  if (!sdkInstance) {
    sdkInstance = new FriendlyCaptchaSDK({ apiEndpoint: FRIENDLY_CAPTCHA_API_ENDPOINT })
  }
  return sdkInstance
}

export default function FriendlyCaptchaWidget({ onToken, onError, error }: FriendlyCaptchaWidgetProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const siteKey = FRIENDLY_CAPTCHA_SITE_KEY

  useEffect(() => {
    const mount = mountRef.current
    if (!mount || !siteKey) return

    const sdk = getSdk()
    const widget = sdk.createWidget({
      element: mount,
      sitekey: siteKey,
      apiEndpoint: FRIENDLY_CAPTCHA_API_ENDPOINT,
      startMode: 'auto',
    })

    const onComplete = (event: Event) => {
      const detail = (event as CustomEvent<{ response?: string }>).detail
      const response = detail?.response ?? widget.getResponse()
      if (response && !response.startsWith('.')) {
        onToken(response)
      }
    }

    const onWidgetError = () => {
      onError?.()
    }

    widget.addEventListener('frc:widget.complete', onComplete)
    widget.addEventListener('frc:widget.error', onWidgetError)

    return () => {
      widget.removeEventListener('frc:widget.complete', onComplete)
      widget.removeEventListener('frc:widget.error', onWidgetError)
      widget.destroy()
      mount.replaceChildren()
    }
  }, [onError, onToken, siteKey])

  if (!siteKey) {
    return (
      <Text.SM secondary color="$orange10">
        Configuration captcha manquante.
      </Text.SM>
    )
  }

  return (
    <YStack gap="$xsmall">
      <div ref={mountRef} style={{ minHeight: 72 }} />
      {error ? <Text.SM color="$orange10">{error}</Text.SM> : null}
    </YStack>
  )
}
