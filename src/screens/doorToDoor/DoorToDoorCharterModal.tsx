import React, { FC } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Markdown from 'react-native-markdown-display'
import DoorToDoorRepository from '../../data/DoorToDoorRepository'
import { Colors, Spacing, Styles, Typography } from '../../styles'
import i18n from '../../utils/i18n'
import { AlertUtils } from '../shared/AlertUtils'
import { PrimaryButton } from '../shared/Buttons'
import { CloseButton } from '../shared/NavigationHeaderButton'

type Props = {
  charter: string
  onAcceptCharter: () => void
  onDismissModal: () => void
}

const DoorToDoorCharterModal: FC<Props> = (props) => {
  const acceptCharter = () => {
    DoorToDoorRepository.getInstance()
      .acceptDoorToDoorCharter()
      .then(() => props.onAcceptCharter())
      .catch((error: Error) => {
        AlertUtils.showNetworkAlert(error, acceptCharter)
      })
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <CloseButton onPress={props.onDismissModal} />
      </View>
      <ScrollView contentContainerStyle={styles.markdownContainer}>
        <Markdown style={Typography.markdownStyle} mergeStyle={false}>
          {props.charter}
        </Markdown>
      </ScrollView>
      <View style={styles.bottomContainer}>
        <PrimaryButton
          title={i18n.t('doorToDoor.charter.accept')}
          onPress={acceptCharter}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  bottomContainer: {
    ...Styles.topElevatedContainerStyle,
    backgroundColor: Colors.defaultBackground,
    padding: Spacing.margin,
  },
  markdownContainer: {
    padding: Spacing.margin,
  },
  container: {
    backgroundColor: Colors.defaultBackground,
    flex: 1,
  },
  headerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  headerTitle: {
    ...Typography.title2,
    textAlign: 'center',
  },
})

export default DoorToDoorCharterModal
