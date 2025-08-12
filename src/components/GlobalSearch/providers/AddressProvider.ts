import { SearchProvider, SearchResult } from '../types'
import { MapPin } from '@tamagui/lucide-icons'
import { getPlaceAutocomplete, getPlaceDetails } from '@/services/search/api'
import googleAddressMapper from '@/data/mapper/googleAddressMapper'
import { NamedExoticComponent } from 'react'
import { IconProps } from '@tamagui/helpers-icon'

export class AddressProvider implements SearchProvider {
  async search(query: string): Promise<SearchResult[]> {
    try {
      const autocompleteResults = await getPlaceAutocomplete({ input: query })
      
      return autocompleteResults.predictions.map(result => ({
        id: result.place_id,
        label: result.description,
        type: 'address',
        metadata: { googlePlace: result }
      }))
    } catch (error) {
      console.error('Error searching addresses:', error)
      return []
    }
  }

  async getDetails(id: string): Promise<SearchResult | null> {
    try {
      const placeDetails = await getPlaceDetails({ 
        place_id: id,
        fields: 'formatted_address,address_components,geometry'
      })
      
      if (placeDetails.result?.formatted_address && placeDetails.result.address_components && placeDetails.result.geometry) {
        const addressComponents = googleAddressMapper({ 
          placeDetails: {
            formatted: placeDetails.result.formatted_address,
            details: placeDetails.result.address_components,
            geometry: placeDetails.result.geometry as any // Type casting pour compatibilité
          }
        })
        
        return {
          id,
          label: placeDetails.result.formatted_address,
          type: 'address',
          metadata: { 
            addressComponents, 
            googleDetails: placeDetails.result 
          }
        }
      }
    } catch (error) {
      console.error('Error fetching address details:', error)
    }
    
    return null
  }

  isSearchable(query: string): boolean {
    return query.length >= 3 && /[a-zA-Z]/.test(query)
  }

  getIcon(): NamedExoticComponent<IconProps> {
    return MapPin as NamedExoticComponent<IconProps>
  }

  getPlaceholder(): string {
    return 'Rechercher une adresse...'
  }
} 