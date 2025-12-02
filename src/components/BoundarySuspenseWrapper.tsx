import { Suspense } from 'react'
import { VoxButton } from '@/components/Button'
import { NotFoundError } from '@/core/errors'
import { QueryErrorResetBoundary } from '@tanstack/react-query'
import { ErrorBoundary, FallbackProps } from 'react-error-boundary'
import { Image, Spinner, useMedia, View, YStack } from 'tamagui'
import Error404 from './404/Error404'
import Text from './base/Text'

type BoundarySuspenseWrapperProps = {
  children: React.ReactNode
  errorMessage?: string
  loadingMessage?: string
  fallback?: React.ReactNode
  errorChildren?: (err: FallbackProps) => React.ReactNode
}

export const DefaultErrorFallback = ({ resetErrorBoundary, error }: FallbackProps) => {
  if (error instanceof NotFoundError) {
    return <Error404 />
  }
  return (
    <>
      <Image source={require('../assets/images/blocs.png')} height={200} width={200} objectFit={'contain'} />
      <Text color="$gray6" textAlign="center">
        Une erreur est survenue. Veuillez recharger la page.
      </Text>
      <View>
        <VoxButton variant="text" onPress={resetErrorBoundary}>
          Réessayer
        </VoxButton>
      </View>
    </>
  )
}

const BoundarySuspenseWrapper = (props: BoundarySuspenseWrapperProps) => {
  const media = useMedia()
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={(EBprops) =>
            props.errorChildren ? (
              props.errorChildren(EBprops)
            ) : (
              <YStack justifyContent={media.sm ? 'center' : undefined} pt={media.gtSm ? 80 : undefined} flex={1} {...props}>
                <YStack p="$medium" paddingTop="$medium" alignItems="center" gap="$medium">
                  <DefaultErrorFallback {...EBprops} />
                </YStack>
              </YStack>
            )
          }
        >
          <Suspense
            fallback={
              props.fallback ?? (
                <YStack justifyContent="center" alignItems="center" flex={1} width="100%">
                  <Spinner size="large" color="$blue6" />
                </YStack>
              )
            }
          >
            {props.children}
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  )
}

export default BoundarySuspenseWrapper
