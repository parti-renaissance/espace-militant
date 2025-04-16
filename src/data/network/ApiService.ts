import { Poll } from '@/core/entities/Poll'
import { authInstance, publicInstance } from '@/lib/axios'
import { AxiosRequestConfig, Method } from 'axios'
import { stringify } from 'qs'
import { RestBuildingEventRequest } from '../restObjects/RestBuildingEventRequest'
import { RestBuildingTypeRequest } from '../restObjects/RestBuildingTypeRequest'
import { RestConfigurations } from '../restObjects/RestConfigurations'
import { RestDepartmentResponse } from '../restObjects/RestDepartmentResponse'
import { RestDoorToDoorAddress } from '../restObjects/RestDoorToDoorAddress'
import { RestDoorToDoorCampaign } from '../restObjects/RestDoorToDoorCampaign'
import { RestDoorToDoorCampaignHistoryResponse, RestDoorToDoorSurveyReplyResponse } from '../restObjects/RestDoorToDoorCampaignHistoryResponse'
import { RestDoorToDoorCampaignRanking } from '../restObjects/RestDoorToDoorCampaignRanking'
import {
  RestDoorToDoorCharter,
  RestDoorToDoorCharterAccepted,
  RestDoorToDoorCharterNotAccepted,
  RestDoorToDoorCharterResponse,
} from '../restObjects/RestDoorToDoorCharter'
import { RestDoorToDoorPollConfig } from '../restObjects/RestDoorToDoorPollConfig'
import { RestDoorToDoorPollResultRequest } from '../restObjects/RestDoorToDoorPollResultRequest'
import { RestHeaderInfos } from '../restObjects/RestHeaderInfos'
import { RestNews, RestNewsResponse } from '../restObjects/RestNewsResponse'
import { RestPhonePollResultRequest } from '../restObjects/RestPhonePollResultRequest'
import { RestPhoningCampaign } from '../restObjects/RestPhoningCampaign'
import { RestPhoningCharter, RestPhoningCharterAccepted, RestPhoningCharterNotAccepted, RestPhoningCharterResponse } from '../restObjects/RestPhoningCharter'
import { RestPhoningSession } from '../restObjects/RestPhoningSession'
import { RestPhoningSessionConfiguration } from '../restObjects/RestPhoningSessionConfiguration'
import { RestPollResultRequest } from '../restObjects/RestPollResultRequest'
import { RestQuickPollItem } from '../restObjects/RestQuickPollResponse'
import { RestResetPasswordRequest } from '../restObjects/RestResetPasswordRequest'
import { RestDataProtectionRegulation } from '../restObjects/RestRestDataProtectionRegulation'
import { RestRetaliation } from '../restObjects/RestRetaliation'
import { RestToolsResponse } from '../restObjects/RestToolsResponse'
import {
  RestPostPushTokenRequest,
  RestUpdateCentersOfInterestRequest,
  RestUpdatePostalCodeRequest,
  RestUpdateSubscriptionsRequest,
} from '../restObjects/RestUpdateProfileRequest'
import { RestBuildingBlock } from './../restObjects/RestBuildingBlock'
import { RestBuildingHistoryPoint } from './../restObjects/RestBuildingHistoryPoint'
import { RestMarkdown } from './../restObjects/RestMarkdown'
import { mapAssociatedToken, mapPhonePollError, mapPhoningSessionError } from './errorMappers'
import { genericErrorMapping } from './utils'

const api = <Response>(method: Method, path: string, opt?: AxiosRequestConfig) =>
  authInstance<Response>({ ...opt, url: path, method })
    .then((res) => res.data)
    .catch(genericErrorMapping)
const publicApi = <Response>(method: Method, path: string, opt?: AxiosRequestConfig) =>
  publicInstance<Response>({ ...opt, url: path, method })
    .then((res) => res.data)
    .catch(genericErrorMapping)

class ApiService {
  private static instance: ApiService
  private constructor() {}

  public async getGdpr(): Promise<RestDataProtectionRegulation> {
    return api<RestDataProtectionRegulation>('get', 'api/je-mengage/rgpd')
  }

  public async resetPassword(request: RestResetPasswordRequest): Promise<void> {
    return api<void>('post', 'api/membership/forgot-password?source=jemengage', {
      data: request,
    })
      .then(() => {})
      .catch(genericErrorMapping)
  }

  public async getPolls() {
    return api<Array<Poll>>('get', 'api/jecoute/survey')
  }

  public async sendPollAnswers(request: RestPollResultRequest) {
    return api<void>('post', 'api/jecoute/survey/reply', { data: request }).catch(genericErrorMapping)
  }

  public async getRetaliations() {
    return api<Array<RestRetaliation>>('get', 'api/v3/ripostes')
  }

  public async getRetaliation(id: string) {
    return api<RestRetaliation>('get', 'api/v3/ripostes/' + id)
  }

  public async getNews(zipCode: string, page: number) {
    return api<RestNewsResponse>('get', 'api/jecoute/news', {
      params: { zipCode: zipCode, page: page, with_enriched: true },
    })
  }

  public async getNewsDetail(newsId: string) {
    return api<RestNews>('get', 'api/jecoute/news/' + newsId).catch(genericErrorMapping)
  }

  public async getDepartment(zipCode: string) {
    return api<RestDepartmentResponse>('get', 'api/jecoute/departments/' + zipCode)
  }

  public async getQuickPolls(zipCode: string) {
    return api<RestQuickPollItem>('get', 'api/v3/polls/' + zipCode)
  }

  public async sendQuickPollAnswer(answerId: string) {
    return api<RestQuickPollItem>('post', 'api/v3/polls/vote', { data: { uuid: answerId } })
  }

  public async getCityFromPostalCode(postalCode: string): Promise<string | undefined> {
    const response = await publicApi<{ [key: string]: string }>('get', 'api/postal-code/' + postalCode)
    const result = response
    const entries = Object.entries(result)
    if (entries.length > 0) {
      const [, value] = Object.entries(result)[0]
      return value
    } else {
      return undefined
    }
  }

  public async getProfileAvailableConfiguration(): Promise<RestConfigurations> {
    return api('get', 'api/v3/profile/configuration')
  }

  public async updateCentersOfInterest(userUuid: string, request: RestUpdateCentersOfInterestRequest): Promise<void> {
    return api('put', 'api/v3/profile/' + userUuid, { data: request })
  }

  public async updateSubscriptions(userUuid: string, request: RestUpdateSubscriptionsRequest): Promise<void> {
    return api('put', 'api/v3/profile/' + userUuid, { data: request })
  }

  public async addPushToken(request: RestPostPushTokenRequest): Promise<void> {
    return api<void>('post', 'api/v3/push-token', { data: request }).catch(mapAssociatedToken)
  }

  public async removePushToken(pushToken: string): Promise<void> {
    return api<void>('delete', 'api/v3/push-token/' + pushToken)
  }

  public async updateDeviceZipCode(deviceId: string, request: RestUpdatePostalCodeRequest): Promise<void> {
    return api<void>('put', `api/v3/device/${deviceId}`, { data: request }).catch(genericErrorMapping)
  }

  public async getPhoningTutorial(): Promise<RestMarkdown> {
    return api('get', 'api/v3/phoning_campaigns/tutorial')
  }

  public async getPhoningCampaigns(): Promise<Array<RestPhoningCampaign>> {
    return api('get', 'api/v3/phoning_campaigns/scores')
  }

  public async getPhoningCampaignPoll(campaignId: string): Promise<Poll> {
    return api('get', `api/v3/phoning_campaigns/${campaignId}/survey`)
  }

  public async getPhoningCampaign(campaignId: string): Promise<RestPhoningCampaign> {
    return api('get', `api/v3/phoning_campaigns/${campaignId}/scores`)
  }

  public async getPhoningCampaignSession(campaignId: string) {
    return api<RestPhoningSession>('post', `api/v3/phoning_campaigns/${campaignId}/start`).catch(mapPhoningSessionError)
  }

  public async getPhoningSessionConfiguration(sessionId: string): Promise<RestPhoningSessionConfiguration> {
    return api<RestPhoningSessionConfiguration>('get', `api/v3/phoning_campaign_histories/${sessionId}/survey-config`)
  }

  public async updatePhoningSessionStatus(sessionId: string, status: string, params: Record<string, string> = {}): Promise<void> {
    return api('put', `api/v3/phoning_campaign_histories/${sessionId}`, {
      data: { status, ...params },
    })
  }

  public async sendPhonePollAnswers(sessionId: string, request: RestPhonePollResultRequest): Promise<void> {
    return api<void>('post', `api/v3/phoning_campaign_histories/${sessionId}/reply`, {
      data: request,
    }).catch(mapPhonePollError)
  }

  public async getPhoningCharter(): Promise<RestPhoningCharter> {
    return api<RestPhoningCharterResponse>('get', 'api/v3/profile/charter/phoning_campaign')
      .catch(genericErrorMapping)
      .then((response) => {
        if (response.content === undefined) {
          return new RestPhoningCharterAccepted()
        } else {
          return new RestPhoningCharterNotAccepted(response.content)
        }
      })
  }

  public async acceptPhoningCharter(): Promise<void> {
    return api<void>('put', 'api/v3/profile/charter/phoning_campaign/accept')
  }

  public async getDoorToDoorCharter(): Promise<RestDoorToDoorCharter> {
    return api<RestDoorToDoorCharterResponse>('get', 'api/v3/profile/charter/pap_campaign')
      .catch(genericErrorMapping)
      .then((response) => {
        if (response.content === undefined) {
          return new RestDoorToDoorCharterAccepted()
        } else {
          return new RestDoorToDoorCharterNotAccepted(response.content)
        }
      })
  }

  public async acceptDoorToDoorCharter(): Promise<void> {
    return api('put', 'api/v3/profile/charter/pap_campaign/accept')
  }

  public async buildingBlocks(buildingId: string, campaignId: string) {
    return api<RestBuildingBlock[]>('get', `api/v3/pap/buildings/${buildingId}/building_blocks?campaign_uuid=${campaignId}`)
  }

  public async buildingHistory(buildingId: string, campaignId: string) {
    return api<RestBuildingHistoryPoint[]>('get', `api/v3/pap/buildings/${buildingId}/history?campaign_uuid=${campaignId}`)
  }

  public async getAddresses(latitude: number, longitude: number, latitudeDelta: number, longitudeDelta: number) {
    return api<RestDoorToDoorAddress[]>('get', 'api/v3/pap/address/near', {
      params: {
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: latitudeDelta,
        longitudeDelta: longitudeDelta,
      },
    })
  }

  public async getAddress(addressId: string) {
    return api<RestDoorToDoorAddress>('get', `api/v3/pap/address/${addressId}`)
  }

  public async getDoorToDoorCampaign(campaignId: string): Promise<RestDoorToDoorCampaign> {
    return api<RestDoorToDoorCampaign>('get', `api/v3/pap_campaigns/${campaignId}`)
  }

  public async getDoorToDoorPollConfig(campaignId: string): Promise<RestDoorToDoorPollConfig> {
    return api<RestDoorToDoorPollConfig>('get', `api/v3/pap_campaigns/${campaignId}/survey-config`)
  }

  public async getDoorToDoorCampaignPoll(campaignId: string): Promise<Poll> {
    return api<Poll>('get', `api/v3/pap_campaigns/${campaignId}/survey`)
  }

  public async createDoorToDoorCampaignHistory(
    request: Record<string, string>, // object with dynamic keys
  ) {
    return api<RestDoorToDoorCampaignHistoryResponse>('post', 'api/v3/pap_campaign_histories', { data: request })
  }

  public async replyToDoorToDoorCampaignHistory(
    campaignHistoryId: string,
    request: RestDoorToDoorPollResultRequest,
  ): Promise<RestDoorToDoorSurveyReplyResponse> {
    return api<RestDoorToDoorSurveyReplyResponse>('post', `api/v3/pap_campaign_histories/${campaignHistoryId}/reply`, {
      data: request,
    })
  }

  public async sendBuildingEvent(buildingId: string, event: RestBuildingEventRequest): Promise<void> {
    return api<void>('post', `api/v3/pap/buildings/${buildingId}/events`, { data: event })
  }

  public async getDoorToDoorTutorial() {
    return api<RestMarkdown>('get', 'api/v3/pap_campaigns/tutorial')
  }

  public async getDoorToDoorCampaignRanking(campaignId: string) {
    return api<Array<RestDoorToDoorCampaignRanking>>('get', `api/v3/pap_campaigns/${campaignId}/ranking`)
  }

  public async updateBuildingType(buildingId: string, request: RestBuildingTypeRequest): Promise<Array<RestDoorToDoorCampaignRanking>> {
    return api<Array<RestDoorToDoorCampaignRanking>>('put', `api/v3/pap/buildings/${buildingId}`, { data: request })
  }

  public async getTools(page: number) {
    return api<RestToolsResponse>('get', 'api/v3/jecoute/resource-links', { params: { page: page } })
  }

  public async getHomeHeader() {
    return api<RestHeaderInfos>('get', 'api/v3/je-mengage/headers/page-accueil')
  }

  public async getLoginHeader() {
    return publicApi<RestHeaderInfos>('get', 'api/je-mengage/headers/page-connexion')
  }

  public async getPlaceAutocomplete(query: string, signal?: AbortSignal): Promise<google.maps.places.AutocompletePrediction[]> {
    return api(
      'get',
      `api/v3/place/autocomplete?${stringify({
        input: query,
      })}`,
      {
        signal,
      },
    ).then((response: { predictions: google.maps.places.AutocompletePrediction[] }) => response.predictions)
  }

  public async getPlaceDetails(placeId: string, signal?: AbortSignal): Promise<GoogleAddressPlaceResult | null> {
    return api(
      'get',
      `api/v3/place/details?${stringify({
        place_id: placeId,
        fields: 'formatted_address,address_components,geometry',
      })}`,
      {
        signal,
      },
    ).then((data: { result: google.maps.places.PlaceResult }) =>
      data?.result
        ? ({
            formatted: data.result.formatted_address,
            details: data.result.address_components,
            geometry: data.result.geometry,
          } as GoogleAddressPlaceResult)
        : null,
    )
  }
  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService()
    }
    return ApiService.instance
  }
}

export interface GoogleAddressPlaceResult {
  formatted?: string
  details?: google.maps.GeocoderAddressComponent[]
  geometry?: google.maps.GeocoderGeometry
}

export default ApiService
