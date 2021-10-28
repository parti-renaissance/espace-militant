import { PhoningCampaign } from '../../core/entities/PhoningCampaign'
import i18n from '../../utils/i18n'
import { PhoningScoreboardRowViewModelMapper } from '../phoningCampaignScoreboard/PhoningScoreboardRowViewModelMapper'
import {
  PhonePollDetailSuccessViewModel,
  PhonePollDetailSuccessRowRanking,
  PhonePollDetailSuccessSection,
  PhonePollDetailSuccessRowType,
} from './PhonePollDetailSuccessViewModel'

export const PhonePollDetailSuccessViewModelMapper = {
  map: (
    campaign: PhoningCampaign | undefined,
  ): PhonePollDetailSuccessViewModel => {
    const rankingRows: Array<PhonePollDetailSuccessRowRanking> = PhoningScoreboardRowViewModelMapper.map(
      campaign?.scoreboard ?? [],
    ).rows.map((viewModel) => ({
      type: 'rankingRow',
      viewModel,
    }))
    const rankingSection: PhonePollDetailSuccessSection = {
      title: i18n.t('phoning.scoreboard.title'),
      data: [{ type: 'rankingHeader' }].concat(
        rankingRows,
      ) as Array<PhonePollDetailSuccessRowType>,
    }

    var sections: Array<PhonePollDetailSuccessSection> = [
      {
        title: i18n.t('phoningsession.success.title'),
        data: [
          {
            type: 'successContent',
            viewModel: {
              isProgressDisplayed: campaign !== undefined,
              progress: campaign?.callsCount ?? 0,
              total: campaign?.goal ?? 0,
            },
          },
        ],
      },
    ]
    if ((campaign?.scoreboard.length ?? 0) > 0) {
      sections.push(rankingSection)
    }
    return { sections }
  },
}
