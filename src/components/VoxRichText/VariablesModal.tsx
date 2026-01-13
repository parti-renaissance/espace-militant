import React from 'react'
import { FlatList, Modal, Pressable, StyleSheet } from 'react-native'
import { VoxHeader } from '@/components/Header/Header'
import { useGetAvailableVariables } from '@/services/publications/hook'
import { RestAvailableVariable } from '@/services/publications/schema'
import Text from '@/components/base/Text'
import { Spinner, XStack, YStack, View } from 'tamagui'
import { Spacing } from '@/styles'
import { VoxCard } from '@/components/VoxCard/VoxCard'

type VariablesModalProps = {
  open: boolean
  onClose: () => void
  onSelect: (code: string) => void
}

export const VariablesModal: React.FC<VariablesModalProps> = ({ open, onClose, onSelect }) => {
  const { data: variables, isLoading, error } = useGetAvailableVariables({
    enabled: open,
  })

  const handleSelect = (variable: RestAvailableVariable) => {
    onSelect(variable.code)
    onClose()
  }

  const renderItem = ({ item }: { item: RestAvailableVariable }) => (
    <Pressable onPress={() => handleSelect(item)}>
      <YStack
        padding="$medium"
        borderBottomColor="$textOutline"
        borderBottomWidth={1}
        gap="$xsmall"
      >
        <Text.MD semibold>{item.label}</Text.MD>
        {item.description && (
          <Text.SM secondary>{item.description}</Text.SM>
        )}
      </YStack>
    </Pressable>
  )

  return (
    <Modal
      animationType="fade"
      transparent
      visible={open}
      onRequestClose={onClose}
    >
      <Pressable
        style={styles.centeredView}
        onPress={(event) => {
          if (event.target === event.currentTarget) {
            onClose()
          }
        }}
      >
        <View style={styles.modalView}>
          <VoxCard.Content maxWidth={520} width="100%">
            <VoxHeader>
              <XStack alignItems="center" flex={1} width="100%">
                <VoxHeader.Title>Variables disponibles</VoxHeader.Title>
              </XStack>
            </VoxHeader>
            <YStack maxHeight={400}>
              {isLoading && (
                <YStack flex={1} justifyContent="center" alignItems="center" padding="$large">
                  <Spinner size="large" color="$blue6" />
                </YStack>
              )}
              {error && (
                <YStack flex={1} justifyContent="center" alignItems="center" padding="$large">
                  <Text.MD secondary>Erreur lors du chargement des variables</Text.MD>
                </YStack>
              )}
              {!isLoading && !error && (!variables || variables.length === 0) && (
                <YStack flex={1} justifyContent="center" alignItems="center" padding="$large">
                  <Text.MD secondary>Aucune variable disponible</Text.MD>
                </YStack>
              )}
              {!isLoading && !error && variables && variables.length > 0 && (
                <FlatList
                  data={variables}
                  keyExtractor={(item) => item.code}
                  renderItem={renderItem}
                />
              )}
            </YStack>
          </VoxCard.Content>
        </View>
      </Pressable>
    </Modal>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 16,
    margin: Spacing.largeMargin,
    maxWidth: 480,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
})

