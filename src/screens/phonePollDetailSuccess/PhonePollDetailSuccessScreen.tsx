import React, { FunctionComponent } from 'react'
import { Text, StyleSheet, BackHandler } from 'react-native'
import SafeAreaView from 'react-native-safe-area-view'
import { PhonePollDetailSuccessScreenProps, Screen } from '../../navigation'
import { Colors, Spacing } from '../../styles'
import { PrimaryButton, SecondaryButton } from '../shared/Buttons'
import { VerticalSpacer } from '../shared/Spacer'

const PhonePollDetailSuccessScreen: FunctionComponent<PhonePollDetailSuccessScreenProps> = ({
  navigation,
  route,
}) => {
  React.useLayoutEffect(() => {
    const updateNavigationHeader = () => {
      navigation.setOptions({
        title: route.params.title,
      })
    }

    // Disable back press
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
    )

    updateNavigationHeader()
    return () => backHandler.remove()
  }, [navigation, route.params.title])

  return (
    <SafeAreaView style={styles.container}>
      <Text>PhonePollDetailSuccessScreen</Text>
      <VerticalSpacer spacing={Spacing.margin} />
      <PrimaryButton title="_NOUVEL_APPEL_" />
      <VerticalSpacer spacing={Spacing.margin} />
      <SecondaryButton title="_VOIR_NUMERO_" />
      <VerticalSpacer spacing={Spacing.margin} />
      <SecondaryButton
        title="_TERMINER_"
        onPress={() => navigation.navigate(Screen.phoning)}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.defaultBackground,
    flex: 1,
    paddingHorizontal: Spacing.margin,
  },
})

export default PhonePollDetailSuccessScreen
