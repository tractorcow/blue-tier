import { parse } from 'csv-parse/sync'
import fetchData from '@/lib/shaledb'
import { SchaleDBData } from '@/lib/shaledb/types'
import { Difficulty, Tier } from '@prisma/client'
import { AllArmorTypes } from '@/lib/ranking/lists'
import { AllTier, Ranking } from '@/lib/ranking/types'
import { updateUserRankings } from '@/lib/ranking'

// We haven't got this in our list yet
const skippedStudents = ['Kisaki', 'Tomoe (Qipao)', 'Marina (Qipao)', 'Reijo']

const substitutions = {
  '(Tracksuit)': '(Track)',
  'Shiroko＊Terror': 'Shiroko Terror',
  Miku: 'Hatsune Miku',
  Mikuwu: 'Hatsune Miku',
  フィーナ: 'Pina',
  // Todo - merge or split these
  'Hoshino (Battle/Tank)': 'Hoshino (Battle)',
  'Hoshino (Battle/Attack)': 'Hoshino (Battle)',
  'Hoshino (Combat/Attack)': 'Hoshino (Battle)',
  'Hoshino (Combat/Tank)': 'Hoshino (Battle)',
}

const pickRanking = (rating: string): AllTier => {
  if (!rating) {
    return Tier.D
  }
  const ratingValue = parseFloat(rating)
  if (ratingValue >= 11) {
    return Tier.SS
  }

  if (ratingValue >= 10) {
    return Tier.S
  }

  if (ratingValue >= 9) {
    return Tier.A
  }

  if (ratingValue >= 8) {
    return Tier.B
  }

  if (ratingValue >= 7) {
    return Tier.C
  }

  return Tier.D
}

// Function to handle the combination of record name, headers, and cell value
const processData = async (
  { raids, students }: SchaleDBData,
  recordName: string,
  raidName: string,
  armorName: string,
  rating: string,
  userId: string,
  difficulty: Difficulty
): Promise<number> => {
  // Lookup raids to make sure the given raid is valid
  const raid = raids.find((r) => r.Name === raidName)
  if (!raid) {
    throw new Error(`Invalid raid: ${raidName}`)
  }

  // Skip some students
  if (skippedStudents.includes(recordName)) {
    return 0
  }

  // Apply substitutions to recordName
  let studentName = recordName
  for (const [from, to] of Object.entries(substitutions)) {
    studentName = studentName.replace(from, to)
  }

  // Lookup students to make sure the given student is valid
  const student = students.find((s) => s.Name === studentName)
  if (!student) {
    // Skip unknown students
    throw new Error(`Invalid student: ${recordName}`)
  }

  // Split armour types, validate each
  const armorNames = armorName.split(',').map((a) => a.trim())
  const armors = AllArmorTypes.filter((a) => armorNames.includes(a))
  if (armors.length !== armorNames.length) {
    throw new Error(`Invalid armor: ${armorName}`)
  }

  // Import rankings for each
  const rankings: Ranking[] = []
  for (const armor of armors) {
    rankings.push({
      studentId: student.Id,
      raidId: raid.Id,
      armorType: armor,
      tier: pickRanking(rating),
      difficulty,
    })
  }

  // Save rankings in the DB
  await updateUserRankings(userId, rankings)

  return rankings.length
}

// Function to parse the CSV
const importCSV = async (
  data: string,
  userId: string,
  difficulty: Difficulty
): Promise<number> => {
  const schaleData = await fetchData()
  const raids: string[] = []
  const raidArmors: string[] = []
  const studentNames: string[] = []
  const ratings: string[][] = []

  let isFirstHeaderRow = true
  let isSecondHeaderRow = false
  let isDataRow = false

  const records = parse(data, { delimiter: ',', from_line: 1 }) as string[][]
  records.forEach((record) => {
    if (isFirstHeaderRow) {
      raids.push(...record.slice(1))
      isFirstHeaderRow = false
      isSecondHeaderRow = true
    } else if (isSecondHeaderRow) {
      raidArmors.push(...record.slice(1))
      isSecondHeaderRow = false
      isDataRow = true
    } else if (isDataRow) {
      const recordName = record[0]
      studentNames.push(recordName)
      ratings.push(record.slice(1))
    }
  })

  let count = 0

  // Iterate over each row (record name) and column (header1, header2)
  for (let i = 0; i < studentNames.length; i++) {
    for (let j = 0; j < raids.length; j++) {
      const recordName = studentNames[i]
      const raid = raids[j]
      const armor = raidArmors[j]
      const rating = ratings[i][j]
      count += await processData(
        schaleData,
        recordName,
        raid,
        armor,
        rating,
        userId,
        difficulty
      )
    }
  }
  return count
}

export default importCSV
