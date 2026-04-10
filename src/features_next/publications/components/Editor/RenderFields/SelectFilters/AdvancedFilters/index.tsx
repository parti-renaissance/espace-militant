import React, { useCallback, useMemo } from 'react'
import { Spinner, XStack, YStack } from 'tamagui'

import DateInput from '@/components/base/DateInput'
import SelectV3 from '@/components/base/Select/SelectV3'
import Text from '@/components/base/Text'
import { useEditorStore } from '@/features_next/publications/components/Editor/store/editorStore'

import { useGetFilterCollection } from '@/services/publications/hook'
import { RestFilterCategory, RestFilterCollectionResponse } from '@/services/publications/schema'

import { FilterValue, SelectedFiltersType } from '../type'
import DateInterval, { type DateIntervalValue } from './DateInterval'

/** Codes de filtre à ne pas afficher dans les filtres avancés (déjà gérés dans le parent, ex. zone) */
const ADVANCED_FILTERS_BLACKLIST = ['zone'] as const

const getSelectOptions = (choices: Record<string, string> | string[]) => {
  if (Array.isArray(choices)) {
    return choices.map((c) => ({ value: c, label: c }))
  }
  return Object.entries(choices).map(([value, label]) => ({
    value,
    label,
  }))
}

// Filtres temporaires en attendant la mise à jour de l'API
export const AVAILABLE_FILTERS: RestFilterCollectionResponse = [
  {
    label: 'Filtres militants',
    color: '#3B82F6',
    filters: [
      {
        code: 'adherent_tags',
        label: 'Label militant',
        type: 'select',
        options: {
          favorite: true,
          advanced: true,
          placeholder: 'Tous les militants',
          choices: {
            '': 'Tous les militants',
            adherent: 'Adhérent',
            'adherent:a_jour_2026': 'Adhérent - À jour 2026',
            'adherent:a_jour_2026:primo': 'Adhérent - À jour 2026 - Primo-adhérent',
            'adherent:a_jour_2026:recotisation': 'Adhérent - À jour 2026 - Recotisation',
            'adherent:a_jour_2026:elu_a_jour': 'Adhérent - À jour 2026 - Élu à jour',
            'adherent:plus_a_jour': 'Adhérent - Plus à jour',
            'adherent:plus_a_jour:annee_2025': 'Adhérent - Plus à jour - À jour 2025',
            'adherent:plus_a_jour:annee_2024': 'Adhérent - Plus à jour - À jour 2024',
            'adherent:plus_a_jour:annee_2023': 'Adhérent - Plus à jour - À jour 2023',
            'adherent:plus_a_jour:annee_2022': 'Adhérent - Plus à jour - À jour 2022',
            sympathisant: 'Sympathisant',
            'sympathisant:adhesion_incomplete': 'Sympathisant - Adhésion incomplète',
            'sympathisant:compte_em': 'Sympathisant - Ancien compte En Marche',
            'sympathisant:compte_avecvous_jemengage': "Sympathisant - Anciens comptes Je m'engage et Avec vous",
            'sympathisant:autre_parti': "Sympathisant - Adhérent d'un autre parti",
            'sympathisant:besoin_d_europe': "Sympathisant - Besoin d'Europe",
            'sympathisant:ensemble2024': 'Sympathisant - Ensemble 2024',
          },
        },
      },
      {
        code: 'gender',
        label: 'Civilité',
        type: 'select',
        options: {
          choices: {
            female: 'Femme',
            male: 'Homme',
          },
        },
      },
    ],
  },
  {
    label: 'Filtres temporels',
    color: '#10B981',
    filters: [
      {
        code: 'first_membership',
        label: 'Première cotisation',
        type: 'date_interval',
        options: null,
      },
      {
        code: 'last_membership',
        label: 'Dernière cotisation',
        type: 'date_interval',
        options: null,
      },
      {
        code: 'registered',
        label: 'Création de compte',
        type: 'date_interval',
        options: null,
      },
    ],
  },
  {
    label: 'Filtres élus',
    color: '#8B5CF6',
    filters: [
      {
        code: 'elect_tags',
        label: 'Label élu',
        type: 'select',
        options: {
          favorite: true,
          advanced: true,
          choices: {
            elu: 'Élu',
            'elu:attente_declaration': 'Élu - En attente de déclaration',
            'elu:cotisation_ok': 'Élu - À jour de cotisation',
            'elu:cotisation_ok:exempte': 'Élu - À jour de cotisation - Exempté de cotisation',
            'elu:cotisation_ok:non_soumis': 'Élu - À jour de cotisation - Non soumis à cotisation',
            'elu:cotisation_ok:soumis': 'Élu - À jour de cotisation - Soumis à cotisation',
            'elu:cotisation_nok': 'Élu - Non à jour de cotisation',
            'elu:exempte_et_adherent_cotisation_nok': 'Élu - Exempté mais pas à jour de cotisation adhérent',
          },
        },
      },
      {
        code: 'declared_mandate',
        label: 'Mandat',
        type: 'select',
        options: {
          multiple: false,
          advanced: true,
          choices: {
            depute_europeen: 'Député européen',
            senateur: 'Sénateur',
            depute: 'Député',
            president_conseil_regional: 'Président du Conseil régional',
            conseiller_regional: 'Conseiller régional',
            president_conseil_departemental: 'Président du Conseil départemental',
            conseiller_departemental: 'Conseiller départemental',
            conseiller_territorial: 'Conseiller territorial',
            president_conseil_communautaire: 'Président du Conseil communautaire',
            conseiller_communautaire: 'Conseiller communautaire',
            maire: 'Maire',
            conseiller_municipal: 'Conseiller municipal',
            conseiller_municipal_opposition: "Conseiller municipal d'opposition",
            conseiller_arrondissement: "Conseiller d'arrondissement",
            membre_assemblee_fde: "Membre de l'Assemblée des Français de l'étranger",
            conseiller_fde: 'Conseiller FDE',
            delegue_consulaire: 'Délégué consulaire',
            ministre: 'Ministre',
          },
        },
      },
    ],
  },
]

interface AdvancedFiltersProps {
  selectedFilters?: SelectedFiltersType
  onFilterChange?: (filterCode: string, value: FilterValue) => void
}

function AdvancedFiltersInner({ selectedFilters = {}, onFilterChange }: AdvancedFiltersProps) {
  const scope = useEditorStore((s) => s.scope) ?? ''
  const { data: filterCollection, isLoading } = useGetFilterCollection({
    scope,
    enabled: !!scope,
  })

  const displayFilters = useMemo(() => (filterCollection && filterCollection.length > 0 ? filterCollection : AVAILABLE_FILTERS), [filterCollection])

  const visibleCategories = useMemo(
    () => displayFilters.filter((category) => category.filters.some((filter) => !(ADVANCED_FILTERS_BLACKLIST as readonly string[]).includes(filter.code))),
    [displayFilters],
  )

  const handleFilterChange = useCallback(
    (filterCode: string, value: FilterValue) => {
      onFilterChange?.(filterCode, value)
    },
    [onFilterChange],
  )

  const getFilterValue = useCallback(
    (filterCode: string): string => {
      const value = selectedFilters[filterCode]
      if (typeof value === 'string') return value
      if (typeof value === 'number') return value.toString()
      if (typeof value === 'boolean') return value.toString()
      if (typeof value === 'object' && value !== null) {
        if ('uuid' in value && typeof (value as { uuid: unknown }).uuid === 'string') return (value as { uuid: string }).uuid
        if ('value' in value && typeof (value as { value: unknown }).value === 'string') return (value as { value: string }).value
      }
      return ''
    },
    [selectedFilters],
  )

  if (isLoading) {
    return (
      <YStack gap="$small" padding="$medium" justifyContent="center" alignItems="center">
        <Spinner size="small" color="$blue6" />
        <Text.SM secondary>Chargement des filtres...</Text.SM>
      </YStack>
    )
  }

  return (
    <YStack gap="$medium">
      {visibleCategories.map((category: RestFilterCategory, categoryIndex: number) => (
        <YStack key={categoryIndex} gap="$small">
          <XStack alignItems="center" gap="$small">
            <Text.MD secondary>{category.label}</Text.MD>
            <YStack h={1} flexGrow={1} mt={2} bg="$textOutline" />
          </XStack>
          <YStack gap="$small">
            {category.filters.map((filter, filterIndex: number) => {
              if (ADVANCED_FILTERS_BLACKLIST.includes(filter.code as (typeof ADVANCED_FILTERS_BLACKLIST)[number])) {
                return null
              }
              if (filter.type === 'select' && filter.options && 'choices' in filter.options) {
                const choices = filter.options.choices
                if (typeof choices === 'object' && choices !== null) {
                  const options = getSelectOptions(choices as Record<string, string> | string[])
                  const isLastCategory = categoryIndex === visibleCategories.length - 1
                  const isLastTwoInLastCategory = isLastCategory && filterIndex >= category.filters.length - 2
                  const hasEmptyOption = options.some((option) => option.value === '' || option.value === null)

                  return (
                    <SelectV3
                      key={filterIndex}
                      label={filter.label}
                      value={getFilterValue(filter.code)}
                      options={options}
                      onChange={(value) => handleFilterChange(filter.code, value === '' || value === null ? null : value)}
                      noValuePlaceholder={filter.options.placeholder || 'Choisir'}
                      nullableOption={!hasEmptyOption ? 'Aucune sélection' : undefined}
                      size="md"
                      color="gray"
                      openAbove={isLastTwoInLastCategory}
                      // searchable={true}
                    />
                  )
                }
              }

              if (filter.type === 'date') {
                return (
                  <DateInput
                    key={filterIndex}
                    label={filter.label}
                    value={(selectedFilters[filter.code] as string) || null}
                    onChange={(value: string | null) => {
                      handleFilterChange(filter.code, value)
                    }}
                    placeholder={`Sélectionner ${filter.label.toLowerCase()}`}
                    size="md"
                    color="gray"
                    resetable
                  />
                )
              }

              if (filter.type === 'date_interval') {
                const raw = selectedFilters[filter.code]
                const intervalValue: DateIntervalValue =
                  raw && typeof raw === 'object' && 'start' in raw && 'end' in raw
                    ? {
                        start: (raw as DateIntervalValue).start ?? null,
                        end: (raw as DateIntervalValue).end ?? null,
                      }
                    : { start: null, end: null }
                return (
                  <DateInterval
                    key={filterIndex}
                    labelFrom={`${filter.label} après le`}
                    labelTo={`${filter.label} avant le`}
                    value={intervalValue}
                    onChange={(value) => handleFilterChange(filter.code, value)}
                    size="md"
                    color="gray"
                    resetable
                  />
                )
              }

              // Pour les autres types de filtres, afficher juste le label et le type
              return (
                <SelectV3
                  key={filterIndex}
                  label={filter.label}
                  value=""
                  options={[{ value: '', label: 'En cours de développement' }]}
                  onChange={() => {}}
                  placeholder="En cours de développement"
                  size="sm"
                  color="gray"
                  disabled={true}
                />
              )
            })}
          </YStack>
        </YStack>
      ))}
    </YStack>
  )
}

export default React.memo(AdvancedFiltersInner)
