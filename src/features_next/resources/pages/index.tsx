import React, { ComponentRef, useRef } from 'react'
import { RefreshControl } from 'react-native'
import CardTool from '@/features_next/resources/components/CardTool'
import { useScrollToTop } from '@react-navigation/native'
import { isWeb, ScrollView, useMedia, View } from 'tamagui'
import { useGetRessources } from '@/services/ressources/hook'
import LayoutScrollView from '@/components/AppStructure/Layout/LayoutScrollView'
import { Layout } from '@/components/AppStructure'
import SkeCard from '@/components/Skeleton/CardSkeleton'
import Text from '@/components/base/Text'

const ResourcesSkeleton = ({ media }: { media: ReturnType<typeof useMedia> }) => {
  return (
    <LayoutScrollView contentContainerStyle={{ alignItems: media.gtSm ? 'center' : undefined }}>
      <Layout.Main maxWidth={992} width="100%">
        <View
          flexDirection={media.gtSm ? 'row' : 'column'}
          flexWrap="wrap"
          gap="$medium"
          px="$medium"
          width="100%"
        >
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeCard key={index} height="$13" width={media.gtSm ? (isWeb ? 'calc(50% - 9px)' : '48.8%') : '100%'}>
              <SkeCard.Content justifyContent="flex-end" gap="$medium">
                <View flexDirection="row" gap={2} justifyContent="flex-end">
                  <View width="$5" height="$5" backgroundColor="$gray1" borderRadius="$2" />
                </View>
                <View flexDirection="row" gap={2} width="100%" flexShrink={1}>
                  <SkeCard.Line width="80%" />
                </View>
                <View flexDirection="row" gap="$small" alignItems="center">
                  <SkeCard.Line width={120} />
                </View>
              </SkeCard.Content>
            </SkeCard>
          ))}
        </View>
      </Layout.Main>
    </LayoutScrollView>
  )
}

const ResourcesScreen = () => {
  const media = useMedia()
  const { data, refetch, isRefetching, isLoading } = useGetRessources()
  const ref = useRef<ComponentRef<typeof ScrollView>>(null)
  useScrollToTop(ref)

  const tools =
    data?.pages
      .map((_) => _.items)
      .flat()
      .map((resource) => ({
        name: resource.label,
        url: resource.url,
        imageUrl: resource.image_url,
      })) ?? []

  if (isLoading) {
    return (
      <ResourcesSkeleton media={media} />
    )
  }

  return (
    <LayoutScrollView
      contentContainerStyle={{ alignItems: media.gtSm ? 'center' : undefined }}
      refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} />}
    >
      <Layout.Main maxWidth={992} width="100%">
        <View
          flexDirection={media.gtSm ? 'row' : 'column'}
          flexWrap="wrap"
          gap="$medium"
          px="$medium"
          width="100%"
        >
          {tools.length > 0 ? tools?.map((item) => (
            <View
              key={item.url + item.name}
              width={media.gtSm ? (isWeb ? 'calc(50% - 9px)' : '48.8%') : '100%'}
            >
              <CardTool {...item} />
            </View>
          )) : (
            <View width="100%" alignItems="center" justifyContent="center">
              <Text.LG secondary>Aucune ressource trouvée</Text.LG>
            </View>
          )}
        </View>
      </Layout.Main>
    </LayoutScrollView>
  )
}

export default ResourcesScreen
