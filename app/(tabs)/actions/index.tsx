import { useSession } from '@/ctx/SessionProvider'
import CompActionsScreen from '@/screens/actions/ActionsScreen'
import { Redirect } from 'expo-router'

export default function ActionsScreen() {
  const { isAuth } = useSession()

  if (!isAuth) {
    return <Redirect href={'/(tabs)/evenements/'} />
  }
  // @ts-ignore
  return <CompActionsScreen />
}
