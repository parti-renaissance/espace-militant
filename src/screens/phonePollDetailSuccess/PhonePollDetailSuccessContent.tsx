import React, { FunctionComponent } from 'react'
import { StyleSheet, View } from 'react-native'
import { Spacing } from '../../styles'
import i18n from '../../utils/i18n'
import { PrimaryButton, SecondaryButton } from '../shared/Buttons'
import CircularIcon from '../shared/CircularIcon'
import { VerticalSpacer } from '../shared/Spacer'
import { PhonePollDetailSuccessProgressContent } from './PhonePollDetailSuccessProgressContent'
import { PhonePollDetailSuccessRowSuccessViewModel } from './PhonePollDetailSuccessViewModel'

import imageMerci from '../../assets/images/imageMerci.png'

type Props = Readonly<{
  viewModel: PhonePollDetailSuccessRowSuccessViewModel
  onNewCall: () => void
  onFinish: () => void
}>

export const PhonePollDetailSuccessContent: FunctionComponent<Props> = ({
  viewModel,
  onNewCall,
  onFinish,
}) => {
  return (
    <>
      <View style={styles.content}>
        <PhonePollDetailSuccessProgressContent viewModel={viewModel} />
      </View>
      <VerticalSpacer spacing={Spacing.margin} />
      <CircularIcon
        style={styles.image}
        source={imageMerci}
      />
      <View style={styles.content}>
        <VerticalSpacer spacing={Spacing.margin} />
        <PrimaryButton
          title={i18n.t('phoningsession.new_call')}
          onPress={() => onNewCall()}
        />
        <VerticalSpacer spacing={Spacing.margin} />
        <SecondaryButton
          title={i18n.t('phoningsession.end_session')}
          onPress={() => onFinish()}
        />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Spacing.margin,
  },
  image: {
    marginBottom: Spacing.margin,
    marginTop: Spacing.margin,
  },
})
