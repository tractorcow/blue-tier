import { ArmorType, Difficulty, Tier } from '@prisma/client'
import {
  AllArmorType,
  AllTier,
  AllType,
  UnrankedType,
} from '@/lib/ranking/types'
import { BulletType, SquadType } from '@/lib/shaledb/types'

export const AllTiers: AllTier[] = [
  Tier.SS,
  Tier.S,
  Tier.A,
  Tier.B,
  Tier.C,
  Tier.D,
  UnrankedType.Unranked,
]

export const armorNames: Record<AllArmorType, string> = {
  [ArmorType.Normal]: 'Normal',
  [ArmorType.LightArmor]: 'Light',
  [ArmorType.HeavyArmor]: 'Heavy',
  [ArmorType.Unarmed]: 'Special',
  [ArmorType.ElasticArmor]: 'Elastic',
  [AllType.All]: 'All',
}

export const bulletNames: Record<BulletType, string> = {
  [BulletType.Normal]: 'Normal',
  [BulletType.Explosion]: 'Explosive',
  [BulletType.Pierce]: 'Piercing',
  [BulletType.Mystic]: 'Mystic',
  [BulletType.Sonic]: 'Sonic',
}

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
