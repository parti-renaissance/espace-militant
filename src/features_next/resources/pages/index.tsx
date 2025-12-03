import React, { ComponentRef, useRef } from 'react'
import { RefreshControl } from 'react-native'
import { useTools } from '@/hooks/useTools'
import CardTool from '@/features_next/resources/components/CardTool'
import { useScrollToTop } from '@react-navigation/native'
import { isWeb, ScrollView, useMedia, View } from 'tamagui'

const ResourcesList = () => {
  const media = useMedia()
  const { data, refetch, isRefetching } = useTools()
  const ref = useRef<ComponentRef<typeof ScrollView>>(null)
  useScrollToTop(ref)

  const tools = data.pages
    .map((_) => _.items)
    .flat()
    .map((resource) => ({
      name: resource.label,
      url: resource.url,
      imageUrl: resource.image_url,
    }))

  return (
    <ScrollView
      ref={ref}
      contentContainerStyle={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
        gap: '$medium',
        paddingTop: '$medium',
        paddingHorizontal: '$medium',
        paddingBottom: '$large',
      }}
      refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} />}
    >
      {tools?.map((item) => (
        <View key={item.url + item.name} width={media.gtSm ? (isWeb ? 'calc(50% - 9px)' : '48.8%') : '100%'}>
          <CardTool {...item} />
        </View>
      ))}
    </ScrollView>
  )
}

export default ResourcesList
