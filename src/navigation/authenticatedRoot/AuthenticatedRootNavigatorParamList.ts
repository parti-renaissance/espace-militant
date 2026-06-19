import { NavigatorScreenParams } from "expo-router/react-navigation"
import { DoorToDoorTunnelModalNavigatorParamList } from '../doorToDoorTunnelModal/DoorToDoorTunnelModalNavigatorParamList'
import { EventsFilterModalNavigatorParamList } from '../eventsFilterModal/EventsFilterModalNavigatorParamList'
import { LocationPickerModalNavigatorParamList } from '../locationPickerModal/LocationPickerModalNavigatorParamList'
import { NewsDetailModalNavigatorParamList } from '../newsDetailModal/NewsDetailModalNavigatorParamList'
import { PersonalInformationModalNavigatorParamList } from '../personalInformationModal/PersonalInformationModalNavigatorParamList'
import { PhoningSessionModalNavigatorParamList } from '../phoningSessionModal/PhoningSessionModalNavigatorParamList'
import { PollDetailModalNavigatorParamList } from '../pollDetailModal/PollDetailModalNavigatorParamList'
import { ProfileModalNavigatorParamList } from '../profileModal/ProfileModalNavigatorParamList'

export type AuthenticatedRootNavigatorParamList = {
  PollDetailModal: NavigatorScreenParams<PollDetailModalNavigatorParamList>
  PhoningSessionModal: NavigatorScreenParams<PhoningSessionModalNavigatorParamList>
  ProfileModal: NavigatorScreenParams<ProfileModalNavigatorParamList>
  DoorToDoorTunnelModal: NavigatorScreenParams<DoorToDoorTunnelModalNavigatorParamList>
  NewsDetailModal: NavigatorScreenParams<NewsDetailModalNavigatorParamList>
  EventsFilterModal: NavigatorScreenParams<EventsFilterModalNavigatorParamList>
  LocationPickerModal: NavigatorScreenParams<LocationPickerModalNavigatorParamList>
  PersonalInformationModal: NavigatorScreenParams<PersonalInformationModalNavigatorParamList>
}
