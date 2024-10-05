import { ArmorType, Difficulty, SquadType } from '@/lib/shaleDbTypes'

export enum Tier {
  SS = 'SS',
  S = 'S',
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  Unranked = 'Unranked',
}

export const AllTiers: Tier[] = [
  Tier.SS,
  Tier.S,
  Tier.A,
  Tier.B,
  Tier.C,
  Tier.D,
  Tier.Unranked,
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
