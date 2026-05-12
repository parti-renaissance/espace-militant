import React, { type ComponentProps, type ComponentType } from 'react'
import * as MapboxGl from '@rnmapbox/maps'

export type UserLocationProps = ComponentProps<typeof MapboxGl.UserLocation> & {
  autoTrigger?: boolean
  preventAutoCenterOnAutoTrigger?: boolean
  hideNativeGeolocateButton?: boolean
}

type ExtendedMapboxGl = typeof MapboxGl & {
  UserLocation: ComponentType<UserLocationProps>
}

const UserLocation: ComponentType<UserLocationProps> = (props) => {
  // React-native: on ne transmet pas les props "web-only"/custom.
  // Sur le web, `UserLocation` est un stub dans `Mapbox.web.tsx` (géoloc = `expo-location` côté app).
  const {
    autoTrigger: _autoTrigger,
    preventAutoCenterOnAutoTrigger: _preventAutoCenterOnAutoTrigger,
    hideNativeGeolocateButton: _hideNativeGeolocateButton,
    ...rest
  } = props
  return <MapboxGl.UserLocation {...rest} />
}

const ExtendedMapboxGl = {
  ...MapboxGl,
  UserLocation,
} as unknown as ExtendedMapboxGl

export default ExtendedMapboxGl
