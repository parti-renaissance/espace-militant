import React, { useState, useCallback } from 'react'
import Layout, { useLayoutPadding } from '@/components/Navigation/Layout'
import Text from '@/components/base/Text'
import { ScrollView } from 'react-native'
import { View, YStack, isWeb } from 'tamagui'
import { usePageLayoutScroll } from '@/components/Navigation/usePageLayoutScroll'

export default function ActionsPage() {
  return (
    <Layout.Container>
      <ActionsContent />
    </Layout.Container>
  )
}

function ActionsContent() {
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

  // 2. Natif : Fonction de gestion pour la ScrollView
  const handleNativeScroll = (event: any) => {
    if (isWeb || !hasMore) return

    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent
    const paddingToBottom = 20
    
    // Détection manuelle de fin de défilement en Natif
    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom) {
      loadMore() // Appel de la fonction unique
    }
  }


  return (
    <>
      <Layout.Main>
        <ScrollView
          contentContainerStyle={{ gap: 16, paddingTop: padding.paddingTop, paddingBottom: padding.paddingBottom }}
          // Défilement activé uniquement en natif (si le conteneur n'est pas déjà défilant)
          scrollEnabled={!isWeb} 
          
          // Connexion au gestionnaire natif
          onScroll={handleNativeScroll} 
          scrollEventThrottle={16} 
        >
          <YStack gap={16}>
            {data.map((item) => (
              <View key={item} height={100} backgroundColor={`$green${(item + 5) % 7 + 1}`}>
                <Text>Action Item {item + 1}</Text>
              </View>
            ))}
          </YStack>
        </ScrollView>
      </Layout.Main>
      <Layout.SideBar isSticky>
        <YStack bg="$orange3" height={500} alignItems="center" justifyContent="center">
          <Text>Contenu colonne 2</Text>
        </YStack>
      </Layout.SideBar>
    </>
  )
}