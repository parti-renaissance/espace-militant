import React from 'react'
import { XStack, YStack } from 'tamagui'
import Text from '@/components/base/Text'
import SelectV3 from '@/components/base/Select/SelectV3'
import { useGetFilterCollection } from '@/services/publications/hook'
import { RestFilterCategory, RestFilterCollectionResponse } from '@/services/publications/schema'
import { SelectedFiltersType } from './type'

// Filtres temporaires en attendant la mise à jour de l'API
const AVAILABLE_FILTERS: RestFilterCollectionResponse = [
  {
    label: "Filtres militants",
    color: "#3B82F6",
    filters: [
    //   {
    //     code: "committee",
    //     label: "Membres du comité",
    //     type: "select",
    //     options: {
    //       choices: {
    //         "Non": "Non",
    //         "Oui": "Oui"
    //       }
    //     }
    //   },
      {
        code: "adherent_tags",
        label: "Label militant",
        type: "select",
        options: {
          favorite: true,
          advanced: true,
          placeholder: "Tous les militants",
          choices: {
            "adherent": "Adhérent",
            "adherent:a_jour_2025": "Adhérent - À jour 2025",
            "adherent:a_jour_2025:primo": "Adhérent - À jour 2025 - Primo-adhérent",
            "adherent:a_jour_2025:recotisation": "Adhérent - À jour 2025 - Recotisation",
            "adherent:a_jour_2025:elu_a_jour": "Adhérent - À jour 2025 - Élu à jour",
            "adherent:plus_a_jour": "Adhérent - Plus à jour",
            "adherent:plus_a_jour:annee_2024": "Adhérent - Plus à jour - À jour 2024",
            "adherent:plus_a_jour:annee_2023": "Adhérent - Plus à jour - À jour 2023",
            "adherent:plus_a_jour:annee_2022": "Adhérent - Plus à jour - À jour 2022",
            "sympathisant": "Sympathisant",
            "sympathisant:adhesion_incomplete": "Sympathisant - Adhésion incomplète",
            "sympathisant:compte_em": "Sympathisant - Ancien compte En Marche",
            "sympathisant:compte_avecvous_jemengage": "Sympathisant - Anciens comptes Je m'engage et Avec vous",
            "sympathisant:autre_parti": "Sympathisant - Adhérent d'un autre parti",
            "sympathisant:besoin_d_europe": "Sympathisant - Besoin d'Europe",
            "sympathisant:ensemble2024": "Sympathisant - Ensemble 2024"
          }
        }
      },
      {
        code: "static_tags",
        label: "Labels divers",
        type: "select",
        options: {
          favorite: true,
          advanced: true,
          choices: {
            "national_event:levenement-6-avril": "Levenement 6 Avril",
            "national_event:rentree-2025": "Rentree 2025",
            "conseil-national:membre-du-burex": "Conseil national - Membre du Burex",
            "conseil-national:ancien-membre-du-burex": "Conseil national - Ancien membre du Burex",
            "conseil-national:membre-du-cese": "Conseil national - Membre du CESE"
          }
        }
      },
      {
        code: "gender",
        label: "Civilité",
        type: "select",
        options: {
          choices: {
            female: "Femme",
            male: "Homme",
            other: "Autre"
          }
        }
      }
    ]
  },
  {
    label: "Filtres temporels",
    color: "#10B981",
    filters: [
      {
        code: "firstMembership",
        label: "Date de première cotisation",
        type: "date_interval",
        options: null
      },
      {
        code: "lastMembership",
        label: "Date de dernière cotisation",
        type: "date_interval",
        options: null
      },
      {
        code: "registered",
        label: "Date de création de compte",
        type: "date_interval",
        options: null
      }
    ]
  },
  {
    label: "Filtres élus",
    color: "#8B5CF6",
    filters: [
      {
        code: "elect_tags",
        label: "Label élu",
        type: "select",
        options: {
          favorite: true,
          advanced: true,
          choices: {
            "elu": "Élu",
            "elu:attente_declaration": "Élu - En attente de déclaration",
            "elu:cotisation_ok": "Élu - À jour de cotisation",
            "elu:cotisation_ok:exempte": "Élu - À jour de cotisation - Exempté de cotisation",
            "elu:cotisation_ok:non_soumis": "Élu - À jour de cotisation - Non soumis à cotisation",
            "elu:cotisation_ok:soumis": "Élu - À jour de cotisation - Soumis à cotisation",
            "elu:cotisation_nok": "Élu - Non à jour de cotisation",
            "elu:exempte_et_adherent_cotisation_nok": "Élu - Exempté mais pas à jour de cotisation adhérent"
          }
        }
      },
      {
        code: "declared_mandate",
        label: "Mandat",
        type: "select",
        options: {
          multiple: false,
          advanced: true,
          choices: {
            "depute_europeen": "Député européen",
            "senateur": "Sénateur",
            "depute": "Député",
            "president_conseil_regional": "Président du Conseil régional",
            "conseiller_regional": "Conseiller régional",
            "president_conseil_departemental": "Président du Conseil départemental",
            "conseiller_departemental": "Conseiller départemental",
            "conseiller_territorial": "Conseiller territorial",
            "president_conseil_communautaire": "Président du Conseil communautaire",
            "conseiller_communautaire": "Conseiller communautaire",
            "maire": "Maire",
            "conseiller_municipal": "Conseiller municipal",
            "conseiller_arrondissement": "Conseiller d'arrondissement",
            "membre_assemblee_fde": "Membre de l'Assemblée des Français de l'étranger",
            "conseiller_fde": "Conseiller FDE",
            "delegue_consulaire": "Délégué consulaire",
            "ministre": "Ministre"
          }
        }
      }
    ]
  }
];

interface AdvancedFiltersProps {
  scope?: string
  selectedFilters?: SelectedFiltersType
  onFilterChange?: (filterCode: string, value: string | null) => void
}

export default function AdvancedFilters({ scope, selectedFilters = {}, onFilterChange }: AdvancedFiltersProps) {
  const { data: filterCollection, isLoading, error } = useGetFilterCollection({ 
    scope: scope || '', 
    enabled: false
  })

//   if (isLoading) {
//     return (
//       <YStack gap="$medium">
//         <Text.SM secondary>Chargement des filtres...</Text.SM>
//       </YStack>
//     )
//   }

//   if (error || !filterCollection) {
//     return (
//       <YStack gap="$medium">
//         <Text.SM secondary>Erreur lors du chargement des filtres</Text.SM>
//       </YStack>
//     )
//   }

//   if (filterCollection.length === 0) {
//     return (
//       <YStack gap="$medium">
//         <Text.SM secondary>Aucun filtre avancé disponible</Text.SM>
//       </YStack>
//     )
//   }

  const displayFilters = AVAILABLE_FILTERS

  const getSelectOptions = (choices: Record<string, string>) => {
    return Object.entries(choices).map(([value, label]) => ({
      value,
      label
    }))
  }

  const handleFilterChange = (filterCode: string, value: string) => {
    onFilterChange?.(filterCode, value || null)
  }

  const getFilterValue = (filterCode: string): string => {
    const value = selectedFilters[filterCode]
    if (typeof value === 'string') return value
    if (typeof value === 'number') return value.toString()
    if (typeof value === 'boolean') return value.toString()
    return ''
  }

  return (
    <YStack gap="$medium">
      {displayFilters.map((category: RestFilterCategory, categoryIndex: number) => (
        <YStack key={categoryIndex} gap="$small">
          <XStack alignItems="center" gap="$small">
            <Text.MD secondary>
              {category.label}
            </Text.MD>
            <YStack h={1} flexGrow={1} mt={2} bg="$textOutline" />
          </XStack>
          <YStack gap="$small">
            {category.filters.map((filter, filterIndex: number) => {
              if (filter.type === 'select' && filter.options && 'choices' in filter.options) {
                const choices = filter.options.choices
                if (typeof choices === 'object' && choices !== null) {
                  const options = getSelectOptions(choices as Record<string, string>)
                  return (
                    <SelectV3
                      key={filterIndex}
                      label={filter.label}
                      value={getFilterValue(filter.code)}
                      options={options}
                      onChange={(value) => handleFilterChange(filter.code, value)}
                      placeholder={filter.options.placeholder || `Sélectionner ${filter.label.toLowerCase()}`}
                      size="sm"
                      color="gray"
                      // searchable={true}
                    />
                  )
                }
              }
              
              // Pour les autres types de filtres, afficher juste le label et le type
              return (
                <SelectV3
                  key={filterIndex}
                  label={filter.label}
                  value=""
                  options={[{ value: "dev", label: "En cours de développement" }]}
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