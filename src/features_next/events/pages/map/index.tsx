import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { isWeb, Spinner, useMedia, XStack, YStack } from 'tamagui'
import { ArrowLeft, Crosshair } from '@tamagui/lucide-icons'
import { OnPressEvent } from '@rnmapbox/maps/src/types/OnPressEvent'

import Layout from '@/components/AppStructure/Layout/Layout'
import { SideBarArea } from '@/components/AppStructure/Navigation/SideBar'
import { VoxButton } from '@/components/Button'

import { useEventsMapQuery, useMapEventsFormatter } from '@/services/events/hook'

import { MapListToggle } from '../../components/feed-layout/MapListToggle'
import EventMap, { EventMapHandle, FRANCE_METRO_CAMERA_BOUNDS, roundCoordinateForMapSortAround } from './components/EventMap'
import { useUserLocation } from './hooks/useUserLocation'

const EventsMapPage = () => {
  const router = useRouter()
  const eventMapRef = useRef<EventMapHandle>(null)
  const hasAutoFlownToUserRef = useRef(false)
  const { coords, isLocating, requestLocation } = useUserLocation()

  const sortAround = useMemo(
    () =>
      coords
        ? {
            lat: roundCoordinateForMapSortAround(coords[1]),
            lng: roundCoordinateForMapSortAround(coords[0]),
          }
        : null,
    [coords],
  )

  const media = useMedia()
  const insets = useSafeAreaInsets()
  const cameraPadding = useMemo(
    () => ({
      paddingTop: 0,
      paddingRight: 0,
      paddingBottom: 0,
      paddingLeft: media.sm ? 0 : 230,
    }),
    [media.sm],
  )

  const { data, isLoading, isFetching } = useEventsMapQuery({ sortAround })

  const mapEvents = useMapEventsFormatter(data?.items)

  useEffect(() => {
    if (hasAutoFlownToUserRef.current || coords == null || isLoading || isFetching) {
      return
    }
    hasAutoFlownToUserRef.current = true
    eventMapRef.current?.flyToUserWithEventsZoom(coords)
  }, [coords, isLoading, isFetching])

  const handleRecenterPress = useCallback(() => {
    void (async () => {
      const next = await requestLocation()
      if (next) {
        eventMapRef.current?.flyToUserWithEventsZoom(next)
      }
    })()
  }, [requestLocation])

  const handleEventPress = (event: OnPressEvent) => {
    const firstFeature = event.features?.[0]
    const slug = firstFeature?.properties?.slug
    if (typeof slug === 'string' && slug.length > 0) {
      router.push(`/evenements/${slug}`)
    }
  }

  const handleBack = () => {
    if (isWeb) {
      router.push('/evenements/hub')
    } else if (router.canGoBack()) {
      router.back()
    } else {
      router.replace('/evenements/hub')
    }
  }

  return (
    <Layout.Main width="100%" maxWidth="100%" height="100%">
      <YStack flex={1}>
        <XStack position="absolute" top="$medium" pt={insets.top} left="$medium" zIndex={20}>
          {media.gtSm ? <SideBarArea state="militant" /> : null}
          <VoxButton variant="soft" size="lg" shrink iconLeft={ArrowLeft} theme="gray" bg="$white1" onPress={handleBack} aria-label="Retour " />
        </XStack>
        <XStack position="absolute" top="$medium" pt={insets.top} right="$medium" zIndex={20} gap="$small">
          <VoxButton
            variant="soft"
            size="xl"
            iconLeft={Crosshair}
            theme="gray"
            bg="$white1"
            aria-label="Centrer sur ma position"
            disabled={isLocating}
            onPress={handleRecenterPress}
          >
            Recentrer
          </VoxButton>
          <MapListToggle activeView="map" mapHref="/evenements/map" listHref="/evenements/list" />
        </XStack>
        <EventMap
          ref={eventMapRef}
          events={mapEvents}
          isInteractive
          clusterEvents={false}
          onEventPress={handleEventPress}
          initialBounds={FRANCE_METRO_CAMERA_BOUNDS}
          padding={cameraPadding}
          userLocationLngLat={coords}
        />
        {isLoading && (
          <YStack position="absolute" right={0} bottom={0} pointerEvents="none">
            <Spinner size="large" />
          </YStack>
        )}
      </YStack>
    </Layout.Main>
  )
}

export default EventsMapPage
