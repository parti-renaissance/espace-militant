import React, { useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useCampaignStore } from '@/data/store/phoning'
import { PhoningScoreboardRowViewModelMapper } from '@/screens/phoningCampaignScoreboard/PhoningScoreboardRowViewModelMapper'
import { PhoningCampaignRankingView } from '@/screens/shared/PhoningCampaignRankingView'
import { Colors, Spacing } from '@/styles'
import i18n from '@/utils/i18n'
import { useNavigation } from 'expo-router'

const PhoningCampaignScoreboardScreen = () => {
  const navigation = useNavigation()
  const { campaign } = useCampaignStore()

  useEffect(() => {
    navigation.setOptions({
      title: i18n.t('phoning.scoreboard.title'),
    })
  }, [navigation])

  if (!campaign) {
    return (
      <View style={styles.container}>
        <Text>Aucune campagne trouvée</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <PhoningCampaignRankingView viewModel={PhoningScoreboardRowViewModelMapper.map(campaign.scoreboard)} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.defaultBackground,
    flex: 1,
    padding: Spacing.margin,
  },
})

export default PhoningCampaignScoreboardScreen
