import React from 'react'
import RaidCard from '@/components/Raids/RaidCard'
import DifficultyButton from '@/components/TierList/DifficultyButton'
import ArmorButton from '@/components/TierList/ArmorButton'
import { RaidBase } from '@/lib/shaledb/types'
import { AllArmorType, AllDifficulty, AllType } from '@/lib/ranking/types'
import { Optional } from '@/lib/types'

type TierFiltersProps = {
  // Raid
  raids: RaidBase[]
  selectedRaid: Optional<RaidBase>
  changeRaid: (raidId: number) => void
  // Difficulty
  difficulties: AllDifficulty[]
  selectedDifficulty: Optional<AllDifficulty>
  changeDifficulty: (difficulty: AllDifficulty) => void
  // Armor
  armors: AllArmorType[]
  selectedArmor: Optional<AllArmorType>
  changeArmour: (armor: AllArmorType) => void
}

export default function TierFilters({
  // Raid
  raids,
  selectedRaid,
  changeRaid,
  // Difficulty
  difficulties,
  selectedDifficulty,
  changeDifficulty,
  // Armor
  armors,
  selectedArmor,
  changeArmour,
}: TierFiltersProps) {
  return (
    <div className='flex w-full flex-col space-y-4 lg:flex-row lg:space-x-4 lg:space-y-0'>
      <div className='lg:flex-grow'>
        <RaidCard
          raids={raids}
          changeRaid={changeRaid}
          raid={selectedRaid}
          difficulty={selectedDifficulty}
          armor={selectedArmor}
        />
      </div>
      <div className='lg:flex-grow'>
        <div className='w-full space-y-2'>
          {/* Difficulty Selector */}
          {difficulties && (
            <div className='flex gap-2'>
              {difficulties.map((difficulty) => {
                return (
                  <DifficultyButton
                    key={difficulty}
                    difficulty={difficulty}
                    selected={
                      selectedDifficulty === difficulty ||
                      selectedDifficulty == AllType.All
                    }
                    onClick={() => changeDifficulty(difficulty)}
                  />
                )
              })}
            </div>
          )}

          {/* Color Selector */}
          {armors && (
            <div className='flex gap-2'>
              {armors.map((armor) => {
                return (
                  <ArmorButton
                    key={armor}
                    armor={armor}
                    selected={
                      selectedArmor === armor || selectedArmor == AllType.All
                    }
                    onClick={() => changeArmour(armor)}
                  />
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
