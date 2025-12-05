import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TunnelDoorOpeningChoiceCard } from '@/screens/doorToDoor/tunnel/opening/TunnelDoorOpeningChoiceCard'
import { TunnelDoorOpeningChoiceCardViewModel } from '@/screens/doorToDoor/tunnel/opening/TunnelDoorOpeningChoiceCardViewModel'
import { useTunnelDoorOpeningScreen } from '@/screens/doorToDoor/tunnel/opening/useTunnelDoorOpeningScreen.hook'
import LoadingOverlay from '@/screens/shared/LoadingOverlay'
import { StatefulView } from '@/screens/shared/StatefulView'
import { Colors, Spacing, Typography } from '@/styles'
import i18n from '@/utils/i18n'

const TunnelDoorOpeningScreen = () => {
  const { statefulState, isSendingChoice, onStatusSelected } = useTunnelDoorOpeningScreen()

  const ContentComponent = (viewModels: TunnelDoorOpeningChoiceCardViewModel[]) => {
    return (
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{i18n.t('doorToDoor.tunnel.opening.title')}</Text>
        {viewModels.map((viewModel) => {
          return <TunnelDoorOpeningChoiceCard key={viewModel.id} style={styles.card} viewModel={viewModel} onPress={() => onStatusSelected(viewModel.id)} />
        })}
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <LoadingOverlay visible={isSendingChoice} />
      <StatefulView state={statefulState} contentComponent={ContentComponent} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.defaultBackground,
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: Spacing.margin,
  },
  title: {
    ...Typography.title3,
    marginBottom: Spacing.margin,
  },
  card: {
    flex: 1,
  },
})

export default TunnelDoorOpeningScreen
