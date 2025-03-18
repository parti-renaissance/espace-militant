import React, { useMemo, useState } from 'react'
import { KeyboardAvoidingView, Platform } from 'react-native'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import InfoCard from '@/components/InfoCard/InfoCard'
import { MessageCard } from '@/components/MessageCard/MessageCard'
import VoxCard from '@/components/VoxCard/VoxCard'
import { useGetInstances, useGetTags } from '@/services/profile/hook'
import { RestInstancesResponse } from '@/services/profile/schema'
import { Info, UserPlus } from '@tamagui/lucide-icons'
import { Link } from 'expo-router'
import { isWeb, YStack } from 'tamagui'
import InstanceCard from '../../../../components/InstanceCard/InstanceCard'
import ScrollView from '../../components/ScrollView'
import ChangeCommitteeModal from './components/ChangeCommittee'
import { DoubleCircle, DoubleDiamond, DoubleTriangle } from './components/icons'

type Instance = RestInstancesResponse[number]

const isCommittee = (instance: any): instance is Instance & { type: 'committee' } => instance.type === 'committee'
const isAssembly = (instance: any): instance is Instance & { type: 'assembly' } => instance.type === 'assembly'
const isCirconscription = (instance: any): instance is Instance & { type: 'circonscription' } => instance.type === 'circonscription'

const InstancesScreen = () => {
  const { data } = useGetInstances()
  const { tags } = useGetTags({ tags: ['sympathisant'] })
  const [openChange, setOpenChange] = useState(false)
  const isSympathisant = tags && tags.length > 0
  const [assembly] = data.filter(isAssembly)
  const [committee] = data.filter(isCommittee)
  const [circonscription] = data.filter(isCirconscription)

  const committeeContent = useMemo(() => {
    if (isSympathisant) {
      return {
        content: (
          <InfoCard theme="yellow" icon={UserPlus} buttonText="J’adhère pour devenir membre" href="/profil/cotisations-et-dons">
            La vie militante liée aux comités est réservée aux adhérents. Adhérez pour devenir membre d’un comité.
          </InfoCard>
        ),
        footerText: null,
        button: null,
      }
    }
    if (committee && committee.name) {
      return {
        content: <InstanceCard.Content title={committee.name} description={`${committee.members_count ?? 0} Adhérents`} />,
        footerText: <Text.P>Vous êtes rattaché à ce comité par défaut. Vous pouvez en changer pour un autre comité de votre département.</Text.P>,
        button: (
          <>
            <VoxButton variant="outlined" onPress={() => setOpenChange(true)} disabled={!committee.can_change_committee}>
              Changer de comité
            </VoxButton>
          </>
        ),
      }
    } else if (committee && !committee.uuid && committee.assembly_committees_count > 0) {
      return {
        content: <InstanceCard.EmptyState message={'Vous n’êtes rattaché à aucun comité.'} />,
        footerText: <Text.P>Vous pouvez choisir parmi les {committee.assembly_committees_count} comités de votre Assemblée.</Text.P>,
        button: (
          <VoxButton variant="outlined" onPress={() => setOpenChange(true)} disabled={!committee.can_change_committee}>
            Choisir parmi {committee.assembly_committees_count} comités
          </VoxButton>
        ),
      }
    } else {
      return {
        content: <InstanceCard.EmptyState message={'Malheureusement, votre comité ne dispose d’aucun comité.'} />,
        footerText: null,
        button: null,
      }
    }
  }, [committee])

  return (
    <>
      <ChangeCommitteeModal currentCommitteeUuid={committee?.uuid ?? null} open={openChange} onClose={() => setOpenChange(false)} />
      <KeyboardAvoidingView behavior={Platform.OS === 'android' ? 'height' : 'padding'} style={{ flex: 1 }} keyboardVerticalOffset={100}>
        <ScrollView>
          <YStack gap="$medium" flex={1} $sm={{ pt: 8, gap: 8 }}>
            <InstanceCard
              title="Mon assemblée"
              icon={DoubleCircle}
              description="Les Assemblées départementales, des Outre-Mer et celle des Français de l’Étranger sont le visage de notre parti à l’échelle locale. Elles sont pilotées par un bureau et leur Président, élus directement par les adhérents."
              footer={
                <Text.P>
                  Cette Assemblée vous a été attribuée en fonction de votre lieu de résidence.{' '}
                  <Link href="/(app)/profil/informations-personnelles" asChild={!isWeb}>
                    <Text.P link>Modifiez votre adresse postale</Text.P>
                  </Link>{' '}
                  pour en changer.
                </Text.P>
              }
            >
              {assembly ? (
                <InstanceCard.Content title={assembly.name} />
              ) : (
                <InstanceCard.EmptyState message="Vous n’avez pas d’Assemblée rattachée. Il s’agit certainement d’un bug, contactez adherents@parti-renaissance.fr." />
              )}
            </InstanceCard>
            <InstanceCard
              title="Mon délégué de circonscription"
              icon={DoubleTriangle}
              description="Chaque circonscription législative peut avoir un délégué de circonscription. Il s’agit du Député Ensemble de la circonscription ou d’un adhérent nommé par le bureau de l’Assemblée."
              footer={
                <YStack>
                  <Text.P>
                    Cette circonscription vous a été attribuée en fonction de votre lieu de résidence.{' '}
                    <Link href="/(app)/profil/informations-personnelles" asChild={!isWeb}>
                      <Text.P link>Modifiez votre adresse postale</Text.P>
                    </Link>{' '}
                    pour en changer.
                  </Text.P>
                </YStack>
              }
            >
              {circonscription ? (
                <InstanceCard.Content title={circonscription.name} />
              ) : (
                <InstanceCard.EmptyState message="Vous n’avez pas de circonscription rattachée." />
              )}
            </InstanceCard>

            <InstanceCard
              title="Mon comité"
              icon={DoubleDiamond}
              description="Échelon de proximité, les comités locaux sont le lieu privilégié de l’action militante. Ils animent la vie du parti et contribuent à notre implantation territoriale."
              headerLeft={isSympathisant ? <VoxCard.AdhLock /> : null}
              footer={
                committeeContent.footerText || committeeContent.button ? (
                  <YStack gap="$medium">
                    {committeeContent.footerText}
                    {committee.message ? (
                      <MessageCard theme="yellow" iconLeft={Info}>
                        {committee.message}
                      </MessageCard>
                    ) : null}
                    {committeeContent.button}
                  </YStack>
                ) : null
              }
            >
              {committeeContent.content}
            </InstanceCard>
          </YStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  )
}

export default InstancesScreen
