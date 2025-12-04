import React from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { useCampaignStore } from '@/data/store/phoning'
import { BorderlessButton, PrimaryButton } from '@/screens/shared/Buttons'
import { Colors, Spacing, Styles, Typography } from '@/styles'
import i18n from '@/utils/i18n'
import Markdown from '@ronradtke/react-native-markdown-display'
import { router, Stack } from 'expo-router'

const PhoningCampaignBriefScreen = () => {
  const { campaign } = useCampaignStore()
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: campaign.title }} />
      <ScrollView contentContainerStyle={styles.markdownContainer}>
        <Markdown style={Typography.markdownStyle} mergeStyle={false}>
          {campaign.brief}
        </Markdown>
      </ScrollView>
      <View style={styles.bottomContainer}>
        <PrimaryButton
          title={i18n.t('phoning.brief.call')}
          onPress={() =>
            router.push({
              pathname: '/(tabs)/actions/phoning/session/[device]/',
              params: { device: 'current' },
            })
          }
        />
        <BorderlessButton
          title={i18n.t('phoning.brief.call_from_other_device')}
          textStyle={styles.linkText}
          onPress={() =>
            router.push({
              pathname: '/(tabs)/actions/phoning/session/[device]/',
              params: { device: 'external' },
            })
          }
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  bottomContainer: {
    ...Styles.topElevatedContainerStyle,
    backgroundColor: Colors.defaultBackground,
    paddingHorizontal: Spacing.margin,
    paddingTop: Spacing.margin,
  },
  container: {
    backgroundColor: Colors.defaultBackground,
    flex: 1,
  },
  markdownContainer: {
    padding: Spacing.margin,
  },
  linkText: {
    ...Styles.seeMoreButtonTextStyle,
  },
})

export default PhoningCampaignBriefScreen
