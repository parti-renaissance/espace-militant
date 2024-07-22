import { useSession } from '@/ctx/SessionProvider'
import * as api from '@/services/magic-link/api'
import * as types from '@/services/magic-link/schema'
import { useMutation } from '@tanstack/react-query'

export const useGetMagicLink = ({ platform }: types.RestGetMagicLinkRequest) => {
  const { isAuth } = useSession()
  return useMutation({
    mutationFn: () => (isAuth ? api.getMagicLink({ platform }) : api.getLink({ platform })),
  })
}
