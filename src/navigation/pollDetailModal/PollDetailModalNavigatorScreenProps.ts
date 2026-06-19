import { CompositeScreenProps } from "expo-router/react-navigation"
import { StackScreenProps } from "expo-router/js-stack"
import { AuthenticatedRootNavigatorScreenProps } from '../authenticatedRoot/AuthenticatedRootNavigatorScreenProps'
import { PollDetailModalNavigatorParamList } from './PollDetailModalNavigatorParamList'

export type PollDetailModalNavigatorScreenProps<
  T extends keyof PollDetailModalNavigatorParamList,
> = CompositeScreenProps<
  StackScreenProps<PollDetailModalNavigatorParamList, T>,
  AuthenticatedRootNavigatorScreenProps
>
