import React, { FunctionComponent } from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { Colors, Spacing, Typography } from '../../../styles'
import i18n from '../../../utils/i18n'
import { PrimaryButton } from '../../shared/Buttons'
import CardView from '../../shared/CardView'
import { HorizontalSeparator } from '../../shared/HorizontalSeparator'
import ProgressBar from '../../shared/ProgressBar'
import { VerticalSpacer } from '../../shared/Spacer'
import { TouchablePlatform } from '../../shared/TouchablePlatform'

import disclosureIndicator from '../../../assets/images/disclosureIndicator.png'

type Props = Readonly<{
  viewModel: PhoningCampaignRowViewModel
  onCallButtonPressed: () => void
  onRankButtonPressed: () => void
}>

export interface PhoningCampaignRowViewModel {
  id: string
  title: string
  subtitle: string
  calledCount: number
  numberOfPersonToCall: number
  rank: number
}

const PhoningCampaignRow: FunctionComponent<Props> = ({
  viewModel,
  onCallButtonPressed,
  onRankButtonPressed,
}) => {
  return (
    <CardView
      style={styles.cardView}
      backgroundColor={Colors.defaultBackground}
    >
      <>
        <View style={styles.informationContainer}>
          <Text style={styles.title}>{viewModel.title}</Text>
          <VerticalSpacer spacing={Spacing.unit} />
          <Text style={styles.body} numberOfLines={3}>
            {viewModel.subtitle}
          </Text>
          <VerticalSpacer spacing={Spacing.unit} />
          <Text style={styles.caption}>
            {i18n.t('phoning.callcontact.progressformat', {
              count: viewModel.calledCount,
              done: viewModel.calledCount,
              total: viewModel.numberOfPersonToCall,
            })}
          </Text>
          <ProgressBar
            progress={viewModel.calledCount / viewModel.numberOfPersonToCall}
            color={Colors.accent}
          />
          <VerticalSpacer spacing={Spacing.unit} />
        </View>
        <TouchablePlatform
          style={styles.scoreboardButton}
          touchHighlight={Colors.touchHighlight}
          onPress={onRankButtonPressed}
        >
          <View style={styles.scoreboardButtonContainer}>
            <Text style={styles.scoreboardText}>
              {i18n.t('phoning.position', {
                count: viewModel.rank,
                position: viewModel.rank,
              })}
            </Text>
            <Image
              style={styles.scoreboardImage}
              source={disclosureIndicator}
            />
          </View>
        </TouchablePlatform>
        <View style={styles.buttonContainer}>
          <HorizontalSeparator />
          <VerticalSpacer spacing={Spacing.margin} />
          <PrimaryButton
            buttonStyle={styles.callButton}
            title={i18n.t('phoning.campaign.action')}
            onPress={onCallButtonPressed}
            shape={'rounded'}
          />
        </View>
      </>
    </CardView>
  )
}

const styles = StyleSheet.create({
  body: {
    ...Typography.body,
  },
  buttonContainer: {
    marginBottom: Spacing.margin,
    marginHorizontal: Spacing.margin,
  },
  callButton: {
    paddingVertical: Spacing.unit,
  },
  caption: {
    ...Typography.caption1,
    color: Colors.lightText,
    paddingBottom: Spacing.unit,
  },
  cardView: {
    marginVertical: Spacing.margin,
  },
  image: {
    marginStart: Spacing.unit,
  },
  informationContainer: {
    marginHorizontal: Spacing.margin,
    marginTop: Spacing.margin,
  },
  scoreboardButton: {
    paddingHorizontal: Spacing.margin,
    paddingVertical: Spacing.unit,
  },
  scoreboardButtonContainer: {
    flexDirection: 'row',
  },
  scoreboardImage: {
    alignSelf: 'center',
  },
  scoreboardText: {
    ...Typography.subheadline,
    flexGrow: 1,
    paddingVertical: Spacing.small,
  },
  title: {
    ...Typography.title2,
  },
})

export default PhoningCampaignRow
