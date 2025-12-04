import React from 'react'
import { StyleSheet, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors, Spacing, Typography } from '@/styles'
import i18n from '@/utils/i18n'
import { PrimaryButton } from '@/screens/shared/Buttons'
import { FlexibleVerticalSpacer, VerticalSpacer } from '@/screens/shared/Spacer'
import { usePreventGoingBack } from '@/screens/shared/usePreventGoingBack.hook'

import { router } from 'expo-router'

import { useSessionStore } from '@/data/store/phoning'


const PhoningSessionNumberFoundOtherDeviceScreen= () => {
    usePreventGoingBack()
    const { session: { adherent } } = useSessionStore()
    const { device } = router.useParams<{ device: 'current' | 'external' }>()

    const phoneNumber = adherent.phone.number

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>
                {i18n.t('phoningsession.other_device.title')}
            </Text>
            <VerticalSpacer spacing={Spacing.margin} />
            <Text style={styles.body}>
                {i18n.t('phoningsession.other_device.description')}
            </Text>
            <VerticalSpacer spacing={Spacing.extraExtraLargeMargin} />
            <Text style={styles.phoneNumber}>{phoneNumber}</Text>
            <FlexibleVerticalSpacer minSpacing={Spacing.margin} />
            <PrimaryButton
                title={i18n.t('phoningsession.call_started')}
                onPress={() => router.replace({
                    pathname: '/(tabs)/actions/phoning/session/[device]/call/status-picker',
                    params: { device },
                })}
                
            />
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
        paddingBottom: Spacing.margin,
        paddingHorizontal: Spacing.margin,
    },
    phoneNumber: {
        ...Typography.title,
        textAlign: 'center',
    },
    title: {
        ...Typography.title,
    },
})

export default PhoningSessionNumberFoundOtherDeviceScreen
