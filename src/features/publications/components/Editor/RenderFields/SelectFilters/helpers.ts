import { format, subMonths } from "date-fns";
import { HierarchicalQuickFilterType, SelectedFiltersType } from "./type";

export function getHierarchicalQuickFilters(): HierarchicalQuickFilterType[] {
  const today = new Date();
  const oneMonthAgo = subMonths(today, 1);
  const formatDate = (date: Date) => format(date, 'yyyy-MM-dd');

  return [
    {
      value: 'tous-contacts',
      label: 'Tous mes contacts',
      type: 'radio',
      level: 0,
      parentId: null,
      filters: {
        'adherent_tags': undefined
      }
    },
    {
      value: 'adherents',
      label: 'Mes adhérents',
      type: 'radio',
      level: 1,
      parentId: 'tous-contacts',
      filters: {
        'adherent_tags': 'adherent'
      }
    },
    {
      value: 'a-jour',
      label: 'À jour de cotisation',
      type: 'radio',
      level: 2,
      parentId: 'adherents',
      filters: {
        'adherent_tags': 'adherent:a_jour_2025'
      }
    },
    {
      value: 'primos',
      label: 'Primos',
      type: 'radio',
      level: 3,
      parentId: 'a-jour',
      filters: {
        'adherent_tags': 'adherent:a_jour_2025:primo'
      }
    },
    {
      value: 'primos-recents',
      label: 'Primos depuis moins d’un mois',
      type: 'radio',
      level: 4,
      parentId: 'primos',
      filters: {
        'adherent_tags': 'adherent:a_jour_2025:primo',
        'firstMembership': { start: formatDate(oneMonthAgo), end: formatDate(today) }
      }
    },
    {
      value: 'non-a-jour',
      label: 'Non à jour de cotisation',
      type: 'radio',
      level: 2,
      parentId: 'adherents',
      filters: {
        'adherent_tags': 'adherent:plus_a_jour'
      }
    },
    {
      value: 'sympathisants',
      label: 'Mes Sympathisants',
      type: 'radio',
      level: 1,
      parentId: 'tous-contacts',
      filters: {
        'adherent_tags': 'sympathisant'
      }
    }
  ];
}

export const identifyQuickFilter = (filters: SelectedFiltersType): string | null => {
  const quickFilters = [
    {
      value: 'tous-contacts',
      filters: { 'adherent_tags': null }
    },
    {
      value: 'adherents',
      filters: { 'adherent_tags': 'adherent' }
    },
    {
      value: 'a-jour',
      filters: { 'adherent_tags': 'adherent:a_jour_2025' }
    },
    {
      value: 'primos-recents',
      filters: {
        'adherent_tags': 'adherent:a_jour_2025:primo',
        'first_membership_since': { start: '', end: '' }
      }
    },
    {
      value: 'primos',
      filters: { 'adherent_tags': 'adherent:a_jour_2025:primo' }
    },
    {
      value: 'non-a-jour',
      filters: { 'adherent_tags': 'adherent:plus_a_jour' }
    },
    {
      value: 'sympathisants',
      filters: { 'adherent_tags': 'sympathisant' }
    }
  ]

  const matchingQuickFilter = quickFilters.find(qf => {
    const quickFilterFields = Object.keys(qf.filters)
    const hasMatchingQuickFilterFields = quickFilterFields.every(key => {
      const quickFilterValue = qf.filters[key]
      const filterValue = filters[key]

      if (key === 'first_membership_since') {
        return filterValue !== null && filterValue !== undefined
      }

      return JSON.stringify(quickFilterValue) === JSON.stringify(filterValue)
    })

    if (!hasMatchingQuickFilterFields) {
      return false
    }

    const allFields = [
      'is_certified', 'committee', 'is_committee_member', 'mandate_type',
      'declared_mandate', 'is_campus_registered', 'donator_status', 'adherent_tags',
      'elect_tags', 'static_tags', 'gender', 'age_min', 'age_max', 'first_name',
      'last_name', 'registered_since', 'registered_until', 'first_membership_since',
      'first_membership_before', 'last_membership_since', 'last_membership_before'
    ]

    const nonQuickFilterFields = allFields.filter(field => !quickFilterFields.includes(field))
    const hasNullNonQuickFilterFields = nonQuickFilterFields.every(field => {
      return filters[field] === null || filters[field] === undefined
    })

    return hasNullNonQuickFilterFields
  })

  return matchingQuickFilter?.value || null
}

export const getItemState = (itemId: string, tempSelectedQuickFilter: string | null, quickFilters: HierarchicalQuickFilterType[]) => {
  const isSelected = tempSelectedQuickFilter === itemId

  if (isSelected) {
    return 'selected'
  }

  const item = quickFilters.find(d => d.value === itemId)

  if (item && item.parentId) {
    const checkParentSelection = (currentParentId: string): boolean => {
      const parentSelected = tempSelectedQuickFilter === currentParentId
      if (parentSelected) {
        return true
      }
      const parent = quickFilters.find(d => d.value === currentParentId)
      if (parent && parent.parentId) {
        return checkParentSelection(parent.parentId)
      }
      return false
    }
    if (checkParentSelection(item.parentId)) {
      return 'parentSelected'
    }
  }
  
  return 'default'
}