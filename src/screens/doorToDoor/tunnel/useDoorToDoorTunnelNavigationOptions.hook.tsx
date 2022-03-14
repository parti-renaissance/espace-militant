import { NavigationProp } from '@react-navigation/native'
import React from 'react'
import { useCallback, useEffect } from 'react'
import { Alert, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { Colors, Spacing, Typography } from '../../../styles'
import i18n from '../../../utils/i18n'
import { useBackHandler } from '../../shared/useBackHandler.hook'

export function useDoorToDoorTunnelNavigationOptions(
  navigation: NavigationProp<any>,
) {
  const askConfirmationBeforeLeaving = useCallback(() => {
    Alert.alert(
      i18n.t('doorToDoor.tunnel.leave_alert.title'),
      i18n.t('doorToDoor.tunnel.leave_alert.message'),
      [
        {
          text: i18n.t('doorToDoor.tunnel.leave_alert.action'),
          onPress: () => navigation.getParent()?.goBack(),
          style: 'destructive',
        },
        {
          text: i18n.t('doorToDoor.tunnel.leave_alert.cancel'),
          style: 'cancel',
        },
      ],
      { cancelable: false },
    )
  }, [navigation])

  useBackHandler(askConfirmationBeforeLeaving)

  useEffect(() => {
    navigation.setOptions({
      title: '',
      headerBackTitleVisible: false,
      headerRight: () => (
        <TouchableOpacity
          style={styles.navigation}
          onPress={() => {
            askConfirmationBeforeLeaving()
          }}
        >
          <Text style={styles.navigationText}>
            {i18n.t('doorToDoor.tunnel.exit')}
          </Text>
        </TouchableOpacity>
      ),
    })
  }, [askConfirmationBeforeLeaving, navigation])
}

const styles = StyleSheet.create({
  navigation: {
    paddingHorizontal: Spacing.margin,
  },
  navigationText: {
    ...Typography.callout,
    color: Colors.primaryColor,
  },
})