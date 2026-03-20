import React from 'react'
import { AppState, StyleSheet, Text, View } from 'react-native'
import * as Linking from 'expo-linking'
import { Colors, Spacing, Typography } from '../../styles'
import i18n from '../../utils/i18n'
import { BorderlessButton } from '../shared/Buttons'
import CircularIcon from '../shared/CircularIcon'

import mapIcon from '../../assets/images/mapIcon.png'

type Props = {
  onAuthorizationRequest: () => void
}

const LocationAuthorization = ({ onAuthorizationRequest }: Props) => {
  const appState = React.useRef(AppState.currentState)
  const goToDeviceSettings = () => {
    Linking.openSettings()
  }

  React.useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        onAuthorizationRequest()
      }

      appState.current = nextAppState
    })

    return () => {
      subscription.remove()
    }
  }, [])
  return (
    <View style={styles.container}>
      <CircularIcon style={styles.phone} source={mapIcon} />
      <Text style={styles.title}>{i18n.t('doorToDoor.location.title')}</Text>
      <Text style={styles.subtitle}>{i18n.t('doorToDoor.location.subtitle')}</Text>
      <BorderlessButton onPress={goToDeviceSettings} title={i18n.t('doorToDoor.location.cta')} textStyle={styles.authorise} />
    </View>
  )
}

const styles = StyleSheet.create({
  authorise: {
    ...Typography.title2,
    color: Colors.primaryColor,
    marginTop: Spacing.margin,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  phone: {
    alignSelf: 'center',
    marginBottom: Spacing.extraExtraLargeMargin,
  },
  subtitle: {
    ...Typography.lightCaption1,
    padding: Spacing.margin,
    textAlign: 'center',
  },
  title: {
    ...Typography.title2,
    textAlign: 'center',
  },
})

export default LocationAuthorization
