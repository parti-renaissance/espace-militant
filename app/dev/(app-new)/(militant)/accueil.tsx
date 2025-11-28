import React, { useState, useCallback } from 'react'
import Layout from '@/components/Navigation/Layout'
import Text from '@/components/base/Text'
import { View, YStack } from 'tamagui'
import LayoutFlatList from '@/components/Navigation/LayoutFlatList'

export default function AccueilPage() {
  return (
    <Layout.Container>
      <AccueilContent />
    </Layout.Container>
  )
}

function AccueilContent() {
  const [data, setData] = useState<number[]>(Array.from({ length: 20 }, (_, index) => index))
  
  const hasMore = data.length < 100

  const loadMore = useCallback(() => {
    console.log('loadMore')
    if (!hasMore) return
    console.log('length', data.length)
    setData((currentData) => [
      ...currentData,
      ...Array.from({ length: 20 }, (_, index) => index + currentData.length),
    ])
  }, [hasMore, data])

  return (
    <>
      <Layout.Main>
        <LayoutFlatList
          padding="left"
          data={data}
          renderItem={({ item }) => (
            <View mb="$medium" key={item} height={100} backgroundColor={`$blue${(item + 5) % 7 + 1}`}>
              <Text>Feed Item {item + 1}</Text>
            </View>
          )}
          onEndReachedThreshold={0.4}
          onEndReached={loadMore}
          hasMore={hasMore}
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