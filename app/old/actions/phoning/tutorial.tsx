import React, { useCallback, useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import PhoningCampaignRepository from '@/data/PhoningCampaignRepository'
import { StatefulView } from '@/screens/shared/StatefulView'
import { ViewState } from '@/screens/shared/ViewState'
import { ViewStateUtils } from '@/screens/shared/ViewStateUtils'
import { Colors, Spacing, Typography } from '@/styles'
import i18n from '@/utils/i18n'
import { useFocusEffect } from '@react-navigation/native'
import Markdown from '@ronradtke/react-native-markdown-display'
import { Stack } from 'expo-router'

export interface TutorialResources {
  content: string
}

const PhoningTutorialScreen = () => {
  const [statefulState, setStatefulState] = useState<ViewState<TutorialResources>>(ViewState.Loading())

  const fetchData = useCallback(() => {
    setStatefulState(ViewState.Loading())
    PhoningCampaignRepository.getInstance()
      .getPhoningTutorial()
      .then((markdown) => {
        setStatefulState(ViewState.Content({ content: markdown }))
      })
      .catch((error) => {
        setStatefulState(ViewStateUtils.networkError(error, fetchData))
      })
  }, [])

  useFocusEffect(fetchData)

  const TutorialContent = (resources: TutorialResources) => {
    return (
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Markdown style={Typography.markdownStyle} mergeStyle={false}>
          {resources.content}
        </Markdown>
      </ScrollView>
    )
  }
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: i18n.t('phoning.tutorial.title') }} />
      <StatefulView contentComponent={TutorialContent} state={statefulState} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.defaultBackground,
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.margin,
  },
})

export default PhoningTutorialScreen
