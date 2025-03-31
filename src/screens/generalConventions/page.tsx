import React from 'react'
import AssemblySelect from '@/components/AssemblySelect/AssemblySelect'
import Text from '@/components/base/Text'
import SearchBox from '@/components/Search/SearchBox'
import { GeneralConventionsDenyCard } from '@/screens/generalConventions/components/DenyCard'
import Section from '@/screens/generalConventions/components/Section'
import { useDataStore } from '@/screens/generalConventions/store'
import { useGetSuspenseProfil } from '@/services/profile/hook'
import { Image, XStack, YStack } from 'tamagui'
import type { GeneralConventionScreenProps } from './types'

const GeneralConventionScreen: GeneralConventionScreenProps = () => {
  const { data: user } = useGetSuspenseProfil()
  const isAdherent = user?.tags?.find((tag) => tag.type === 'adherent')
  const { filter, setFilter } = useDataStore()

  const header = (
    <>
      <Image source={require('@/assets/illustrations/EtatsGeneraux-hd.png')} objectFit={'contain'} height={140} width={250} />

      <Text.MD fontSize={'$3'} maxWidth={550} textAlign={'center'} fontWeight={600} color="white">
        Consultez l’ensemble des remontées des États généraux faites par nos instances internes : Assemblées départementales, Circonscriptions et Comités
        locaux.
      </Text.MD>
    </>
  )

  return isAdherent ? (
    <Section
      filter={filter}
      headerComponent={
        <YStack flex={1} alignItems={'center'} gap={'$6'} $gtSm={{ gap: '$8' }}>
          {header}
          <XStack gap="$6" flexWrap="wrap" $gtSm={{ gap: '$8', flexWrap: 'nowrap', maxWidth: 550 }}>
            <YStack flex={1} minWidth={260}>
              <AssemblySelect
                label="Département"
                resetable={!!filter.assembly && filter.assembly !== 'all'}
                size="sm"
                id="filter-dept"
                color="white"
                value={filter.assembly}
                onDetailChange={(x) => {
                  setFilter({ ...filter, assembly: x === undefined ? 'all' : (x?.value ?? '') })
                }}
              />
            </YStack>
            <YStack flex={1} minWidth={260}>
              <SearchBox value={filter.search} onChange={(value) => setFilter({ ...filter, search: value })} />
            </YStack>
          </XStack>
        </YStack>
      }
    />
  ) : (
    <>
      {header}
      <GeneralConventionsDenyCard topVisual={0} />
    </>
  )
}

export default GeneralConventionScreen
