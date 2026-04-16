import React from 'react'
import { Image } from 'expo-image'

import EmptyStateWithFilters from '@/components/EmptyStates/EmptyStateWithFilters'

import EmptyStateImage from '@/assets/illustrations/empty_state_publications.png'

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

  return (
    <EmptyStateWithFilters
      title={title}
      subtitle={subtitle}
      onResetFilters={onResetFilters}
      illustration={<Image source={EmptyStateImage} style={{ width: 179, height: 190 }} contentFit="contain" />}
    />
  )
}
