import { XStack, YStack } from 'tamagui'
import { CircleX, EqualNot, Undo2 } from '@tamagui/lucide-icons'

import { VoxButton } from '@/components/Button'

import type { RestFilterCollectionResponse } from '@/services/publications/schema'

import { AVAILABLE_FILTERS } from './Editor/RenderFields/SelectFilters/AdvancedFilters'
import {
  type FilterValue,
  type SelectedFiltersType,
  isIntervalObject,
  isEmptyInterval,
} from './Editor/RenderFields/SelectFilters/type'

export type { FilterValue, SelectedFiltersType }

export type FiltersChipsProps = {
  selectedFilters: Record<string, FilterValue>
  onFilterChange?: (filterKey: string, value: FilterValue) => void
  isStatic?: boolean
  /** Collection de filtres depuis l’API (si fournie, utilisée pour les libellés ; sinon fallback sur AVAILABLE_FILTERS) */
  filterCollection?: RestFilterCollectionResponse | null
}

const getFilterLabel = (key: string, value: FilterValue, filterCollection: RestFilterCollectionResponse | null | undefined): string => {
  // Exception pour le filtre zone : afficher zone.name (zone.code)
  if (key === 'zone' && typeof value === 'object' && value !== null && 'name' in value && 'code' in value) {
    return `${value.name} (${value.code})`
  }

  // Exception pour le filtre committee : afficher committee.name
  if (key === 'committee' && typeof value === 'object' && value !== null && 'name' in value) {
    return value.name
  }

  // Exception pour le filtre adherent_tags : labels personnalisés
  if (key === 'adherent_tags' && typeof value === 'string') {
    const adherentLabels: Record<string, string> = {
      'adherent:a_jour_2025': 'À jour de cotisation',
      'adherent:a_jour_2025:primo': 'Primos',
      'adherent:plus_a_jour': 'Non à jour de cotisation',
    }

    if (adherentLabels[value]) {
      return adherentLabels[value]
    }
  }

  // Si adherent_tags est null, afficher "Tous mes contacts"
  if (key === 'adherent_tags' && value === null) {
    return 'Tous mes contacts'
  }

  const collection = filterCollection && filterCollection.length > 0 ? filterCollection : AVAILABLE_FILTERS
  const keyWithoutSuffix = key.replace(/_(since|until|before|after)$/, '')

  for (const category of collection) {
    const filter = category.filters.find((f) => f.code === key) ?? category.filters.find((f) => f.code === keyWithoutSuffix)

    if (filter) {
      // Si c'est un select avec des choix, récupérer le label de la valeur
      if (filter.type === 'select' && filter.options) {
        const options = filter.options as { choices?: Record<string, string> | string[] }
        if (options.choices && typeof options.choices === 'object') {
          if (!Array.isArray(options.choices)) {
            const choiceLabel = typeof value === 'string' ? options.choices[value] : undefined
            if (choiceLabel) {
              return choiceLabel
            }
          } else {
            // choices est un tableau (ex. isCommitteeMember : ["Non", "Oui"]) → afficher "Label : Valeur"
            const idx = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : -1
            const choiceLabel =
              Number.isInteger(idx) && idx >= 0 && idx < options.choices.length
                ? options.choices[idx]
                : typeof value === 'string' && options.choices.includes(value)
                  ? value
                  : undefined
            if (choiceLabel) {
              return `${filter.label} : ${choiceLabel}`
            }
          }
        }
      }

      // Par défaut, retourner le label du filtre
      return filter.label
    }
  }

  // Si le filtre n'est pas trouvé, retourner la clé
  return key
}

const isValueDefault = (key: string, value: FilterValue, defaultValue: FilterValue): boolean => {
  // Si pas de valeur par défaut, ce n'est pas un filtre avec défaut
  if (defaultValue === null || defaultValue === undefined) return false

  // Comparaison pour les objets zone avec uuid
  if (
    key === 'zone' &&
    typeof value === 'object' &&
    typeof defaultValue === 'object' &&
    value !== null &&
    defaultValue !== null &&
    'uuid' in value &&
    'uuid' in defaultValue
  ) {
    return value.uuid === defaultValue.uuid
  }

  // Comparaison simple pour les autres types
  return value === defaultValue
}

const hasDefaultValue = (key: string, defaultValues: SelectedFiltersType): boolean => {
  return key in defaultValues && defaultValues[key] !== null && defaultValues[key] !== undefined
}

export const calculateDefaultValues = (selectedFilters: Record<string, FilterValue>): SelectedFiltersType => {
  const defaults: SelectedFiltersType = {}

  // Valeur par défaut de zone : zones[0] si dispo, sinon zone initiale
  if (selectedFilters.zones && Array.isArray(selectedFilters.zones) && selectedFilters.zones.length > 0) {
    const firstZone = selectedFilters.zones[0]
    if (firstZone && typeof firstZone === 'object' && 'uuid' in firstZone) {
      defaults.zone = firstZone
    }
  } else if (selectedFilters.zone && typeof selectedFilters.zone === 'object' && 'uuid' in selectedFilters.zone) {
    defaults.zone = selectedFilters.zone
  }

  // Adherent est la valeur par défaut pour adherent_tags
  defaults.adherent_tags = 'adherent'

  return defaults
}

export const FiltersChips = ({ selectedFilters, onFilterChange, isStatic = false, filterCollection }: FiltersChipsProps) => {
  // Calculer automatiquement les valeurs par défaut
  const defaultValues = calculateDefaultValues(selectedFilters)

  // Exclure de l'affichage : zones (redondant avec zone), uuid (métadonnée, pas un filtre)
  const excludedKeys = ['zones', 'uuid']

  // Ajouter adherent_tags s'il n'est pas dans selectedFilters mais qu'il a une valeur par défaut
  const filtersToDisplay = { ...selectedFilters }
  if (!('adherent_tags' in filtersToDisplay) && 'adherent_tags' in defaultValues) {
    filtersToDisplay.adherent_tags = null
  }

  // Filtrer les valeurs non-nulles et non-undefined
  // Exception : adherent_tags peut être null et doit quand même s'afficher
  const activeFilters = Object.entries(filtersToDisplay)
    .filter(([key, value]) => {
      if (excludedKeys.includes(key)) return false
      if (key === 'adherent_tags') return true // Toujours afficher adherent_tags
      if (isIntervalObject(value)) return !isEmptyInterval(value)
      return value !== null && value !== undefined
    })
    // Trier : filtres avec valeur par défaut en premier
    .sort(([keyA], [keyB]) => {
      const hasDefaultA = hasDefaultValue(keyA, defaultValues)
      const hasDefaultB = hasDefaultValue(keyB, defaultValues)

      if (hasDefaultA && !hasDefaultB) return -1
      if (!hasDefaultA && hasDefaultB) return 1
      return 0
    })

  if (activeFilters.length === 0) {
    return null
  }

  const handleChipPress = (key: string) => {
    if (isStatic || !onFilterChange) return

    // Si le filtre a une valeur par défaut, on remet la valeur par défaut
    if (hasDefaultValue(key, defaultValues)) {
      onFilterChange(key, defaultValues[key])
    } else {
      // Sinon on met à null
      onFilterChange(key, null)
    }
  }

  return (
    <YStack gap="$small">
      <XStack flexWrap="wrap" gap="$small">
        {activeFilters.map(([key, value]) => {
          const label = getFilterLabel(key, value, filterCollection)

          // Détecter si la valeur commence par "!" (négation)
          const isNegation = typeof value === 'string' && value.startsWith('!')
          const theme = isNegation ? 'orange' : 'gray'
          const iconLeft = isNegation ? EqualNot : undefined

          // Si le filtre a une valeur par défaut
          if (hasDefaultValue(key, defaultValues)) {
            const isDefault = isValueDefault(key, value, defaultValues[key])

            return (
              <VoxButton
                key={key}
                size="xxs"
                theme={theme}
                variant={isDefault ? 'outlined' : 'contained'}
                iconLeft={iconLeft}
                iconRight={!isDefault && !isStatic ? Undo2 : undefined}
                onPress={() => handleChipPress(key)}
                testID={`filter-chip-${key}`}
                asChip={isStatic}
              >
                {label}
                {isDefault && !isStatic ? ' - par défaut' : ''}
              </VoxButton>
            )
          }

          // Pour les filtres sans valeur par défaut (filtres actifs)
          return (
            <VoxButton
              key={key}
              size="xxs"
              theme={theme}
              variant="contained"
              iconLeft={iconLeft}
              iconRight={!isStatic ? CircleX : undefined}
              onPress={() => handleChipPress(key)}
              testID={`filter-chip-${key}`}
              asChip={isStatic}
            >
              {label}
            </VoxButton>
          )
        })}
      </XStack>
    </YStack>
  )
}
