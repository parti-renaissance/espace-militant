import React, { useCallback, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import * as Linking from 'expo-linking'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors, Spacing, Typography } from '@/styles'
import i18n from '@/utils/i18n'
import { PrimaryButton, SecondaryButton } from '@/screens/shared/Buttons'
import CircularIcon from '@/screens/shared/CircularIcon'
import { VerticalSpacer } from '@/screens/shared/Spacer'
import { usePreventGoingBack } from '@/screens/shared/usePreventGoingBack.hook'
import { router } from 'expo-router'
import { useSessionStore } from '@/data/store/phoning'

const PhoningSessionNumberFoundScreen = () => {
    usePreventGoingBack()
    const { session: { adherent } } = useSessionStore()

    const phoneNumberUrl = (phoneNumber: string): string => {
        const whitespaceRegex = /\s/g
        const sanitizedPhoneNumber = phoneNumber.replace(whitespaceRegex, '')
        return `tel:${sanitizedPhoneNumber}`
    }

    const phoneNumber = adherent.phone.number

    const callNumber = useCallback(() => {
        const url = phoneNumberUrl(phoneNumber)
        Linking.openURL(url)
    }, [phoneNumber])

    useEffect(() => { callNumber() }, [callNumber])

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>
                {i18n.t('phoningsession.number_found.title')}
            </Text>
            <VerticalSpacer spacing={Spacing.margin} />
            <Text style={styles.body}>
                {i18n.t('phoningsession.number_found.description')}
            </Text>
            <View style={styles.imageContainer}>
                <CircularIcon
                    source={require('@/assets/images/phoneNumberFoundIcon.png')}
                />
            </View>
            <SecondaryButton
                title={i18n.t('phoningsession.number_found.recall')}
                onPress={() => callNumber()}
            />
            <VerticalSpacer spacing={Spacing.margin} />
            <PrimaryButton
                title={i18n.t('phoningsession.call_started')}
                onPress={() =>
                    router.replace({
                        pathname: '/(tabs)/actions/phoning/session/[device]/call/status-picker',
                        params: { device: 'current' }
                    })
                }
            />
            <VerticalSpacer spacing={Spacing.margin} />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    body: {
        ...Typography.body,
    },
    container: {
        backgroundColor: Colors.defaultBackground,
        flex: 1,
        paddingHorizontal: Spacing.margin,
    },
    imageContainer: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        ...Typography.title,
    },
})

export default PhoningSessionNumberFoundScreen
