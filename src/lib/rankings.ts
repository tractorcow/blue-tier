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
      "raidId",
      "armorType",
      "difficulty",
      "studentId",
      MODE() WITHIN GROUP (ORDER BY "tier") AS "tier"
    FROM "rankings"
    GROUP BY "raidId", "armorType", "difficulty", "studentId"
  `
}

// Function to fetch grouped tier data for a specific userId
export const fetchDataForUser = async (userId: string): Promise<Ranking[]> => {
  return prisma.$queryRaw<Ranking[]>`
    SELECT
      "raidId",
      "armorType",
      "difficulty",
      "studentId",
      "tier"
    FROM "rankings"
    WHERE "userId" = ${userId}
  `
}
