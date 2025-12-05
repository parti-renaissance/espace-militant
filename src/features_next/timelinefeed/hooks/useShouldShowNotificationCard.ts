import { useGetSuspenseProfil } from '@/services/profile/hook'
import { useUserStore } from '@/store/user-store'
import { isAfter } from 'date-fns'
import zod from 'zod'

const isUserHidedNotificationCard = (x: string | null) => {
  if (!x) return false
  const date = zod.string().datetime().safeParse(x)
  if (!date.success) return false
  if (!date.data) return false
  if (isAfter(new Date(date.data), new Date())) return true
  return false
}

export const useShouldShowNotificationCard = () => {
  const userStore = useUserStore()
  const shouldNotShow = isUserHidedNotificationCard(userStore.hideResubscribeAlert)
  const { data: user } = useGetSuspenseProfil()
  return !shouldNotShow && !user?.email_subscribed
}
