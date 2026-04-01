import { useMemo } from 'react'
import { styled, View, XStack, YStack } from 'tamagui'
import { CircleAlert, CircleCheck, CircleHelp, MapPin, Pencil, Plus, Trash2 } from '@tamagui/lucide-icons'

import Switch from '@/components/base/SwitchV2/SwitchV2'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'

import { Chip } from '@/components'
import { declarationsValues } from '@/services/adherents/constants'
import { useAdherentElect, useMutationToggleAdherentElectExemptFromCotisation } from '@/services/adherents/hook'
import type { RestAdherentElectMandate, RestAdherentElectPayment, RestAdherentElectResponse, RestAdherentTag } from '@/services/adherents/schema'
import { useGetExecutiveScopes } from '@/services/profile/hook'
import { formatShortDate } from '@/utils/DateFormatter'
import { FEATURES } from '@/utils/Scopes'

const SectionCard = styled(YStack, {
  backgroundColor: '$textSurface',
  borderRadius: '$small',
  padding: '$medium',
  gap: '$medium',
})

function getPaymentStatusStyle(statusLabel: string) {
  if (statusLabel === 'Paiement validé') return { icon: CircleCheck, color: '$green5', bg: '$green2' }
  if (statusLabel === 'Remboursé') return { icon: CircleCheck, color: '$orange9', bg: '$orange2' }
  if (statusLabel === 'Reversé') return { icon: CircleCheck, color: '$blue5', bg: '$blue2' }
  if (statusLabel === 'Annulé') return { icon: CircleAlert, color: '$orange5', bg: '$orange2' }
  return { icon: CircleAlert, color: '$gray5', bg: '$gray2' }
}

function CotisationIconByCode({ code }: { code?: string | null }) {
  if (!code) return null
  switch (code) {
    case 'elu:attente_declaration':
      return <CircleHelp size={12} color="$orange5" />
    case 'elu:cotisation_ok':
    case 'elu:cotisation_ok:exempte':
    case 'elu:cotisation_ok:non_soumis':
    case 'elu:cotisation_ok:soumis':
      return <CircleCheck size={12} color="$orange5" />
    case 'elu:cotisation_nok':
    case 'elu:exempte_et_adherent_cotisation_nok':
      return <CircleAlert size={12} color="$orange5" />
    default:
      return null
  }
}

function ElectPaymentItem({ payment }: { payment: RestAdherentElectPayment }) {
  const nature = payment.method?.trim() ? payment.method : 'Paiement'
  const { icon: StatusIcon, color, bg } = getPaymentStatusStyle(payment.status_label || '')
  return (
    <XStack gap="$medium" pl={14} py={12} pr={16} bg="$textSurface" borderRadius={8} alignItems="center" justifyContent="space-between" minHeight={56}>
      <YStack bg={bg} borderRadius={14} w={28} h={28} alignItems="center" justifyContent="center">
        <StatusIcon size={16} color={color} />
      </YStack>
      <YStack flex={1} gap={4}>
        <Text.SM semibold>Cotisation d'élu</Text.SM>
        <Text.SM secondary>
          {formatShortDate(payment.date)} - {nature}
        </Text.SM>
      </YStack>
      <YStack alignItems="flex-end" gap={4}>
        <Text.SM semibold>{`${payment.amount} €`}</Text.SM>
        <Text.XSM color={color} semibold textTransform="uppercase">
          {payment.status_label}
        </Text.XSM>
      </YStack>
    </XStack>
  )
}

function MandateItem({ mandate }: { mandate: RestAdherentElectMandate }) {
  return (
    <YStack
      gap={12}
      backgroundColor={mandate.finish_at ? '$textSurface' : '$white1'}
      borderWidth={1}
      borderColor={mandate.finish_at ? '$textOutline32' : '$textOutline'}
      p="$medium"
      borderRadius="$small"
    >
      <YStack gap="$small">
        <Text.MD color="$orange5">{mandate.mandate_type_label}</Text.MD>
        <XStack gap={6} alignItems="flex-start">
          <MapPin size={14} color="$gray4" />
          <YStack gap={4} flex={1}>
            <Text.SM primary>{mandate.zone.name}</Text.SM>
            <Text.XSM secondary semibold>
              {mandate.finish_at
                ? `du ${formatShortDate(mandate.begin_at)} au ${formatShortDate(mandate.finish_at)}`
                : `depuis le ${formatShortDate(mandate.begin_at)}`}
            </Text.XSM>
          </YStack>
        </XStack>
      </YStack>
      <XStack gap="$xsmall" alignItems="center">
        {/* TODO: connecter « Modifier » à l'édition du mandat (API / formulaire) */}
        <VoxButton size="xs" theme="gray" variant="outlined" iconLeft={Pencil} disabled>
          Modifier
        </VoxButton>
        {/* TODO: connecter la suppression du mandat (confirmation + API) */}
        <VoxButton size="xxs" theme="orange" variant="text" iconLeft={Trash2} disabled />
      </XStack>
      {mandate.delegation ? <Text.SM color="$textSecondary">Délégation: {mandate.delegation}</Text.SM> : null}
    </YStack>
  )
}

type MandateTagLike = { code?: string; label: string }

interface MandatsTagsSectionProps {
  isLoading: boolean
  canSeeElectedRepresentative: boolean
  electMandatesList: MandateTagLike[]
  electTagsList: RestAdherentTag[]
}

function MandatsTagsSection({ isLoading, canSeeElectedRepresentative, electMandatesList, electTagsList }: MandatsTagsSectionProps) {
  if (isLoading) {
    return (
      <XStack gap="$small">
        <View w={165} h={22} backgroundColor="$textOutline20" borderRadius={16} />
      </XStack>
    )
  }

  if (!canSeeElectedRepresentative && electMandatesList.length === 0 && electTagsList.length === 0) {
    return <Text.SM color="$textDisabled">Aucun mandat associé.</Text.SM>
  }

  return (
    <XStack gap="$small" flexWrap="wrap">
      {!canSeeElectedRepresentative &&
        electMandatesList.map((mandate, index) => (
          <Chip key={mandate.code ?? `${mandate.label}-${index}`} theme="orange">
            <Text.SM color="$color5" semibold>
              {mandate.label}
            </Text.SM>
          </Chip>
        ))}
      {electTagsList.map((tag, index) => (
        <Chip key={tag.code ?? `${tag.label}-${index}`} theme="orange">
          <XStack gap={4} alignItems="center">
            <CotisationIconByCode code={tag.code} />
            <Text.SM color="$color5" semibold>
              {tag.label}
            </Text.SM>
          </XStack>
        </Chip>
      ))}
    </XStack>
  )
}

interface DeclaredMandatesSectionProps {
  isLoading: boolean
  declaredMandates: string[]
  declarationLabels: Map<string, string>
}

function DeclaredMandatesSection({ isLoading, declaredMandates, declarationLabels }: DeclaredMandatesSectionProps) {
  if (isLoading) {
    return (
      <SectionCard>
        <View w={180} h={17} backgroundColor="$textOutline20" borderRadius={4} />
        <View w="100%" h={56} backgroundColor="$textOutline20" borderRadius={8} />
      </SectionCard>
    )
  }

  if (!declaredMandates || declaredMandates.length === 0) return null

  return (
    <SectionCard>
      <YStack gap="$small">
        <Text.MD semibold>Déclarations de mandat</Text.MD>
        <Text.SM color="$textPrimary">
          Les déclarations de mandat doivent être faites par l'adhérent lors de son adhésion ou depuis son profil.
          <Text.SM semibold> Vous devez les vérifier et les valider pour les faire apparaître dans votre base de données.</Text.SM>
        </Text.SM>
      </YStack>
      <XStack gap="$small" flexWrap="wrap">
        {declaredMandates.map((mandate) => (
          <Chip key={mandate} theme="orange" outlined>
            <Text.MD color="$color5" semibold>
              {declarationLabels.get(mandate) ?? mandate}
            </Text.MD>
          </Chip>
        ))}
      </XStack>
    </SectionCard>
  )
}

interface CurrentAndClosedMandatesSectionProps {
  isLoading: boolean
  activeMandates: RestAdherentElectMandate[]
  closedMandates: RestAdherentElectMandate[]
}

function CurrentAndClosedMandatesSection({ isLoading, activeMandates, closedMandates }: CurrentAndClosedMandatesSectionProps) {
  if (isLoading) {
    return (
      <SectionCard>
        <View w={150} h={17} backgroundColor="$textOutline20" borderRadius={4} />
        <View w="100%" h={56} backgroundColor="$textOutline20" borderRadius={8} />
        <View w="100%" h={123} backgroundColor="$textOutline20" borderRadius={8} />
      </SectionCard>
    )
  }

  return (
    <SectionCard>
      <YStack gap="$small">
        <Text.MD semibold>Mandats en cours</Text.MD>
        <Text.SM color="$textPrimary">
          <Text.SM semibold>En déclarant des mandats à cet adhérent, vous en ferez un élu dans votre base de données.</Text.SM>
          <Text.SM> Celui-ci sera alors invité à déclarer son indemnité d'élu et selon le montant, cotiser auprès du parti.</Text.SM>
        </Text.SM>
      </YStack>
      {/* TODO: connecter « Ajouter un mandat » (création / navigation vers le flux métier) */}
      <VoxButton size="sm" variant="outlined" iconLeft={Plus} theme="blue" disabled>
        Ajouter un mandat
      </VoxButton>

      {activeMandates.length === 0 ? (
        <Text.MD color="$textDisabled">Aucun mandat en cours.</Text.MD>
      ) : (
        <YStack gap="$small">
          {activeMandates.map((mandate) => (
            <MandateItem key={mandate.uuid} mandate={mandate} />
          ))}
        </YStack>
      )}

      {closedMandates.length > 0 && (
        <>
          <Text.MD semibold mt="$small">
            Mandats fermés
          </Text.MD>
          <YStack gap="$small">
            {closedMandates.map((mandate) => (
              <MandateItem key={mandate.uuid} mandate={mandate} />
            ))}
          </YStack>
        </>
      )}
    </SectionCard>
  )
}

interface RevenueDeclarationSectionProps {
  isLoading: boolean
  data: RestAdherentElectResponse | undefined
  isTogglingExempt: boolean
  onToggleExempt: (payload: { exemptFromCotisation: boolean }) => void
}

function RevenueDeclarationSection({ isLoading, data, isTogglingExempt, onToggleExempt }: RevenueDeclarationSectionProps) {
  if (isLoading) {
    return (
      <SectionCard>
        <View w={220} h={17} backgroundColor="$textOutline20" borderRadius={4} />
        <View w="100%" h={50} backgroundColor="$textOutline20" borderRadius={8} />
        <View w="60%" h={28} backgroundColor="$textOutline20" borderRadius={4} />
      </SectionCard>
    )
  }

  return (
    <SectionCard>
      <Text.MD semibold>Déclarations d'indemnité d'élu</Text.MD>
      <XStack gap="$small">
        <YStack bg="$white1" borderRadius="$small" p="$small" flex={1} gap={4}>
          <Text.SM color="$textSecondary">Déclaration</Text.SM>
          <Text.MD semibold>{data?.last_revenue_declaration?.amount ? `${data.last_revenue_declaration.amount} €` : '—'}</Text.MD>
        </YStack>
        <YStack bg="$white1" borderRadius="$small" p="$small" flex={1} gap={4}>
          <Text.SM color="$textSecondary">Cotisation</Text.SM>
          <Text.MD semibold>{data?.contribution_amount != null ? `${data.contribution_amount} €` : '—'}</Text.MD>
        </YStack>
      </XStack>

      {data?.contribution_status === 'not_eligible' && (
        <XStack gap="$xsmall" alignItems="center">
          <CircleAlert size={12} color="$orange5" />
          <Text.SM color="$orange5">À jour de cotisation élu</Text.SM>
        </XStack>
      )}

      <Text.SM color="$textPrimary">
        <Text.SM semibold>Vous pouvez exonérer de cotisation les élus locaux.</Text.SM> Ils ne vous seront donc pas redevables de leur cotisation d'élu.
      </Text.SM>

      <XStack alignItems="center" gap="$xxsmall">
        <Switch
          checked={data?.exempt_from_cotisation}
          disabled={isTogglingExempt}
          onPress={() => onToggleExempt({ exemptFromCotisation: !data?.exempt_from_cotisation })}
        />
        <Text.SM>Exonérer de cotisations</Text.SM>
      </XStack>
    </SectionCard>
  )
}

interface ElectPaymentsSectionProps {
  isLoading: boolean
  payments: RestAdherentElectPayment[]
}

function ElectPaymentsSection({ isLoading, payments }: ElectPaymentsSectionProps) {
  if (isLoading) {
    return (
      <YStack gap="$small" mt="$medium">
        <View w={140} h={20} backgroundColor="$textOutline20" borderRadius={4} mb="$small" />
        <View w="100%" h={56} backgroundColor="$textOutline20" borderRadius={8} />
        <View w="100%" h={56} backgroundColor="$textOutline20" borderRadius={8} />
      </YStack>
    )
  }

  return (
    <YStack gap="$small" mt="$medium">
      <Text semibold primary fontSize={16}>
        Cotisations d'élu
      </Text>
      {payments.length > 0 ? (
        payments.map((payment) => <ElectPaymentItem key={payment.uuid} payment={payment} />)
      ) : (
        <Text.SM color="$textDisabled" mb="$small">
          Aucune cotisation d'élu.
        </Text.SM>
      )}
    </YStack>
  )
}

export function ElectMandatTab({
  uuid,
  scope,
  electTags,
  electMandates,
}: {
  uuid?: string
  scope?: string
  electTags?: RestAdherentTag[] | null
  electMandates?: MandateTagLike[] | null
}) {
  const declarationLabels = useMemo(() => new Map(declarationsValues.map((item) => [item.value, item.label])), [])

  const electTagsList = Array.isArray(electTags) ? electTags : []
  const electMandatesList = Array.isArray(electMandates) ? electMandates : []

  const { hasFeature } = useGetExecutiveScopes()
  const canSeeElectedRepresentative = hasFeature(FEATURES.ELECTED_REPRESENTATIVE, scope)

  const { data, isError, isLoading } = useAdherentElect(uuid, scope, canSeeElectedRepresentative)
  const { mutate: toggleExempt, isPending: isTogglingExempt } = useMutationToggleAdherentElectExemptFromCotisation({
    adherentUuid: uuid,
    scope,
  })

  if (!uuid || !scope) return null

  if (isError) {
    return (
      <YStack padding="$medium" gap="$medium">
        <Text semibold primary fontSize={16}>
          Mandats
        </Text>
        <Text.MD color="$textDisabled">Impossible de récupérer les informations de l'élu.</Text.MD>
      </YStack>
    )
  }

  const activeMandates = data?.elect_mandates?.filter((x) => !x.finish_at) || []
  const closedMandates = data?.elect_mandates?.filter((x) => Boolean(x.finish_at)) || []
  const payments = data?.payments || []
  const declaredMandates = data?.declared_mandates || []

  return (
    <YStack padding="$medium" gap="$medium" paddingBottom={80}>
      <Text semibold primary fontSize={16}>
        Mandats
      </Text>

      <MandatsTagsSection
        isLoading={isLoading}
        canSeeElectedRepresentative={canSeeElectedRepresentative}
        electMandatesList={electMandatesList}
        electTagsList={electTagsList}
      />

      {canSeeElectedRepresentative && (
        <>
          <DeclaredMandatesSection isLoading={isLoading} declaredMandates={declaredMandates} declarationLabels={declarationLabels} />
          <CurrentAndClosedMandatesSection isLoading={isLoading} activeMandates={activeMandates} closedMandates={closedMandates} />
          <RevenueDeclarationSection isLoading={isLoading} data={data} isTogglingExempt={isTogglingExempt} onToggleExempt={toggleExempt} />
          <ElectPaymentsSection isLoading={isLoading} payments={payments} />
        </>
      )}
    </YStack>
  )
}
