import { Poll } from '../../core/entities/Poll'
import i18n from '../../utils/i18n'
import { PollRowViewModel } from './PollRowViewModel'

import pollImage01 from '../../assets/images/pollImage01.jpg'
import pollImage02 from '../../assets/images/pollImage02.jpg'
import pollImage03 from '../../assets/images/pollImage03.jpg'
import pollImage04 from '../../assets/images/pollImage04.jpg'
import pollImage05 from '../../assets/images/pollImage05.jpg'

const POLL_IMAGES = [pollImage01, pollImage02, pollImage03, pollImage04, pollImage05]

export const PollRowViewModelMapper = {
  map: (poll: Poll): PollRowViewModel => {
    const pollImage = POLL_IMAGES[poll.id % POLL_IMAGES.length]
    return {
      id: poll.uuid,
      image: pollImage,
      title: poll.name,
      subtitle: i18n.t('polls.question_count_format', {
        count: poll.questions.length,
      }),
      tag: poll.type.toString(),
    }
  },
}
