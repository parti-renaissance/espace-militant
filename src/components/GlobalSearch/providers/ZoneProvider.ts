import { ChevronsUpDown } from '@tamagui/lucide-icons'

import { authInstance } from '@/lib/axios'
import type { IconComponent } from '@/models/common.model'
import { getZoneAutocomplete } from '@/services/search/api'

import { SearchProvider, SearchResult } from '../types'

export interface ZoneProviderOptions {
  url: string
  query_param: string
  value_param: string
  label_param: string
  multiple?: boolean
  required?: boolean
}

const ZONE_TYPE_LABELS: Record<string, string> = {
  custom: 'Personnalisé',
  country: 'Pays',
  region: 'Région',
  department: 'Département',
  district: 'Circonscription',
  city: 'Ville',
  borough: 'Arrondissement',
  city_community: 'Communauté de communes',
  canton: 'Canton',
  foreign_district: 'Circonscription',
  consular_district: 'District consulaire',
  vote_place: 'Bureau de vote',
}

export class ZoneProvider implements SearchProvider {
  private options?: ZoneProviderOptions

  constructor(options?: ZoneProviderOptions) {
    this.options = options
  }

  async search(query: string, scope: string = 'president_departmental_assembly'): Promise<SearchResult[]> {
    try {
      const options = this.options
      const useCustomUrl = options?.url && query.length > 0
      if (useCustomUrl && options) {
        const params: Record<string, string | number | undefined> = {
          [options.query_param]: query,
          scope,
        }
        const response = await authInstance.get(options.url, { params })
        const data = Array.isArray(response.data) ? response.data : []
        const valueParam = options.value_param
        const labelParam = options.label_param
        return data.map((item: Record<string, unknown>) => {
          const id = String(item[valueParam] ?? '')
          const label = String(item[labelParam] ?? '')
          return {
            id,
            label,
            type: 'zone' as const,
            metadata: { zone: item, zoneType: item.type, zoneCode: item.code },
          }
        })
      }

      const response = await getZoneAutocomplete({
        q: query,
        scope,
        'types[]': ['borough', 'city', 'canton', 'department', 'region', 'country', 'district', 'foreign_district'], // Contrainte Mailchimp
        searchEvenEmptyTerm: query.length === 0 ? 1 : undefined,
      })

      return response.map((zone) => ({
        id: zone.uuid,
        label: zone.name + ' (' + zone.code + ')',
        subLabel: ZONE_TYPE_LABELS[zone.type] || zone.type,
        type: 'zone' as const,
        metadata: {
          zone,
          zoneType: zone.type,
          zoneCode: zone.code,
          postalCodes: zone.postal_code,
        },
      }))
    } catch (error) {
      console.error('Error searching zones:', error)
      if (error instanceof Error) {
        console.error('Error details:', error.message)
      }
      return []
    }
  }

  async getDetails(id: string): Promise<null> {
    return null
  }

  isSearchable(query: string): boolean {
    // Permet les recherches vides (pour le chargement initial) ou avec au moins 2 caractères alphanumériques
    return query.length === 0 || (query.length >= 2 && /[a-zA-Z0-9]/.test(query))
  }

  getIcon(): IconComponent {
    return ChevronsUpDown as IconComponent
  }

  getPlaceholder(): string {
    return 'Rechercher une zone...'
  }
}
