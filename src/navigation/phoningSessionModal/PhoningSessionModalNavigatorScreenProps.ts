import { StackScreenProps } from '@react-navigation/stack'
import { CompositeScreenProps } from '@react-navigation/native'
import { AuthenticatedRootNavigatorScreenProps } from '../authenticatedRoot/AuthenticatedRootNavigatorScreenProps'
import { PhoningSessionModalNavigatorParamList } from './PhoningSessionModalNavigatorParamList'

export type PhoningSessionModalNavigatorScreenProps<
  T extends keyof PhoningSessionModalNavigatorParamList
> = CompositeScreenProps<
  StackScreenProps<PhoningSessionModalNavigatorParamList, T>,
  AuthenticatedRootNavigatorScreenProps
>
