import React, { FunctionComponent } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Colors, Spacing, Typography } from '../../styles'
import i18n from '../../utils/i18n'
import { PrimaryButton } from './Buttons'
import CircularIcon from './CircularIcon'
import { ViewStateError } from './ViewState'

import networkErrorIcon from '../../assets/images/networkErrorIcon.png'

type Props = Readonly<{
  state: ViewStateError
}>

const ErrorView: FunctionComponent<Props> = (props) => {
  const currentState = props.state
  return (
    <View style={styles.container}>
      <CircularIcon
        style={styles.icon}
        source={networkErrorIcon}
      />
      <Text style={styles.title}>{i18n.t('common.error_title')}</Text>
      <Text style={styles.text}>{currentState.errorMessage}</Text>
      {currentState.onRetry !== undefined ? (
        <PrimaryButton
          title={i18n.t('common.error_reload')}
          onPress={currentState.onRetry}
          style={styles.retryButton}
        />
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: Colors.defaultBackground,
  },
  icon: {
    alignSelf: 'center',
    marginHorizontal: Spacing.margin,
  },
  retryButton: {
    marginHorizontal: Spacing.margin,
    marginTop: Spacing.mediumMargin,
  },
  text: {
    ...Typography.body,
    alignSelf: 'center',
    marginHorizontal: Spacing.margin,
    marginTop: Spacing.unit,
    textAlign: 'center',
  },
  title: {
    ...Typography.title,
    alignSelf: 'center',
    marginHorizontal: Spacing.margin,
    marginTop: Spacing.mediumMargin,
  },
})

export default ErrorView
