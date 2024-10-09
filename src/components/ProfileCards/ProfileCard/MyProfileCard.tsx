import { NamedExoticComponent, useCallback } from 'react'
import Text from '@/components/base/Text'
import BoundarySuspenseWrapper from '@/components/BoundarySuspenseWrapper'
import { VoxButton } from '@/components/Button'
import Menu from '@/components/menu/Menu'
import VoxCard from '@/components/VoxCard/VoxCard'
import clientEnv from '@/config/clientEnv'
import { useSession } from '@/ctx/SessionProvider'
import ProfilBlock from '@/screens/profil/dashboard/components/ProfilBlock'
import { useGetProfil, useGetUserScopes } from '@/services/profile/hook'
import { RestProfilResponse } from '@/services/profile/schema'
import { useUserStore } from '@/store/user-store'
import { ErrorMonitor } from '@/utils/ErrorMonitor'
import type { IconProps } from '@tamagui/helpers-icon'
import { ChevronRight, ClipboardCheck, GraduationCap, History, Link as LinkIcon, SquareUser, UserPlus } from '@tamagui/lucide-icons'
import { getYear } from 'date-fns'
import { openURL } from 'expo-linking'
import { Href, Link } from 'expo-router'
import { isWeb, ThemeName, XStack, YStack } from 'tamagui'

const GoToAdminCard = ({ profil }: { profil: RestProfilResponse }) => {
  const { user: credentials } = useUserStore()
  const scopes = useGetUserScopes({ enabled: !!credentials })
  const isCadre = profil?.cadre_auth_path && scopes?.data && scopes.data.length > 0
  const onNavigateToCadre = useCallback(() => {
    if (isCadre) openURL(`${credentials?.isAdmin ? clientEnv.ADMIN_URL : clientEnv.OAUTH_BASE_URL}${profil?.cadre_auth_path}`)
  }, [profil])
  if (!isCadre) {
    return null
  }
  return (
    <VoxCard
      inside={true}
      bg="$purple1"
      onPress={onNavigateToCadre}
      cursor="pointer"
      animation="100ms"
      hoverStyle={{
        bg: '$purple2',
      }}
      pressStyle={{
        bg: '$purple3',
      }}
    >
      <VoxCard.Content>
        <XStack justifyContent="space-between" alignItems="center">
          <YStack flexShrink={1} flex={1}>
            <Text.MD color="$purple6" semibold>
              {scopes.data[0].name}
            </Text.MD>
            {scopes.data[0].zones.map((z) => (
              <Text.P color="$purple6">
                {z.name} ({z.code})
              </Text.P>
            ))}
          </YStack>
          <YStack>
            <ChevronRight size="$1" color="$purple6" />
          </YStack>
        </XStack>
      </VoxCard.Content>
    </VoxCard>
  )
}

const InfoCard = (props: {
  buttonText: string
  icon: NamedExoticComponent<IconProps>
  children: string | string[]
  href: Href<string | object>
  theme?: ThemeName | null
}) => {
  return (
    <VoxCard inside bg="$color1" theme={props.theme}>
      <VoxCard.Content justifyContent="space-between" alignItems="center">
        <props.icon size={24} color="$color5" />
        <YStack flexShrink={1}>
          <Text.SM multiline textAlign="center" color="$color7">
            {props.children}
          </Text.SM>
        </YStack>
        <YStack width="100%">
          <Link href={props.href} asChild={!isWeb}>
            <VoxButton full inverse theme={props.theme}>
              {props.buttonText}
            </VoxButton>
          </Link>
        </YStack>
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
    <InfoCard buttonText={buttonText} icon={icon} href="/profil/cotisation-et-dons" theme="yellow">
      {text}
    </InfoCard>
  )
}

const EluCard = () => {
  return (
    <InfoCard buttonText="Je complète mon informations d’élu" icon={SquareUser} href="/profil/informations-elu" theme="green">
      Complétez votre profil d’élu pour participer à l’Assemblée des territoires.
    </InfoCard>
  )
}

export default function MyProfileCard() {
  const { session } = useSession()
  const user = useGetProfil({ enabled: !!session })
  const profile = user?.data
  const statusAdh = profile ? getMembershipCardStatus(profile.tags) : null
  const showEluCard = (profile?.tags ?? []).map((tag) => tag.code).find((x) => ['elu:attente_declaration', 'elu:cotisation_nok'].includes(x))

  if (!profile) {
    return null
  }

  if (!session) {
    return null
  }

  return (
    <VoxCard bg="$white" overflow="hidden">
      <YStack>
        <VoxCard.Content>
          <BoundarySuspenseWrapper>
            <Link href="/profil" asChild={!isWeb}>
              <ProfilBlock
                editablePicture={false}
                inside
                bg="$textSurface"
                animation="100ms"
                hoverStyle={{
                  bg: '$gray1',
                }}
              />
            </Link>
          </BoundarySuspenseWrapper>
          {!showEluCard && statusAdh ? <MembershipCard status={statusAdh} /> : null}
          {showEluCard ? <EluCard /> : null}
          <GoToAdminCard profil={profile} />
        </VoxCard.Content>
        <Link href="/ressources" asChild={!isWeb}>
          <Menu.Item size="sm" icon={LinkIcon} showArrow>
            Ressources
          </Menu.Item>
        </Link>
        <Menu.Item size="sm" icon={GraduationCap} showArrow disabled>
          Formations (bientôt disponible)
        </Menu.Item>
        <Menu.Item size="sm" icon={ClipboardCheck} showArrow disabled>
          Questionnaires (bientôt disponible)
        </Menu.Item>
      </YStack>
    </VoxCard>
  )
}
