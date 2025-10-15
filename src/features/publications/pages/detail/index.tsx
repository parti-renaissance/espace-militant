import React, { useState, useEffect } from 'react'
import { YStack, ScrollView, XStack } from 'tamagui'
import SkeCard from '@/components/Skeleton/CardSkeleton'
import Text from '@/components/base/Text'
import { RestGetMessageContentResponse, RestGetMessageResponse } from '@/services/publications/schema'
import PublicationCard from '@/components/Cards/PublicationCard/PublicationCard'
import VoxCard from '@/components/VoxCard/VoxCard'
import { router, useLocalSearchParams } from 'expo-router'
import { ArrowLeft, Eye, PieChart, Sparkle } from '@tamagui/lucide-icons'
import { VoxHeader } from '@/components/Header/Header'
import { useMedia } from 'tamagui'
import CongratulationsModal from '../../components/CongratulationsModal'
import { RestPublicationStatsResponse } from '@/services/stats/schema'
import PublicationGlobalStatsCards from './components/PublicationGlobalStatsCards'
import BreadCrumbV2 from '@/components/BreadCrumb/BreadCrumbV2'

interface MessageDetailsScreenProps {
  data?: RestGetMessageResponse
  content?: RestGetMessageContentResponse
  isLoading?: boolean
  error?: Error
  stats?: RestPublicationStatsResponse
}

interface MessageDetailsScreenDenyProps {
  error: Error
}

export const HeaderMesssageDetails: React.FC = () => {

  const media = useMedia()
  const handleBack = () => {
    router.replace({ pathname: '/' })
  }

  if (media.sm) {
    return null
  }

  return (
    <YStack flex={1} position="relative" mt="$xlarge">
      <XStack>
        <VoxHeader.LeftButton
          icon={ArrowLeft}
          onPress={handleBack}
          backTitle={'Retour'}
        />
      </XStack>
    </YStack>
  )
}

export const MessageDetailsScreenSkeleton: React.FC = () => {
  const media = useMedia()

  return (
    <ScrollView backgroundColor="$surface" flex={1}>
      <YStack gap="$medium" maxWidth={media.gtSm ? 600 : undefined} width={media.gtSm ? '100%' : undefined} marginHorizontal={media.gtSm ? 'auto' : undefined}>
        <HeaderMesssageDetails />
        <SkeCard>
          <SkeCard.Content>
            <SkeCard.Chip />
            <SkeCard.Author />
            <SkeCard.Title />
            <SkeCard.Separator />
            <SkeCard.Description />
            <SkeCard.Image />
            <SkeCard.Description />
          </SkeCard.Content>
        </SkeCard>
      </YStack>
    </ScrollView>
  )
}

export const MessageDetailsScreenDeny: React.FC<MessageDetailsScreenDenyProps> = ({ error }) => {
  const media = useMedia()

  return (
    <ScrollView backgroundColor="$surface" flex={1}>
      <YStack gap="$medium" maxWidth={media.gtSm ? 600 : undefined} width={media.gtSm ? '100%' : undefined} marginHorizontal={media.gtSm ? 'auto' : undefined}>
        <HeaderMesssageDetails />
        <VoxCard>
          <VoxCard.Content>
            <YStack gap="$medium" alignItems="center">
              <Text.LG semibold color="$red10">
                Accès refusé
              </Text.LG>
              <Text.MD secondary textAlign="center">
                {error.message}
              </Text.MD>
            </YStack>
          </VoxCard.Content>
        </VoxCard>
      </YStack>
    </ScrollView>
  )
}

const MessageDetailsScreen: React.FC<MessageDetailsScreenProps> = ({ data, isLoading, error, stats }) => {
  const params = useLocalSearchParams()
  const media = useMedia()
  const [showCongratulations, setShowCongratulations] = useState(false)
  const [activeSection, setActiveSection] = useState('read')

  useEffect(() => {
    if (params.congratulations) {
      setShowCongratulations(true)
    }
  }, [params.congratulations])

  const handleCloseCongratulations = () => {
    setShowCongratulations(false)
  }

  if (isLoading) {
    return <MessageDetailsScreenSkeleton />
  }

  if (error || !data) {
    return <MessageDetailsScreenDeny error={error || new Error('Impossible de charger le message')} />
  }

  return (
    <>
      {(stats && media.sm) && (
        <YStack gap="$medium" >
          <BreadCrumbV2 items={[{ id: "read", label: 'Lecture', icon: Eye }, { id: "stats", label: 'Statistiques', icon: PieChart, color: '$purple5' }]} value={activeSection} onChange={(v) => { setActiveSection(v) }} />
        </YStack>
      )}
      <ScrollView backgroundColor="$surface" flex={1} contentContainerStyle={{ paddingBottom: 100 }}>
        <YStack gap="$medium" maxWidth={media.gtSm ? 600 : undefined} width={media.gtSm ? '100%' : undefined} marginHorizontal={media.gtSm ? 'auto' : undefined}>
          <HeaderMesssageDetails />
          {
            (activeSection === 'read' || media.gtSm) && (
              <YStack gap="$medium" pt={media.sm ? '$medium' : 0}>
                <PublicationCard
                  showFullContent={true}
                  title={data.subject}
                  description={data?.json_content}
                  author={data.sender}
                  uuid={data.uuid}
                />
              </YStack>
            )
          }

          {stats && (activeSection === 'stats' || media.gtSm) && (
            <YStack gap={media.sm ? 0 : "$medium"} pt={media.sm ? 0 : '$large'}>
              <XStack gap="$small" px="$medium" display={media.sm ? 'none' : 'flex'}>
                <PieChart size={20} />
                <Text.LG semibold>Statistiques de publication</Text.LG>
              </XStack>
              <VoxCard bg="$purple1" borderWidth={0}>
                <VoxCard.Content>
                  <XStack gap="$medium" alignItems="center">
                  <Text.SM color="$purple6">
                    Vous pouvez voir ces statistiques uniquement car vous êtes Cadre avec un rôle au sein de l’instance qui l’a envoyée.
                  </Text.SM>
                  <YStack>
                    <Sparkle size={20} color="$purple6" />
                  </YStack>
                  </XStack>
                  
                </VoxCard.Content>
              </VoxCard>
              <PublicationGlobalStatsCards stats={stats} />
            </YStack>
          )
          }
        </YStack>
        <CongratulationsModal isOpen={showCongratulations} onClose={handleCloseCongratulations} />
      </ScrollView>
    </>
  )
}

export default MessageDetailsScreen 