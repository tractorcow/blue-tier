import { SquadType } from '@/lib/shaleDbTypes'

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
