import React, { ComponentRef, forwardRef, RefObject, useCallback, useImperativeHandle, useMemo, useRef } from 'react'
import { TouchableOpacity } from 'react-native'
import { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetFlatList, BottomSheetModal } from '@gorhom/bottom-sheet'
import { YStack } from 'tamagui'
import { DropdownFrame, DropdownItem } from '../Dropdown'
import Input from '../Input/Input'
import { ModalDropDownRef, SelectProps } from './types'
import useSelectSearch from './useSelectSearch'

const MemoItem = React.memo(DropdownItem)

type BottomsheetLogicProps = {
  frameRef?: RefObject<ComponentRef<typeof TouchableOpacity>>
} & SelectProps<string>

const SelectBottomSheet = forwardRef<ModalDropDownRef, BottomsheetLogicProps>(({ options, searchableOptions, frameRef, resetable, ...props }, ref) => {
  const bottomSheetRef = useRef<BottomSheetModal>(null)
  const snapPoints = useMemo(() => ['60%'], [])
  const { setQuery, filteredItems, queryInputRef, searchableIcon } = useSelectSearch({ options, searchableOptions })

  useImperativeHandle(
    ref,
    () => ({
      open: () => {
        bottomSheetRef.current?.present()
        setTimeout(() => queryInputRef.current?.focus(), 100)
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
      label: payload.title,
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
        // index={-1}
        enableDynamicSizing={false}
        snapPoints={snapPoints}
        onDismiss={handleClose}
        handleIndicatorStyle={{
          backgroundColor: '#D2DCE5',
          width: 48,
        }}
      >
        <DropdownFrame minHeight="100%" flex={1} borderRadius={0} borderWidth={0}>
          <BottomSheetFlatList
            stickyHeaderHiddenOnScroll={props.searchable}
            stickyHeaderIndices={props.searchable ? [0] : undefined}
            ListHeaderComponent={
              props.searchable ? (
                <YStack padding={16} bg="white">
                  <Input
                    color="gray"
                    ref={queryInputRef}
                    onChangeText={setQuery}
                    placeholder={searchableOptions?.placeholder ?? 'Rechercher'}
                    iconRight={searchableIcon}
                  />
                </YStack>
              ) : null
            }
            data={filteredItems}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <MemoItem {...item} onPress={handleSelect(item)} size={props.size} selected={item.id === props.value} last={filteredItems.length - 1 === index} />
            )}
          />
        </DropdownFrame>
      </BottomSheetModal>
    </>
  )
})

export default SelectBottomSheet
