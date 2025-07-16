import React, { FunctionComponent } from 'react'
import {
  Image,
  ImageSourcePropType,
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'
import { Colors, Spacing } from '@/styles'

type NavigationHeaderButtonProps = Readonly<{
  style?: StyleProp<ViewStyle>
  buttonStyle?: StyleProp<ViewStyle>
  onPress?: () => void
  source: ImageSourcePropType
  tintColor?: string
}>

export const NavigationHeaderButton: FunctionComponent<
  NavigationHeaderButtonProps
> = ({ style, onPress, source, tintColor }) => {
  if (Platform.OS === 'android') {
    return (
      <View style={[styles.container, style]}>
        <Pressable
          style={[styles.button]}
          onPress={onPress}
          android_ripple={{ color: Colors.touchHighlight }}
        >
          <Image source={source} tintColor={tintColor} />
        </Pressable>
      </View>
    )
  } else {
    return (
      <View style={[styles.container, style]}>
        <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
          <Image source={source} tintColor={tintColor} />
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    overflow: 'hidden',
    minHeight: 44,
    minWidth: 44,
    borderRadius: 22,
    margin: Spacing.small,
  },
})

type ButtonProps = Pick<NavigationHeaderButtonProps, 'style' | 'onPress'>

export const CloseButton: FunctionComponent<ButtonProps> = (props) => {
  return (
    <NavigationHeaderButton
      {...props}
      source={require('../../assets/images/navigationBarClose.png')}
      tintColor={Colors.navigationTint}
    />
  )
}

export const ProfileButton: FunctionComponent<ButtonProps> = (props) => {
  return (
    <NavigationHeaderButton
      {...props}
      style={[props.style, { backgroundColor: Colors.primaryColor }]}
      tintColor={Colors.veryLightText}
      source={require('../../assets/images/profileIcon.png')}
    />
  )
}

export const EventsFilterButton: FunctionComponent<ButtonProps> = (props) => {
  return (
    <NavigationHeaderButton
      {...props}
      style={props.style}
      tintColor={Colors.primaryColor}
      source={require('../../assets/images/iconFilters.png')}
    />
  )
}
