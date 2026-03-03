export type DoorToDoorAddress = {
  id: string
  number: string
  address: string
  inseeCode: string
  cityName: string
  latitude: number
  longitude: number
  votersCount: number
  priority: number | null
  postalCodes: string[]
  building: {
    id: string
    type: BuildingType
    campaignStatistics: DoorToDoorAddressCampaign | null
  }
}

export type BuildingType = 'building' | 'house'

export type DoorToDoorAddressCampaign = {
  id: string
  numberOfDoors: number
  numberOfSurveys: number
  lastPassage: Date | null
  campaignId: string
  status: DoorToDoorAddressStatus
  leafletsDistributed: number
  lastPassageDoneBy: {
    id: string
    firstName: string
    lastName: string
  }
}

export type DoorToDoorAddressStatus = 'todo' | 'ongoing' | 'completed'

export type BuildingSelectedParams = {
  id: string
  block: string
  floor: number
  door: number
  type: BuildingType
}
