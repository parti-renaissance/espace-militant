export interface SearchResult {
  id: string
  label: string
  subLabel?: string
  type: 'address' | 'zone' | 'user' | 'place'
  metadata?: Record<string, unknown>
}

import type { IconComponent } from '@/models/common.model'

export interface SearchProvider {
  search(query: string, scope?: string): Promise<SearchResult[]>
  getDetails(id: string): Promise<SearchResult | null>
  isSearchable(query: string): boolean
  getIcon(): IconComponent
  getPlaceholder(): string
}

export interface GlobalSearchProps {
  defaultValue?: string | { value: string | null; label: string }
  onSelect: (result: SearchResult | null) => void
  provider: SearchProvider
  placeholder?: string
  error?: string
  minimal?: boolean
  maxWidth?: string | number
  minWidth?: string | number
  onBlur?: () => void
  onReset?: () => void
  disabled?: boolean
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  scope?: string
  nullable?: boolean
  helpText?: string | React.ReactNode
} 