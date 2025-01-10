import { api } from '@/utils/api'
import type { RestGetMagicLinkRequest, RestGetMagicLinkResponse, Slugs } from './schema'
import * as schema from './schema'

export const getMagicLink = async ({ slug, params }: { slug: Slugs; params?: RestGetMagicLinkRequest }): Promise<RestGetMagicLinkResponse> => {
  return api({
    method: 'get',
    path: `/api/v3/app-link/${slug}`,
    requestSchema: schema.RestGetMagicLinkRequestSchema,
    responseSchema: schema.RestGetMagicLinkResponseSchema,
    type: 'private',
  })(params)
}

export const getLink = async ({ slug, params }: { slug: Slugs; params?: RestGetMagicLinkRequest }): Promise<RestGetMagicLinkResponse> => {
  return api({
    method: 'get',
    path: `/api/app-link/${slug}`,
    requestSchema: schema.RestGetMagicLinkRequestSchema,
    responseSchema: schema.RestGetMagicLinkResponseSchema,
    type: 'public',
  })(params)
}
