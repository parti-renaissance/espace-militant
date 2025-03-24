export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other',
}

export const AllGenders: Array<Gender> = [Gender.Male, Gender.Female, Gender.Other]

export enum AgeRange {
  UpTo20 = 'UpTo20',
  From20To24 = 'From20To24',
  From25To39 = 'From25To39',
  From40To54 = 'From40To54',
  From55To64 = 'From55To64',
  From65To80 = 'From65To80',
  From80 = 'From80',
}

export const AllAgeRanges: Array<AgeRange> = [
  AgeRange.UpTo20,
  AgeRange.From20To24,
  AgeRange.From25To39,
  AgeRange.From40To54,
  AgeRange.From55To64,
  AgeRange.From65To80,
  AgeRange.From80,
]

export enum Profession {
  Employee = 'Employee',
  Worker = 'Worker',
  Executive = 'Executive',
  Intermediate = 'Intermediate',
  Independent = 'Independent',
  Retired = 'Retired',
  Student = 'Student',
}

export const AllProfessions: Array<Profession> = [
  Profession.Employee,
  Profession.Worker,
  Profession.Executive,
  Profession.Intermediate,
  Profession.Independent,
  Profession.Retired,
  Profession.Student,
]

export interface UserProfile {
  gender: Gender | undefined
  age: AgeRange | undefined
  profession: Profession | undefined
}

export enum UserTagEnum {
  SYMPATHISANT = 'sympathisant',
  ADHERENT = 'adherent',
  ELU = 'elu',
  OTHER = 'other',
}
