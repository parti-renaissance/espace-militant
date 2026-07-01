import { Link } from 'expo-router'
import { isWeb, Spinner, XStack, YStack } from 'tamagui'
import { ChevronRight, ClipboardCheck, GraduationCap, History, Link as LinkIcon, SquareUser, UserPlus } from '@tamagui/lucide-icons'
import { getYear } from 'date-fns'

import Text from '@/components/base/Text'
import BoundarySuspenseWrapper from '@/components/BoundarySuspenseWrapper'
import InfoCard from '@/components/InfoCard/InfoCard'
import Menu from '@/components/menu/Menu'
import ProfilBlock from '@/components/ProfilBlock'
import VoxCard from '@/components/VoxCard/VoxCard'
import RenewMembershipButton from '@/features/profil/pages/donations/components/RenewMembershipButton'

import { useOpenExternalContent } from '@/hooks/useOpenExternalContent'
import { HIT_SOURCES } from '@/services/hits/constants'
import { useGetExecutiveScopes, useGetProfil, useGetSuspenseProfil, useProfileCompletion } from '@/services/profile/hook'
import { RestProfilResponse } from '@/services/profile/schema'
import { useUserStore } from '@/store/user-store'
import { ErrorMonitor } from '@/utils/ErrorMonitor'
import { getMembershipStatus } from '@/utils/membershipStatus'

export const GoToAdminCard = ({ profil }: { profil: RestProfilResponse }) => {
  const { data } = useGetExecutiveScopes()
  const default_scope = data?.default
  const isCadre = profil?.cadre_auth_path && default_scope
  const { open: openCadre, isPending } = useOpenExternalContent({ slug: 'cadre', source: HIT_SOURCES.PAGE_TIMELINE })

  if (!isCadre) {
    return null
  }
  return (
    <VoxCard
      inside={true}
      bg="$pink1"
      onPress={openCadre({ state: `/?scope=${default_scope?.code ?? ''}` })}
      cursor="pointer"
      animation="100ms"
      disabled={isPending}
      hoverStyle={{
        bg: '$pink2',
      }}
      pressStyle={{
        bg: '$pink3',
      }}
    >
      <VoxCard.Content>
        <XStack justifyContent="space-between" alignItems="center">
          <YStack flexShrink={1} flex={1}>
            <Text.MD color="$pink6" semibold>
              {default_scope.name}
            </Text.MD>
            {default_scope.zones.map((z) => (
              <Text.P color="$pink6" key={z.name + z.code}>
                {z.name} ({z.code})
              </Text.P>
            ))}
          </YStack>
          <YStack>{isPending ? <Spinner color="$pink6" /> : <ChevronRight size="$1" color="$pink6" />}</YStack>
        </XStack>
      </VoxCard.Content>
    </VoxCard>
  )
}

export const getMembershipCardStatus = (tags: RestProfilResponse['tags']): 'renew' | 'tofinish' | null => {
  const codes = tags.map((tag) => tag.code)

  if (codes.includes('sympathisant:adhesion_incomplete')) {
    return 'tofinish'
  }
  const AtDate = codes.find((code) => code.startsWith('adherent:a_jour_'))
  if (AtDate) {
    const todayYear = new Date().getFullYear()
    const codeYear = parseInt(AtDate.split('_')[2])
    if (!codeYear || Number.isNaN(codeYear)) {
      ErrorMonitor.log(`Invalid tag code date parsing: ${AtDate}`)
      return null
    }
    return codeYear >= todayYear ? null : 'renew'
  }

  return null
}

const MembershipCard = ({ status }: { status: 'renew' | 'tofinish' }) => {
  const buttonText = status === 'renew' ? `Recotiser pour ${getYear(new Date())}` : 'Je finalise mon adhésion'
  const text =
    status === 'renew'
      ? `Mettez-vous à jour de cotisation dès maintenant pour garder vos avantages adhérents.`
      : 'Finalisez votre adhésion dès maintenant pour profiter des avantages adhérent'
  const icon = status === 'renew' ? History : UserPlus

  return (
    <InfoCard
      button={
        <RenewMembershipButton text={buttonText} page="accueil-connecte" hitSource={HIT_SOURCES.PAGE_TIMELINE} variant="outlined" full />
      }
      icon={icon}
      theme="yellow"
    >
      {text}
    </InfoCard>
  )
}

const EluCard = () => {
  return (
    <InfoCard buttonText="Je complète mes informations d’élu" icon={SquareUser} href="/profil/informations-elu" theme="green">
      Complétez votre profil d’élu pour participer à l’Assemblée des territoires.
    </InfoCard>
  )
}

const MY_PROFILE_CARD_PROFIL_BLOCK_PROPS = {
  editablePicture: false,
  inside: true,
  bg: '$textSurface',
  animation: '100ms',
  hoverStyle: {
    bg: '$gray1',
  },
} as const

const MyProfileCardProfilBlock = () => {
  const { isComplete } = useProfileCompletion()

  if (!isComplete) {
    return <ProfilBlock {...MY_PROFILE_CARD_PROFIL_BLOCK_PROPS} />
  }

  return (
    <Link href="/profil" asChild={!isWeb}>
      <ProfilBlock {...MY_PROFILE_CARD_PROFIL_BLOCK_PROPS} />
    </Link>
  )
}

export default function MyProfileCard() {
  const { user: session } = useUserStore()
  const user = useGetProfil({ enabled: !!session })
  const profile = user?.data
  const statusAdh = profile ? getMembershipCardStatus(profile.tags) : null
  const showEluCard = (profile?.tags ?? []).map((tag) => tag.code).find((x) => ['elu:attente_declaration', 'elu:cotisation_nok'].includes(x))
  const { open: openFormations, isPending: isPendingFormations } = useOpenExternalContent({
    slug: 'formation',
    source: HIT_SOURCES.PAGE_TIMELINE,
  })

  if (!profile) {
    return null
  }

  if (!session) {
    return null
  }

  const eas_profile = process.env.EAS_BUILD_PROFILE

  return (
    <VoxCard bg="$white" overflow="hidden">
      <YStack>
        <VoxCard.Content>
          <BoundarySuspenseWrapper>
            <>
              <MyProfileCardProfilBlock />

              {!showEluCard && statusAdh ? <MembershipCard status={statusAdh} /> : null}
              {showEluCard ? <EluCard /> : null}
              <GoToAdminCard profil={profile} />
            </>
          </BoundarySuspenseWrapper>
        </VoxCard.Content>
        <Link href="/ressources" asChild={!isWeb}>
          <Menu.Item size="sm" icon={LinkIcon} showArrow>
            Ressources
          </Menu.Item>
        </Link>
        <Menu.Item size="sm" icon={GraduationCap} showArrow onPress={openFormations()} disabled={isPendingFormations}>
          Formations
        </Menu.Item>
        <Link href="/questionnaires" asChild={!isWeb}>
          <Menu.Item size="sm" icon={ClipboardCheck} showArrow>
            Questionnaires
          </Menu.Item>
        </Link>
      </YStack>
    </VoxCard>
  )
}

export function MyProfileCardNoLinks() {
  const { user: session } = useUserStore()
  const user = useGetSuspenseProfil({ enabled: !!session })
  const profile = user?.data
  const status = profile ? getMembershipStatus(profile.tags) : null
  const statusAdh = status === 'renew' || status === 'tofinish' ? status : null
  const showEluCard = (profile?.tags ?? []).map((tag) => tag.code).find((x) => ['elu:attente_declaration', 'elu:cotisation_nok'].includes(x))

  if (!profile) {
    return null
  }

  if (!session) {
    return null
  }

  return (
    <VoxCard bg="$white" overflow="hidden" width="100%">
      <YStack>
        <VoxCard.Content>
          <BoundarySuspenseWrapper>
            <>
              <MyProfileCardProfilBlock />

              {!showEluCard && statusAdh ? <MembershipCard status={statusAdh} /> : null}
              {showEluCard ? <EluCard /> : null}
            </>
          </BoundarySuspenseWrapper>
        </VoxCard.Content>
      </YStack>
    </VoxCard>
  )
}
