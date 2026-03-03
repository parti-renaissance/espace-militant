import { ImageSourcePropType } from 'react-native'
import {
  AgeRange,
  AllAgeRanges,
  AllGenders,
  AllProfessions,
  Gender,
  Profession,
  UserProfile,
} from '../../core/entities/UserProfile'
import i18n from '../../utils/i18n'
import {
  PollDetailQuestionUserProfileSectionViewModel,
  PollDetailQuestionUserProfileViewModel,
} from './PollDetailQuestionUserProfileViewModel'

import genderFemale from '../../assets/images/genderFemale.png'
import genderMale from '../../assets/images/genderMale.png'
import genderOther from '../../assets/images/genderOther.png'

const genderTitle = (gender: Gender): string => {
  switch (gender) {
    case Gender.Male:
      return i18n.t('polldetail.profile.gender_male')
    case Gender.Female:
      return i18n.t('polldetail.profile.gender_female')
    case Gender.Other:
      return i18n.t('polldetail.profile.gender_other')
  }
}

const genderImage = (gender: Gender): ImageSourcePropType => {
  switch (gender) {
    case Gender.Male:
      return genderMale
    case Gender.Female:
      return genderFemale
    case Gender.Other:
      return genderOther
  }
}

const ageTitle = (age: AgeRange): string => {
  switch (age) {
    case AgeRange.UpTo20:
      return i18n.t('polldetail.profile.age_range_20')
    case AgeRange.From20To24:
      return i18n.t('polldetail.profile.age_range_20_24')
    case AgeRange.From25To39:
      return i18n.t('polldetail.profile.age_range_25_39')
    case AgeRange.From40To54:
      return i18n.t('polldetail.profile.age_range_40_54')
    case AgeRange.From55To64:
      return i18n.t('polldetail.profile.age_range_55_64')
    case AgeRange.From65To80:
      return i18n.t('polldetail.profile.age_range_65_80')
    case AgeRange.From80:
      return i18n.t('polldetail.profile.age_range_80')
  }
}

const professionTitle = (profession: Profession): string => {
  switch (profession) {
    case Profession.Employee:
      return i18n.t('polldetail.profile.profession_employee')
    case Profession.Worker:
      return i18n.t('polldetail.profile.profession_worker')
    case Profession.Executive:
      return i18n.t('polldetail.profile.profession_executive')
    case Profession.Intermediate:
      return i18n.t('polldetail.profile.profession_intermediate')
    case Profession.Independent:
      return i18n.t('polldetail.profile.profession_independent')
    case Profession.Retired:
      return i18n.t('polldetail.profile.profession_retired')
    case Profession.Student:
      return i18n.t('polldetail.profile.profession_student')
  }
}

export enum UserProfileSection {
  Gender = 'Gender',
  Age = 'Age',
  Profession = 'Profession',
}

export const PollDetailQuestionUserProfileViewModelMapper = {
  map: (profile: UserProfile): PollDetailQuestionUserProfileViewModel => {
    const genderSection: PollDetailQuestionUserProfileSectionViewModel = {
      id: UserProfileSection.Gender,
      title: i18n.t('polldetail.profile.gender_section'),
      data: [
        {
          type: 'gender',
          value: {
            id: 'gender',
            genders: AllGenders.map((gender: Gender) => {
              return {
                id: gender.toString(),
                title: genderTitle(gender),
                image: genderImage(gender),
                isSelected: profile.gender === gender,
              }
            }),
          },
        },
      ],
    }

    const ageSection: PollDetailQuestionUserProfileSectionViewModel = {
      id: UserProfileSection.Age,
      title: i18n.t('polldetail.profile.age_section'),
      data: AllAgeRanges.map((age) => {
        return {
          type: 'choice',
          value: {
            id: age.toString(),
            title: ageTitle(age),
            isSelected: profile.age === age,
          },
        }
      }),
    }

    const professionSection: PollDetailQuestionUserProfileSectionViewModel = {
      id: UserProfileSection.Profession,
      title: i18n.t('polldetail.profile.profession_section'),
      data: AllProfessions.map((profession) => {
        return {
          type: 'choice',
          value: {
            id: profession.toString(),
            title: professionTitle(profession),
            isSelected: profile.profession === profession,
          },
        }
      }),
    }

    return {
      sections: [genderSection, ageSection, professionSection],
    }
  },
}
