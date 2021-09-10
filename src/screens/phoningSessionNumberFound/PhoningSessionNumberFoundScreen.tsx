import React, { FunctionComponent } from 'react'
import { Text, StyleSheet } from 'react-native'
import SafeAreaView from 'react-native-safe-area-view'
import { PhoningSessionNumberFoundScreenProps, Screen } from '../../navigation'
import { Colors, Spacing } from '../../styles'
import { PrimaryButton } from '../shared/Buttons'
import { VerticalSpacer } from '../shared/Spacer'

const PhoningSessionNumberFoundScreen: FunctionComponent<PhoningSessionNumberFoundScreenProps> = ({
  navigation,
  route,
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>PhoningSessionNumberFoundScreen</Text>
      <VerticalSpacer spacing={Spacing.margin} />
      <PrimaryButton
        title="_NEXT_"
        onPress={() =>
          navigation.navigate(Screen.phonePollDetail, {
            campaignId: route.params.campaignId,
          })
        }
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

export default PhoningSessionNumberFoundScreen
