import React, { useDeferredValue, useMemo, useState } from 'react'
import AssemblySelect from '@/components/AssemblySelect/AssemblySelect'
import SearchBox from '@/components/Search/SearchBox'
import { GeneralConventionsDenyCard } from '@/screens/generalConventions/components/DenyCard'
import { generalConventionContent } from '@/screens/generalConventions/components/DetailsScreen'
import EmptyFormaState from '@/screens/generalConventions/components/EmptyFormaState'
import { FormaCard } from '@/screens/generalConventions/components/FormaCard'
import { useGetGeneralConventions } from '@/services/general-convention/hook'
import { useGetSuspenseProfil } from '@/services/profile/hook'
import { XStack, YStack } from 'tamagui'

const Section = () => {
  const { data: user } = useGetSuspenseProfil()
  const isAdherent = user?.tags?.find((tag) => tag.type === 'adherent')
  const { data } = useGetGeneralConventions(!!isAdherent)

  const [filter, setFilter] = useState({
    search: '',
    assembly: '',
  })
  const deferredFilter = useDeferredValue(filter)

  const filteredItems = useMemo(() => {
    const items = data ?? []

    if (!deferredFilter.search && !deferredFilter.assembly) {
      return items
    }

    return (data ?? []).filter((item) => {
      let content = ''
      if (deferredFilter.search) {
        content = generalConventionContent(item)
      }

      return (
        (!deferredFilter.search || content.toLowerCase().includes(deferredFilter.search.toLowerCase())) &&
        (!deferredFilter.assembly || item.department_zone?.code === deferredFilter.assembly)
      )
    })
  }, [deferredFilter, data])

  if (!isAdherent) {
    return <GeneralConventionsDenyCard topVisual={0} />
  }

  return (
    <YStack gap={16} $gtSm={{ gap: 40 }}>
      <XStack
        marginLeft={16}
        marginBottom={10}
        marginRight={16}
        alignSelf={'center'}
        gap={16}
        flexWrap="wrap"
        $gtSm={{ gap: 40, flexWrap: 'nowrap', maxWidth: 550 }}
      >
        <YStack flex={1} minWidth={260}>
          <AssemblySelect
            resetable={!!deferredFilter.assembly}
            size="sm"
            id="filter-dept"
            color="white"
            value={deferredFilter.assembly}
            onDetailChange={(x) => setFilter((prevState) => ({ ...prevState, assembly: x?.value === 'all' ? '' : (x?.value ?? '') }))}
          />
        </YStack>
        <YStack flex={1} minWidth={260}>
          <SearchBox value={filter.search} onChange={(value) => setFilter((prevState) => ({ ...prevState, search: value }))} />
        </YStack>
      </XStack>
      <XStack flexWrap="wrap" alignItems={'flex-start'} maxWidth={1200} gap={'$4'} $gtSm={{ gap: '$8' }} justifyContent="center">
        {filteredItems.length ? filteredItems.map((generalConvention, index) => <FormaCard key={index} payload={generalConvention} />) : <EmptyFormaState />}
      </XStack>
    </YStack>
  )
}

export default Section
