import Text from '@/components/base/Text'
import BoundarySuspenseWrapper from '@/components/BoundarySuspenseWrapper'
import InfoCard from '@/components/InfoCard/InfoCard'
import Menu from '@/components/menu/Menu'
import ProfilBlock from '@/components/ProfilBlock'
import VoxCard from '@/components/VoxCard/VoxCard'
import RenewMembershipButton from '@/features/profil/pages/donations/components/RenewMembershipButton'
import { useOpenExternalContent } from '@/hooks/useOpenExternalContent'
import { useGetExecutiveScopes, useGetProfil } from '@/services/profile/hook'
import { RestProfilResponse } from '@/services/profile/schema'
import { useUserStore } from '@/store/user-store'
import { ErrorMonitor } from '@/utils/ErrorMonitor'
import { ChevronRight, ClipboardCheck, GraduationCap, History, Link as LinkIcon, SquareUser, UserPlus } from '@tamagui/lucide-icons'
import { getYear } from 'date-fns'
import { Link } from 'expo-router'
import { isWeb, Spinner, XStack, YStack } from 'tamagui'

export const GoToAdminCard = ({ profil }: { profil: RestProfilResponse }) => {
  const { data: { default: default_scope } = {} } = useGetExecutiveScopes()
  const isCadre = profil?.cadre_auth_path && default_scope
  const { open: openCadre, isPending } = useOpenExternalContent({ slug: 'cadre' })

  if (!isCadre) {
    return null
  }
  return (
    <VoxCard
      inside={true}
      bg="$purple1"
      onPress={openCadre({ state: `/?scope=${default_scope.code}` })}
      cursor="pointer"
      animation="100ms"
      disabled={isPending}
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
              {default_scope.name}
            </Text.MD>
            {default_scope.zones.map((z) => (
              <Text.P color="$purple6" key={z.name + z.code}>
                {z.name} ({z.code})
              </Text.P>
            ))}
          </YStack>
          <YStack>{isPending ? <Spinner color="$purple6" /> : <ChevronRight size="$1" color="$purple6" />}</YStack>
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
    <InfoCard button={<RenewMembershipButton text={buttonText} page="accueil-connecte" full inverse bg="white" />} icon={icon} theme="yellow">
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

export default function MyProfileCard() {
  const { user: session } = useUserStore()
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
            <>
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
        <Link href="/formations" asChild={!isWeb}>
          <Menu.Item size="sm" icon={GraduationCap} showArrow>
            Formations
          </Menu.Item>
        </Link>
        <Menu.Item size="sm" icon={ClipboardCheck} showArrow disabled>
          Questionnaires (bientôt disponible)
        </Menu.Item>
      </YStack>
    </VoxCard>
  )
}
