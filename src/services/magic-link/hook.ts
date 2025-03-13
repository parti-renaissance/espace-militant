import { useSession } from '@/ctx/SessionProvider'
import * as api from '@/services/magic-link/api'
import * as types from '@/services/magic-link/schema'
import { useMutation } from '@tanstack/react-query'

export const useGetMagicLink = ({ slug, utm_source = 'app', utm_campaign }: { slug: types.Slugs; utm_source?: string; utm_campaign?: string }) => {
  const { isAuth } = useSession()

  const queryParams = utm_campaign ? { utm_source, utm_campaign } : undefined

  return useMutation({
    mutationKey: ['magicLink', slug],
    mutationFn: (params?: types.RestGetMagicLinkRequest) => (isAuth ? api.getMagicLink({ slug, queryParams, params }) : api.getLink({ slug, params })),
  })
}
