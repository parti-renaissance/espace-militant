import React, { useState, useCallback } from 'react'
import Layout from '@/components/Navigation/Layout'
import Text from '@/components/base/Text'
import { View, YStack } from 'tamagui'
import LayoutScrollView from '@/components/Navigation/LayoutScrollView'

export default function ActionsPage() {
  return (
    <Layout.Container>
      <ActionsContent />
    </Layout.Container>
  )
}

function ActionsContent() {
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
        <LayoutScrollView
          padding="left"
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          hasMore={hasMore}
        >
          <YStack gap={16}>
            {data.map((item) => (
              <View key={item} height={100} backgroundColor={`$green${(item + 5) % 7 + 1}`}>
                <Text>Action Item {item + 1}</Text>
              </View>
            ))}
          </YStack>
        </LayoutScrollView>
      </Layout.Main>
      <Layout.SideBar isSticky>
        <YStack bg="$orange3" height={500} alignItems="center" justifyContent="center">
          <Text>Contenu colonne 2</Text>
        </YStack>
      </Layout.SideBar>
    </>
  )
}