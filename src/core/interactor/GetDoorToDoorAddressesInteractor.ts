import DoorToDoorRepository from '../../data/DoorToDoorRepository'
import { DoorToDoorAddress } from '../entities/DoorToDoor'

export class GetDoorToDoorAddressesInteractor {
  private repository = DoorToDoorRepository.getInstance()

  public async execute(
    latitude: number,
    longitude: number,
    latitudeDelta: number,
    longitudeDelta: number,
  ): Promise<Array<DoorToDoorAddress>> {
    const addresses = await this.repository.getAddresses(
      latitude,
      longitude,
      latitudeDelta,
      longitudeDelta,
    )
    const campaignIds = new Set<string>()
    addresses.forEach((address) => {
      const campaign = address.building.campaignStatistics
      if (campaign) {
        campaignIds.add(campaign.campaignId)
      }
    })
    await Promise.all(
      [...campaignIds].map(async (id) => {
        await this.repository.getCampaign(id, 'remote')
        await this.repository.getDoorToDoorCampaignRanking(id, 'remote')
        await this.repository.getDoorToDoorPollConfig(id, 'remote')
        await this.repository.getDoorToDoorPoll(id, 'remote')
      }),
    )
    return addresses
  }
}
