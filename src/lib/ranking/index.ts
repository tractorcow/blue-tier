import prisma from '@/lib/prisma'
import { Tier } from '@prisma/client'
import { RaidBase, Student } from '@/lib/shaledb/types'
import {
  AllArmorType,
  AllDifficulty,
  AllTier,
  AllType,
  Ranking,
  UnrankedType,
} from '@/lib/ranking/types'
import { AllTiers } from '@/lib/ranking/lists'

// Function to fetch tier data grouped by raidId, armorType, difficulty, and studentId
export const fetchGlobalRankings = async (): Promise<Ranking[]> => {
  return prisma.$queryRaw<Ranking[]>`
    SELECT
      "raid_id" AS "raidId",
      "armor_type" AS "armorType",
      "difficulty",
      "student_id" AS "studentId",
      MODE() WITHIN GROUP (ORDER BY "tier") AS "tier"
    FROM "rankings"
    GROUP BY "raid_id", "armor_type", "difficulty", "student_id"
  `
}

// Function to fetch grouped tier data for a specific userId
export const fetchDataForUser = async (userId: string): Promise<Ranking[]> => {
  return prisma.$queryRaw<Ranking[]>`
    SELECT
      "raid_id" AS "raidId",
      "armor_type" AS "armorType",
      "difficulty",
      "student_id" AS "studentId",
      "tier"
    FROM "rankings"
    WHERE "user_id" = ${userId}
  `
}

/**
 * Validate that a ranking exists for a given set of options
 *
 * @param rankings THe set of rankings to search within
 * @param raid The raid to check for
 * @param difficulty The difficulty to check for, or "All" if all difficulties should be checked
 * @param armor The armor type to check for, or "All" if all armor types should be checked
 * @returns True if a ranking exists for the given options
 */
const validateRankingOptions = (
  rankings: Ranking[],
  raid: RaidBase,
  difficulty: AllDifficulty,
  armor: AllArmorType
): boolean => {
  // Check if validating all difficulties
  if (difficulty === AllType.All) {
    for (const difficulty2 of raid.OptionDifficulties) {
      if (!validateRankingOptions(rankings, raid, difficulty2, armor)) {
        return false
      }
    }
    return true
  }

  // Check if validating all armor types
  if (armor === AllType.All) {
    for (const armor2 of raid.OptionTypes) {
      if (!validateRankingOptions(rankings, raid, difficulty, armor2)) {
        return false
      }
    }
    return true
  }

  // Validate a single ranking
  return !!rankings.find(
    (ranking) =>
      ranking.difficulty === difficulty && ranking.armorType === armor
  )
}

const calculateStudentTier = (
  rankings: Ranking[],
  raid: RaidBase,
  difficulty: AllDifficulty,
  armor: AllArmorType
): AllTier => {
  for (const tier of AllTiers) {
    // If we've got to this point we have no ranking
    if (tier === UnrankedType.Unranked) {
      return tier
    }

    const tierRankings = rankings.filter((ranking) => ranking.tier === tier)

    // Check if the difficulty and armor type matches the rankings
    if (validateRankingOptions(tierRankings, raid, difficulty, armor)) {
      return tier
    }
  }

  // Not ranked
  return UnrankedType.Unranked
}

/**
 * Calculate the rankings for a given set of students
 * @param students List of all students
 * @param rankings List of rankings to look through
 * @param raid index of raid
 * @param difficulty
 * @param armor
 */
export const calculateRankings = (
  students: Student[],
  rankings: Ranking[],
  raid?: RaidBase,
  difficulty?: AllDifficulty,
  armor?: AllArmorType
): Record<AllTier, Student[]> => {
  // Setup blank tiers
  const groups: Record<AllTier, Student[]> = AllTiers.reduce(
    (acc, tier) => ({ ...acc, [tier]: [] }),
    {} as Record<AllTier, Student[]>
  )

  // If no raid, difficulty, or armor is selected, return the empty rankings
  if (!raid || !difficulty || !armor) {
    return groups
  }

  // raid filter is simple
  const validRankings = rankings.filter((ranking) => ranking.raidId === raid.Id)

  // For each student, find the ranking
  students.forEach((student) => {
    const studentRankings = validRankings.filter(
      (ranking) => ranking.studentId === student.Id
    )

    // Get and store rankings
    const studentRanking = calculateStudentTier(
      studentRankings,
      raid,
      difficulty,
      armor
    )
    groups[studentRanking].push(student)
  })

  return groups
}

/**
 * Given a student, tier, raid, difficulty, and armor type, generate a set of rankings.
 * If difficulty or armour are "All", then all rankings for that raid should be generated.
 *
 * @param studentId
 * @param tier
 * @param selectedRaid
 * @param selectedDifficulty
 * @param selectedArmor
 */
export const generateRankings = (
  studentId: number,
  tier: Tier,
  selectedRaid: RaidBase,
  selectedDifficulty: AllDifficulty,
  selectedArmor: AllArmorType
): Ranking[] => {
  const rankings: Ranking[] = []

  // Check if generating all difficulties
  if (selectedDifficulty === AllType.All) {
    for (const difficulty of selectedRaid.OptionDifficulties) {
      rankings.push(
        ...generateRankings(
          studentId,
          tier,
          selectedRaid,
          difficulty,
          selectedArmor
        )
      )
    }
    return rankings
  }

  // Check if generating all armor types
  if (selectedArmor === AllType.All) {
    for (const armor of selectedRaid.OptionTypes) {
      rankings.push(
        ...generateRankings(
          studentId,
          tier,
          selectedRaid,
          selectedDifficulty,
          armor
        )
      )
    }
    return rankings
  }

  // Generate a single ranking
  rankings.push({
    studentId,
    raidId: selectedRaid.Id,
    difficulty: selectedDifficulty,
    armorType: selectedArmor,
    tier,
  })

  return rankings
}
