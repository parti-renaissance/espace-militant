import React from 'react'
import { TouchableOpacity } from 'react-native'
import Text from '@/components/base/Text'
import clientEnv from '@/config/clientEnv'
import { format } from 'date-fns'
import { nativeBuildVersion } from 'expo-application'
import Constants from 'expo-constants'
import * as Update from 'expo-updates'
import { isWeb, YStack } from 'tamagui'

export default function Version() {
  const [showEasDate, setShowEasDate] = React.useState(false)
  const handlePress = () => {
    if (Update.manifest.id) setShowEasDate((x) => !x)
  }
  return (
    <TouchableOpacity activeOpacity={Update.manifest?.id ? 0.2 : 1} onPress={handlePress}>
      <YStack alignItems="center" justifyContent="center" gap="$medium">
        <VersionText />
        {showEasDate ? (
          <YStack alignItems="center" gap="$xsmall">
            <Text.SM alignSelf="center" secondary>
              {Update.manifest?.id ?? 'store-update'}
            </Text.SM>
            {Update.createdAt ? (
              <Text.SM alignSelf="center" secondary>
                {format(Update.createdAt, 'dd-MM-yyyy HH:mm:ss')}
              </Text.SM>
            ) : null}
          </YStack>
        ) : null}
      </YStack>
    </TouchableOpacity>
  )
}

function VersionText() {
  return (
    <Text.SM alignSelf="center">
      Version {Constants.expoConfig?.version ?? '0.0.0'} [{isWeb ? '' : nativeBuildVersion}
      {isWeb ? '' : ' - '}
      {clientEnv.ENVIRONMENT}]
    </Text.SM>
  )
}
