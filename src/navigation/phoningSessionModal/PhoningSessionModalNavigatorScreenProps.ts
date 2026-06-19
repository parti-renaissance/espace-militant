import { CompositeScreenProps } from "expo-router/react-navigation"
import { StackScreenProps } from "expo-router/js-stack"
import { AuthenticatedRootNavigatorScreenProps } from '../authenticatedRoot/AuthenticatedRootNavigatorScreenProps'
import { PhoningSessionModalNavigatorParamList } from './PhoningSessionModalNavigatorParamList'

export type PhoningSessionModalNavigatorScreenProps<
  T extends keyof PhoningSessionModalNavigatorParamList,
> = CompositeScreenProps<
  StackScreenProps<PhoningSessionModalNavigatorParamList, T>,
  AuthenticatedRootNavigatorScreenProps
>
