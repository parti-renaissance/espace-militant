import React, { useMemo, useRef, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { isWeb, Spinner, useMedia, XStack, YStack } from 'tamagui'
import { ArrowLeft, Crosshair } from '@tamagui/lucide-icons'
import { OnPressEvent } from '@rnmapbox/maps/src/types/OnPressEvent'

import Layout from '@/components/AppStructure/Layout/Layout'
import { SideBarArea } from '@/components/AppStructure/Navigation/SideBar'
import { VoxButton } from '@/components/Button'
import { useSuspensePaginatedEvents } from '@/services/events/hook'

import { isEventPast } from '../../utils'

import EventMap, { EventMapHandle, EventMapItem } from './EventMap'

const DEFAULT_CENTER: [number, number] = [2.45, 46.55]
const isFiniteCoordinate = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value)

const EventsMapPage = () => {
  const router = useRouter()
  const eventMapRef = useRef<EventMapHandle>(null)
  const [isLocating, setIsLocating] = useState(false)
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

  const cameraZoomLevel = useMemo(() => {
    if (media.xs) return 4.3
    if (media.sm) return 4.6
    return 5.5
  }, [media.sm, media.xs])

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

  const handleEventPress = (event: OnPressEvent) => {
    const firstFeature = event.features?.[0]
    const slug = firstFeature?.properties?.slug
    if (typeof slug === 'string' && slug.length > 0) {
      router.push(`/evenements/${slug}`)
    }
  }

  const handleBack = () => {
    if (isWeb) {
      router.push('/evenements')
    } else if (router.canGoBack()) {
      router.back()
    } else {
      router.replace('/evenements')
    }
  }

  return (
    <Layout.Main width="100%" maxWidth="100%" height="100%">
      <YStack flex={1}>
        <XStack position="absolute" top="$medium" pt={insets.top} left="$medium" zIndex={20}>
          {media.gtSm ? <SideBarArea state="militant" /> : null}
          <VoxButton variant="soft" size="lg" shrink iconLeft={ArrowLeft} theme="gray" bg="$white1" onPress={handleBack} aria-label="Retour " />
        </XStack>
        <YStack position="absolute" top="$medium" pt={insets.top} right="$medium" zIndex={20}>
          <VoxButton
            variant="soft"
            size="lg"
            shrink
            iconLeft={Crosshair}
            theme="gray"
            bg="$white1"
            onPress={() => void eventMapRef.current?.centerOnMyPosition()}
            aria-label="Centrer sur ma position"
            disabled={isLocating}
          >
            Recentrer
          </VoxButton>
        </YStack>
        <EventMap
          ref={eventMapRef}
          events={mapEvents}
          isInteractive
          clusterEvents={false}
          onEventPress={handleEventPress}
          centerCoordinate={DEFAULT_CENTER}
          zoomLevel={cameraZoomLevel}
          padding={cameraPadding}
          onCenterOnUserLocationStateChange={setIsLocating}
        />
        {(isLoading || isFetching) && (
          <YStack position="absolute" right={0} bottom={0} pointerEvents="none">
            <Spinner size="large" />
          </YStack>
        )}
      </YStack>
    </Layout.Main>
  )
}

export default EventsMapPage
