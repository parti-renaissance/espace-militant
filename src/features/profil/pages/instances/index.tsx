import React, { useMemo, useState } from 'react'
import { KeyboardAvoidingView, Platform } from 'react-native'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import InfoCard from '@/components/InfoCard/InfoCard'
import InstanceCard from '@/components/InstanceCard/InstanceCard'
import { MessageCard } from '@/components/MessageCard/MessageCard'
import VoxCard from '@/components/VoxCard/VoxCard'
import { useGetInstances, useGetTags } from '@/services/profile/hook'
import { RestInstancesResponse } from '@/services/profile/schema'
import { Info, UserPlus } from '@tamagui/lucide-icons'
import { Link } from 'expo-router'
import { isWeb, YStack } from 'tamagui'
import ScrollView from '../../components/ScrollView'
import ChangeCommitteeModal from './components/ChangeCommittee'
import { DoubleCircle, DoubleDiamond, DoubleTriangle, DoubleSquare } from './components/icons'
import { UserTagEnum } from '@/core/entities/UserProfile'
import ChangeAgoraModal from './components/ChangeAgoraModal'

type Instance = RestInstancesResponse[number]

const isCommittee = (instance: any): instance is Instance & { type: 'committee' } => instance.type === 'committee'
const isAssembly = (instance: any): instance is Instance & { type: 'assembly' } => instance.type === 'assembly'
const isCirconscription = (instance: any): instance is Instance & { type: 'circonscription' } => instance.type === 'circonscription'
const isAgora = (instance: any): instance is Instance & { type: 'agora' } => instance.type === 'agora'

const InstancesScreen = () => {
  const { data } = useGetInstances()
  const { tags } = useGetTags({ tags: [UserTagEnum.SYMPATHISANT] })
  const [openChange, setOpenChange] = useState(false)
  const [openChangeAgora, setOpenChangeAgora] = useState(false)
  const isSympathisant = tags && tags.length > 0
  const [assembly] = data.filter(isAssembly)
  const [committee] = data.filter(isCommittee)
  const [circonscription] = data.filter(isCirconscription)
  const agoras = data.filter(isAgora)

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
        content: <InstanceCard.Content
          title={committee.name}
          description={`${committee.members_count ?? 0} Adhérents`}
          author={
            committee?.manager
              ? {
                name: `${committee?.manager.first_name ?? ''} ${committee?.manager.last_name ?? ''}`,
                avatar: committee?.manager.image_url ?? undefined,
                role: committee?.manager.role ?? undefined,
              }
              : undefined
          }
        />,
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
        content: <InstanceCard.EmptyState message={'Malheureusement, votre Assemblée ne dispose d’aucun comité.'} />,
        footerText: null,
        button: null,
      }
    }
  }, [committee])

  const agorasContent = useMemo(() => {
    if (isSympathisant) {
      return {
        content: (
          <InfoCard theme="yellow" icon={UserPlus} buttonText="J’adhère pour accéder aux agoras" href="/profil/cotisations-et-dons">
            Les agoras sont réservées aux adhérents. Adhérez pour y accéder.
          </InfoCard>
        ),
        footerText: null,
      }
    }

    if (agoras?.length > 0) {
      return {
        content: (
          <YStack gap="$2">
            {agoras.map((agora) => {
              const manager = agora.manager

              return (
                <InstanceCard.Content
                  key={agora.uuid ?? agora.name}
                  title={agora?.name ?? 'Agora sans nom'}
                  description={`${agora?.members_count ?? '-'} membres`}
                  author={
                    manager
                      ? {
                        name: `${manager.first_name ?? ''} ${manager.last_name ?? ''}`,
                        avatar: manager.image_url ?? undefined,
                        role: manager.role ?? undefined,
                      }
                      : undefined
                  }
                />
              )
            })}
          </YStack>
        ),
        footerText: null,
      }
    }

    return {
      content: <InstanceCard.EmptyState message="Vous n’êtes rattaché à aucune agora." />,
      footerText: null,
      button: (
        <VoxButton variant="outlined" onPress={() => setOpenChangeAgora(true)}>
          Rejoindre une agora
        </VoxButton>
      ),
    }
  }, [isSympathisant, agoras])


  return (
    <>
      <ChangeCommitteeModal currentCommitteeUuid={committee?.uuid ?? null} open={openChange} onClose={() => setOpenChange(false)} />
      <ChangeAgoraModal
        currentAgoraUuids={agoras.map((a) => a.uuid).filter((uuid): uuid is string => uuid !== null)}
        open={openChangeAgora}
        onClose={() => setOpenChangeAgora(false)}
      />
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
                <InstanceCard.Content 
                title={assembly.name}
                author={
                  assembly?.manager
                    ? {
                      name: `${assembly?.manager.first_name ?? ''} ${assembly?.manager.last_name ?? ''}`,
                      avatar: assembly?.manager.image_url ?? undefined,
                      role: assembly?.manager.role ?? undefined,
                    }
                    : undefined
                }
                 />
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
                <InstanceCard.Content 
                title={circonscription.name} 
                author={
                  circonscription?.manager
                    ? {
                      name: `${circonscription?.manager.first_name ?? ''} ${circonscription?.manager.last_name ?? ''}`,
                      avatar: circonscription?.manager.image_url ?? undefined,
                      role: circonscription?.manager.role ?? undefined,
                    }
                    : undefined
                }
                />
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

            <InstanceCard
              title={agoras?.length > 1 ? "Mes agoras thématiques" : "Mon agora thématique"}
              icon={DoubleSquare}
              description="Les agoras thématiques sont un espace d’échange et de travail réservé aux adhérents Renaissance."
              headerLeft={isSympathisant ? <VoxCard.AdhLock /> : null}
              footer={
                agorasContent.footerText || agorasContent.button ? (
                  <YStack gap="$medium">
                    {agorasContent.footerText}
                    {agorasContent.button}
                  </YStack>
                ) : null
              }
            >
              {agorasContent.content}
            </InstanceCard>
          </YStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  )
}

export default InstancesScreen
