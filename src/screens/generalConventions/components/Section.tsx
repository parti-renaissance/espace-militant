import React, { ReactElement, useMemo } from 'react'
import { FlatList } from 'react-native'
import Text from '@/components/base/Text'
import EmptyState from '@/components/EmptyStates/EmptyState'
import { generalConventionContent } from '@/screens/generalConventions/components/DetailsScreen'
import { FormaCard } from '@/screens/generalConventions/components/FormaCard'
import { Filter } from '@/screens/generalConventions/store'
import { useGetGeneralConventions } from '@/services/general-convention/hook'
import { sortBy } from 'lodash'
import { getThemes, useMedia, View } from 'tamagui'

const Section = ({ filter, headerComponent }: { filter: Filter; headerComponent: ReactElement }) => {
  const media = useMedia()
  const { data } = useGetGeneralConventions()
  const themes = getThemes()

  const filteredItems = useMemo(() => {
    const items = sortBy(data ?? [], (item) => parseInt(item.department_zone?.code ?? '0', 10))

    if (!filter.search && !filter.assembly) {
      return items
    }

    return items.filter((item) => {
      let content = ''
      if (filter.search) {
        content = generalConventionContent(item)
      }

      return (
        (!filter.search || content.toLowerCase().includes(filter.search.toLowerCase())) &&
        (!filter.assembly || filter.assembly === 'all' || item.department_zone?.code === filter.assembly)
      )
    })
  }, [filter, data])

  return (
    <FlatList
      style={{ flex: 1 }}
      key={media.gtMd ? 'gtMd' : media.gtSm ? 'gtSm' : 'sm'}
      numColumns={media.gtMd ? 3 : media.gtSm ? 2 : undefined}
      data={filteredItems}
      keyExtractor={(item) => item.uuid}
      renderItem={({ item }) => (
        <View
          $sm={{
            backgroundColor: themes.light[`gray3Light`].val,
            paddingBottom: media.gtSm ? 24 : 8,
          }}
          $gtMd={{ backgroundColor: 'transparent' }}
        >
          <FormaCard payload={item} />
        </View>
      )}
      contentContainerStyle={{
        gap: media.gtSm ? 24 : 0,
        maxWidth: 1200,
        alignSelf: 'center',
        width: '100%',
      }}
      columnWrapperStyle={media.gtSm ? { gap: 24, justifyContent: 'center' } : undefined}
      ListHeaderComponent={headerComponent}
      ListHeaderComponentStyle={{ marginBottom: 16 }}
      ListEmptyComponent={
        <EmptyState>
          <Text.MD textAlign={'center'} medium>
            Aucun élément
          </Text.MD>
        </EmptyState>
      }
    />
  )
}

export default Section
