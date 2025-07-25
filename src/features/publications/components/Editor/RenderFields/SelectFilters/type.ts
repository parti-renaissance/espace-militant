type FilterValue =
  | string
  | number
  | boolean
  | string[]
  | { min: number; max: number }
  | { start: string; end: string }
  | Record<string, string>
  | Record<string, string>[]
  | undefined
  | null

export type SelectedFiltersType = Record<string, FilterValue>;

export type HierarchicalQuickFilterType = {
  value: string;
  label: string;
  type: 'radio';
  level: number;
  parentId: string | null;
  count?: number;
  filters: SelectedFiltersType;
};