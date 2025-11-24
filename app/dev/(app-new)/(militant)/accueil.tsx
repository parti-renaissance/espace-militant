import React, { useState } from 'react'
import { View, styled, XStack } from 'tamagui'
import Layout from '@/components/Navigation/Layout'
import { Stack } from 'expo-router'
import { VoxButton } from '@/components/Button'
import Text from '@/components/base/Text'
import { Minus, Plus } from '@tamagui/lucide-icons'

const CenterContainer = styled(View, {
  justifyContent: 'center',
  alignItems: 'center',
  gap: '$medium',
})

const RouteName = styled(Text, {
  fontSize: '$8',
  fontWeight: 'bold',
  color: '$textPrimary',
})

export default function AccueilPage() {
  const [count, setCount] = useState(0)

  return (
    <Layout.ScrollView safeArea>
      <Layout.Container>
        <Layout.Main>
          <CenterContainer>
            <RouteName>Accueil 1</RouteName>
            <RouteName>Accueil 2</RouteName>
            <RouteName>Accueil 3</RouteName>
            <RouteName>Accueil 4</RouteName>
            <XStack gap="$medium" alignItems="center">
              <VoxButton
                onPress={() => setCount(count - 1)}
                shrink
                iconLeft={Minus}
                iconSize={16}
              />
              <Text.LG>{count}</Text.LG>
              <VoxButton
                onPress={() => setCount(count + 1)}
                shrink
                iconLeft={Plus}
                iconSize={16}
              />
              
            </XStack>
            <RouteName>Accueil 5</RouteName>
            <RouteName>Accueil 6</RouteName>
            <RouteName>Accueil 7</RouteName>
            <RouteName>Accueil 8</RouteName>
            <RouteName>Accueil 9</RouteName>
            <RouteName>Accueil 10</RouteName>
            <RouteName>Accueil 11</RouteName>
            <RouteName>Accueil 12</RouteName>
            <RouteName>Accueil 13</RouteName>
            <RouteName>Accueil 14</RouteName>
            <RouteName>Accueil 15</RouteName>
            <RouteName>Accueil 16</RouteName>
            <RouteName>Accueil 17</RouteName>
            <RouteName>Accueil 18</RouteName>
            <RouteName>Accueil 19</RouteName>
            <RouteName>Accueil 20</RouteName>
          </CenterContainer>
        </Layout.Main>
      </Layout.Container>
    </Layout.ScrollView>
  )
}

