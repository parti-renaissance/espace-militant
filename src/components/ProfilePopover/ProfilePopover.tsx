import { PropsWithChildren, useCallback, useRef } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import clientEnv from '@/config/clientEnv'
import { useSession } from '@/ctx/SessionProvider'
import { useUserStore } from '@/store/user-store'
import { Link, router } from 'expo-router'
import { Adapt, isWeb, ListItem, Popover, Separator, useMedia, YGroup } from 'tamagui'

export default function ProfilePopover({ children }: PropsWithChildren) {
  const { signOut } = useSession()
  const { user } = useUserStore()
  const { bottom } = useSafeAreaInsets()
  const media = useMedia()

  const ref = useRef<Popover>(null)

  const onGoToStorybook = useCallback(() => {
    ref.current?.close()
    router.replace('/storybook/')
  }, [])

  const onDisconnect = useCallback(async () => {
    ref.current?.close()
    await signOut()
  }, [])

  return (
    <Popover ref={ref} hoverable allowFlip placement={'bottom'} offset={{ mainAxis: isWeb ? 10 : 60, crossAxis: -20 }}>
      <Popover.Trigger cursor={'pointer'}>{children}</Popover.Trigger>

      <Adapt when="sm" platform="touch">
        <Popover.Sheet modal dismissOnSnapToBottom snapPointsMode="fit">
          <Popover.Sheet.Handle />
          <Popover.Sheet.Frame padding="$medium" pb={bottom}>
            <Adapt.Contents />
          </Popover.Sheet.Frame>
          <Popover.Sheet.Overlay animation="100ms" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
        </Popover.Sheet>
      </Adapt>

      <Popover.Content borderWidth={1} padding={0} borderColor="$gray1" overflow="hidden">
        <YGroup width={media.gtLg ? 300 : undefined} paddingBottom={16}>
          <YGroup.Item>
            <Link href="/profil/" asChild>
              <MenuEntry title="Mon profil" onPress={() => ref.current?.close()} />
            </Link>
          </YGroup.Item>
          <Separator borderStyle={'dashed'} borderColor="$gray1" />
          {clientEnv.ENVIRONMENT !== 'production' && (
            <>
              <YGroup.Item>
                <MenuEntry onPress={onGoToStorybook} title="Storybook" />
              </YGroup.Item>
              <Separator borderStyle={'dashed'} borderColor="$gray1" />
            </>
          )}
          <YGroup.Item>
            <MenuEntry onPress={onDisconnect} title={user?.isAdmin ? 'Quitter l’impersonnification' : 'Me déconnecter'} danger />
          </YGroup.Item>
        </YGroup>
      </Popover.Content>
    </Popover>
  )
}

const MenuEntry = ({ title, onPress, danger, onPressIn }: { title: string; onPress?: () => void; onPressIn?: () => void; danger?: boolean }) => (
  <ListItem hoverTheme pressTheme onPress={onPress} onPressIn={onPressIn} cursor={'pointer'}>
    <ListItem.Text color={danger ? '$textDanger' : '$textPrimary'} cursor={'pointer'}>
      {title}
    </ListItem.Text>
  </ListItem>
)
