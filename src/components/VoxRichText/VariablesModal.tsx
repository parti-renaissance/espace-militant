import React from 'react'
import { FlatList, Modal, StyleSheet, TouchableOpacity } from 'react-native'
import { VoxHeader } from '@/components/Header/Header'
import { useGetAvailableVariables } from '@/services/publications/hook'
import { RestAvailableVariable } from '@/services/publications/schema'
import Text from '@/components/base/Text'
import { Spinner, XStack, YStack, View } from 'tamagui'
import { Spacing } from '@/styles'
import { VoxCard } from '@/components/VoxCard/VoxCard'
import { X } from '@tamagui/lucide-icons'

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
    <TouchableOpacity activeOpacity={0.9} onPress={() => handleSelect(item)}>
      <YStack
        padding="$medium"
        borderBottomColor="$textOutline"
        borderBottomWidth={1}
        gap="$xsmall"
      >
        <XStack alignItems="center" gap="$xsmall">
          <Text.MD>{item.label} :</Text.MD>
          <Text.SM secondary>{item.code}</Text.SM>
        </XStack>
        {item.description && (
          <Text.SM secondary>{item.description}</Text.SM>
        )}
      </YStack>
    </TouchableOpacity>
  )

  return (
    <Modal
      animationType="fade"
      transparent
      visible={open}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        activeOpacity={1}
        style={styles.centeredView}
        onPress={(event) => {
          if (event.target === event.currentTarget) {
            onClose()
          }
        }}
      >
        <View style={styles.modalView}>
          <VoxCard.Content maxWidth={520} width="100%" padding={0} gap={0}>
            <XStack alignItems="center" justifyContent="space-between" width="100%" padding="$medium" borderBottomColor="$textOutline" borderBottomWidth={1}>
              <VoxHeader.Title>Variables disponibles</VoxHeader.Title>
              <X size={20} color="$textPrimary" onPress={onClose} />
            </XStack>
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
      </TouchableOpacity>
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
    overflow: 'hidden',
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

