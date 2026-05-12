import { useCallback, useMemo, useRef, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Spinner, useMedia, YStack } from 'tamagui'
import { OnPressEvent } from '@rnmapbox/maps/src/types/OnPressEvent'

import { SideBarArea } from '@/components/AppStructure'
import { TABBAR_HEIGHT_SM } from '@/components/AppStructure/hooks/useLayoutSpacing'

import { useEventsMapQuery, useMapEventsFormatter } from '@/services/events/hook'

import { EventMapHandle } from '../map/EventMap'
import { EventsHubDesktop } from './EventsHubDesktop'
import { EventsHubMobile } from './EventsHubMobile'
import { HubMapBlock } from './HubMapBlock'

const EventsHubPage = () => {
  const router = useRouter()
  const eventMapRef = useRef<EventMapHandle>(null)
  const [isLocating, setIsLocating] = useState(false)
  const [sortAround, setSortAround] = useState<{ lat: number; lng: number } | null>(null)
  const media = useMedia()
  const insets = useSafeAreaInsets()
  const cameraPadding = useMemo(
    () =>
      media.gtSm
        ? {
            paddingTop: 0,
            paddingRight: 0,
            paddingBottom: 0,
            paddingLeft: media.sm ? 0 : 230,
          }
        : { paddingTop: 0, paddingRight: 0, paddingBottom: 0, paddingLeft: 0 },
    [media.gtSm, media.sm],
  )

  const tabBarSafeBottom = useMemo(() => (!media.gtSm ? insets.bottom + TABBAR_HEIGHT_SM : 0), [media.gtSm, insets.bottom])

  const { data, isLoading, isFetching } = useEventsMapQuery({ sortAround })

  const mapEvents = useMapEventsFormatter(data?.items)

  const handleEventPress = useCallback(
    (event: OnPressEvent) => {
      const firstFeature = event.features?.[0]
      const slug = firstFeature?.properties?.slug
      if (typeof slug === 'string' && slug.length > 0) {
        router.push(`/evenements/${slug}`)
      }
    },
    [router],
  )

  const handleRecenterPress = useCallback(() => {
    void eventMapRef.current?.centerOnMyPosition()
  }, [])

  const mapBlockCommonProps = {
    eventMapRef,
    mapEvents,
    onEventPress: handleEventPress,
    onRecenterPress: handleRecenterPress,
    padding: cameraPadding,
    isLocating,
    onCenterOnUserLocationStateChange: setIsLocating,
    onUserLocationResolved: setSortAround,
    showLoadingSpinner: isLoading,
    showFetchingIndicator: isFetching && !isLoading,
    topInset: insets.top,
  }

  const feedSuspenseFallback = (
    <YStack flex={1} p="$medium" alignItems="center" justifyContent="center">
      <Spinner size="large" />
    </YStack>
  )

  if (!media.gtSm) {
    return (
      <EventsHubMobile
        embeddedMapHeader={<HubMapBlock {...mapBlockCommonProps} variant="embedded" />}
        tabBarSafeBottom={tabBarSafeBottom}
        feedSuspenseFallback={feedSuspenseFallback}
      />
    )
  }

  return (
    <EventsHubDesktop
      mapLayer={
        <HubMapBlock {...mapBlockCommonProps} variant="fullscreen" promoLeadingAccessory={<SideBarArea state="militant" />} />
      }
      feedSuspenseFallback={feedSuspenseFallback}
    />
  )
}

export default EventsHubPage
