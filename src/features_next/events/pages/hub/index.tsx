import { Suspense, useCallback, useMemo, useRef, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Spinner, useMedia, YStack } from 'tamagui'
import { OnPressEvent } from '@rnmapbox/maps/src/types/OnPressEvent'

import { SideBarArea } from '@/components/AppStructure'
import { TABBAR_HEIGHT_SM } from '@/components/AppStructure/hooks/useLayoutSpacing'
import { FRANCE_METRO_HUB_BBOX, useHubItemsQuery } from '@/services/hub/hook'
import { mapHubItemsToMapMarkers } from '@/services/hub/mapper'

import { HubItemMapHandle, roundCoordinateForMapSortAround } from '../map/components/HubItemMap'
import { useUserLocation } from '../map/hooks/useUserLocation'
import { EventsHubDesktop } from './components/EventsHubDesktop'
import { EventsHubMobile } from './components/EventsHubMobile'
import { HubMapBlock } from './components/HubMapBlock'
import { useOpenOrganiserEvenement } from '@/features_next/profil/hooks/useOpenOrganiserEvenement'

import { HubOrganizeCategoryModal } from './components/HubOrganizeCategoryModal'

const EventsHubPage = () => {
  const router = useRouter()
  const hubItemMapRef = useRef<HubItemMapHandle>(null)
  const { coords, isLocating, requestLocation } = useUserLocation()

  const [sortAround, setSortAround] = useState<{ lat: number; lng: number } | null>(null)
  const [organizeModalOpen, setOrganizeModalOpen] = useState(false)

  const { openOrganiserModal } = useOpenOrganiserEvenement()

  const handleOpenOrganizeModal = useCallback(() => {
    openOrganiserModal(() => setOrganizeModalOpen(true))
  }, [openOrganiserModal])

  const handleCloseOrganizeModal = useCallback(() => {
    setOrganizeModalOpen(false)
  }, [])
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

  const handleMapItemPress = useCallback(
    (event: OnPressEvent) => {
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
    },
    [router],
  )

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

  const mapBlockCommonProps = {
    hubItemMapRef,
    mapItems,
    onItemPress: handleMapItemPress,
    onRecenterPress: handleRecenterPress,
    padding: cameraPadding,
    isLocating,
    userLocationLngLat: coords,
    showLoadingSpinner: isLoading,
    showFetchingIndicator: isFetching && !isLoading,
    topInset: insets.top,
  }

  const feedSuspenseFallback = (
    <YStack flex={1} p="$medium" alignItems="center" justifyContent="center">
      <Spinner size="large" />
    </YStack>
  )

  const organizeModal = organizeModalOpen ? (
    <Suspense fallback={null}>
      <HubOrganizeCategoryModal open onClose={handleCloseOrganizeModal} />
    </Suspense>
  ) : null

  if (!media.gtSm) {
    return (
      <>
        <EventsHubMobile
          embeddedMapHeader={<HubMapBlock {...mapBlockCommonProps} variant="embedded" />}
          tabBarSafeBottom={tabBarSafeBottom}
          feedSuspenseFallback={feedSuspenseFallback}
          onOpenOrganizeModal={handleOpenOrganizeModal}
        />
        {organizeModal}
      </>
    )
  }

  return (
    <>
      <EventsHubDesktop
        mapLayer={<HubMapBlock {...mapBlockCommonProps} variant="fullscreen" promoLeadingAccessory={<SideBarArea state="militant" />} />}
        feedSuspenseFallback={feedSuspenseFallback}
        onOpenOrganizeModal={handleOpenOrganizeModal}
      />
      {organizeModal}
    </>
  )
}

export default EventsHubPage
