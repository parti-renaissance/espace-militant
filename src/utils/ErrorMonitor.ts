import clientEnv from '@/config/clientEnv'
import * as Sentry from '@sentry/react-native'
import { isRunningInExpoGo } from 'expo'

export const ErrorMonitor = {
  configure: () => {
    const navigationIntegration = Sentry.reactNavigationIntegration({
      enableTimeToInitialDisplay: !isRunningInExpoGo(),
    })

    Sentry.init({
      dsn: clientEnv.SENTRY_DSN,
      environment: clientEnv.ENVIRONMENT,
      enabled: !__DEV__,
      //debug: ENVIRONMENT !== 'production', // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
      integrations: [navigationIntegration],
      enableNativeFramesTracking: !isRunningInExpoGo(),
    })
    return { navigationIntegration }
  },
  log: (message: string, payload?: Record<string, unknown>, sendToSentryIfProduction = true) => {
    if (__DEV__) {
      console.log('[ErrorMonitor]', message, payload)
    } else if (sendToSentryIfProduction) {
      Sentry.captureMessage(message, { extra: payload })
    }
  },
  wrap: (RootComponent: React.ComponentType<Record<string, unknown>>) => {
    return Sentry.wrap(RootComponent)
  },
}
