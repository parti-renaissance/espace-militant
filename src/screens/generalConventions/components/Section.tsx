import React, { useMemo } from 'react'
import Text from '@/components/base/Text'
import EmptyState from '@/components/EmptyStates/EmptyState'
import { generalConventionContent } from '@/screens/generalConventions/components/DetailsScreen'
import { FormaCard } from '@/screens/generalConventions/components/FormaCard'
import { Filter } from '@/screens/generalConventions/store'
import { useGetGeneralConventions } from '@/services/general-convention/hook'
import { XStack } from 'tamagui'

const Section = ({ filter }: { filter: Filter }) => {
  const { data } = useGetGeneralConventions()

  const filteredItems = useMemo(() => {
    const items = data ?? []

    if (!filter.search && !filter.assembly) {
      return items
    }

    return (data ?? []).filter((item) => {
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
    <XStack flexWrap="wrap" alignItems={'flex-start'} maxWidth={1200} gap={'$4'} $gtSm={{ gap: '$8' }} justifyContent="center">
      {filteredItems.length ? (
        filteredItems.map((generalConvention, index) => <FormaCard key={index} payload={generalConvention} />)
      ) : (
        <XStack background={'white'} borderRadius={12} width={300} justifyContent={'center'} paddingHorizontal={16} paddingVertical={32}>
          <EmptyState>
            <Text.MD textAlign={'center'} medium>
              Aucun élément
            </Text.MD>
          </EmptyState>
        </XStack>
      )}
    </XStack>
  )
}

export default Section
