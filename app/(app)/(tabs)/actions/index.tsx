import React, { useMemo, useRef, useState } from 'react'
import { Dimensions, Platform, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Text from '@/components/base/Text'
import BoundarySuspenseWrapper, { DefaultErrorFallback } from '@/components/BoundarySuspenseWrapper'
import PageLayout from '@/components/layouts/PageLayout/PageLayout'
import MapboxGl from '@/components/Mapbox/Mapbox'
import * as metatags from '@/config/metatags'
import { useSession } from '@/ctx/SessionProvider'
import useIsFocused from '@/hooks/useIsFocused'
import { LocationPermissionError, QUERY_KEY_LOCATION, useLocation, useLocationPermission } from '@/hooks/useLocation'
import {
  ActionBottomSheet,
  ActionCreateButton,
  ActionFiltersList,
  BottomSheetList,
  CreateEditModal,
  createSource,
  passType,
  SelectType,
  SideActionList,
  SideList,
  useSheetPosition,
} from '@/screens/actions'
import { ActionMapView } from '@/screens/actions/ActionMapView'
import MapButton from '@/screens/doorToDoor/DoorToDoorMapButton'
import LocationAuthorization from '@/screens/doorToDoor/LocationAuthorization'
import { QUERY_KEY_PAGINATED_ACTIONS, useAction, usePaginatedActions } from '@/services/actions/hook/useActions'
import { FilterActionType, RestAction, SelectPeriod } from '@/services/actions/schema'
import { useOnFocus } from '@/utils/useOnFocus.hook'
import { CameraStop } from '@rnmapbox/maps'
import { OnPressEvent } from '@rnmapbox/maps/src/types/OnPressEvent'
import { GalleryHorizontal } from '@tamagui/lucide-icons'
import { useQueryClient } from '@tanstack/react-query'
import { Redirect, router, useLocalSearchParams } from 'expo-router'
import Head from 'expo-router/head'
import { Feature, Point } from 'geojson'
import { FallbackProps } from 'react-error-boundary'
import { isWeb, useMedia, View, YStack } from 'tamagui'
import { useDebouncedCallback } from 'use-debounce'

const ErrorFallback = (props: FallbackProps) => {
  if (props.error instanceof LocationPermissionError) {
    return <LocationAuthorization onAuthorizationRequest={() => props.resetErrorBoundary()} />
  }
  return (
    <PageLayout>
      <PageLayout.StateFrame>
        <DefaultErrorFallback {...props} />
      </PageLayout.StateFrame>
    </PageLayout>
  )
}

export default function ActionsScreen() {
  const { isAuth } = useSession()
  const media = useMedia()

  const isFocused = useIsFocused()
  if (!isFocused) {
    return null
  }

  if (!isAuth) {
    return <Redirect href={'/(tabs)/evenements/'} />
  }

  return (
    <PageLayout full>
      <Head>
        <title>{metatags.createTitle('Actions')}</title>
      </Head>
      <BoundarySuspenseWrapper errorChildren={(x) => <ErrorFallback {...x} />}>
        {!isWeb && media.gtMd ? (
          // <PageLayout.StateFrame bg="$white2">
          <YStack flex={1} justifyContent="center" bg="$white2" alignItems="center">
            <GalleryHorizontal size={40} color="$green6" />
            <Text fontSize="$2" color="$green6">
              Tournez votre appareil en mode portrait
            </Text>
          </YStack>
        ) : (
          // </PageLayout.StateFrame>
          <Page />
        )}
      </BoundarySuspenseWrapper>
    </PageLayout>
  )
}

function Page() {
  useLocationPermission()
  const insets = useSafeAreaInsets()
  const media = useMedia()
  const { uuid: activeAction, ...params } = useLocalSearchParams<{ uuid: string; action: 'create' | 'edit'; scope?: string }>()
  const { scope } = useSession()
  const myScope = params.scope ?? scope?.data?.find((x) => x.features.includes('actions'))?.code
  const queryClient = useQueryClient()

  const { data: maybeDataCoord } = useLocation()

  const [activeTab] = useState<'actions' | 'myActions'>('actions')
  const [period, setPeriod] = React.useState<SelectPeriod>('to-come')
  const [type, setType] = React.useState<SelectType>(FilterActionType.ALL)

  const data = usePaginatedActions({
    ...maybeDataCoord?.coords,
    subscribeOnly: activeTab === 'myActions',
    filters: { period, type },
  })
  const actionQuery = useAction(activeAction, { ...maybeDataCoord?.coords, subscribeOnly: activeTab === 'myActions', filters: { period, type } })
  const positionConfig = useSheetPosition(1)
  const { setPosition } = positionConfig

  const [_modalOpen, _setModalOpen] = React.useState(false)
  const modalOpen = _modalOpen || params.action === 'create' || (params.action === 'edit' && activeAction)
  const setModalOpen = (open: boolean) => {
    _setModalOpen(open)
    if (!open) {
      router.setParams({ action: '' })
    }
  }
  const padding = { paddingBottom: media.gtMd ? 300 : 0, paddingLeft: media.gtMd ? 500 : 0, paddingRight: 0, paddingTop: 0 }

  const filterHeight = useRef(70)
  const [listOpen, setListOpen] = React.useState(true)
  const mapRefs = React.useRef<{ camera: MapboxGl.Camera | null }>(null)
  const flattedActions = data.data?.pages.flatMap((page) => page?.items).filter((x): x is RestAction => x !== undefined) ?? []
  const filteredActions = flattedActions.filter((action) => {
    return [passType(type, action.type)].every(Boolean)
  })
  const [followUser, setFollowUser] = React.useState(true)
  const source = createSource(filteredActions, activeAction ?? '')

  const refUserPosition = React.useRef<{ longitude: number; latitude: number } | null>(null)

  useOnFocus(() => {
    data.refetch()
  })

  const setActiveAction = (action: RestAction | null) => {
    if (action && activeAction) {
      if (media.md) router.setParams({ uuid: '' })
      setTimeout(() => {
        router.setParams({ uuid: action.uuid })
      }, 0)
    } else {
      router.setParams({ uuid: action?.uuid ?? '' })
    }
  }

  const handleLocationChange = (coordsPayload?: { longitude: number; latitude: number }, moveToCoord = true) => {
    if (coordsPayload) {
      followUser && setFollowUser(false)
      queryClient.setQueryData([QUERY_KEY_LOCATION], { coords: coordsPayload })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_PAGINATED_ACTIONS] })
    }
    if (moveToCoord) {
      const coords = coordsPayload ?? refUserPosition.current
      if (coords) {
        setTimeout(() => {
          mapRefs.current?.camera?.setCamera({
            centerCoordinate: [coords.longitude, coords.latitude],
            zoomLevel: 14,
            animationMode: 'easeTo',
            animationDuration: 30,
            padding,
          })
        }, 100)
      }
    }
  }

  const debouncedHandleLocationChange = useDebouncedCallback(handleLocationChange, 1000)

  const setCameraBySnapPercent = (snapPercent: number, cameraSetting?: CameraStop) => {
    const height = Dimensions.get('window').height
    const paddingBottom = media.md ? (height * snapPercent) / 100 - (insets.top + filterHeight.current + 40) : 0
    mapRefs.current?.camera?.setCamera({
      padding: { paddingBottom, paddingLeft: 0, paddingRight: 0, paddingTop: 0 },
      animationMode: 'easeTo',
      ...cameraSetting,
    })
  }

  const handleActiveAction = (action: RestAction | null) => {
    if (!action) {
      setActiveAction(null)
      setListOpen(true)
      return
    }
    setActiveAction(action)

    setFollowUser(false)
    setTimeout(() => {
      setCameraBySnapPercent(49, {
        centerCoordinate: [action.post_address.longitude, action.post_address.latitude],
        zoomLevel: 16,
        animationMode: 'easeTo',
        animationDuration: 300,
      })
    }, 200)
    setListOpen(false)
  }

  const handleOnEditAction = (action: RestAction) => {
    setActiveAction(action)
    setModalOpen(true)
    setListOpen(false)
  }

  const handleOnActionLayerPress = (e: OnPressEvent) => {
    if (e.features.length === 0) {
      setActiveAction(null)
      setListOpen(true)
      return
    }

    const [cluster] = e.features as Feature<Point>[]
    handleActiveAction(flattedActions.find((action) => action.uuid === cluster.properties?.uuid) ?? null)
  }

  const onCloseModal = () => setModalOpen(false)

  const modal = <CreateEditModal open={!!modalOpen} onClose={onCloseModal} activeAction={activeAction} scope={myScope} />

  const filtersBtns = useMemo(
    () => (
      <ActionFiltersList
        onLocationChange={handleLocationChange}
        onAddressReset={() => handleLocationChange(refUserPosition.current ?? undefined)}
        type={type}
        period={period}
        onPeriodChange={setPeriod}
        onTypeChange={setType}
        bg="$transparentColor"
        position="absolute"
        top={5 + insets.top}
        zIndex={100}
        left={0}
        right={0}
      />
    ),
    [activeAction, period, type],
  )

  const bottomSheetList = useMemo(
    () => (
      <BottomSheetList
        loading={data.isFetching}
        actions={filteredActions}
        postionConfig={positionConfig}
        open={listOpen}
        onEdit={handleOnEditAction}
        onOpenChange={setListOpen}
        setActiveAction={handleActiveAction}
      />
    ),
    [filteredActions, listOpen, data.isFetching],
  )

  const sideList = useMemo(
    () => (
      <SideList
        actions={filteredActions}
        loading={data.isFetching}
        postionConfig={positionConfig}
        onEdit={handleOnEditAction}
        open={listOpen}
        onOpenChange={setListOpen}
        setActiveAction={handleActiveAction}
      >
        <YStack height={200} $gtSm={{ width: 500 }} display={!activeAction ? 'flex' : 'none'}>
          <ActionFiltersList
            onLocationChange={handleLocationChange}
            onAddressReset={() => handleLocationChange(refUserPosition.current ?? undefined)}
            type={type}
            period={period}
            onPeriodChange={setPeriod}
            onTypeChange={setType}
            zIndex={10000}
          />
          <YStack pl="$medium">
            <ActionCreateButton width={200} onPress={() => setModalOpen(true)} />
          </YStack>
        </YStack>
      </SideList>
    ),
    [filteredActions, listOpen, data.isFetching],
  )

  const actionBottomSheet = useMemo(
    () => (
      <ActionBottomSheet
        actionQuery={actionQuery}
        onEdit={() => setModalOpen(true)}
        onOpenChange={(open) => {
          if (!open) {
            setActiveAction(null)
            setListOpen(true)

            mapRefs.current?.camera?.setCamera({
              padding: { paddingBottom: 0, paddingLeft: 0, paddingRight: 0, paddingTop: 0 },
              animationMode: 'easeTo',
              animationDuration: 300,
            })
          }
        }}
        onPositionChange={(_, percent) => setCameraBySnapPercent(percent)}
      />
    ),
    [actionQuery],
  )

  const sideActionList = useMemo(
    () => (
      <SideActionList
        actionQuery={actionQuery}
        onEdit={() => setModalOpen(true)}
        onOpenChange={(open) => {
          if (!open) {
            setActiveAction(null)
            setListOpen(true)

            // mapRefs.current?.camera?.setCamera({
            //   padding: { paddingBottom: 0, paddingLeft: 0, paddingRight: 0, paddingTop: 0 },
            //   animationMode: 'easeTo',
            //   animationDuration: 300,
            // })
          }
        }}
        onPositionChange={(_, percent) => setCameraBySnapPercent(percent)}
      />
    ),
    [actionQuery],
  )

  const handleMapPress = () => {
    setActiveAction(null)
    if (listOpen) {
      setPosition(1)
    } else {
      setListOpen(true)
    }
    mapRefs.current?.camera?.setCamera({
      padding: { paddingBottom: 0, paddingLeft: 0, paddingRight: 0, paddingTop: 0 },
      animationMode: 'easeTo',
      animationDuration: 300,
    })
  }

  const handleOnUserLocationChange = (location: { longitude: number; latitude: number }) => {
    refUserPosition.current = location
  }

  const handleOnCameraChange = (location: { longitude: number; latitude: number }) => {
    debouncedHandleLocationChange(location, false)
  }

  const mapView = useMemo(
    () => (
      <ActionMapView
        ref={mapRefs}
        source={source}
        onCameraChange={handleOnCameraChange}
        onActionPress={handleOnActionLayerPress}
        onMapPress={handleMapPress}
        coords={maybeDataCoord?.coords}
        onUserPositionChange={handleOnUserLocationChange}
        followUser={followUser}
        padding={padding}
      />
    ),
    [maybeDataCoord?.coords, followUser, source, padding],
  )

  const mapButton = useMemo(
    () => (
      <View style={styles.mapButtonSideContainer}>
        {!isWeb && (
          <MapButton
            style={styles.mapButtonLocation}
            onPress={() => {
              const userCoords = refUserPosition.current
              if (!userCoords) return
              handleLocationChange(userCoords)

              mapRefs.current?.camera?.setCamera({
                centerCoordinate: [userCoords.longitude, userCoords.latitude],
                animationMode: 'easeTo',
                animationDuration: 300,
                zoomLevel: 14,
              })
            }}
            image={require('@/assets/images/gpsPosition.png')}
          />
        )}
      </View>
    ),
    [],
  )

  return (
    <>
      {Platform.OS !== 'android' ? modal : null}
      {media.md && bottomSheetList}
      {media.md && actionBottomSheet}
      {Platform.OS === 'android' ? modal : null}
      {/* <Tabs<'actions' | 'myActions'>
        value={activeTab}
        onChange={setActiveTab}
        grouped={media.lg}
        $gtMd={{ paddingHorizontal: '$7', paddingTop: '$6', paddingBottom: 0 }}
      >
        <Tabs.Tab id="actions">Toutes les actions</Tabs.Tab>
        <Tabs.Tab id="myActions">J'y participe</Tabs.Tab>
      </Tabs> */}
      <YStack flex={1} flexDirection="column" position="relative">
        {media.gtMd && sideActionList}
        {media.gtMd && sideList}
        <YStack flex={1} position="relative">
          {media.md && !activeAction && filtersBtns}

          {mapView}
        </YStack>
        {media.md && <ActionCreateButton onPress={() => setModalOpen(true)} style={styles.createActionContainer} />}

        {mapButton}
      </YStack>
    </>
  )
}

const styles = StyleSheet.create({
  mapButtonLocation: {
    alignSelf: 'flex-start',
    height: 40,
    width: 40,
  },
  createActionContainer: {
    flex: 1,
    position: 'absolute',
    right: 10,
    bottom: 80,
  },
  mapButtonSideContainer: {
    flex: 1,
    position: 'absolute',
    left: 10,
    bottom: 80,
  },
})
