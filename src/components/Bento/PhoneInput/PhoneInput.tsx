import { useMemo, useState } from 'react'
import { StyleSheet } from 'react-native'
import { Input } from '@/components/Bento/Inputs/components/inputsParts'
import isoToEmoji from '@/utils/isoToEmoji'
import { Globe2, Search, X } from '@tamagui/lucide-icons'
import { RovingFocusGroup } from '@tamagui/roving-focus'
import { getExample, getSupportedRegionCodes, parsePhoneNumber } from 'awesome-phonenumber'
import type { SizeTokens } from 'tamagui'
import { Adapt, isWeb, Popover, ScrollView, Text, View } from 'tamagui'

const phoneCodes = getSupportedRegionCodes().map((code) => {
  return {
    name: code,
    flag: isoToEmoji(code),
  }
})

type RegionFilterInputProps = {
  setRegionCode: (regionCode: string) => void
  setOpen: (open: boolean) => void
  open: boolean
}

function RegionFilterInput(props: RegionFilterInputProps) {
  const { setRegionCode, setOpen, open } = props
  const [filter, setFilter] = useState('')
  const [reset, setReset] = useState(0)

  const phoneCodesFiltered = useMemo(() => {
    return phoneCodes.filter((item) => {
      return item.name.toLowerCase().includes(filter.toLowerCase())
    })
  }, [filter])

  return (
    <RovingFocusGroup height="100%" flexDirection="column" paddingTop="$medium" width="100%">
      <Input marginHorizontal="$medium" size="$2">
        <Input.Box>
          <Input.Area
            defaultValue={filter}
            borderRadius={0}
            // Note: when key changes, the input remounts and the value will be reset
            // we can achive better performance using this approach instead binding the value to state
            key={reset}
            onChangeText={setFilter}
            width="100%"
            placeholderTextColor={'$grey4'}
            color={'$grey4'}
            placeholder="Rechercher..."
          />
          <Input.Icon
            onPress={() => {
              setFilter('')
              setReset(reset === 0 ? 1 : 0)
            }}
            pointerEvents="auto"
            zIndex={10}
            theme="alt1"
          >
            {filter ? <X /> : <Search />}
          </Input.Icon>
        </Input.Box>
      </Input>
      {open && (
        <ScrollView height="100%" mt={'$2'}>
          {phoneCodesFiltered.map((item) => {
            return (
              <RovingFocusGroup.Item
                key={item.name}
                {...(isWeb && {
                  onKeyDown: (e: KeyboardEvent) => {
                    if (e.key === 'Enter') {
                      setRegionCode(item.name)
                      setOpen(false)
                    }
                  },
                })}
                focusStyle={{
                  outlineColor: '$outlineColor',
                  outlineOffset: -2,
                }}
              >
                <View
                  onPress={() => {
                    setRegionCode(item.name)
                    setOpen(false)
                  }}
                  // @ts-expect-error bad type definition / inference
                  group="item"
                  borderColor="$borderColor"
                  borderWidth={0}
                  borderBottomWidth={1}
                  flexDirection="row"
                  gap="$medium"
                  paddingHorizontal="$medium"
                  paddingVertical="$xsmall"
                  cursor="pointer"
                >
                  <Text>{item.flag}</Text>
                  <Text
                    color="$gray10"
                    $group-item-hover={{
                      color: '$gray12',
                    }}
                    marginRight="auto"
                  >
                    {item.name}
                  </Text>
                </View>
              </RovingFocusGroup.Item>
            )
          })}
        </ScrollView>
      )}
    </RovingFocusGroup>
  )
}

type RegionSelectBoxProps = {
  regionCode: string
  setRegionCode: (regionCode: string) => void
  containerWidth?: number
}

function RegionSelectBox(props: RegionSelectBoxProps) {
  const { regionCode, setRegionCode, containerWidth } = props

  const [open, setOpen] = useState(false)
  const selectedItem = useMemo(() => phoneCodes.find((item) => item.name === regionCode)!, [regionCode])

  return (
    <Popover
      offset={{
        mainAxis: 5,
      }}
      open={open}
      onOpenChange={setOpen}
      allowFlip
      placement="bottom-start"
      {...props}
    >
      <Popover.Trigger>
        <Input.XGroup.Item>
          <Input.Button paddingHorizontal="$small" onPress={() => setOpen(true)} backgroundColor={'$white1'}>
            {regionCode ? <Text>{selectedItem.flag}</Text> : <Globe2 color="$gray10" width={20} height={20} />}
          </Input.Button>
        </Input.XGroup.Item>
      </Popover.Trigger>

      <Adapt when="sm" platform="touch">
        <Popover.Sheet modal dismissOnSnapToBottom>
          <Popover.Sheet.Frame padding="$medium">
            <Adapt.Contents />
          </Popover.Sheet.Frame>
          <Popover.Sheet.Overlay animation="lazy" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
        </Popover.Sheet>
      </Adapt>

      <Popover.Content
        width={containerWidth}
        borderWidth={1}
        height={300}
        borderColor="$borderColor"
        enterStyle={{ y: -10, opacity: 0 }}
        exitStyle={{ y: -10, opacity: 0 }}
        elevate
        animation={[
          'quick',
          {
            opacity: {
              overshootClamping: true,
            },
          },
        ]}
        padding={0}
      >
        <RegionFilterInput open={open} setOpen={setOpen} setRegionCode={setRegionCode} />
      </Popover.Content>
    </Popover>
  )
}

type BoxInputProps = typeof Input.Box
type PhoneInputProps = {
  size?: SizeTokens
  placeholder: string
  value?: string
  onChange?: (v: string) => void
  onBlur?: (fieldOrEvent: unknown) => void
  error?: string
  countryCode?: string
  onChangeCountryCode?: (v: string) => void
}

export function PhoneInput({ size, placeholder, onChange, value, countryCode = 'FR', onChangeCountryCode, ...rest }: PhoneInputProps) {
  const [containerWidth, setContainerWidth] = useState<number>()

  const handlePhoneNumberChange = (text: string) => {
    const candidate: string = text
    let isFrenchNumber = false

    // If no country code is set, we assume that is a french number
    if (candidate.startsWith('0')) {
      isFrenchNumber = true
    }

    const parsed = parsePhoneNumber(candidate, { regionCode: isFrenchNumber ? 'FR' : undefined })
    // Note: parsed object has a lot of info about the number
    if (parsed.regionCode) {
      onChangeCountryCode?.(parsed.regionCode)
    } else {
      onChangeCountryCode?.('')
    }

    onChange?.(parsed.number?.international ?? candidate)
  }

  const handleCountryCodeChange = (iso: string) => {
    const selectedCountry = phoneCodes.find(({ name }) => name === iso)

    // Compute and change matching regionnal plus code
    if (selectedCountry) {
      const example = getExample(selectedCountry.name)
      if (example?.number) {
        onChange?.(example.number.e164.replace(example.number.significant, ''))
      }
    }

    onChangeCountryCode?.(iso)
  }

  return (
    <View flexDirection="column">
      <Input size={size}>
        <Input.Box
          onLayout={(e) => {
            setContainerWidth(e.nativeEvent.layout.width)
          }}
          alignSelf="center"
          width={'100%'}
          borderLeftWidth={0}
          borderRightWidth={0}
          borderTopWidth={0}
          borderBottomWidth={1}
          borderRadius={0}
          focusVisibleStyle={style.input}
          focusStyle={style.input}
          hoverStyle={style.input}
          {...rest}
        >
          <Input.Section>
            <RegionSelectBox containerWidth={containerWidth} regionCode={countryCode} setRegionCode={handleCountryCodeChange} />
          </Input.Section>
          <Input.Section>
            <Input.Area
              keyboardType="numeric"
              value={value}
              onChangeText={handlePhoneNumberChange}
              placeholderTextColor={'$gray6'}
              placeholder={placeholder ?? 'Numéro de téléphone'}
              color={'$gray6'}
            />
          </Input.Section>
        </Input.Box>
      </Input>
    </View>
  )
}

PhoneInput.fileName = 'PhoneInput'

const style = StyleSheet.create({
  input: {
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomWidth: 1,
    borderRadius: 0,
    backgroundColor: '$white1',
  },
})

export default PhoneInput
