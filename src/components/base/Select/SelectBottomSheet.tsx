import React, { ComponentRef, forwardRef, RefObject, useCallback, useImperativeHandle, useRef } from 'react'
import { Platform, TouchableOpacity } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetFlatList, BottomSheetModal } from '@gorhom/bottom-sheet'
import { YStack } from 'tamagui'
import { DropdownItem, DropdownItemFrame } from '../Dropdown'
import Input from '../Input/Input'
import { ModalDropDownRef, SelectProps } from './types'
import useSelectSearch from './useSelectSearch'
import { reactTextNodeChildrenToString } from './utils'
import Text from '../Text'

const MemoItem = React.memo(DropdownItem)

type BottomsheetLogicProps = {
  frameRef?: RefObject<ComponentRef<typeof TouchableOpacity>>
} & SelectProps<string>

const SelectBottomSheet = forwardRef<ModalDropDownRef, BottomsheetLogicProps>(({ options, searchableOptions, frameRef, resetable, ...props }, ref) => {
  const bottomSheetRef = useRef<BottomSheetModal>(null)
  const { setQuery, filteredItems, queryInputRef, searchableIcon } = useSelectSearch({ options, searchableOptions })
  const insets = useSafeAreaInsets()

  useImperativeHandle(
    ref,
    () => ({
      open: () => {
        bottomSheetRef.current?.present()
        setTimeout(() => queryInputRef.current?.focus(), 200)
      },
      close: () => {
        bottomSheetRef.current?.close()
      },
    }),
    [],
  )

  const handleClose = () => {
    props.onBlur?.()
    setQuery('')
  }

  const handleSelect = (payload: (typeof filteredItems)[number]) => () => {
    props.onChange?.(payload.id)
    props.onDetailChange?.({
      value: payload.id,
      label: reactTextNodeChildrenToString(payload.title),
      subLabel: payload.subtitle,
    })
    setQuery('')
    bottomSheetRef.current?.close()
  }

  const renderBackdrop = useCallback((props: BottomSheetBackdropProps) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={1} />, [])

  return (
    <>
      <BottomSheetModal
        ref={bottomSheetRef}
        backdropComponent={renderBackdrop}
        enablePanDownToClose
        onDismiss={handleClose}
        topInset={insets.top}
        handleIndicatorStyle={{
          backgroundColor: '#D2DCE5',
          width: 48,
        }}
      >
        <BottomSheetFlatList
          stickyHeaderHiddenOnScroll={props.searchable}
          stickyHeaderIndices={props.searchable ? [0] : undefined}
          keyboardShouldPersistTaps="always"
          contentContainerStyle={{ paddingBottom: insets.bottom }}
          ListHeaderComponent={
            <YStack>
              {props.searchable ? (
                <YStack padding={16} bg="white">
                  <Input
                    bottomSheetInput={Platform.OS === 'ios'}
                    color="gray"
                    ref={queryInputRef}
                    onChangeText={setQuery}
                    placeholder={searchableOptions?.placeholder ?? 'Rechercher'}
                    iconRight={searchableIcon}
                    loading={searchableOptions?.isFetching}
                  />
                </YStack>
              ) : null}
               {props.helpText ? (
                <YStack p="$medium" bg="$textSurface" borderBottomColor="$textOutline" borderBottomWidth={1}>
                  {typeof props.helpText === 'string' ? (
                    <Text.SM color="$textSecondary">{props.helpText}</Text.SM>
                  ) : (
                    props.helpText
                  )}
                </YStack>
              ) : null}
              {
                searchableOptions?.noResults && searchableOptions?.isFetching === false ? (
                  <DropdownItemFrame>
                    <Text.SM color="$textSecondary">{searchableOptions?.noResults}</Text.SM>
                  </DropdownItemFrame>
                ) : null
              }
            </YStack>
          }
          data={filteredItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <MemoItem {...item} onPress={handleSelect(item)} size={props.size} selected={item.id === props.value} last={filteredItems.length - 1 === index} />
          )}
        />
      </BottomSheetModal>
    </>
  )
})

export default SelectBottomSheet
