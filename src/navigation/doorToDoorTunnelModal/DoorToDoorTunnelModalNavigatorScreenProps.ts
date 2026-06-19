import { CompositeScreenProps } from "expo-router/react-navigation"
import { StackScreenProps } from "expo-router/js-stack"
import { AuthenticatedRootNavigatorScreenProps } from '../authenticatedRoot/AuthenticatedRootNavigatorScreenProps'
import { DoorToDoorTunnelModalNavigatorParamList } from './DoorToDoorTunnelModalNavigatorParamList'

export type DoorToDoorTunnelModalNavigatorScreenProps<
  T extends keyof DoorToDoorTunnelModalNavigatorParamList,
> = CompositeScreenProps<
  StackScreenProps<DoorToDoorTunnelModalNavigatorParamList, T>,
  AuthenticatedRootNavigatorScreenProps
>
