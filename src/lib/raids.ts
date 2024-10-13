import {
  BulletType,
  MultiFloorRaid,
  Raid,
  RaidBase,
  RaidType,
} from '@/lib/shaledb/types'
import { AllDifficulty, AllType } from '@/lib/ranking/types'
import { Difficulty } from '@prisma/client'
import { Optional } from '@/lib/types'

/**
 * Check if raid is a regular raid
 * @param raid
 */
export const isRaid = (raid: Optional<RaidBase>): raid is Raid => {
  return !!raid && raid.RaidType === RaidType.Raid
}

/**
 * Check if raid is a multifloor raid
 * @param raid
 */
export const isMultiFloorRaid = (
  raid: Optional<RaidBase>
): raid is MultiFloorRaid => {
  return !!raid && raid.RaidType === RaidType.MultiFloorRaid
}

/**
 * List of difficulties that imply the highest difficulty
 */
const insaneTypes: AllDifficulty[] = [
  AllType.All,
  Difficulty.Insane,
  Difficulty.Torment,
  Difficulty.Floor50_125,
]

/**
 * Determine the bullet type to use for matching.
 * If difficulty is "All" then assume highest difficulty
 *
 * @param raid
 * @param difficulty
 */
export const determineBulletType = (
  raid: Optional<RaidBase>,
  difficulty: Optional<AllDifficulty>
): Optional<BulletType> => {
  // Skip unknown raid / difficulty
  if (!raid || !difficulty) {
    return null
  }

  // Regular raids only have one bullet type
  if (isRaid(raid)) {
    // Check if the insane type matches the difficulty
    if (raid.BulletTypeInsane && insaneTypes.includes(difficulty)) {
      return raid.BulletTypeInsane
    }
    return raid.BulletType
  }

  if (isMultiFloorRaid(raid) && raid.BulletType.length > 0) {
    // multifloor raid bullet type is based on either first or last floor
    if (insaneTypes.includes(difficulty)) {
      return raid.BulletType[raid.BulletType.length - 1]
    }

    // If not insane just use the easiest bullet type
    return raid.BulletType[0]
  }

  return null
}
