import { VoxButton } from '@/components/Button'
import { Undo2, CircleX, EqualNot } from '@tamagui/lucide-icons'
import { XStack, YStack } from 'tamagui'
import { AVAILABLE_FILTERS } from './Editor/RenderFields/SelectFilters/AdvancedFilters'

export type FilterValue =
  | string
  | number
  | boolean
  | string[]
  | { min: number; max: number }
  | { start: string; end: string }
  | Record<string, string>
  | Record<string, string>[]
  | { uuid: string; type: string; code: string; name: string }
  | { uuid: string; type: string; code: string; name: string }[]
  | undefined
  | null

export type SelectedFiltersType = Record<string, FilterValue>

export type FiltersChipsProps = {
  selectedFilters: Record<string, FilterValue>
  onFilterChange?: (filterKey: string, value: FilterValue) => void
  isStatic?: boolean
}

const getFilterLabel = (key: string, value: FilterValue): string => {
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

  // Rechercher le filtre dans AVAILABLE_FILTERS
  for (const category of AVAILABLE_FILTERS) {
    const filter = category.filters.find(f => f.code === key)

    if (filter) {
      // Si c'est un select avec des choix, récupérer le label de la valeur
      if (filter.type === 'select' && filter.options && typeof value === 'string') {
        const options = filter.options as { choices?: Record<string, string> | string[] }
        if (options.choices && typeof options.choices === 'object' && !Array.isArray(options.choices)) {
          const choiceLabel = options.choices[value]
          if (choiceLabel) {
            return choiceLabel
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
  if (key === 'zone' && typeof value === 'object' && typeof defaultValue === 'object' &&
    value !== null && defaultValue !== null &&
    'uuid' in value && 'uuid' in defaultValue) {
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

export const FiltersChips = ({ selectedFilters, onFilterChange, isStatic = false }: FiltersChipsProps) => {
  // Calculer automatiquement les valeurs par défaut
  const defaultValues = calculateDefaultValues(selectedFilters)

  // Exclure 'zones' de l'affichage (on garde seulement 'zone')
  const excludedKeys = ['zones']

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
          const label = getFilterLabel(key, value)

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
                variant={isDefault ? "outlined" : "contained"}
                iconLeft={iconLeft}
                iconRight={!isDefault && !isStatic ? Undo2 : undefined}
                onPress={() => handleChipPress(key)}
                testID={`filter-chip-${key}`}
                asChip={isStatic}
              >
                {label}{isDefault && !isStatic ? " - par défaut" : ""}
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

