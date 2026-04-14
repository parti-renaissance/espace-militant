import React, { ComponentRef, forwardRef, RefObject, useCallback, useImperativeHandle, useRef, useState } from 'react'
import { Platform, TouchableOpacity } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { YStack } from 'tamagui'
import { Equal, EqualNot } from '@tamagui/lucide-icons'
import { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetFlatList, BottomSheetModal } from '@gorhom/bottom-sheet'

import BigSwitch from '../BigSwitch'
import { DropdownItem, DropdownItemFrame } from '../Dropdown'
import Input, { BottomSheetProvider } from '../Input/Input'
import Text from '../Text'
import { ModalDropDownRef, SelectProps } from './types'
import useSelectSearch from './useSelectSearch'
import { reactTextNodeChildrenToString } from './utils'

const MemoItem = React.memo(DropdownItem)
const EqualNotOrange = (iconProps: { color?: string; size?: number }) => <EqualNot {...iconProps} color="$orange5" />

type BottomsheetLogicProps = {
  frameRef?: RefObject<ComponentRef<typeof TouchableOpacity> | null>
} & SelectProps<string>

const SelectBottomSheet = forwardRef<ModalDropDownRef, BottomsheetLogicProps>(
  ({ options, searchableOptions, frameRef, resetable, nullableOption, allowInverseSelection, ...props }, ref) => {
    const bottomSheetRef = useRef<BottomSheetModal>(null)
    const { setQuery, filteredItems, queryInputRef, searchableIcon } = useSelectSearch({ options, searchableOptions })
    const [isInverseSelectionActive, setIsInverseSelectionActive] = useState(Boolean(props.value?.startsWith('!')))
    const insets = useSafeAreaInsets()

    useImperativeHandle(
      ref,
      () => ({
        open: () => {
          bottomSheetRef.current?.present()
          props.onOpen?.()
          setTimeout(() => queryInputRef.current?.focus(), 200)
        },
        close: () => {
          bottomSheetRef.current?.close()
        },
      }),
      [props.onOpen],
    )

    const handleClose = () => {
      props.onBlur?.()
      setQuery('')
    }

    const handleInverseSelectionChange = useCallback((value: string | undefined) => {
      setIsInverseSelectionActive(value === 'inverse')
    }, [])

    const handleSelect = (payload: (typeof filteredItems)[number]) => () => {
      const nextValue = allowInverseSelection && isInverseSelectionActive ? `!${payload.id}` : payload.id
      props.onChange?.(nextValue)
      props.onDetailChange?.({
        value: nextValue,
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
          <BottomSheetProvider>
            <BottomSheetFlatList
              stickyHeaderHiddenOnScroll={props.searchable || allowInverseSelection}
              stickyHeaderIndices={props.searchable || allowInverseSelection ? [0] : undefined}
              keyboardShouldPersistTaps="always"
              contentContainerStyle={{ paddingBottom: insets.bottom }}
              ListHeaderComponent={
                <YStack>
                  {allowInverseSelection ? (
                    <YStack p="$small" bg="$white1" borderBottomColor="$textOutline" borderBottomWidth={1}>
                      <BigSwitch
                        options={[
                          { label: 'Inclure', value: 'normal', iconLeft: Equal },
                          { label: 'Exclure', value: 'inverse', iconLeft: EqualNot, activeTheme: { textColor: '$orange8', backgroundColor: '$orange1' } },
                        ]}
                        value={isInverseSelectionActive ? 'inverse' : 'normal'}
                        onChange={handleInverseSelectionChange}
                      />
                    </YStack>
                  ) : null}
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
                      {typeof props.helpText === 'string' ? <Text.SM color="$textSecondary">{props.helpText}</Text.SM> : props.helpText}
                    </YStack>
                  ) : null}
                  {searchableOptions?.noResults && searchableOptions?.isFetching === false ? (
                    <DropdownItemFrame>
                      <Text.MD secondary>{searchableOptions?.noResults}</Text.MD>
                    </DropdownItemFrame>
                  ) : null}
                  {nullableOption && (
                    <DropdownItemFrame
                      onPress={() => {
                        props.onChange?.(null)
                        props.onDetailChange?.({
                          value: '',
                          label: '',
                          subLabel: '',
                        })
                        handleClose()
                        bottomSheetRef.current?.close()
                      }}
                    >
                      <Text.MD secondary>{nullableOption}</Text.MD>
                    </DropdownItemFrame>
                  )}
                </YStack>
              }
              data={filteredItems}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => (
                <MemoItem
                  {...item}
                  icon={allowInverseSelection ? (isInverseSelectionActive ? EqualNotOrange : Equal) : item.icon}
                  onPress={handleSelect(item)}
                  size={props.size}
                  selected={isInverseSelectionActive ? props.value === `!${item.id}` : props.value === item.id}
                  last={filteredItems.length - 1 === index}
                />
              )}
            />
          </BottomSheetProvider>
        </BottomSheetModal>
      </>
    )
  },
)

export default SelectBottomSheet
