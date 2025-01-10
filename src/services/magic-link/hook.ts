import { useSession } from '@/ctx/SessionProvider'
import * as api from '@/services/magic-link/api'
import * as types from '@/services/magic-link/schema'
import { useMutation } from '@tanstack/react-query'

export const useGetMagicLink = ({ slug }: { slug: types.Slugs }) => {
  const { isAuth } = useSession()
  return useMutation({
    mutationKey: ['magicLink', slug],
    mutationFn: (params?: types.RestGetMagicLinkRequest) => (isAuth ? api.getMagicLink({ slug, params }) : api.getLink({ slug, params })),
  })
}
