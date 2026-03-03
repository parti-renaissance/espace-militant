import DoorToDoorRepository from '../../data/DoorToDoorRepository'
import { DoorToDoorPollResult } from '../../screens/doorToDoor/tunnel/survey/DoorToDoorQuestionResult'
import type { BuildingSelectedParams } from '../entities/DoorToDoor'
import { DoorToDoorPollParams } from '../entities/DoorToDoorPollParams'

export const INTERLOCUTOR_ACCEPT_TO_ANSWER_CODE = 'accept_to_answer'

export type DoorToDoorPollSubmissionParams = {
  campaignId: string
  doorStatus: string
  buildingParams: BuildingSelectedParams
  pollResult?: DoorToDoorPollResult
  visitStartDateISOString: string
}

export class SendDoorPollAnswersInteractor {
  private repository = DoorToDoorRepository.getInstance()

  public async execute(
    params: DoorToDoorPollSubmissionParams,
  ): Promise<void> {
    const pollParams = {
      campaignId: params.campaignId,
      buildingId: params.buildingParams.id,
      status: params.doorStatus,
      block: params.buildingParams.block,
      floor: params.buildingParams.floor,
      door: params.buildingParams.door,
    }

    await this.sendAnswers(
      params.doorStatus,
      pollParams,
      params.pollResult ?? { answers: [], qualificationAnswers: [] },
      params.visitStartDateISOString,
    )

    if (params.buildingParams.type === 'house') {
      await DoorToDoorRepository.getInstance().closeBuildingBlockFloor(
        params.campaignId,
        params.buildingParams.id,
        params.buildingParams.block,
        params.buildingParams.floor,
      )
    }
  }

  private async sendAnswers(
    status: string,
    pollParams: DoorToDoorPollParams,
    pollResult: DoorToDoorPollResult,
    visitStartDateISOString: string,
  ) {
    const response = await this.repository.createDoorPollCampaignHistory(
      pollParams,
      pollResult,
      visitStartDateISOString,
    )
    if (status === INTERLOCUTOR_ACCEPT_TO_ANSWER_CODE && pollResult) {
      await this.repository.sendDoorToDoorPollAnswers(response.uuid, pollResult)
    }
  }

}
