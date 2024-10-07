import { ArmorType, Difficulty, Tier } from '@prisma/client'
import { AllTier, UnrankedType } from '@/lib/ranking/types'
import { SquadType } from '@/lib/shaledb/types'

export const AllTiers: AllTier[] = [
  Tier.SS,
  Tier.S,
  Tier.A,
  Tier.B,
  Tier.C,
  Tier.D,
  UnrankedType.Unranked,
]

export const SquadTypes = [
  {
    title: 'Striker',
    squadType: SquadType.Main,
  },
  {
    title: 'Special',
    squadType: SquadType.Support,
  },
]

export const AllDifficulties: Difficulty[] = [
  Difficulty.Normal,
  Difficulty.Hard,
  Difficulty.VeryHard,
  Difficulty.Hardcore,
  Difficulty.Extreme,
  Difficulty.Insane,
  Difficulty.Torment,
  Difficulty.Floor1_49,
  Difficulty.Floor50_125,
]

export const AllArmorTypes: ArmorType[] = [
  ArmorType.Normal,
  ArmorType.LightArmor,
  ArmorType.HeavyArmor,
  ArmorType.Unarmed,
  ArmorType.ElasticArmor,
]
