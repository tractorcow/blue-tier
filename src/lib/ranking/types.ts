import {
  ArmorType,
  Difficulty,
  Tier,
  Ranking as DBRanking,
} from '@prisma/client'

// It's necessary to strip some DB fields when mutating this locally
export type Ranking = Omit<
  DBRanking,
  'id' | 'createdAt' | 'updatedAt' | 'userId'
>

// just the unique identifiable fields from ranking
export type RankingId = Omit<Ranking, 'tier'>

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
