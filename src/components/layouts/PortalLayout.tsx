import { useSafeAreaInsets } from 'react-native-safe-area-context'
import VoxToast from '@/components/VoxToast/VoxToast'
import { ToastViewport } from '@tamagui/toast'
import { PortalProvider } from 'tamagui'

export const PortalLayout = ({ children }: { children: React.ReactNode }) => {
  const insets = useSafeAreaInsets()
  return (
    <PortalProvider>
      {children}
      <VoxToast />
      <ToastViewport flexDirection="column-reverse" top={16 + insets.top} right={16} />
    </PortalProvider>
  )
}
