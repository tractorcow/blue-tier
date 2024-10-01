export enum SquadType {
  Main = 'Main',
  Support = 'Support',
}

type SkillEffect = {
  Type: string
  Hits?: number[]
  Scale?: number[]
  Frames?: Record<string, number>
  CriticalCheck?: string
  Stat?: string
  Channel?: number
  Value?: number[][]
}

type Skill = {
  SkillType: string
  Name?: string
  Desc?: string
  Parameters?: string[][]
  Cost?: number[]
  Duration?: number
  Range?: number
  Radius?: { Type: string; Radius: number }[]
  Icon?: string
  Effects: SkillEffect[]
}

type Gear = {
  Released: boolean[]
  StatType: string[]
  StatValue: number[][]
  Name: string
  Desc: string
  TierUpMaterial: number[][]
  TierUpMaterialAmount: number[][]
}

type Weapon = {
  Name: string
  Desc: string
  AdaptationType: string
  AdaptationValue: number
  AttackPower1: number
  AttackPower100: number
  MaxHP1: number
  MaxHP100: number
  HealPower1: number
  HealPower100: number
  StatLevelUpType: string
}

type Summon = {
  Id: number
  SourceSkill: string
  InheritCasterStat: string[]
  InheritCasterAmount: number[][]
  ObstacleMaxHP1: number
  ObstacleMaxHP100: number
}

export type Student = {
  Id: number
  IsReleased: boolean[]
  DefaultOrder: number
  PathName: string
  DevName: string
  Name: string
  School: string
  Club: string
  StarGrade: number
  SquadType: SquadType
  TacticRole: string
  Summons: Summon[]
  Position: string
  BulletType: string
  ArmorType: string
  StreetBattleAdaptation: number
  OutdoorBattleAdaptation: number
  IndoorBattleAdaptation: number
  WeaponType: string
  WeaponImg: string
  Cover: boolean
  Equipment: string[]
  CollectionBG: string
  FamilyName: string
  PersonalName: string
  SchoolYear: string
  CharacterAge: string
  Birthday: string
  CharacterSSRNew: string
  ProfileIntroduction: string
  Hobby: string
  CharacterVoice: string
  BirthDay: string
  Illustrator: string
  Designer: string
  CharHeightMetric: string
  CharHeightImperial: string
  StabilityPoint: number
  AttackPower1: number
  AttackPower100: number
  MaxHP1: number
  MaxHP100: number
  DefensePower1: number
  DefensePower100: number
  HealPower1: number
  HealPower100: number
  DodgePoint: number
  AccuracyPoint: number
  CriticalPoint: number
  CriticalDamageRate: number
  AmmoCount: number
  AmmoCost: number
  Range: number
  RegenCost: number
  Skills: Skill[]
  FavorStatType: string[]
  FavorStatValue: number[][]
  FavorAlts: number[]
  MemoryLobby: number[]
  MemoryLobbyBGM: string
  FurnitureInteraction: number[][][]
  FavorItemTags: string[]
  FavorItemUniqueTags: string[]
  IsLimited: number
  Weapon: Weapon
  Gear: Gear
  SkillExMaterial: number[][]
  SkillExMaterialAmount: number[][]
  SkillMaterial: number[][]
  SkillMaterialAmount: number[][]
}

const jsonUrl =
  'https://cdn.jsdelivr.net/gh/SchaleDB/SchaleDB@main/data/en/students.min.json'

const fetchStudents = async (): Promise<Student[]> => {
  const response = await fetch(jsonUrl)
  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.statusText}`)
  }
  return (await response.json()) as Student[]
}

export default fetchStudents
