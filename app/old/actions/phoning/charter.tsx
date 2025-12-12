import React from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import Markdown from '@ronradtke/react-native-markdown-display'
import PhoningCampaignRepository from '@/data/PhoningCampaignRepository'
import { Colors, Spacing, Styles, Typography } from '@/styles'
import i18n from '@/utils/i18n'
import { AlertUtils } from '@/screens/shared/AlertUtils'
import { PrimaryButton } from '@/screens/shared/Buttons'
import { useCharterStore } from '@/data/store/phoning'
import { Stack, router } from 'expo-router'


const PhoningCharterScreen = () => {
    const { charter }  = useCharterStore()
    const acceptCharter = () => {
        PhoningCampaignRepository.getInstance()
            .acceptPhoningCharter()
            .then(() => {
                router.replace('/old/actions/phoning/campaign/brief')
            })
            .catch((error: Error) => {
                AlertUtils.showNetworkAlert(error, undefined)
            })
    }

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: i18n.t('phoning.charter.title') }} />
            <ScrollView contentContainerStyle={styles.markdownContainer}>
                <Markdown style={Typography.markdownStyle} mergeStyle={false}>
                    {charter}
                </Markdown>
            </ScrollView>
            <View style={styles.bottomContainer}>
                <PrimaryButton
                    title={i18n.t('phoning.charter.accept')}
                    onPress={acceptCharter}
                />
            </View>
        </View>
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
})

export default PhoningCharterScreen
