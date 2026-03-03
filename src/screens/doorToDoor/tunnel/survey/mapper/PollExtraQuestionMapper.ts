import { ImageProps } from 'react-native'
import {
  PollExtraCompoundAnswer,
  PollExtraMultipleChoicesAnswer,
  PollExtraSingleChoiceAnswer,
  PollExtraTextAnswer,
} from '../../../../../core/entities/PollExtraAnswer'
import {
  PollExtraQuestion,
  PollExtraQuestionChoice,
  PollExtraQuestionChoiceOptions,
  PollExtraQuestionCompoundOptions,
  PollExtraQuestionDualChoiceOptions,
  PollExtraQuestionTextOptions,
} from '../../../../../core/entities/PollExtraQuestion'
import i18n from '../../../../../utils/i18n'
import { PollDetailQuestionChoiceViewModel } from '../../../../pollDetail/PollDetailQuestionChoiceViewModel'
import { PollDetailQuestionInputViewModel } from '../../../../pollDetail/PollDetailQuestionInputViewModel'
import {
  NO_ID,
  YES_ID,
} from '../../../../pollDetailUserData/PollDetailQuestionUserDataViewModelMapper'
import { QualificationFormUserDataViewModel } from '../../qualification/QualificationFormUserDataViewModel'

import genderFemale from '../../../../../assets/images/genderFemale.png'
import genderMale from '../../../../../assets/images/genderMale.png'

export const QUESTION_CODE_GENDER = 'gender'

export const PollExtraQuestionMapper = {
  mapInput: (
    question: PollExtraQuestion,
    answer: PollExtraTextAnswer,
  ): PollDetailQuestionInputViewModel => {
    const options = question.options as PollExtraQuestionTextOptions
    return {
      title: options.label,
      content: {
        id: question.code,
        text: answer.value,
      },
    }
  },
  mapSingleChoice: (
    question: PollExtraQuestion,
    answer: PollExtraSingleChoiceAnswer | undefined,
  ): PollDetailQuestionChoiceViewModel => {
    const options = question.options as PollExtraQuestionChoiceOptions
    const mapImage = (
      questionCode: string,
      choice: PollExtraQuestionChoice,
    ): ImageProps | undefined => {
      if (questionCode === QUESTION_CODE_GENDER) {
        switch (choice.code) {
          case 'female':
            return genderFemale
          case 'male':
            return genderMale
        }
      }
      return undefined
    }
    return {
      title: options.title,
      subtitle: options.subtitle,
      answers: options.choices.map((choice) => {
        return {
          id: choice.code,
          title: choice.label,
          isSelected: answer?.choiceId === choice.code,
          image: mapImage(question.code, choice),
        }
      }),
    }
  },
  mapDualChoice: (
    question: PollExtraQuestion,
    answer: PollExtraSingleChoiceAnswer | undefined,
  ): PollDetailQuestionChoiceViewModel => {
    const options = question.options as PollExtraQuestionDualChoiceOptions
    return {
      title: options.title,
      subtitle: options.subtitle,
      answers: [
        {
          id: YES_ID,
          title: i18n.t('polldetail.user_form.positive_choice'),
          isSelected: answer?.choiceId === YES_ID,
        },
        {
          id: NO_ID,
          title: i18n.t('polldetail.user_form.negative_choice'),
          isSelected: answer?.choiceId === NO_ID,
        },
      ],
    }
  },
  mapMultipleChoice: (
    question: PollExtraQuestion,
    answer: PollExtraMultipleChoicesAnswer | undefined,
  ): PollDetailQuestionChoiceViewModel => {
    const options = question.options as PollExtraQuestionChoiceOptions
    return {
      title: options.title,
      subtitle: options.subtitle,
      answers: options.choices.map((choice) => {
        return {
          id: choice.code,
          title: choice.label,
          isSelected: answer?.choiceIds?.includes(choice.code) ?? false,
        }
      }),
    }
  },
  mapCompound: (
    question: PollExtraQuestion,
    answer: PollExtraCompoundAnswer,
  ): QualificationFormUserDataViewModel => {
    const options = question.options as PollExtraQuestionCompoundOptions
    const textSubQuestions = options.children.filter(
      (child) => child.type === 'text',
    )
    return {
      id: question.code,
      title: options.label,
      data: textSubQuestions.map((textSubQuestion) => {
        const subQuestyionOptions =
          textSubQuestion.options as PollExtraQuestionTextOptions
        return {
          id: textSubQuestion.code,
          title: subQuestyionOptions.label,
          placeholder: subQuestyionOptions.placeholder,
          value: answer.values.get(textSubQuestion.code) ?? '',
          autocapitalize: 'none',
          keyboardType: 'default',
        }
      }),
    }
  },
}
