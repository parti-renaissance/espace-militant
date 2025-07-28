import React, { useState, useEffect } from 'react'
import { YStack, ScrollView, XStack } from 'tamagui'
import SkeCard from '@/components/Skeleton/CardSkeleton'
import Text from '@/components/base/Text'
import { RestGetMessageContentResponse, RestGetMessageResponse } from '@/services/publications/schema'
import PublicationCard from '@/components/Cards/PublicationCard/PublicationCard'
import VoxCard from '@/components/VoxCard/VoxCard'
import { router, useLocalSearchParams } from 'expo-router'
import { ArrowLeft } from '@tamagui/lucide-icons'
import { VoxHeader } from '@/components/Header/Header'
import { useMedia } from 'tamagui'
import CongratulationsModal from '../../components/CongratulationsModal'

interface MessageDetailsScreenProps {
  data?: RestGetMessageResponse
  content?: RestGetMessageContentResponse
  isLoading?: boolean
  error?: Error
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
  return (
    <ScrollView backgroundColor="$surface" flex={1}>

      <YStack gap="$medium" $gtSm={{ maxWidth: 600, width: '100%', marginHorizontal: 'auto'}}>  
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
  return (
    <ScrollView backgroundColor="$surface" flex={1}>

      <YStack gap="$medium" $gtSm={{ maxWidth: 600, width: '100%', marginHorizontal: 'auto'}}>
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

const MessageDetailsScreen: React.FC<MessageDetailsScreenProps> = ({ data, isLoading, error }) => {
  const params = useLocalSearchParams()
  const [showCongratulations, setShowCongratulations] = useState(false)

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
    <ScrollView backgroundColor="$surface" flex={1} contentContainerStyle={{ paddingBottom: 100 }}>
      <YStack gap="$medium" $gtSm={{ maxWidth: 600, width: '100%', marginHorizontal: 'auto'}}>
        <HeaderMesssageDetails />
        <PublicationCard
          showFullContent={true}
          title={data.subject}
          description={data?.json_content}
          author={data.sender}
          uuid={data.uuid}
        />
      </YStack>
      <CongratulationsModal isOpen={showCongratulations} onClose={handleCloseCongratulations} />
    </ScrollView>
  )
}

export default MessageDetailsScreen 