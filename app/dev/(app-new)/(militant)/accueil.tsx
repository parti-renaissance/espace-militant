import React, { useState, useCallback } from 'react'
import Layout, { useLayoutPadding } from '@/components/Navigation/Layout'
import Text from '@/components/base/Text'
import { FlatList } from 'react-native'
import { View, YStack, isWeb } from 'tamagui'
import { usePageLayoutScroll } from '@/components/Navigation/usePageLayoutScroll'

export default function AccueilPage() {
  return (
    <Layout.Container>
      <AccueilContent />
    </Layout.Container>
  )
}

function AccueilContent() {
  const [data, setData] = useState<number[]>(Array.from({ length: 20 }, (_, index) => index))
  const padding = useLayoutPadding({ safeArea: true })
  
  const hasMore = data.length < 100

  // 🔥 Logique de chargement unique (useCallback pour la stabilité)
  const loadMore = useCallback(() => {
    console.log('loadMore')
    if (!hasMore) return
    console.log('length', data.length)
    setData((currentData) => [
      ...currentData,
      ...Array.from({ length: 20 }, (_, index) => index + currentData.length),
    ])
  }, [hasMore, data])


  // 1. Web : Utilisation du hook pour la détection sur le conteneur parent
  usePageLayoutScroll({
    onEndReached: hasMore ? loadMore : undefined,
    onEndReachedThreshold: 0.4,
  })

  return (
    <>
      <Layout.Main>
        <FlatList
          contentContainerStyle={{ gap: 16, paddingTop: padding.paddingTop, paddingBottom: padding.paddingBottom }}
          data={data}
          scrollEnabled={!isWeb}
          renderItem={({ item }) => (
            <View key={item} height={100} backgroundColor={`$blue${(item + 5) % 7 + 1}`}>
              <Text>Feed Item {item + 1}</Text>
            </View>
          )}
          
          // 2. Natif : Utilisation des props natives de la FlatList
          onEndReachedThreshold={0.4}
          onEndReached={isWeb ? undefined : (hasMore ? loadMore : undefined)} // Appel de la fonction unique
        />
      </Layout.Main>
      <Layout.SideBar isSticky>
        <YStack bg="$orange3" height={500} alignItems="center" justifyContent="center">
          <Text>Contenu colonne 2</Text>
        </YStack>
      </Layout.SideBar>
    </>
  )
}