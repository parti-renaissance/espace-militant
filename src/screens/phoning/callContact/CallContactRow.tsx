import React, { FunctionComponent } from 'react'
import { StyleSheet, Image, Text, View } from 'react-native'
import { Spacing, Typography, Colors } from '../../../styles'
import CardView from '../../shared/CardView'
import { useTheme } from '../../../themes'
import ProgressBar from '../../shared/ProgressBar'
import { PrimaryButton } from '../../shared/Buttons'
import i18n from '../../../utils/i18n'

type Props = Readonly<{
  viewModel: PhoningCallContactRowViewModel
  onCallButtonPressed: () => void
}>

export interface PhoningCallContactRowViewModel {
  id: string
  calledCount: number
  numberOfPersonToCall: number
}

const PhoningCallContactRow: FunctionComponent<Props> = ({
  viewModel,
  onCallButtonPressed,
}) => {
  const { theme } = useTheme()
  return (
    <CardView style={styles.cardView} backgroundColor={theme.lightBackground}>
      <View style={styles.container}>
        <Text style={styles.title}>{i18n.t('phoning.callcontact.title')}</Text>
        <Image
          style={styles.image}
          source={require('../../../assets/images/blue/imageActualite.png')}
        />
        <Text style={styles.body}>{i18n.t('phoning.callcontact.body')}</Text>
        <Text style={styles.caption}>
          {i18n.t('phoning.callcontact.progressformat', {
            done: viewModel.calledCount,
            total: viewModel.numberOfPersonToCall,
          })}
        </Text>
        <ProgressBar
          progress={viewModel.calledCount / viewModel.numberOfPersonToCall}
          color={theme.primaryColor}
        />
        <PrimaryButton
          style={styles.callButton}
          title={i18n.t('phoning.callcontact.callbuttontitle')}
          onPress={onCallButtonPressed}
          shape={'rounded'}
        />
      </View>
    </CardView>
  )
}

const styles = StyleSheet.create({
  body: {
    ...Typography.body,
    marginBottom: Spacing.margin,
  },
  caption: {
    ...Typography.caption1,
    color: Colors.lightText,
    paddingBottom: Spacing.unit,
  },
  cardView: {
    marginHorizontal: Spacing.margin,
    marginVertical: Spacing.margin,
  },
  callButton: {
    marginHorizontal: Spacing.margin,
    marginTop: Spacing.mediumMargin,
  },
  container: {
    padding: Spacing.margin,
  },
  image: {
    marginStart: Spacing.unit,
  },
  title: {
    ...Typography.title2,
    marginBottom: Spacing.margin,
  },
})

export default PhoningCallContactRow
