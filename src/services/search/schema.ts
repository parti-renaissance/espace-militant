import { z } from 'zod'

// Schémas pour les zones
export const ZoneAutocompleteRequestSchema = z.object({
  q: z.string().min(1),
  scope: z.string().optional(),
  'types[]': z.array(z.string()).optional(),
})

export const ZoneAutocompleteResponseSchema = z.array(z.object({
  uuid: z.string(),
  type: z.string(),
  postal_code: z.array(z.string()),
  code: z.string(),
  name: z.string(),
}))

// Schémas pour les places (Google Places)
export const PlaceAutocompleteRequestSchema = z.object({
  input: z.string().min(1),
})

export const PlaceAutocompleteResponseSchema = z.object({
  predictions: z.array(z.object({
    place_id: z.string(),
    description: z.string(),
    structured_formatting: z.object({
      main_text: z.string(),
      secondary_text: z.string(),
    }).optional(),
    types: z.array(z.string()).optional(),
  })),
})

export const PlaceDetailsRequestSchema = z.object({
  place_id: z.string(),
  fields: z.string().default('formatted_address,address_components,geometry'),
})

export const PlaceDetailsResponseSchema = z.object({
  result: z.object({
    formatted_address: z.string().optional(),
    address_components: z.array(z.any()).optional(),
    geometry: z.object({
      location: z.object({
        lat: z.number(),
        lng: z.number(),
      }).optional(),
    }).optional(),
  }),
})

// Types exportés
export type ZoneAutocompleteRequest = z.infer<typeof ZoneAutocompleteRequestSchema>
export type ZoneAutocompleteResponse = z.infer<typeof ZoneAutocompleteResponseSchema>
export type PlaceAutocompleteRequest = z.infer<typeof PlaceAutocompleteRequestSchema>
export type PlaceAutocompleteResponse = z.infer<typeof PlaceAutocompleteResponseSchema>
export type PlaceDetailsRequest = z.infer<typeof PlaceDetailsRequestSchema>
export type PlaceDetailsResponse = z.infer<typeof PlaceDetailsResponseSchema> 