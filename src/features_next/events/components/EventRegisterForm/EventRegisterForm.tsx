import React, { ComponentProps, useId, useRef } from 'react'
import { Linking, LogBox } from 'react-native'
import Input from '@/components/base/Input/Input'
import Text from '@/components/base/Text'
import Button, { VoxButton } from '@/components/Button/Button'
import FormikController from '@/components/FormikController'
import VoxCard from '@/components/VoxCard/VoxCard'
import { useSession } from '@/ctx/SessionProvider'
import { PublicEventSubscriptionFormError } from '@/services/events/error'
import { useSubscribePublicEvent } from '@/services/events/hook'
import type { RestPostPublicEventSubsciptionRequest } from '@/services/events/schema'
import { CheckedState } from '@tamagui/checkbox-headless/src/useCheckbox'
import { CalendarCheck2, Check as CheckIcon } from '@tamagui/lucide-icons'
import { router } from 'expo-router'
import { Formik, FormikHelpers } from 'formik'
import { Checkbox, CheckboxProps, Dialog, H2, isWeb, Label, Paragraph, ScrollView, useMedia, XStack, YStack } from 'tamagui'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import { PublicSubscribtionFormDataSchema } from './schema'

type PublicSubscribtionFormData = RestPostPublicEventSubsciptionRequest

LogBox.ignoreLogs([/bad setState[\s\S]*Themed/])

function _VoxInput({ onChange, ...props }: ComponentProps<typeof Input> & { value: string; onChange: (x: string) => void }) {
  return <Input {...props} color="gray" onChangeText={onChange} />
}

const VoxInput = React.memo(_VoxInput)

type VoxCheckboxProps = {
  id: string
  label: string
  error?: string
} & CheckboxProps & { checked: boolean; onCheckedChange: (x: boolean) => void }

const VoxCheckbox = ({ label, id: _id, error, ...rest }: VoxCheckboxProps) => {
  const uniqueId = useId()
  const id = uniqueId + _id

  return (
    <YStack gap="$small" theme={error ? 'red' : undefined}>
      <XStack gap="$medium" alignItems="center">
        <Checkbox id={id} size="$2" {...rest}>
          <Checkbox.Indicator>
            <CheckIcon />
          </Checkbox.Indicator>
        </Checkbox>
        <Label htmlFor={id} gap="$xsmall" flex={1} lineHeight="$2" fontSize="$2">
          <Text>{label}</Text>
        </Label>
      </XStack>
      {!!error && <Text fontSize="$1">{error}</Text>}
    </YStack>
  )
}

const initialValues = {
  first_name: '',
  last_name: '',
  email_address: '',
  postal_code: '',
  cgu_accepted: false,
  join_newsletter: false,
} satisfies PublicSubscribtionFormData

const EventRegisterForm = (props: { 
  onScrollTo?: (x: { x: number; y: number }) => void; 
  eventId: string; 
  eventSlug?: string;
  urlParams: { ref?: string; utm_source?: string; utm_campaign?: string };
}) => {
  const { signIn } = useSession()
  const { mutateAsync } = useSubscribePublicEvent({ id: props.eventId, slug: props.eventSlug })

  const onSubmit = (values: PublicSubscribtionFormData, action: FormikHelpers<PublicSubscribtionFormData>) => {
    action.setSubmitting(true)
    
    const payloadWithTracking: RestPostPublicEventSubsciptionRequest = {
      ...values,
      referrer_code: props.urlParams.ref,
      utm_source: props.urlParams.utm_source,
      utm_campaign: props.urlParams.utm_campaign,
    }
    
    mutateAsync(payloadWithTracking)
      .then(() => {
        action.resetForm()
        router.replace('/(militant)/evenements')
      })
      .catch((error) => {
        if (error instanceof PublicEventSubscriptionFormError) {
          error.violations.forEach((violation) => {
            if (violation.propertyPath === '') {
              return
            }
            action.setFieldError(violation.propertyPath, violation.message)
          })
        }
      })
      .finally(() => {
        action.setSubmitting(false)
      })
  }

  const position = useRef<null | { x: number; y: number }>(null)
  const handlePress = () => {
    if (position.current) {
      props.onScrollTo?.(position.current)
    }
  }

  return (
    <Formik<PublicSubscribtionFormData>
      initialValues={initialValues}
      validationSchema={toFormikValidationSchema(PublicSubscribtionFormDataSchema)}
      onSubmit={onSubmit}
    >
      {({ isSubmitting, handleSubmit, setFieldValue }) => (
        <YStack gap="$medium" flex={1}>
          <Text fontWeight="$6" fontSize="$3" textAlign="center" color="$textPrimary">
            M’inscrire à cet évènement
          </Text>

          <FormikController<PublicSubscribtionFormData, 'first_name'> name="first_name">
            {({ inputProps }) => <VoxInput placeholder="Prénom" {...inputProps} />}
          </FormikController>

          <FormikController<PublicSubscribtionFormData, 'last_name'> name="last_name">
            {({ inputProps }) => <VoxInput placeholder="Nom" {...inputProps} />}
          </FormikController>

          <FormikController<PublicSubscribtionFormData, 'email_address'> name="email_address">
            {({ inputProps }) => <VoxInput placeholder="Email" {...inputProps} />}
          </FormikController>

          <FormikController<PublicSubscribtionFormData, 'postal_code'> name="postal_code">
            {({ inputProps }) => <VoxInput placeholder="Code postal" {...inputProps} />}
          </FormikController>
          <YStack gap="$medium">
            <FormikController<PublicSubscribtionFormData, 'join_newsletter'> name="join_newsletter">
              {({ inputProps }) => (
                <VoxCheckbox
                  id={inputProps.id}
                  label="Je m’abonne à la newsletter pour ne rien rater de des actualités (optionnel)"
                  error={inputProps.error}
                  checked={inputProps.value}
                  onBlur={inputProps.onBlur}
                  onCheckedChange={(d: CheckedState) => {
                    if (d === 'indeterminate') return

                    setFieldValue('join_newsletter', d)
                  }}
                />
              )}
            </FormikController>

            <FormikController<PublicSubscribtionFormData, 'cgu_accepted'> name="cgu_accepted">
              {({ inputProps }) => (
                <VoxCheckbox
                  id={inputProps.id}
                  label="J’ai lu et j’accepte la politique de protection des données et les mentions d’informations relatives au traitement de mes données."
                  error={inputProps.error}
                  checked={inputProps.value}
                  onCheckedChange={(d: CheckedState) => {
                    if (d === 'indeterminate') return

                    setFieldValue('cgu_accepted', d)
                  }}
                />
              )}
            </FormikController>
          </YStack>

          <YStack justifyContent="center" alignContent="center">
            <Button
              width="100%"
              variant="text"
              size="md"
              theme="gray"
              onPress={async () => {
                const link = 'https://parti-renaissance.fr/politique-de-protection-des-donnees/'

                if (await Linking.canOpenURL(link)) {
                  await Linking.openURL(link)
                }
              }}
            >
              <Button.Text color="$black1" fontWeight="$4" fontSize="$1" textAlign="center" textDecorationLine="underline">
                Politique de protection des données
              </Button.Text>
            </Button>
            <Button variant="text" onPress={handlePress} width="100%" size="md">
              <Button.Text color="$black1" fontWeight="$4" fontSize="$1" textAlign="center" textDecorationLine="underline">
                Mention d’informations relatives au traitement de mes données
              </Button.Text>
            </Button>
          </YStack>

          <VoxButton size="xl" width="100%" theme="blue" onPress={() => handleSubmit()} iconLeft={CalendarCheck2} loading={isSubmitting}>
            M'inscrire
          </VoxButton>

          <Button variant="text" theme="gray" size="lg" width="100%" onPress={() => signIn()}>
            <Text fontSize="$1">
              <Text color="$textPrimary" fontWeight="$7">
                Me connecter
              </Text>{' '}
              <Text color="$textSecondary">pour m’inscrire en un clic.</Text>
            </Text>
          </Button>

          <YStack
            id="mention-legale"
            gap="$medium"
            onLayout={(l) => {
              position.current = { x: l.nativeEvent.layout.x, y: l.nativeEvent.layout.y }
            }}
          >
            <VoxCard.Separator />
            <MentionLegale />
          </YStack>
        </YStack>
      )}
    </Formik>
  )
}

function MentionLegale() {
  return (
    <YStack gap="$medium" flex={1} height="100%">
      <H2>Légalité</H2>
      <Paragraph>
        Les données recueillies sur ce formulaire sont traitées par Renaissance et ses équipes aux fins d’organisation de cet événement. Elles permettront à ses
        équipes de gérer les informations relatives aux participants et de vous inviter à d’autres événements qu’elles organisent. Elles permettront également à
        Renaissance de vous envoyer ses communications politiques si vous y consentez. En envoyant ce formulaire, vous acceptez que Renaissance traite vos
        données pour ces finalités. Les champs marqués d’un astérisque sont obligatoires, l’absence de réponse dans ces champs ne permettra pas de traiter votre
        demande. Vos données seront conservées jusqu’à 1 mois à compter de la fin de l’événement ou jusqu’au retrait de votre consentement lorsque vous acceptez
        de recevoir les communications politiques de Renaissance. Conformément à la réglementation en vigueur, vous pouvez retirer votre consentement à tout
        moment. Vous disposez d’un droit d’opposition et d’un droit à la limitation du traitement des données vous concernant, ainsi que d’un droit d’accès, de
        rectification et d’effacement de vos données. Vous disposez, par ailleurs, de la faculté de donner des directives sur le sort de vos données après votre
        décès. Vous pouvez exercer vos droits en contactant Renaissance à l’adresse postale : Renaissance, 68 rue du Rocher 75008 Paris, ou à l’adresse
        électronique mes-donnees@parti-renaissance.fr. Dans certaines hypothèses, une copie de votre pièce d’identité pourra vous être demandée. Pour toute
        information relative au traitement de vos données par Renaissance, vous pouvez consulter la politique de protection des données ou contacter le délégué
        à la protection des données à l’adresse dpo@parti-renaissance.fr
      </Paragraph>
    </YStack>
  )
}

export default EventRegisterForm
