import { ImageSourcePropType } from 'react-native'
import { DoorToDoorAddress } from '../../core/entities/DoorToDoor'
import { DateFormatter } from '../../utils/DateFormatter'
import i18n from '../../utils/i18n'
import { BuildingBlock } from './../../core/entities/BuildingBlock'
import { BuildingHistoryPoint } from './../../core/entities/BuildingHistory'
import { DoorToDoorAddressCampaign } from './../../core/entities/DoorToDoor'
import { BuildingDetailScreenViewModel } from './BuildingDetailScreenViewModel'
import { BuildingHistoryViewModelMapper } from './BuildingHistoryViewModelMapper'
import { BuildingLayoutViewModelMapper } from './BuildingLayoutViewModelMapper'
import { BuildingStatusViewModelMapper } from './BuildingStatusViewModelMapper'

export const BuildingDetailScreenViewModelMapper = {
  map: (address: DoorToDoorAddress, history: BuildingHistoryPoint[], layout: BuildingBlock[]): BuildingDetailScreenViewModel => {
    const illustration = (): ImageSourcePropType => {
      switch (address.building.type) {
        case 'house':
          return require('../../assets/images/imageHouse.png')
        case 'building':
          return require('../../assets/images/imageBuilding.png')
        default:
          return require('../../assets/images/imageBuilding.png')
      }
    }
    return {
      address: i18n.t('doorToDoor.address', {
        number: address.number ?? '',
        street: address.address ?? '',
      }),
      lastVisit: lastVisit(address.building.campaignStatistics) ?? i18n.t('common.noDataPlaceholder'),
      illustration: illustration(),
      leafletsDistributed: address.building.campaignStatistics?.leafletsDistributed ?? null,
      status: BuildingStatusViewModelMapper.map(address),
      history: BuildingHistoryViewModelMapper.map(history ?? []),
      buildingLayout: BuildingLayoutViewModelMapper.map(
        address.building.type ?? 'building',
        address.building.campaignStatistics?.status ?? 'todo',
        layout ?? []
      ),
      campaignId: address.building.campaignStatistics?.campaignId ?? '',
    }
  },
}

function lastVisit(campaign: DoorToDoorAddressCampaign | null): string {
  return campaign?.lastPassage ? i18n.t('doorToDoor.lastPassage') + ' ' + mapDate(campaign.lastPassage) : i18n.t('doorToDoor.noPassage')
}

function mapDate(lastPassage: Date): string {
  return DateFormatter.format(lastPassage, i18n.t('doorToDoor.date_format'))
}
