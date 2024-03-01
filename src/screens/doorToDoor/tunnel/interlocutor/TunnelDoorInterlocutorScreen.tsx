import React, { FunctionComponent } from 'react'
import { SafeAreaView, StyleSheet, Text } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { DoorToDoorTunnelModalNavigatorScreenProps } from '../../../../navigation/doorToDoorTunnelModal/DoorToDoorTunnelModalNavigatorScreenProps'
import { Colors, Spacing, Typography } from '../../../../styles'
import i18n from '../../../../utils/i18n'
import LoadingOverlay from '../../../shared/LoadingOverlay'
import { StatefulView } from '../../../shared/StatefulView'
import { TunnelDoorInterlocutorChoiceCard } from './TunnelDoorInterlocutorChoiceCard'
import { TunnelDoorInterlocutorChoiceCardViewModel } from './TunnelDoorInterlocutorChoiceCardViewModel'
import { useTunnelDoorInterlocutorScreen } from './useTunnelDoorInterlocutorScreen.hook'

type TunnelDoorInterlocutorScreenProps =
  DoorToDoorTunnelModalNavigatorScreenProps<'TunnelDoorInterlocutor'>

const TunnelDoorInterlocutorScreen: FunctionComponent<
  TunnelDoorInterlocutorScreenProps
> = ({ route }) => {
  const { statefulState, isSendingChoice, onChoice } =
    useTunnelDoorInterlocutorScreen(
      route.params.campaignId,
      route.params.buildingParams,
      route.params.visitStartDateISOString,
    )

  const renderContentComponent = (
    items: Array<TunnelDoorInterlocutorChoiceCardViewModel>,
  ) => (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.title} key={'title'}>
        {i18n.t('doorToDoor.tunnel.interlocutor.title')}
      </Text>
      {items.map((viewModel, index) => (
        <TunnelDoorInterlocutorChoiceCard
          key={viewModel.id}
          style={[
            styles.card,
            index === items.length - 1 && styles.cardExpanded,
          ]}
          viewModel={viewModel}
          onPress={() => onChoice(viewModel.id)}
        />
      ))}
    </ScrollView>
  )

  return (
    <SafeAreaView style={styles.container}>
      <LoadingOverlay visible={isSendingChoice} />
      <StatefulView
        state={statefulState}
        contentComponent={(content) => renderContentComponent(content)}
      />
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
