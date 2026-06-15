import React, { forwardRef, type ComponentProps, type ComponentRef, type ComponentType } from 'react'
import * as MapboxGl from '@rnmapbox/maps'

export type UserLocationProps = ComponentProps<typeof MapboxGl.UserLocation> & {
  autoTrigger?: boolean
  preventAutoCenterOnAutoTrigger?: boolean
  hideNativeGeolocateButton?: boolean
}

type ExtendedMapboxGl = typeof MapboxGl & {
  UserLocation: ComponentType<UserLocationProps>
}

const MapView = forwardRef<ComponentRef<typeof MapboxGl.MapView>, ComponentProps<typeof MapboxGl.MapView>>((props, ref) => {
  const { localizeLabels = { locale: 'fr' }, ...rest } = props
  return <MapboxGl.MapView ref={ref} localizeLabels={localizeLabels} {...rest} />
})
MapView.displayName = 'MapView'

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
  MapView,
  UserLocation,
} as unknown as ExtendedMapboxGl

export default ExtendedMapboxGl
