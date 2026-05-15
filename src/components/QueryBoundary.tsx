import { Suspense, type ReactNode } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

type QueryBoundaryProps = {
  children: ReactNode
  fallback?: ReactNode
}

export function QueryBoundary({ children, fallback = null }: QueryBoundaryProps) {
  return (
    <ErrorBoundary fallbackRender={() => null}>
      <Suspense fallback={fallback}>{children}</Suspense>
    </ErrorBoundary>
  )
}
