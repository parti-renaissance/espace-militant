'use no memo'

import { Suspense } from 'react'
import { YStack } from 'tamagui'

import Layout from '@/components/AppStructure/Layout/Layout'
import HubSideContent from '@/features_next/events/components/feed-layout/SideContent'

import { HubOrganizeCategoryModal } from '../hub/components/HubOrganizeCategoryModal'
import { EventsListFlatList } from './components/EventsListFlatList'
import { EventsListHeader } from './components/EventsListHeader'
import { EventsListOrganizeFab } from './components/EventsListOrganizeFab'
import { useEventsListPage } from './hooks/useEventsListPage'

type EventsListPageProps = {
  itemType?: string
}

const EventsListPage = ({ itemType }: EventsListPageProps) => {
  const {
    media,
    isAuth,
    userData,
    organizeModalOpen,
    feedState,
    showSkeleton,
    feedContentContainerStyle,
    hasActiveFilters,
    hasNextPage,
    isManualRefreshing,
    handleManualRefresh,
    loadMore,
    handleOpenOrganizeModal,
    handleCloseOrganizeModal,
    handleSwitchToAllItems,
    handleSwitchChange,
    pinnedBannerPaddingTop,
    activeTab,
  } = useEventsListPage({ itemType })

  const listHeader = (
    <EventsListHeader
      activeTab={activeTab}
      isAuth={isAuth}
      onOpenOrganizeModal={handleOpenOrganizeModal}
      onSwitchChange={handleSwitchChange}
      pinnedBannerPaddingTop={pinnedBannerPaddingTop}
    />
  )

  const organizeModal = organizeModalOpen ? (
    <Suspense fallback={null}>
      <HubOrganizeCategoryModal open onClose={handleCloseOrganizeModal} />
    </Suspense>
  ) : null

  return (
    <>
      <Layout.Main width="100%">
        <YStack flex={1}>
          <EventsListFlatList
            data={feedState.sectionedData}
            emptyReason={feedState.emptyReason}
            feedContentContainerStyle={feedContentContainerStyle}
            hasActiveFilters={hasActiveFilters}
            hasNextPage={hasNextPage}
            isManualRefreshing={isManualRefreshing}
            listHeader={listHeader}
            onLoadMore={loadMore}
            onManualRefresh={handleManualRefresh}
            onSwitchToAllItems={handleSwitchToAllItems}
            showSkeleton={showSkeleton}
            userData={userData}
          />
          <EventsListOrganizeFab onPress={handleOpenOrganizeModal} />
        </YStack>
      </Layout.Main>
      {media.gtMd ? (
        <Layout.SideBar isSticky padding="right">
          <YStack>
            <HubSideContent onOpenOrganizeModal={handleOpenOrganizeModal} />
          </YStack>
        </Layout.SideBar>
      ) : null}
      {organizeModal}
    </>
  )
}

EventsListPage.displayName = 'EventsListPage'

export default EventsListPage
