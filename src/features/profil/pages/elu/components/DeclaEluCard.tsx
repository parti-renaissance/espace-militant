import { ComponentProps, useState } from 'react'
import Badge from '@/components/Badge'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import VoxCard from '@/components/VoxCard/VoxCard'
import { useOpenExternalContent } from '@/hooks/useOpenExternalContent'
import { useGetTags } from '@/services/profile/hook'
import { Coins } from '@tamagui/lucide-icons'
import { ThemeName, useMedia, View, XStack, YStack } from 'tamagui'
import DeclaForm from './DeclaForm'
import IbanForm from './IbanForm'

const FrameElu = (props: { children: React.ReactNode; badgeColor?: ThemeName; badgeTitle: string }) => {
  return (
    <VoxCard inside borderColor="$textOutline32" borderWidth={1.2}>
      <VoxCard.Content>
        <XStack>
          <Badge theme={props.badgeColor ?? 'gray'}>{props.badgeTitle}</Badge>
        </XStack>
        {props.children}
      </VoxCard.Content>
    </VoxCard>
  )
}

const ButtonDeclaration = (props: ComponentProps<typeof VoxButton>) => {
  return (
    <VoxButton variant="outlined" alignSelf="flex-end" theme="blue" {...props}>
      {props.children}
    </VoxButton>
  )
}

const EluOkExempte = () => {
  return (
    <FrameElu badgeTitle="Exempté de cotisation">
      <Text.MD semibold>Le bureau de votre assemblée départementale vous a exempté de cotisation élu.</Text.MD>
    </FrameElu>
  )
}

const EluExempteNonAdh = () => {
  const { isPending, open: handlePress } = useOpenExternalContent({ slug: 'adhesion', utm_campaign: 'elu' })
  return (
    <FrameElu badgeTitle="Exempté de cotisation élu si à jour de cotisation adhérent">
      <Text.MD semibold>
        Le bureau de votre assemblée départementale vous a exempté de cotisation élu mais vous devez être à jour de cotisation adhérent pour en profiter.
      </Text.MD>
      <VoxButton variant="outlined" alignSelf="flex-end" theme="yellow" disabled={isPending} loading={isPending} onPress={handlePress()}>
        Me mettre à jour de cotisation
      </VoxButton>
    </FrameElu>
  )
}

const EluOkSoumis = (props: { declaration: number; cotisation: number; onPressDeclaForm: () => void; onPressIbanForm: () => void }) => {
  return (
    <FrameElu badgeTitle="À jour de cotisation" badgeColor="green">
      <VoxCard inside bg="$textSurface">
        <VoxCard.Content>
          <XStack alignItems="center" gap="$medium">
            <Coins color="$textPrimary" />
            <Text.MD semibold>
              Montant de cotisation mensuelle calculé {props.cotisation} €.
              <Text.BR />
              (soit {Math.round(props.cotisation * 0.34)}€ après réduction d’impôts)
            </Text.MD>
          </XStack>
          <Text.SM>Vous avez déclaré une indemnitée d’élu de {props.declaration} €.</Text.SM>
        </VoxCard.Content>
      </VoxCard>
      <XStack gap="$medium" justifyContent="space-between">
        <ButtonDeclaration theme="gray" alignSelf="flex-start" onPress={props.onPressDeclaForm}>
          Modifier ma declaration
        </ButtonDeclaration>
        <VoxButton theme="gray" variant="outlined" alignSelf="flex-end" onPress={props.onPressIbanForm}>
          Modifier mon IBAN
        </VoxButton>
      </XStack>
    </FrameElu>
  )
}

const EluOkNonSoumis = (props: { declaration: number; onPressDeclaForm: () => void }) => {
  return (
    <FrameElu badgeTitle="Non soumis à cotisation" badgeColor="green">
      <Text.MD semibold>Vous n’êtes pas soumis à cotisation.</Text.MD>
      <Text.SM>Vous avez déclaré une indemnitée d’élu de {props.declaration} €.</Text.SM>
      <ButtonDeclaration onPress={props.onPressDeclaForm}>Modifier ma déclaration</ButtonDeclaration>
    </FrameElu>
  )
}

const EluWaiting = (props: { onPressDeclaForm: () => void }) => {
  return (
    <FrameElu badgeColor="orange" badgeTitle="En attente de déclaration">
      <Text.MD semibold>En tant qu’élu adhérent, vous devez déclarer vos indemnités et cotiser le cas échéant.</Text.MD>
      <ButtonDeclaration onPress={props.onPressDeclaForm}>Faire ma déclaration</ButtonDeclaration>
    </FrameElu>
  )
}

const EluNonOk = (props: { declaration: number; cotisation: number; onPressDeclaForm: () => void; onPressIbanForm: () => void }) => {
  const media = useMedia()
  return (
    <FrameElu badgeColor="orange" badgeTitle="Non à jour de cotisation">
      <Text.MD semibold>Vous n’avez pas enclenché de paiement récurrent ou celui-ci s’est interrompu.</Text.MD>
      <Text.P>
        Votre cotisation due est de {props.cotisation} €.
        <Text.BR />
        Vous avez déclaré une indemnités d’élu de {props.declaration} €.
      </Text.P>
      <XStack $sm={{ flexDirection: 'column' }} gap="$medium" justifyContent="space-between">
        <ButtonDeclaration theme="gray" full={media.sm} alignSelf="flex-start" onPress={props.onPressDeclaForm}>
          Modifier ma declaration
        </ButtonDeclaration>
        <VoxButton variant="outlined" full={media.sm} alignSelf="flex-end" theme="blue" onPress={props.onPressIbanForm}>
          Renseigner mon IBAN
        </VoxButton>
      </XStack>
    </FrameElu>
  )
}

export const EluBlock = ({
  code,
  declaration,
  cotisation,
  onPressDeclaForm,
  onPressIbanForm,
}: {
  code: string[]
  declaration?: number
  cotisation?: number
  onPressDeclaForm: () => void
  onPressIbanForm: () => void
}) => {
  if (code.includes('elu:cotisation_ok:exempte')) {
    return <EluOkExempte />
  } else if (code.includes('elu:cotisation_ok:soumis')) {
    return <EluOkSoumis declaration={declaration ?? 0} cotisation={cotisation ?? 0}onPressIbanForm={onPressIbanForm} onPressDeclaForm={onPressDeclaForm} />
  } else if (code.includes('elu:cotisation_ok:non_soumis')) {
    return <EluOkNonSoumis declaration={declaration ?? 0} onPressDeclaForm={onPressDeclaForm} />
  } else if (code.includes('elu:attente_declaration')) {
    return <EluWaiting onPressDeclaForm={onPressDeclaForm} />
  } else if (code.includes('elu:cotisation_nok')) {
    return <EluNonOk declaration={declaration ?? 0} cotisation={cotisation ?? 0} onPressIbanForm={onPressIbanForm} onPressDeclaForm={onPressDeclaForm} />
  } else if (code.includes('elu:exempte_et_adherent_cotisation_nok')) {
    return <EluExempteNonAdh />
  } else {
    return null
  }
}

export default function (props: { declaration?: number; cotisation?: number }) {
  const { tags: _codes } = useGetTags({ tags: ['elu'] })
  const codes = _codes || []
  const [openIban, setOpenIban] = useState(false)
  const [openDecla, setOpenDecla] = useState(false)
  const handleOpenIban = () => setOpenIban(true)
  const handleCloseIban = () => setOpenIban(false)
  const handleOpenDecla = () => setOpenDecla(true)
  const handleCloseDecla = () => setOpenDecla(false)
  return (
    <>
      <DeclaForm onClose={handleCloseDecla} open={openDecla} declaration={props.declaration} key={`modal_decla_profil_${props.declaration}`} />
      <IbanForm onClose={handleCloseIban} open={openIban} />
      {codes.find((x) => x.type === 'elu') ? (
        <VoxCard>
          <VoxCard.Content>
            <Text.LG>Cotisation élus</Text.LG>
            <EluBlock code={codes.map((x) => x.code)} {...props} onPressIbanForm={handleOpenIban} onPressDeclaForm={handleOpenDecla} />
            <VoxCard inside bg="$textSurface">
              <VoxCard.Content>
                <YStack gap="$medium">
                  <Text.P>
                    En application de l’article 4.1.2 du Règlement Intérieur, les élus titulaires de mandats électifs locaux ouvrant droit à indemnisation
                    doivent s’acquitter d’une cotisation mensuelle dont le montant est fixé suivant le barème décidé par le Bureau Exécutif du 28 novembre 2022.
                  </Text.P>
                  <Text.MD>Comment est calculé le montant de la cotisation élu ?</Text.MD>
                  <Text.P>
                    La cotisation calculée est égale à 2% du montant de l’ensemble des indemnités brutes perçues par l’adhérent, avec un plafond fixé à 200€ et
                    un seuil de déclenchement à partir de 250€ d’indemnités mensuelles brutes.
                    <Text.BR />
                    <Text.BR />
                    Par exemple,
                    <Text.BR />
                  </Text.P>
                  <View pl="$small">
                    <Text.P>
                      - Si vos indemnités brutes sont de 200 euros, vous ne serez pas redevable de cotisation élu ;
                      <Text.BR />
                      - Si vos indemnités brutes sont de 6 000 euros, vous serez redevable de 6 000 x 0,02 = 120 euros ;
                      <Text.BR />
                      -Si vos indemnités brutes sont de 12 000 euros brutes, vous serez redevable du plafond de cotisation de 200 euros.
                    </Text.P>
                  </View>

                  <Text.MD>Pourquoi déclarer/cotiser ?</Text.MD>
                  <Text.P>
                    Les cotisations d’élus sont entièrement versées au budget de votre assemblée départementale, en cotisant vous financez donc le parti
                    localement.
                    <Text.BR />
                    <Text.BR />
                    Si vous êtes Député, elle vous donne le droit aux accès « Délégué de corconscription » qui vous donnent les moyens de contacter par email et
                    notifications les militants de votre circonscription, de créer des événements et d’autres fonctionnalités.
                  </Text.P>

                  <Text.MD>Dois-je également cotiser en tant qu’adhérent ?</Text.MD>
                  <Text.P>
                    La cotisation élu replace la cotisation adhérent, vous serez donc à jour de cotiation adhérent et pourrez participer aux élections internes
                    et aux consultations sans avoir à re-cotiser chaque année.
                    <Text.BR />
                    <Text.BR />
                    Attention : si vous ne versez pas de cotisation élu car vous êtes exempté ou non soumis à cotisation élu, vous n’êtes pas exempté de
                    cotisation adhérent.
                  </Text.P>

                  <Text.MD>Puis-je être exempté de cotisation élu ?</Text.MD>
                  <Text.P>
                    Le bureau de votre Assemblée départementale peut décider de vous exempter de cotisation si vous n’avez pas de mandat national.
                    <Text.BR />
                    <Text.BR />
                    En étant exempté vous serez considéré comme à jour de cotisation élu tant que vous êtes à jour de cotisation adhérent.
                  </Text.P>
                </YStack>
              </VoxCard.Content>
            </VoxCard>
          </VoxCard.Content>
        </VoxCard>
      ) : null}
    </>
  )
}
