import type { Meta, StoryObj } from '@storybook/react'
import { YStack, Card, ScrollView } from 'tamagui'
import { MapPin } from '@tamagui/lucide-icons'
import { AddressProvider, GlobalSearch, ZoneProvider } from './index'
import { SearchResult } from './types'
import Text from '@/components/base/Text'

const meta: Meta<typeof GlobalSearch> = {
  title: 'GlobalSearch',
  component: GlobalSearch,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    placeholder: {
      control: 'text',
    },
    error: {
      control: 'text',
    },
    disabled: {
      control: 'boolean',
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    maxWidth: {
      control: 'text',
    },
    minWidth: {
      control: 'text',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Fake provider pour les stories
const fakeAddressProvider = {
  search: async (query: string) => {
    await new Promise(resolve => setTimeout(resolve, 500))

    if (query.length < 3) return []

    return [
      {
        id: 'address-1',
        label: '123 Rue de la Paix, 75001 Paris, France',
        type: 'address' as const,
        metadata: { googlePlace: {} }
      },
      {
        id: 'address-2',
        label: '456 Avenue des Champs-Élysées, 75008 Paris, France',
        type: 'address' as const,
        metadata: { googlePlace: {} }
      },
      {
        id: 'address-3',
        label: '789 Boulevard Saint-Germain, 75006 Paris, France',
        type: 'address' as const,
        metadata: { googlePlace: {} }
      }
    ]
  },

  getDetails: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 300))

    return {
      id,
      label: '123 Rue de la Paix, 75001 Paris, France',
      type: 'address' as const,
      metadata: {
        addressComponents : {
          address: '123 Rue de la Paix',
          city: 'Paris',
          postalCode: '75001',
          country: 'France',
          location: { lat: 48.8566, lng: 2.3522 }
        },
        googleDetails: {}
      }
    }
  },

  isSearchable: (query: string) => query.length >= 3,
  getIcon: () => MapPin,
  getPlaceholder: () => 'Rechercher une adresse...'
}

// Story principale avec toutes les variantes
export const AllVariants: Story = {
  render: () => {
    const handleSelect = (result: SearchResult) => {
      console.log('Résultat sélectionné:', result)
      if (result.type === 'address' && result.metadata?.addressComponents) {
        console.log('Composants d\'adresse:', result.metadata.addressComponents)
      }
    }

    return (
      <ScrollView flex={1} width="100%" backgroundColor="$surface" padding="$medium" showsVerticalScrollIndicator={false}>
        <YStack gap="$xlarge" maxWidth={480} width="100%" marginHorizontal="auto" paddingBottom={100} >

          <Text.LG semibold>GlobalSearch</Text.LG>

          {/* Instructions */}
          <Card padding="$medium" backgroundColor="$blue9">
            <Text.MD semibold color="$white1">Instructions d'utilisation</Text.MD>
            <Text.SM color="$white1" marginTop="$small">
              • Tapez au moins 3 caractères pour commencer la recherche d'adresse
            </Text.SM>
            <Text.SM color="$white1">
              • Cliquez sur un résultat pour voir les détails dans la console
            </Text.SM>
            <Text.SM color="$white1">
              • Tous les composants utilisent le même provider fake pour la démonstration
            </Text.SM>
          </Card>

                      {/* Variante de base */}
            <Card padding="$medium" backgroundColor="$white1">
              <Text.MD semibold marginBottom="$small">Variante de base</Text.MD>
              <GlobalSearch
                provider={fakeAddressProvider}
                onSelect={handleSelect}
                placeholder="Rechercher une adresse..."
              />
            </Card>

            {/* Variante avec taille personnalisée */}
            <Card padding="$medium" backgroundColor="$white1">
              <Text.MD semibold marginBottom="$small">Taille large (lg)</Text.MD>
              <GlobalSearch
                provider={fakeAddressProvider}
                onSelect={handleSelect}
                placeholder="Rechercher une adresse..."
                size="lg"
              />
            </Card>

            {/* Variante avec erreur */}
            <Card padding="$medium" backgroundColor="$white1">
              <Text.MD semibold marginBottom="$small">Avec erreur</Text.MD>
              <GlobalSearch
                provider={fakeAddressProvider}
                onSelect={handleSelect}
                placeholder="Rechercher une adresse..."
                error="Veuillez sélectionner une adresse valide"
              />
            </Card>

            {/* Variante désactivée */}
            <Card padding="$medium" backgroundColor="$white1">
              <Text.MD semibold marginBottom="$small">Désactivé</Text.MD>
              <GlobalSearch
                provider={fakeAddressProvider}
                onSelect={handleSelect}
                placeholder="Rechercher une adresse..."
                disabled={true}
              />
            </Card>

            {/* Variante avec valeur par défaut */}
            <Card padding="$medium" backgroundColor="$white1">
              <Text.MD semibold marginBottom="$small">Valeur par défaut</Text.MD>
              <GlobalSearch
                provider={fakeAddressProvider}
                onSelect={handleSelect}
                placeholder="Rechercher une adresse..."
                defaultValue="123 Rue de la Paix, Paris"
              />
            </Card>

            {/* Variante avec largeur contrainte */}
            <Card padding="$medium" backgroundColor="$white1">
              <Text.MD semibold marginBottom="$small">Largeur contrainte</Text.MD>
              <GlobalSearch
                provider={fakeAddressProvider}
                onSelect={handleSelect}
                placeholder="Rechercher une adresse..."
                minWidth={200}
                maxWidth={300}
              />
            </Card>

            {/* Variante taille extra-small */}
            <Card padding="$medium" backgroundColor="$white1">
              <Text.MD semibold marginBottom="$small">Taille extra-small (xs)</Text.MD>
              <GlobalSearch
                provider={fakeAddressProvider}
                onSelect={handleSelect}
                placeholder="Rechercher une adresse..."
                size="xs"
              />
            </Card>

            {/* Variante taille extra-large */}
            <Card padding="$medium" backgroundColor="$white1">
              <Text.MD semibold marginBottom="$small">Taille extra-large (xl)</Text.MD>
              <GlobalSearch
                provider={fakeAddressProvider}
                onSelect={handleSelect}
                placeholder="Rechercher une adresse..."
                size="xl"
              />
            </Card>
        </YStack>
      </ScrollView>
    )
  },
}


export const AddressSearch: Story = {
  args: {
    provider: new AddressProvider(),
    placeholder: 'Rechercher une adresse...',
    onSelect: (result: SearchResult) => {
      console.log('Résultat sélectionné:', result)
      if (result.type === 'address' && result.metadata?.addressComponents) {
        console.log('Composants d\'adresse:', result.metadata.addressComponents)
      }
    }
  },
}

export const ZoneSearch: Story = {
  args: {
    provider: new ZoneProvider(),
    placeholder: 'Rechercher une zone...',
    onSelect: (result: SearchResult) => {
      console.log('Résultat sélectionné:', result)
    }
  },
} 