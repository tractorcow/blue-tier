import prisma from '@/lib/prisma'
import { ArmorType, Difficulty } from '@/lib/shaleDbTypes'
import { Tier } from '@/lib/tiers' // Adjust the path based on your setup

export type Ranking = {
  raidId: string
  armorType: ArmorType
  difficulty: Difficulty
  studentId: string
  tier: Tier
}

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
