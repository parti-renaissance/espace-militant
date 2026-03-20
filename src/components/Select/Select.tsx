import React, { memo, useCallback, useMemo, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Input from '@/components/base/Input/Input'
import { LabelValueModel } from '@/models/common.model'
import { Check, ChevronDown, ChevronUp, Search, XCircle } from '@tamagui/lucide-icons'
import { Adapt, isWeb, Label, Select as SelectTamagui, Sheet, View, YStack } from 'tamagui'
import Text from '../base/Text'

export interface SelectProps {
  id?: string
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  label?: string
  options: OptionWithFixedIndex[]
  canSearch?: boolean
  /** Indicate if we search a word in all sentence or only on start **/
  matchOn?: MatchOnEnum
}

interface OptionWithFixedIndex extends LabelValueModel {
  index?: number
}

export enum MatchOnEnum {
  INNER = 'inner',
  START = 'start',
}

const Select = ({ id, value, onChange, placeholder, label, options, canSearch = false, matchOn = MatchOnEnum.INNER }: SelectProps) => {
  const insets = useSafeAreaInsets()

  const [search, setSearch] = useState<string>('')

  const selectedOption = useMemo(() => options.find((option) => option.value === value), [options, value])

  const clearSearch = useCallback(() => {
    setSearch('')
  }, [])

  const virtualOptions: OptionWithFixedIndex[] | undefined = useMemo(() => {
    if (!canSearch) return options

    return options.filter(({ label }) => {
      const lowerLabel = label.toLowerCase().trim()
      const candidate = search.toLowerCase().trim()

      if (matchOn === MatchOnEnum.INNER) {
        return lowerLabel.includes(candidate)
      }

      return lowerLabel.startsWith(candidate)
    })
  }, [canSearch, search, matchOn, options])

  return (
    <View>
      {label && (
        <Label
          htmlFor={id}
          color="$gray5"
          fontWeight={'600'}
          fontFamily={'$PublicSans'}
          fontSize={'$1'}
          ml={'$1'}
          mb={'$-4'}
          pressStyle={{
            color: '$gray5',
          }}
        >
          {label}
        </Label>
      )}

      <SelectTamagui id={id} value={value} onValueChange={onChange}>
        <SelectTamagui.Trigger
          iconAfter={ChevronDown}
          backgroundColor={'$colorTransparent'}
          borderWidth={0}
          borderBottomWidth={1}
          borderBottomColor={'$gray3'}
          borderRadius={0}
          padding={'$0'}
          outlineStyle="none"
          hoverStyle={{
            backgroundColor: '$colorTransparent',
          }}
          pressStyle={{
            backgroundColor: '$colorTransparent',
            borderBottomColor: '$gray8',
          }}
        >
          <SelectTamagui.Value placeholder={placeholder} color={'$gray6'} fontSize={'$2'} fontFamily={'$PublicSans'} fontWeight={'400'}>
            <Text color={'$gray6'}>{selectedOption?.label}</Text>
          </SelectTamagui.Value>
        </SelectTamagui.Trigger>

        <Adapt when="sm" platform="touch">
          <Sheet native={!isWeb} modal dismissOnSnapToBottom>
            <Sheet.Frame>
              <Sheet.ScrollView>
                <Adapt.Contents />
              </Sheet.ScrollView>
            </Sheet.Frame>
            <Sheet.Overlay animation="lazy" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
          </Sheet>
        </Adapt>

        <SelectTamagui.Content zIndex={200}>
          <SelectTamagui.ScrollUpButton ai="center" jc="center" pos="relative" w="100%" h="$medium">
            <YStack zi={10}>
              <ChevronUp size={20} />
            </YStack>
          </SelectTamagui.ScrollUpButton>

          <SelectTamagui.Viewport outlineStyle="none">
            <SelectTamagui.Group paddingBottom={insets.bottom}>
              <SelectTamagui.Label fontWeight={'$5'} fontSize={'$3'} backgroundColor={'none'} flexDirection={'column'} alignItems={'flex-start'}>
                <View>
                  <Text fontFamily={'$PublicSans'} fontSize={'$1'} fontWeight={'500'} color={'#00AEEF'}>
                    {label}
                  </Text>
                </View>

                {canSearch && !isWeb && (
                  <View mt={'$2'} width={'100%'}>
                    <Input
                      placeholder={'Recherche'}
                      iconRight={
                        search.trim().length > 0 ? (
                          <TouchableOpacity onPress={clearSearch}>
                            <XCircle />
                          </TouchableOpacity>
                        ) : (
                          <Search />
                        )
                      }
                      value={search}
                      onChangeText={setSearch}
                    />
                  </View>
                )}
              </SelectTamagui.Label>
              {virtualOptions?.map((option, index) => <RenderItem key={option.value} option={option} index={option.index ?? index} />)}
            </SelectTamagui.Group>
          </SelectTamagui.Viewport>

          <SelectTamagui.ScrollDownButton ai="center" jc="center" pos="relative" w="100%" h="$medium">
            <YStack zi={10}>
              <ChevronDown size={20} />
            </YStack>
          </SelectTamagui.ScrollDownButton>
        </SelectTamagui.Content>
      </SelectTamagui>
    </View>
  )
}

const RenderItem = memo(({ index, option }: { index: number; option: LabelValueModel }) => (
  <SelectTamagui.Item index={index} value={option.value} outlineStyle="none" bc="$backgroundStrong">
    <SelectTamagui.ItemText>{option.label}</SelectTamagui.ItemText>
    <SelectTamagui.ItemIndicator ml="auto">
      <Check size={16} />
    </SelectTamagui.ItemIndicator>
  </SelectTamagui.Item>
))

export default React.memo(Select)
