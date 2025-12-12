import React from 'react'
import { SafeAreaView, ScrollView, StyleSheet, Text } from 'react-native'
import { TunnelDoorInterlocutorChoiceCard } from '@/screens/doorToDoor/tunnel/interlocutor/TunnelDoorInterlocutorChoiceCard'
import { TunnelDoorInterlocutorChoiceCardViewModel } from '@/screens/doorToDoor/tunnel/interlocutor/TunnelDoorInterlocutorChoiceCardViewModel'
import { useTunnelDoorInterlocutorScreen } from '@/screens/doorToDoor/tunnel/interlocutor/useTunnelDoorInterlocutorScreen.hook'
import LoadingOverlay from '@/screens/shared/LoadingOverlay'
import { StatefulView } from '@/screens/shared/StatefulView'
import { Colors, Spacing, Typography } from '@/styles'
import i18n from '@/utils/i18n'
import { useLocalSearchParams } from 'expo-router'

const TunnelDoorInterlocutorScreen = () => {
  const params = useLocalSearchParams<{ visitStartDateISOString: string }>()
  const { statefulState, isSendingChoice, onChoice } = useTunnelDoorInterlocutorScreen(params.visitStartDateISOString)

  const renderContentComponent = (items: Array<TunnelDoorInterlocutorChoiceCardViewModel>) => (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.title} key={'title'}>
        {i18n.t('doorToDoor.tunnel.interlocutor.title')}
      </Text>
      {items.map((viewModel, index) => (
        <TunnelDoorInterlocutorChoiceCard
          key={viewModel.id}
          style={[styles.card, index === items.length - 1 && styles.cardExpanded]}
          viewModel={viewModel}
          onPress={() => onChoice(viewModel.id)}
        />
      ))}
    </ScrollView>
  )

  return (
    <SafeAreaView style={styles.container}>
      <LoadingOverlay visible={isSendingChoice} />
      <StatefulView state={statefulState} contentComponent={(content) => renderContentComponent(content)} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.defaultBackground,
    flex: 1,
  },
  content: {
    flex: 1,
    marginHorizontal: Spacing.margin,
  },
  card: {
    marginBottom: Spacing.margin,
  },
  cardExpanded: {
    flexGrow: 1,
    flex: 1,
  },
  title: {
    ...Typography.title2,
    marginVertical: Spacing.margin,
  },
})

export default TunnelDoorInterlocutorScreen
