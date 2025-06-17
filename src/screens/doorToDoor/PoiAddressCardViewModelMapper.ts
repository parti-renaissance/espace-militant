import { ImageRequireSource } from 'react-native'
import {
  DoorToDoorAddress,
  DoorToDoorAddressCampaign,
} from '../../core/entities/DoorToDoor'
import { DateFormatter } from '../../utils/DateFormatter'
import i18n from '../../utils/i18n'
import { PoiAddressCardViewModel } from './PoiAddressCardViewModel'

export const PoiAddressCardViewModelMapper = {
  map: (
    poiAddress?: DoorToDoorAddress,
  ): PoiAddressCardViewModel | undefined => {
    return poiAddress
      ? {
          id: poiAddress.id ?? '',
          interactable: poiAddress.building.campaignStatistics !== null,
          formattedAddress: i18n.t('doorToDoor.address', {
            number: poiAddress.number ?? '',
            street: poiAddress.address ?? '',
          }),
          icon:
            poiAddress.building.type === 'house'
              ? require('../../assets/images/papHomeIcon.png')
              : require('../../assets/images/papBuildingIcon.png'),
          statusIcon: mapStatusIcon(poiAddress.building.campaignStatistics),
          mapStatusIcon: mapMapStatusIcon(
            poiAddress.building.campaignStatistics,
          ),
          passage: mapLastPassage(poiAddress.building.campaignStatistics),
          doorsOrVotersLabel:
            poiAddress.building.campaignStatistics?.numberOfDoors?.toString() ??
            '-',
          label: i18n.t('doorToDoor.doorKnocked', {
            count: poiAddress.building.campaignStatistics?.numberOfDoors ?? 0,
          }),
        }
      : undefined
  },
}

function mapLastPassage(campaign: DoorToDoorAddressCampaign | null): string {
  if (campaign === null) return i18n.t('doorToDoor.noCampaign')
  return campaign.lastPassage
    ? i18n.t('doorToDoor.lastPassage') +
        '\n' +
        i18n.t('doorToDoor.lastPassageBy', {
          firstname: campaign.lastPassageDoneBy.firstName,
          lastname: campaign.lastPassageDoneBy.lastName.charAt(0).toUpperCase(),
          date: DateFormatter.format(
            campaign.lastPassage,
            i18n.t('doorToDoor.date_format'),
          ),
        })
    : i18n.t('doorToDoor.noPassage')
}

function mapStatusIcon(
  campaignStatistics: DoorToDoorAddressCampaign | null,
): ImageRequireSource {
  switch (campaignStatistics?.status) {
    case 'ongoing':
      return require('../../assets/images/papToFinishIcon.png')
    case 'completed':
      return require('../../assets/images/papDoneIcon.png')
    default:
      return require('../../assets/images/papTodoIcon.png')
  }
}

function mapMapStatusIcon(
  campaignStatistics: DoorToDoorAddressCampaign | null,
): ImageRequireSource {
  switch (campaignStatistics?.status) {
    case 'ongoing':
      return require('../../assets/images/papToFinishCard.png')
    case 'completed':
      return require('../../assets/images/papDoneCard.png')
    default:
      return require('../../assets/images/papTodoCard.png')
  }
}
