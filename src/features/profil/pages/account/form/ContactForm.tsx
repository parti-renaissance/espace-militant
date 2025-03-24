import Input from '@/components/base/Input/Input'
import SelectV3 from '@/components/base/Select/SelectV3'
import Text from '@/components/base/Text'
import { MessageCard } from '@/components/MessageCard/MessageCard'
import { RestDetailedProfileResponse } from '@/services/profile/schema'
import isoToEmoji from '@/utils/isoToEmoji'
import { phoneCodes } from '@/utils/phoneCodes'
import { Info } from '@tamagui/lucide-icons'
import { getCountryCodeForRegionCode, getSupportedRegionCodes } from 'awesome-phonenumber'
import { Controller } from 'react-hook-form'
import { View, XStack } from 'tamagui'
import AbstractProfilForm from './AbstractProfilForm'
import { validateCoordFormSchema } from './schema'

const ContactForm = ({ profile }: { profile: RestDetailedProfileResponse }) => {
  return (
    <AbstractProfilForm
      uuid={profile.uuid}
      defaultValues={
        {
          email_address: profile.email_address,
          phone: {
            country: profile.phone?.country ?? 'FR',
            number: profile.phone?.number,
          },
        } as const
      }
      validatorSchema={validateCoordFormSchema}
    >
      {({ control }) => (
        <>
          <Text.LG semibold>Contact</Text.LG>
          {profile.change_email_token?.email ? (
            <MessageCard iconLeft={Info} theme="yellow">
              Confirmez le changement de votre email en cliquant sur le lien que vous venez de recevoir sur « {profile.change_email_token.email} ». Il est actif
              pour 24h.
            </MessageCard>
          ) : null}
          <Controller
            name="email_address"
            control={control}
            render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
              <Input color="gray" value={value} placeholder="Email" onBlur={onBlur} onChange={onChange} error={error?.message} />
            )}
          />

          <Controller
            name="phone"
            control={control}
            render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
              <XStack gap="$medium">
                <View width={130}>
                  <SelectV3
                    searchable={true}
                    color="gray"
                    value={value?.country ?? 'FR'}
                    size="lg"
                    options={phoneCodes}
                    onChange={(x) => onChange({ number: value?.number, country: x })}
                  />
                </View>
                <View flexGrow={1}>
                  <Input
                    value={value?.number}
                    color="gray"
                    placeholder="Téléphone"
                    onBlur={onBlur}
                    onChange={(x) => {
                      if (!x) {
                        onChange(null)
                      } else {
                        onChange({ number: x, country: value?.country })
                      }
                    }}
                    error={error?.message}
                  />
                </View>
              </XStack>
            )}
          />
        </>
      )}
    </AbstractProfilForm>
  )
}

export default ContactForm
