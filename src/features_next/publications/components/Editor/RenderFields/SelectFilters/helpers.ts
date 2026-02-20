import { format, parseISO, startOfDay, subMonths } from 'date-fns'

import { HierarchicalQuickFilterType, isEmptyInterval, isIntervalObject, SelectedFiltersType } from './type'

export function getHierarchicalQuickFilters(): HierarchicalQuickFilterType[] {
  const today = new Date()
  const oneMonthAgo = subMonths(today, 1)
  const formatDate = (date: Date) => format(date, 'yyyy-MM-dd')

  return [
    {
      value: 'tous-contacts',
      label: 'Tous mes contacts',
      type: 'radio',
      level: 0,
      parentId: null,
      filters: {
        adherent_tags: null,
        first_membership: null,
      },
    },
    {
      value: 'adherents',
      label: 'Mes adhérents',
      type: 'radio',
      level: 1,
      parentId: 'tous-contacts',
      filters: {
        adherent_tags: 'adherent',
        first_membership: null,
      },
    },
    {
      value: 'a-jour',
      label: 'À jour de cotisation',
      type: 'radio',
      level: 2,
      parentId: 'adherents',
      filters: {
        adherent_tags: 'adherent:a_jour_2026',
        first_membership: null,
      },
    },
    {
      value: 'primos',
      label: 'Primos',
      type: 'radio',
      level: 3,
      parentId: 'a-jour',
      filters: {
        adherent_tags: 'adherent:a_jour_2026:primo',
        first_membership: null,
      },
    },
    {
      value: 'primos-recents',
      label: 'Primos depuis moins d’un mois',
      type: 'radio',
      level: 4,
      parentId: 'primos',
      filters: {
        adherent_tags: 'adherent:a_jour_2026:primo',
        first_membership: { start: formatDate(oneMonthAgo), end: null },
      },
    },
    {
      value: 'non-a-jour',
      label: 'Non à jour de cotisation',
      type: 'radio',
      level: 2,
      parentId: 'adherents',
      filters: {
        adherent_tags: 'adherent:plus_a_jour',
        first_membership: null,
      },
    },
    {
      value: 'sympathisants',
      label: 'Mes Sympathisants',
      type: 'radio',
      level: 1,
      parentId: 'tous-contacts',
      filters: {
        adherent_tags: 'sympathisant',
        first_membership: null,
      },
    },
  ]
}

export const identifyQuickFilter = (filters: SelectedFiltersType): string | null => {
  const quickFilters = [
    {
      value: 'tous-contacts',
      filters: { adherent_tags: null },
    },
    {
      value: 'adherents',
      filters: { adherent_tags: 'adherent' },
    },
    {
      value: 'a-jour',
      filters: { adherent_tags: 'adherent:a_jour_2026' },
    },
    {
      value: 'primos-recents',
      filters: {
        adherent_tags: 'adherent:a_jour_2026:primo',
        first_membership: { start: 'today - 30 days', end: null },
      },
    },
    {
      value: 'primos',
      filters: { adherent_tags: 'adherent:a_jour_2026:primo' },
    },
    {
      value: 'non-a-jour',
      filters: { adherent_tags: 'adherent:plus_a_jour' },
    },
    {
      value: 'sympathisants',
      filters: { adherent_tags: 'sympathisant' },
    },
  ]

  /** Vérifie si une date string correspond à "aujourd'hui - 1 mois" (aligné avec getHierarchicalQuickFilters qui utilise subMonths) */
  const isDateWithinLastMonth = (dateStr: string): boolean => {
    try {
      const date = startOfDay(parseISO(dateStr))
      if (isNaN(date.getTime())) return false
      const cutoff = startOfDay(subMonths(new Date(), 1))
      return date >= cutoff
    } catch {
      return false
    }
  }

  const matchingQuickFilter = quickFilters.find((qf) => {
    const quickFilterFields = Object.keys(qf.filters)
    const hasMatchingQuickFilterFields = quickFilterFields.every((key) => {
      const quickFilterValue = qf.filters[key]
      const filterValue = filters[key]
      if (isIntervalObject(quickFilterValue)) {
        if (!isIntervalObject(filterValue) || isEmptyInterval(filterValue)) return false
        // Cas spécial "primos-recents" : vérifier que first_membership.start correspond au dernier mois
        if (key === 'first_membership' && quickFilterValue.start === 'today - 30 days') {
          const start = filterValue.start
          return typeof start === 'string' && isDateWithinLastMonth(start)
        }
        return true
      }
      return JSON.stringify(quickFilterValue) === JSON.stringify(filterValue)
    })

    if (!hasMatchingQuickFilterFields) return false

    const metadataKeys = ['uuid']
    const protectedKeys = ['zone', 'zones'] // coexistent avec les quick filters, ne doivent pas être vides
    const isFilterEmpty = (v: unknown): boolean =>
      v === null || v === undefined || (isIntervalObject(v) && isEmptyInterval(v))

    const nonQuickFilterKeys = Object.keys(filters).filter(
      (key) => !quickFilterFields.includes(key) && !metadataKeys.includes(key) && !protectedKeys.includes(key),
    )
    const hasNullNonQuickFilterFields = nonQuickFilterKeys.every((key) => isFilterEmpty(filters[key]))

    return hasNullNonQuickFilterFields
  })

  return matchingQuickFilter?.value || null
}

export const getItemState = (itemId: string, selectedQuickFilterId: string | null, quickFilters: HierarchicalQuickFilterType[]) => {
  const isSelected = selectedQuickFilterId === itemId

  if (isSelected) {
    return 'selected'
  }

  const item = quickFilters.find((d) => d.value === itemId)

  if (item && item.parentId) {
    const checkParentSelection = (currentParentId: string): boolean => {
      const parentSelected = selectedQuickFilterId === currentParentId
      if (parentSelected) {
        return true
      }
      const parent = quickFilters.find((d) => d.value === currentParentId)
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
