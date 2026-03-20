import { z } from 'zod'

/** Choices pour select : clé = value, valeur = label */
export const FilterOptionChoicesSchema = z.record(z.string(), z.string())

/** Options pour integer_interval (âge, etc.) */
export const FilterOptionIntegerIntervalBoundSchema = z.object({
  min: z.number(),
  max: z.number(),
  label: z.string().optional(),
})

export const FilterOptionIntegerIntervalSchema = z.object({
  first: FilterOptionIntegerIntervalBoundSchema,
  second: FilterOptionIntegerIntervalBoundSchema,
  suffix: z.string().optional(),
})

/** Options pour zone_autocomplete */
export const FilterOptionZoneAutocompleteSchema = z.object({
  url: z.string(),
  query_param: z.string(),
  value_param: z.string(),
  label_param: z.string(),
  multiple: z.boolean().optional(),
  required: z.boolean().optional(),
  help: z.string().nullable().optional(),
})

/** Options pour select (choices, multiple, placeholder, etc.) */
export const FilterOptionSelectSchema = z.object({
  choices: FilterOptionChoicesSchema.optional(),
  multiple: z.boolean().optional(),
  required: z.boolean().optional(),
  favorite: z.boolean().optional(),
  advanced: z.boolean().optional(),
  placeholder: z.string().optional(),
})

// Ordre important : les schémas avec clés requises en premier, sinon Zod matche
// FilterOptionSelectSchema (toutes clés optionnelles) et renvoie {} en strippant first/second, etc.
export const FilterOptionsSchema = z.union([
  FilterOptionIntegerIntervalSchema,
  FilterOptionZoneAutocompleteSchema,
  FilterOptionSelectSchema,
  z.object({ favorite: z.boolean().optional() }).passthrough(), // text avec options optionnelles
  z.null(),
])

export const FilterDefinitionSchema = z.object({
  code: z.string(),
  label: z.string(),
  options: FilterOptionsSchema,
  type: z.enum(['text', 'select', 'integer_interval', 'date_interval', 'date', 'zone_autocomplete']),
})

export const FilterGroupSchema = z.object({
  label: z.string(),
  color: z.string(),
  filters: z.array(FilterDefinitionSchema),
})

export const FiltersCollectionResponseSchema = z.array(FilterGroupSchema)

export type FilterOptionChoices = z.infer<typeof FilterOptionChoicesSchema>
export type FilterOptionIntegerIntervalBound = z.infer<typeof FilterOptionIntegerIntervalBoundSchema>
export type FilterOptionIntegerInterval = z.infer<typeof FilterOptionIntegerIntervalSchema>
export type FilterOptionZoneAutocomplete = z.infer<typeof FilterOptionZoneAutocompleteSchema>
export type FilterOptionSelect = z.infer<typeof FilterOptionSelectSchema>
export type FilterOptions = z.infer<typeof FilterOptionsSchema>
export type FilterDefinition = z.infer<typeof FilterDefinitionSchema>
export type FilterGroup = z.infer<typeof FilterGroupSchema>
export type FiltersCollectionResponse = z.infer<typeof FiltersCollectionResponseSchema>
