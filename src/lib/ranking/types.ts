import { ArmorType, Difficulty, Tier } from '@prisma/client'

export enum RankingType {
  Global = 'Global',
  User = 'User',
}

export enum AllType {
  All = 'All',
}

export enum UnrankedType {
  Unranked = 'Unranked',
}

export type AllArmorType = ArmorType | AllType

export type AllDifficulty = Difficulty | AllType

export type AllTier = Tier | UnrankedType
