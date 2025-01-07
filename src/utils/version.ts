import Constants from 'expo-constants'

export const getFullVersion = () => {
  return `${Constants.expoConfig?.version ?? '0.0.0'}#${Constants.expoConfig?.extra?.eas_update_version ?? '0'}`
}

export const getRuntimeVersion = () => {
  return `${Constants.expoConfig?.version ?? '0.0.0'}`
}

export const getEasUpdateVersion = () => {
  return Constants.expoConfig?.extra?.eas_update_version ?? '0'
}
