import { RestUserScopesResponse } from '@/services/profile/schema'

/** Scope avec accès espace cadre (`data_corner`). */
export const isExecutiveCadreScope = (scope: RestUserScopesResponse[number]): boolean => scope.apps.includes('data_corner')

/** La feature est disponible sur au moins un scope utilisateur. */
export const hasScopeFeature = (scopes: RestUserScopesResponse | undefined, featureKey: string): boolean =>
  scopes?.some((scope) => scope.features.includes(featureKey)) ?? false

export const getFormatedScope = (scope: RestUserScopesResponse[number]) => {
  const { name, zones, attributes } = scope

  const description =
    attributes?.committees?.[0]?.name ?? attributes?.agoras?.[0]?.name ?? (zones?.length ? zones.map((z) => `${z.name} (${z.code})`).join(', ') : undefined)

  return { name, description }
}
