export interface RestDoorToDoorAddress {
  number: string
  address: string
  insee_code: string
  city_name: string
  latitude: number
  longitude: number
  building: {
    type: 'building' | 'house'
    uuid: string
    campaign_statistics: {
      uuid: string
      nb_doors: number
      nb_surveys: number
      last_passage: string
      status: 'todo' | 'ongoing' | 'completed'
      last_passage_done_by: {
        first_name: string
        last_name: string
        uuid: string
      }
      campaign: {
        uuid: string
      }
    }
  }
  uuid: string
}
