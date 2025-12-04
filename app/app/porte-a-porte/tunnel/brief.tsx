import React, { useLayoutEffect } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useDtdTunnelStore } from '@/data/store/door-to-door'
import { DoorToDoorBriefViewModel } from '@/screens/doorToDoor/tunnel/brief/DoorToDoorBriefViewModel'
import { useDoorToDoorBriefScreen } from '@/screens/doorToDoor/tunnel/brief/useDoorToDoorBriefScreen.hook'
import { PrimaryButton } from '@/screens/shared/Buttons'
import { CloseButton } from '@/screens/shared/NavigationHeaderButton'
import { StatefulView } from '@/screens/shared/StatefulView'
import { Colors, Spacing, Typography } from '@/styles'
import i18n from '@/utils/i18n'
import Markdown from '@ronradtke/react-native-markdown-display'
import { useNavigation } from 'expo-router'

const DoorToDoorBriefScreen = () => {
  const navigation = useNavigation()
  const { tunnel } = useDtdTunnelStore()
  const { statefulState, onAction } = useDoorToDoorBriefScreen(tunnel.campaignId, tunnel.buildingParams, tunnel.canCloseFloor)

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <CloseButton onPress={() => navigation.goBack()} />,
    })
  }, [navigation])

  const TutorialContent = (viewModel: DoorToDoorBriefViewModel) => {
    return (
      <>
        <ScrollView style={styles.contentContainer}>
          <Text style={styles.title}>{i18n.t('doorToDoor.tunnel.door.tutorial.title')}</Text>
          <Markdown style={Typography.markdownStyle} mergeStyle={false}>
            {viewModel.markdown}
          </Markdown>
        </ScrollView>
        <View style={styles.bottomContainer}>
          <PrimaryButton title={i18n.t('doorToDoor.tunnel.door.tutorial.action')} onPress={onAction} />
        </View>
      </>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatefulView contentComponent={TutorialContent} state={statefulState} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  bottomContainer: {
    backgroundColor: Colors.defaultBackground,
    paddingHorizontal: Spacing.margin,
    padding: Spacing.margin,
  },
  container: {
    backgroundColor: Colors.defaultBackground,
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.margin,
  },
  title: {
    ...Typography.largeTitle,
  },
})

export default DoorToDoorBriefScreen
