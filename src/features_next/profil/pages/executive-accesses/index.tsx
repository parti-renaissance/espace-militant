import React from 'react'
import { Sparkle } from '@tamagui/lucide-icons'
import { XStack } from 'tamagui'
import Text from '@/components/base/Text'
import VoxCard from '@/components/VoxCard/VoxCard'
import LayoutScrollView from '@/components/Navigation/LayoutScrollView'
import ProfilLayout from '@/features_next/profil/components/Layout'
import ChangeScope from './components/ScopeList'

const ExecutivesAccessesScreen = () => {
  return (
    <ProfilLayout>
      <LayoutScrollView padding="left">
        <VoxCard>
          <VoxCard.Content>
            <XStack gap={6} alignItems="center">
              <Sparkle size={20} />
              <XStack width="100%" flexShrink={1}>
                <Text.LG multiline semibold>
                  Mes rôles cadres
                </Text.LG>
              </XStack>
            </XStack>
            <Text.P>
              Votre compte dispose de plusieurs accès « cadres » vous donnant accès à des ressources supplémentaires comme la gestion des événements et des
              actions ou l’envoi d’emails. Chaque accès est associé à un rôle (ex : Président ») et une zone de gestion (ex : le Var) sur laquelle il est limité.
            </Text.P>
            <Text.P>
              Un seul de vos accès est défini comme par défaut et est utilisé dans l’interface. Vous pouvez changer cet accès par défaut ou en utiliser un autre
              ponctuellement à la création d’un événement, d’une action ou d’un email.
            </Text.P>
            <ChangeScope />
          </VoxCard.Content>
        </VoxCard>
      </LayoutScrollView>
    </ProfilLayout>
  )
}

export default ExecutivesAccessesScreen
