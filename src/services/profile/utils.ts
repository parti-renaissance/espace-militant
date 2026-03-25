import { RestUserScopesResponse } from '@/services/profile/schema'

export const getFormatedScope = (scope: RestUserScopesResponse[number]) => {
  const { name, zones, attributes } = scope

  const description =
    attributes?.committees?.[0]?.name ?? attributes?.agoras?.[0]?.name ?? (zones?.length ? zones.map((z) => `${z.name} (${z.code})`).join(', ') : undefined)

  return { name, description }
}
