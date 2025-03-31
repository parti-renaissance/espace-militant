import React, { ReactElement, useMemo } from 'react'
import { FlatList } from 'react-native'
import Text from '@/components/base/Text'
import EmptyState from '@/components/EmptyStates/EmptyState'
import { generalConventionContent } from '@/screens/generalConventions/components/DetailsScreen'
import { FormaCard } from '@/screens/generalConventions/components/FormaCard'
import { Filter } from '@/screens/generalConventions/store'
import { useGetGeneralConventions } from '@/services/general-convention/hook'
import { sortBy } from 'lodash'
import { Spinner, useMedia } from 'tamagui'

const Section = ({ filter, headerComponent }: { filter: Filter; headerComponent: ReactElement }) => {
  const media = useMedia()
  const { data, isFetching } = useGetGeneralConventions()

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
      renderItem={({ item }) => <FormaCard payload={item} />}
      contentContainerStyle={{
        paddingVertical: media.gtSm ? 40 : 20,
        gap: media.gtSm ? 24 : 8,
        maxWidth: 1200,
        alignSelf: 'center',
        marginBottom: 24,
        width: '100%',
      }}
      columnWrapperStyle={media.gtSm ? { gap: 24, justifyContent: 'center' } : undefined}
      ListHeaderComponent={headerComponent}
      ListHeaderComponentStyle={{ marginBottom: media.gtSm ? 16 : 8 }}
      ListFooterComponent={isFetching ? <Spinner /> : undefined}
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
