import React, { FunctionComponent } from 'react'
import { StyleSheet, Text, View, Image, Linking } from 'react-native'
import { Colors, Spacing, Typography } from '../../styles'
import CardView from '../shared/CardView'
import { useThemedStyles } from '../../themes'
import { RetaliationCardViewModel } from './RetaliationCardViewModel'
import Clipboard from '@react-native-community/clipboard'

type Props = Readonly<{
  viewModel: RetaliationCardViewModel
}>

export const Retaliate = (text: string, url: string) => {
  Clipboard.setString(text)
  Linking.openURL(url)
}

const RetaliationCard: FunctionComponent<Props> = ({ viewModel }) => {
  const styles = useThemedStyles(stylesFactory)
  return (
    <CardView
      style={styles.cardView}
      backgroundColor={Colors.defaultBackground}
    >
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Image source={viewModel.socialIcon} />
          <Text style={styles.title}>{viewModel.title}</Text>
        </View>
        <Text style={styles.body}>{viewModel.body}</Text>
        {viewModel.image.length !== 0 ? (
          <Image style={styles.image} source={{ uri: viewModel.image }} />
        ) : null}
      </View>
    </CardView>
  )
}

const stylesFactory = () => {
  return StyleSheet.create({
    body: {
      ...Typography.body,
      marginBottom: Spacing.margin,
    },
    cardView: {
      marginHorizontal: Spacing.margin,
      marginVertical: Spacing.margin,
    },
    container: {
      padding: Spacing.margin,
    },
    image: {
      aspectRatio: 258 / 145,
      width: '100%',
      resizeMode: 'cover',
    },
    title: {
      ...Typography.title2,
      marginBottom: Spacing.margin,
      marginLeft: Spacing.margin,
    },
    titleContainer: {
      flexDirection: 'row',
    },
  })
}

export default RetaliationCard
