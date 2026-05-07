import { useCallback, useMemo, useRef, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Spinner, useMedia, YStack } from 'tamagui'
import { OnPressEvent } from '@rnmapbox/maps/src/types/OnPressEvent'

import { SideBarArea } from '@/components/AppStructure'
import { TABBAR_HEIGHT_SM } from '@/components/AppStructure/hooks/useLayoutSpacing'

import { useSuspensePaginatedEvents } from '@/services/events/hook'

import { isEventPast } from '../../utils'

import { EventMapHandle, EventMapItem } from '../map/EventMap'
import { EventsHubDesktop } from './EventsHubDesktop'
import { EventsHubMobile } from './EventsHubMobile'
import { HubMapBlock } from './HubMapBlock'

const DEFAULT_CENTER: [number, number] = [2.45, 46.55]
const isFiniteCoordinate = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value)

const EventsHubPage = () => {
  const router = useRouter()
  const eventMapRef = useRef<EventMapHandle>(null)
  const [isLocating, setIsLocating] = useState(false)
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

  const cameraZoomLevel = useMemo(() => {
    if (media.xs) return 4.3
    if (media.sm) return 4.6
    return 5.5
  }, [media.sm, media.xs])

  const tabBarSafeBottom = useMemo(() => (!media.gtSm ? insets.bottom + TABBAR_HEIGHT_SM : 0), [media.gtSm, insets.bottom])

  const { data, isLoading, isFetching } = useSuspensePaginatedEvents({
    filters: {},
  })

  const mapEvents = useMemo<EventMapItem[]>(() => {
    const items = data?.pages.flatMap((page) => page.items) ?? []
    return items
      .filter((event) => isFiniteCoordinate(event.post_address?.latitude) && isFiniteCoordinate(event.post_address?.longitude))
      .slice(0, 20)
      .map((event) => ({
        uuid: event.uuid,
        name: event.name,
        slug: event.slug,
        latitude: event.post_address!.latitude!,
        longitude: event.post_address!.longitude!,
        visibility: event.visibility,
        isPast: isEventPast(event),
      }))
  }, [data?.pages])

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

  const showLoadingSpinner = isLoading || isFetching

  const mapBlockCommonProps = {
    eventMapRef,
    mapEvents,
    onEventPress: handleEventPress,
    onRecenterPress: handleRecenterPress,
    centerCoordinate: DEFAULT_CENTER,
    zoomLevel: cameraZoomLevel,
    padding: cameraPadding,
    isLocating,
    onCenterOnUserLocationStateChange: setIsLocating,
    showLoadingSpinner,
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
