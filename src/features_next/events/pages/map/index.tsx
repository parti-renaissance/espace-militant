import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { isWeb, Spinner, useMedia, XStack, YStack } from 'tamagui'
import { ArrowLeft, CirclePlus, Crosshair } from '@tamagui/lucide-icons'
import { OnPressEvent } from '@rnmapbox/maps/src/types/OnPressEvent'

import Layout from '@/components/AppStructure/Layout/Layout'
import { SideBarArea } from '@/components/AppStructure/Navigation/SideBar'
import { VoxButton } from '@/components/Button'

import { FRANCE_METRO_HUB_BBOX, useHubItemsQuery } from '@/services/hub/hook'
import { mapHubItemsToMapMarkers } from '@/services/hub/mapper'

import { MapListToggle } from '../../components/feed-layout/MapListToggle'
import HubItemMap, { FRANCE_METRO_CAMERA_BOUNDS, HubItemMapHandle, roundCoordinateForMapSortAround } from './components/HubItemMap'
import { useUserLocation } from './hooks/useUserLocation'

const EventsMapPage = () => {
  const router = useRouter()
  const hubItemMapRef = useRef<HubItemMapHandle>(null)
  const hasAutoFlownToUserRef = useRef(false)
  const { coords, isLocating, requestLocation } = useUserLocation()

  const [sortAround, setSortAround] = useState<{ lat: number; lng: number } | null>(null)

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

  const { data, isLoading, isFetching } = useHubItemsQuery({
    params: {
      page: 1,
      pageSize: 300,
      bbox: FRANCE_METRO_HUB_BBOX,
      upcomingOnly: true,
      ...(sortAround ? { sortAround } : {}),
    },
  })

  const mapItems = useMemo(() => mapHubItemsToMapMarkers(data?.items ?? []), [data?.items])

  useEffect(() => {
    if (hasAutoFlownToUserRef.current || coords == null || isLoading || isFetching) {
      return
    }
    hasAutoFlownToUserRef.current = true
    hubItemMapRef.current?.flyToUserWithItemsZoom(coords)
  }, [coords, isLoading, isFetching])

  const handleRecenterPress = useCallback(() => {
    void (async () => {
      const next = await requestLocation({ showAlertOnFailure: true })
      if (next) {
        setSortAround({
          lat: roundCoordinateForMapSortAround(next[1]),
          lng: roundCoordinateForMapSortAround(next[0]),
        })
        hubItemMapRef.current?.flyToUserWithItemsZoom(next)
      }
    })()
  }, [requestLocation])

  const handleItemPress = (event: OnPressEvent) => {
    const properties = event.features?.[0]?.properties as { itemType?: string; uuid?: string; slug?: string | null } | undefined
    if (!properties) {
      return
    }

    if (properties.itemType === 'action' && typeof properties.uuid === 'string' && properties.uuid.length > 0) {
      router.push({ pathname: '/actions/[id]', params: { id: properties.uuid } })
      return
    }

    const slug = properties.slug
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
        <HubItemMap
          ref={hubItemMapRef}
          items={mapItems}
          isInteractive
          clusterItems={false}
          onItemPress={handleItemPress}
          initialBounds={FRANCE_METRO_CAMERA_BOUNDS}
          padding={cameraPadding}
          userLocationLngLat={coords}
        />
        {isLoading && (
          <YStack position="absolute" right={0} bottom={0} pointerEvents="none">
            <Spinner size="large" />
          </YStack>
        )}
        <XStack position="absolute" bottom="$medium" right="$medium" zIndex={20} gap="$small">
          <VoxButton variant="contained" size="lg" iconLeft={CirclePlus} theme="purple" onPress={() => router.push('/evenements/creer')}>
            Organiser un événement
          </VoxButton>
        </XStack>
      </YStack>
    </Layout.Main>
  )
}

export default EventsMapPage
