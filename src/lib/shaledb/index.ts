import {
  RaidBase,
  RaidType,
  SchaleDBData,
  Student,
  TacticRole,
} from '@/lib/shaledb/types'
import { ArmorType, Difficulty } from '@prisma/client'

const dataUrl = (type: string): string => {
  return `https://cdn.jsdelivr.net/gh/SchaleDB/SchaleDB@main/data/en/${type}.min.json`
}

export const imageUrl = (path: string): string => {
  return `https://cdn.jsdelivr.net/gh/SchaleDB/SchaleDB@main/images/${path}`
}

export const studentIcon = (student: Student): string => {
  return imageUrl(`student/icon/${student.Id}.webp`)
}

export const attackIcon = (): string => {
  return imageUrl('ui/Type_Attack_s.png')
}

export const defenseIcon = (): string => {
  return imageUrl('ui/Type_Defense_s.png')
}

/**
 * Generate image for role icon
 * @param role
 */
export const roleIcon = (role: TacticRole): string => {
  return imageUrl(`ui/Role_${role}.png`)
}

const fetchDataSource = async (type: string) => {
  const jsonUrl = dataUrl(type)
  const response = await fetch(jsonUrl)
  if (!response.ok) {
    throw new Error(
      `Failed to fetch data from ${jsonUrl}: ${response.statusText}`
    )
  }
  return response.json()
}

const fetchData = async (): Promise<SchaleDBData> => {
  const [students, raidData] = await Promise.all([
    fetchDataSource('students'),
    fetchDataSource('raids'),
  ])

  // Split up the raid data
  const raids: RaidBase[] = []
  for (const data of raidData['Raid']) {
    // Kuro has elastic instead of heavy armour
    const armorTypes =
      data['ArmorType'] == ArmorType.ElasticArmor
        ? [ArmorType.ElasticArmor, ArmorType.LightArmor, ArmorType.Unarmed]
        : [ArmorType.LightArmor, ArmorType.HeavyArmor, ArmorType.Unarmed]

    // Limit our focus to only extreme and insane
    const difficulties = [Difficulty.Extreme, Difficulty.Insane]

    raids.push({
      RaidType: RaidType.Raid,
      OptionTypes: armorTypes,
      OptionDifficulties: difficulties,
      ...data,
    })
  }

  // Merge all multi floor raids into a single unit
  const multiFloorArmors = raidData['MultiFloorRaid'].map(
    (raid: RaidBase) => raid.ArmorType
  )
  raids.push({
    RaidType: RaidType.MultiFloorRaid,
    OptionTypes: multiFloorArmors,
    OptionDifficulties: [Difficulty.Floor1_49, Difficulty.Floor50_125],
    ...raidData['MultiFloorRaid'][0],
  })

  // Sort students by name
  ;(students as Student[]).sort((a, b) => a.Name.localeCompare(b.Name))

  return {
    raids,
    students,
  }
}

export default fetchData
