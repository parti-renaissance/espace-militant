import { ScrollView, YStack } from 'tamagui'
import type { Meta, StoryObj } from '@storybook/react'

import type { FilterDefinition, FiltersCollectionResponse } from '@/services/filters-collection/schema'

import FilterCollectionBuilder from './FilterCollectionBuilder'
import type { FilterValues } from './FilterCollectionBuilder'

/** Un champ par type + type inconnu, labels agnostiques — pour comprendre le composant */
const MOCK_COLLECTION_ALL_TYPES: FiltersCollectionResponse = [
  {
    label: 'Types de champs',
    color: '#0E7490',
    filters: [
      { code: 'field_text', label: 'Texte', options: null, type: 'text' },
      {
        code: 'field_select',
        label: 'Liste déroulante',
        options: { choices: { a: 'Option A', b: 'Option B', c: 'Option C' } },
        type: 'select',
      },
      {
        code: 'field_integer_interval',
        label: 'Intervalle entier',
        options: {
          first: { min: 0, max: 100 },
          second: { min: 0, max: 100 },
        },
        type: 'integer_interval',
      },
      {
        code: 'field_date_interval',
        label: 'Intervalle de dates',
        options: null,
        type: 'date_interval',
      },
      { code: 'field_date', label: 'Date', options: null, type: 'date' },
      {
        code: 'field_zone',
        label: 'Zone (autocomplete)',
        options: {
          url: '/api/v3/zone/autocomplete',
          query_param: 'q',
          value_param: 'uuid',
          label_param: 'name',
          multiple: false,
        },
        type: 'zone_autocomplete',
      },
    ],
  },
  {
    label: 'Champs inconnus affichés en staging',
    color: '#0E7490',
    filters: [{ code: 'field_unknown', label: 'Type inconnu', options: null, type: 'unknown' } as unknown as FilterDefinition],
  },
]

const meta: Meta<typeof FilterCollectionBuilder> = {
  title: 'Filters/FilterCollectionBuilder',
  component: FilterCollectionBuilder,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    featureKey: { control: 'text' },
    scope: { control: 'text' },
  },
}

export default meta

type Story = StoryObj<typeof meta>

export const WithMockAllFieldTypes: Story = {
  args: {
    featureKey: 'contacts',
    onChangeFilter: (values: FilterValues) => {
      // eslint-disable-next-line no-console
      console.log('onChangeFilter', values)
    },
  },
  render: (args) => (
    <ScrollView padding="$medium" pb={350}>
      <YStack gap="$medium" maxWidth={480}>
        <FilterCollectionBuilder {...args} collection={MOCK_COLLECTION_ALL_TYPES} />
      </YStack>
    </ScrollView>
  ),
}

export const WithInitialValues: Story = {
  args: {
    featureKey: 'contacts',
    initialValues: {
      field_text: 'exemple',
      field_select: 'b',
      field_integer_interval: { start: 10, end: 50 },
      field_date_interval: { start: '2020-01-01', end: '2025-12-31' },
      field_date: '2024-06-15',
    },
    onChangeFilter: (values: FilterValues) => {
      // eslint-disable-next-line no-console
      console.log('onChangeFilter', values)
    },
  },
  render: (args) => (
    <ScrollView padding="$medium" pb={350}>
      <YStack gap="$medium" maxWidth={480}>
        <FilterCollectionBuilder {...args} collection={MOCK_COLLECTION_ALL_TYPES} />
      </YStack>
    </ScrollView>
  ),
}
