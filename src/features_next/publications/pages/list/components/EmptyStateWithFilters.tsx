import React from 'react'

import EmptyStateWithFilters from '@/components/EmptyStates/EmptyStateWithFilters'

import { PublicationsFilters } from '../index'

interface PublicationsEmptyStateWithFiltersProps {
  filters: PublicationsFilters
  onResetFilters: () => void
}

function getFilterLabel(filters: PublicationsFilters): string {
  if (filters.status === 'draft') return 'brouillons'
  if (filters.status === 'sent') return 'publiées'
  return ''
}

export default function PublicationsEmptyStateWithFilters({ filters, onResetFilters }: PublicationsEmptyStateWithFiltersProps) {
  const filterLabel = getFilterLabel(filters)
  const title = filterLabel ? `Aucune publication "${filterLabel}" trouvée` : 'Aucune publication trouvée'
  const subtitle = 'Aucune publication ne correspond à vos filtres actifs.'

  return <EmptyStateWithFilters title={title} subtitle={subtitle} onResetFilters={onResetFilters} />
}
