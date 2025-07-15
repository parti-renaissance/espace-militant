import React, { FunctionComponent } from 'react'
import {
  ColorValue,
  Image,
  ImageSourcePropType,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'
import { Colors, ColorUtils, Spacing, Typography } from '../../styles'
import { TouchablePlatform } from './TouchablePlatform'

type ButtonProps = Readonly<{
  style?: StyleProp<ViewStyle>
  buttonStyle?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
  onPress?: () => void
  title?: string
  disabled?: boolean
  shape?: ButtonShape
  children?:
    | React.ReactNode
    | FunctionComponent<{ textStyle: StyleProp<TextStyle>[] }>
}>

type ButtonShape = 'oval' | 'rounded'

type TertiaryButtonProps = ButtonProps &
  Readonly<{
    noShadow?: boolean
    innerStyle?: StyleProp<ViewStyle>
  }>

type IconProps = Readonly<{
  leadingIcon?: ImageSourcePropType
  trailingIcon?: ImageSourcePropType
  iconTint?: ColorValue
  iconPadding?: number
}>

type BaseButtonProps = Readonly<{
  backgroundColor: string
  textColor: string
  children?: React.ComponentProps<typeof TouchablePlatform>['children']
}>

const BaseButton: FunctionComponent<
  ButtonProps & BaseButtonProps & IconProps
> = (props) => {
  const opacity = props.disabled ? 0.5 : 1.0
  const defaultBackground = props.backgroundColor
  const disabledBackground = ColorUtils.lighten(defaultBackground, 0.7)
  const highlightedBackground = ColorUtils.lighten(defaultBackground, 0.5)

  const computedBackground = props.disabled
    ? disabledBackground
    : defaultBackground

  const baseButtonStyle = getBaseButtonStyle(props.shape ?? 'oval')

  const textStyle = [
    styles.appButtonText,
    { opacity: opacity, color: props.textColor },
    props.textStyle,
  ]

  return (
    <View
      style={[
        baseButtonStyle,
        { backgroundColor: computedBackground },
        props.style,
      ]}
    >
      <TouchablePlatform
        onPress={props.onPress}
        touchHighlight={highlightedBackground}
        disabled={props.disabled}
        style={[styles.buttonTouchable, props.buttonStyle]}
      >
        {props.children ? (
          typeof props.children === 'function' ? (
            props.children({ textStyle })
          ) : (
            props.children
          )
        ) : (
          <Text style={textStyle}>
            {props.leadingIcon ? (
              <View style={{ paddingRight: props.iconPadding }}>
                <Image
                  tintColor={props.iconTint}
                  source={props.leadingIcon}
                />
              </View>
            ) : null}
            {props.title}
            {props.trailingIcon ? (
              <View style={{ paddingLeft: props.iconPadding }}>
                <Image
                  tintColor={props.iconTint}
                  source={props.trailingIcon}
                />
              </View>
            ) : null}
          </Text>
        )}
      </TouchablePlatform>
    </View>
  )
}

export const PrimaryButton: FunctionComponent<ButtonProps> = (props) => {
  return (
    <BaseButton
      backgroundColor={Colors.primaryColor}
      textColor={Colors.primaryButtonTextColor}
      {...props}
    />
  )
}

export const ActionButton: FunctionComponent<ButtonProps> = (props) => {
  return (
    <BaseButton
      backgroundColor={Colors.accent}
      textColor={Colors.primaryButtonTextColor}
      {...props}
    />
  )
}

export const SecondaryButton: FunctionComponent<ButtonProps & IconProps> = (
  props,
) => {
  return (
    <BaseButton
      backgroundColor={Colors.secondaryButtonBackground}
      textColor={Colors.secondaryButtonText}
      {...props}
    />
  )
}

export const TertiaryButton: FunctionComponent<TertiaryButtonProps> = (
  props,
) => {
  const opacity = props.disabled ? 0.5 : 1.0
  const containerStyle = props.noShadow
    ? [props.style]
    : [
        props.style,
        styles.shadow,
        { shadowOpacity: styles.shadow.shadowOpacity * opacity },
      ]
  const baseButtonStyle = getBaseButtonStyle(props.shape ?? 'oval')
  return (
    <View style={containerStyle}>
      <View
        style={[
          baseButtonStyle,
          { backgroundColor: Colors.tertiaryButtonBackground },
          { elevation: Spacing.buttonElevation * opacity },
        ]}
      >
        <TouchablePlatform
          onPress={props.onPress}
          disabled={props.disabled}
          style={[styles.buttonTouchable, props.innerStyle]}
          touchHighlight={Colors.tertiaryButtonBackground}
        >
          <Text
            style={[
              styles.appButtonText,
              { opacity: opacity, color: Colors.coloredText },
              props.textStyle,
            ]}
          >
            {props.title}
          </Text>
        </TouchablePlatform>
      </View>
    </View>
  )
}

type BorderlessButtonType = 'regular' | 'primary'
type BorderlessButtonProps = Readonly<{
  type?: BorderlessButtonType
}>

export const BorderlessButton: FunctionComponent<
  ButtonProps & BorderlessButtonProps
> = (props) => {
  const opacity = props.disabled ? 0.5 : 1.0
  const textColor = () => {
    switch (props.type ?? 'regular') {
      case 'regular':
        return Colors.darkText
      case 'primary':
        return Colors.primaryColor
    }
  }
  return (
    <View style={{ opacity: opacity }}>
      <TouchableOpacity
        onPress={props.onPress}
        disabled={props.disabled}
        style={[styles.appButtonContainerBorderless, props.style]}
      >
        <Text
          style={[
            styles.appButtonText,
            { color: textColor() },
            props.textStyle,
          ]}
        >
          {props.title}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const getBaseButtonStyle = (shape: ButtonShape): StyleProp<ViewStyle> => {
  switch (shape) {
    case 'oval':
      return styles.baseAppButtonContainerOval
    case 'rounded':
      return styles.baseAppButtonContainerRounded
  }
}

const styles = StyleSheet.create({
  appButtonContainerBorderless: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  appButtonText: {
    ...Typography.callout,
    textAlign: 'center',
    alignSelf: 'center',
  },
  baseAppButtonContainerOval: {
    borderRadius: 100,
    overflow: 'hidden',
  },
  baseAppButtonContainerRounded: {
    borderRadius: 4,
    overflow: 'hidden',
  },
  buttonTouchable: {
    paddingHorizontal: Spacing.mediumMargin,
    paddingVertical: 14,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
})
