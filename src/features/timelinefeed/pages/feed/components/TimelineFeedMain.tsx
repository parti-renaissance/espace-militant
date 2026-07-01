import { useMemo } from 'react'

import { TimelineFeedAuthHeader } from './TimelineFeedAuthHeader'
import { TimelineFeedList } from './TimelineFeedList'
import { TimelineFeedPublicHeader } from './TimelineFeedPublicHeader'
import { useShouldShowNotificationCard } from '../hooks/useShouldShowNotificationCard'

import { useSession } from '@/ctx/SessionProvider'
import { useAlerts } from '@/services/alerts/hook'
import type { RestAlertsResponse } from '@/services/alerts/schema'
import { useGetSuspenseExecutiveScopes } from '@/services/profile/hook'
import { useGetPaginatedFeed } from '@/services/timeline-feed/hook'
import { RestTimelineFeedItem } from '@/services/timeline-feed/schema'
import { FEATURES } from '@/utils/Scopes'

type TimelineFeedMainListProps = {
  alerts: RestAlertsResponse
  feedData: RestTimelineFeedItem[]
  fetchNextPage: ReturnType<typeof useGetPaginatedFeed>['fetchNextPage']
  hasNextPage: boolean
  isFetchingNextPage: boolean
  feedQuery: Omit<ReturnType<typeof useGetPaginatedFeed>, 'data' | 'fetchNextPage' | 'hasNextPage' | 'isFetchingNextPage'>
}

function TimelineFeedMainAuthenticated(props: TimelineFeedMainListProps) {
  const shouldShowNotificationCard = useShouldShowNotificationCard()
  const { hasFeature } = useGetSuspenseExecutiveScopes()
  const hasPublications = useMemo(() => hasFeature(FEATURES.PUBLICATIONS), [hasFeature])

  const header = useMemo(
    () => (
      <TimelineFeedAuthHeader
        alerts={props.alerts}
        shouldShowNotificationCard={shouldShowNotificationCard}
        hasPublications={hasPublications}
      />
    ),
    [props.alerts, shouldShowNotificationCard, hasPublications],
  )

  return <TimelineFeedList {...props} header={header} />
}

function TimelineFeedMainPublic(props: TimelineFeedMainListProps) {
  const header = useMemo(() => <TimelineFeedPublicHeader alerts={props.alerts} />, [props.alerts])

  return <TimelineFeedList {...props} header={header} />
}

export function TimelineFeedMain() {
  const { isAuth } = useSession()
  const { data: paginatedFeed, fetchNextPage, hasNextPage, isFetchingNextPage, ...feedQuery } = useGetPaginatedFeed()
  const { data: alerts } = useAlerts()

  const feedData = useMemo(() => {
    const items = paginatedFeed?.pages.flatMap((page) => page?.hits ?? []) ?? []
    const seen = new Set<string>()

    return items.filter((item) => {
      if (seen.has(item.objectID)) return false
      seen.add(item.objectID)
      return true
    })
  }, [paginatedFeed?.pages])

  const listProps: TimelineFeedMainListProps = {
    alerts,
    feedData,
    fetchNextPage,
    hasNextPage: hasNextPage ?? false,
    isFetchingNextPage,
    feedQuery,
  }

  return isAuth ? <TimelineFeedMainAuthenticated {...listProps} /> : <TimelineFeedMainPublic {...listProps} />
}
