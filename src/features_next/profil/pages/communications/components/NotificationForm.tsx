import React, { useEffect, useRef } from 'react'
import { WebView } from 'react-native-webview'
import SwitchGroup from '@/components/base/SwitchGroup/SwitchGroup'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import { MessageCard } from '@/components/MessageCard/MessageCard'
import VoxCard from '@/components/VoxCard/VoxCard'
import { useGetNotificationList, useGetReSubscribeConfig, useUnsubscribe } from '@/services/notifications/hook'
import { useGetResubscribeLoop, useGetSuspenseProfil, useMutationUpdateProfil } from '@/services/profile/hook'
import { RestDetailedProfileResponse } from '@/services/profile/schema'
import { AlertTriangle, Info } from '@tamagui/lucide-icons'
import { router, useLocalSearchParams } from 'expo-router'
import { Controller, useForm } from 'react-hook-form'
import { isWeb, Separator, XStack, YStack } from 'tamagui'

const UnSubscribeCase = () => {
  const [execWebView, setExecWebView] = React.useState(false)
  const [enableLoop, setEnableLoop] = React.useState(false)
  const [isStartResub, setIsStartResub] = React.useState(false)
  const { autorun } = useLocalSearchParams<{ autorun?: '1' | '0' }>()
  const [hasAutorun, setHasAutoRun] = React.useState(false)

  const retry = useGetResubscribeLoop({
    enabled: enableLoop,
  })

  useEffect(() => setEnableLoop(false), [])
  const { data: config } = useGetReSubscribeConfig()

  const getUrl = () => {
    const params = new URLSearchParams({ callback: 'c', ...JSON.parse(atob(config.payload)) })
    const url = new URL(config.url + '/subscribe/post-json')
    url.search = params.toString()
    return url.toString()
  }

  const handlePress = () => {
    if (isWeb) {
      interface JsonpOptions {
        callbackName?: string
        onSuccess?: (data: any) => void
        onTimeout?: () => void
        timeout?: number // seconds
      }

      const jsonp = (() => {
        const that = {} as {
          send: (src: string, options?: JsonpOptions) => void
        }

        that.send = function (src: string, options: JsonpOptions = {}) {
          const callbackName = options.callbackName || 'callback'
          const onSuccess = options.onSuccess || (() => {})
          const onTimeout = options.onTimeout || (() => {})
          const timeout = options.timeout || 10 // seconds

          const timeoutTrigger: NodeJS.Timeout = setTimeout(() => {
            ;(window as any)[callbackName] = () => {}
            onTimeout()
          }, timeout * 1000)
          ;(window as any)[callbackName] = function (data: any) {
            clearTimeout(timeoutTrigger)
            onSuccess(data)
          }

          const script = document.createElement('script')
          script.type = 'text/javascript'
          script.async = true
          script.src = src
          ;(document.getElementsByTagName('head')[0] as HTMLHeadElement).appendChild(script)
        }

        return that
      })()

      setIsStartResub(true)

      jsonp.send(getUrl(), {
        onSuccess: function () {
          setEnableLoop(true)
          setIsStartResub(false)
        },
        onTimeout: function () {
          setEnableLoop(true)
          setIsStartResub(false)
        },
        timeout: 5,
      })
    } else {
      setExecWebView(true)
    }
  }

  useEffect(() => {
    if (autorun === '1' && !hasAutorun) {
      handlePress()
      setHasAutoRun(true)
    }
  }, [autorun, hasAutorun])

  return (
    <YStack gap="$medium">
      {execWebView && (
        <WebView
          source={{
            html: `<html><head>    <script>
                setTimeout(function () {
                var $jsonp = (function(){
                  var that = {};

                  that.send = function(src, options) {
                    var callback_name = options.callbackName || 'callback',
                      on_success = options.onSuccess || function(){},
                      on_timeout = options.onTimeout || function(){},
                      timeout = options.timeout || 10; // sec

                    var timeout_trigger = window.setTimeout(function(){
                      window[callback_name] = function(){};
                      on_timeout();
                    }, timeout * 1000);

                    window[callback_name] = function(data){
                      window.clearTimeout(timeout_trigger);
                      on_success(data);
                    }

                    var script = document.createElement('script');
                    script.type = 'text/javascript';
                    script.async = true;
                    script.src = src;

                    document.getElementsByTagName('head')[0].appendChild(script);
                  }

                  return that;
                })();
                $jsonp.send('${getUrl()}', {
                  onSuccess: function (json) {
                   window.ReactNativeWebView.postMessage(json);
                  },
                  onTimeout: function () {
                    window.ReactNativeWebView.postMessage('timeput');
                  },
                  timeout: 5,
                })
                }, 2000)
              </script></head></html>`,
          }}
          javaScriptEnabled={true}
          onMessage={() => {
            setEnableLoop(true)
            setIsStartResub(true)
            setExecWebView(false)
          }}
        />
      )}
      {!enableLoop && (
        <MessageCard
          iconLeft={AlertTriangle}
          theme="orange"
          rightComponent={
            <YStack>
              <VoxButton loading={execWebView || isStartResub} theme="orange" onPress={handlePress}>
                Me réabonner
              </VoxButton>
            </YStack>
          }
        >
          Vous êtes désabonné de toutes nos communications
        </MessageCard>
      )}

      {retry.isError && (
        <MessageCard iconLeft={AlertTriangle} theme="orange">
          Une erreur est survenue lors de votre réabonnement.
          {'\n'}
          Nos équipes sont mobilisées pour résoudre le problème.
        </MessageCard>
      )}

      {enableLoop && !retry.isError && (
        <MessageCard iconLeft={Info} theme="blue">
          Votre réabonnement est en cours de traitement.
        </MessageCard>
      )}
    </YStack>
  )
}

const NotificationForm = (props: { cardProps?: React.ComponentProps<typeof VoxCard>; profile: RestDetailedProfileResponse }) => {
  const { autorun } = useLocalSearchParams<{ autorun?: '1' | '0' }>()
  const { data: userData } = useGetSuspenseProfil()
  const shouldAutoCheck = autorun === '1' && userData && userData.email_subscribed
  const subscription_types = props.profile.subscription_types
  const isAutoRunHasBeenExecuted = useRef(false)
  const unsubscribe = useUnsubscribe()

  const { data: _notificationList } = useGetNotificationList()
  const user_subscription_values = shouldAutoCheck ? _notificationList.map((n) => n.code) : subscription_types.map((st) => st.code)

  const notificationList = _notificationList.map((n) => ({ type: n.type, label: n.label, value: n.code }))
  const emailList = notificationList.filter((n) => n.type === 'email')
  const smsList = notificationList.filter((n) => n.type === 'sms')
  const { control, handleSubmit, formState, reset } = useForm({
    values: {
      subscription_email: user_subscription_values.filter((x) => emailList.find((y) => y.value === x)),
      subscription_sms: user_subscription_values.filter((x) => smsList.find((y) => y.value === x)),
    },
    mode: 'all',
  })
  const { isDirty, isValid } = formState

  const { mutateAsync, isPending } = useMutationUpdateProfil({ userUuid: props.profile.uuid })

  const onSubmit = handleSubmit((data) => {
    return mutateAsync({ subscription_types: Object.values(data).flat() })
  })

  useEffect(() => {
    if (shouldAutoCheck && !isAutoRunHasBeenExecuted.current) {
      isAutoRunHasBeenExecuted.current = true
      onSubmit().then(() => {
        router.setParams({ autorun: '0' })
      })
    }
  }, [shouldAutoCheck, onSubmit])

  const SmsSection = () => {
    return props.profile.phone ? (
      <>
        <YStack gap="$small">
          <Text.MD multiline secondary semibold>
            Par SMS
          </Text.MD>
          <Text.P>Nous n’envoyons des SMS que très rarement, pour les occasions les plus importantes.</Text.P>
        </YStack>
        <Controller
          name="subscription_sms"
          control={control}
          render={({ field }) => {
            return <SwitchGroup options={smsList} onChange={field.onChange} value={field.value} />
          }}
        />
      </>
    ) : (
      <>
        <Text.MD multiline secondary semibold>
          Par SMS
        </Text.MD>
        <MessageCard iconLeft={Info} theme="yellow">
          Ajoutez un numéro de téléphone pour ne pas manquer les informations les plus importantes.
        </MessageCard>
      </>
    )
  }

  return (
    <>
      <VoxCard {...props.cardProps}>
        <VoxCard.Content>
          <Text.LG>Préférences de communication</Text.LG>
          {userData && !userData.email_subscribed ? (
            <UnSubscribeCase />
          ) : (
            <>
              <SmsSection />
              <Separator backgroundColor="$textOutlined" />
              <YStack gap="$small">
                <Text.MD multiline secondary semibold>
                  Par Email
                </Text.MD>
                <Text.P>En cochant ces cases j’accepte de recevoir les emails : </Text.P>
              </YStack>
              <Controller
                name="subscription_email"
                control={control}
                render={({ field }) => {
                  return <SwitchGroup options={emailList} onChange={field.onChange} value={field.value} />
                }}
              />
              <XStack justifyContent="flex-end" gap="$small">
                <VoxButton variant="outlined" display={isDirty ? 'flex' : 'none'} onPress={() => reset()}>
                  Annuler
                </VoxButton>
                <VoxButton variant="outlined" theme="blue" loading={isPending} onPress={onSubmit} disabled={!isDirty || !isValid}>
                  Enregistrer
                </VoxButton>
              </XStack>
            </>
          )}
        </VoxCard.Content>
      </VoxCard>
      {!!userData?.email_subscribed && (
        <VoxButton variant="text" onPress={() => unsubscribe.mutateAsync()} loading={unsubscribe.isPending}>
          Me désabonner de toutes les communications
        </VoxButton>
      )}
    </>
  )
}

export default NotificationForm
