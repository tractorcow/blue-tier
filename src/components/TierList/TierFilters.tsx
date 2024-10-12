import React from 'react'
import RaidCard from '@/components/Raids/RaidCard'
import DifficultyButton from '@/components/TierList/DifficultyButton'
import ArmorButton from '@/components/TierList/ArmorButton'
import { RaidBase } from '@/lib/shaledb/types'
import { AllArmorType, AllDifficulty } from '@/lib/ranking/types'
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
        {/* Difficulty Selector */}
        {difficulties && (
          <div className='mb-4 flex space-x-4'>
            {difficulties.map((difficulty) => {
              return (
                <DifficultyButton
                  key={difficulty}
                  difficulty={difficulty}
                  selected={selectedDifficulty === difficulty}
                  onClick={() => changeDifficulty(difficulty)}
                />
              )
            })}
          </div>
        )}

        {/* Color Selector */}
        {armors && (
          <div className='mb-4 flex space-x-4'>
            {armors.map((armor) => {
              return (
                <ArmorButton
                  key={armor}
                  armor={armor}
                  selected={selectedArmor === armor}
                  onClick={() => changeArmour(armor)}
                />
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
  //
  // return (
  //   <div className='mb-8 border-b-2 border-gray-300 pb-4 dark:border-gray-700'>
  //     {/* Boss Selector and Info Box */}
  //     <div className='mb-4 flex justify-between'>
  //       <select
  //         value={selectedRaid?.Id || 0}
  //         onChange={(e) => changeRaid(parseInt(e.target.value))}
  //         className='rounded border border-gray-300 px-4 py-2 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200'
  //       >
  //         <option value={0}>Select Raid</option>
  //         {raids.map((raid) => (
  //           <option key={raid.Id} value={raid.Id}>
  //             {raid.Name}
  //           </option>
  //         ))}
  //       </select>
  //       {selectedRaid && <RaidCard raid={selectedRaid} />}
  //     </div>
  //
  //     {/* Filter Box */}
  //     <input
  //       type='text'
  //       className='w-1/2 rounded border border-gray-300 bg-white px-4 py-2 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200'
  //       placeholder='Filter by Student Name'
  //     />
  //   </div>
  // )
}
