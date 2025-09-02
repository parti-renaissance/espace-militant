import { SearchProvider, SearchResult } from '../types'
import { ChevronsUpDown } from '@tamagui/lucide-icons'
import type { IconComponent } from '@/models/common.model'
import { getZoneAutocomplete } from '@/services/search/api'

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
  vote_place: 'Bureau de vote'
}

export class ZoneProvider implements SearchProvider {
  async search(query: string, scope: string = 'president_departmental_assembly'): Promise<SearchResult[]> {
    try {
      const response = await getZoneAutocomplete({
        q: query,
        scope,
        'types[]': ['borough', 'city', 'canton', 'department', 'region', 'country', 'district', 'foreign_district'] // Contrainte Mailchimp
      })

      return response.map(zone => ({
        id: zone.uuid,
        label: zone.name + ' (' + zone.code + ')',
        subLabel: ZONE_TYPE_LABELS[zone.type] || zone.type,
        type: 'zone' as const,
        metadata: { 
          zone,
          zoneType: zone.type,
          zoneCode: zone.code,
          postalCodes: zone.postal_code
        }
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
    return query.length >= 2 && /[a-zA-Z]/.test(query)
  }

  getIcon(): IconComponent {
    return ChevronsUpDown as IconComponent
  }

  getPlaceholder(): string {
    return 'Rechercher une zone...'
  }
} 