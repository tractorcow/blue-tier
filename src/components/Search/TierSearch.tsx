import { Dropdown } from '@/components/Fields/Dropdown'
import {
  armorEfficiencies,
  bulletEFficiencies,
  Efficiency,
  SearchState,
} from '@/state/SearchState'
import React from 'react'
import { Optional } from '@/lib/types'

type TierSearchProps = {
  searchState: SearchState
  setNameFilter: (name: string) => void
  setBulletEfficiency: (efficiency: Optional<Efficiency>) => void
  setArmorEfficiency: (efficiency: Optional<Efficiency>) => void
}

export default function TierSearch({
  searchState,
  setNameFilter,
  setBulletEfficiency,
  setArmorEfficiency,
}: TierSearchProps) {
  return (
    <div className='flex flex-col justify-between space-y-2 md:flex-row md:space-x-2 md:space-y-0'>
      <div className='relative flex-grow text-right'>
        <input
          type='text'
          value={searchState.searchQuery}
          onChange={(e) => setNameFilter(e.target.value)}
          placeholder='Filter students by name'
          className='w-full rounded-lg border-[1px] border-black bg-gray-300 px-4 py-2 pl-10 placeholder-gray-700 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-white dark:bg-gray-700 dark:placeholder-gray-400'
        />
        <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
          <i className='fas fa-search text-gray-500 dark:text-gray-400'></i>
        </div>
      </div>
      <div className='flex-grow'>
        <Dropdown
          options={Object.keys(bulletEFficiencies).map((key) => ({
            value: key as Efficiency,
            label: bulletEFficiencies[key as Efficiency],
          }))}
          value={searchState.bulletEfficiency}
          onChange={setBulletEfficiency}
          canDeselect={true}
          placeholder='Filter bullet effectiveness'
          noneLabel='Any bullet'
          className='rounded-lg border-[1px] border-black bg-gray-300 px-4 py-2 dark:border-white dark:bg-gray-700'
          menuClassName='rounded-md border border-gray-300 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-800 text-lg'
        />
      </div>
      <div className='flex-grow'>
        <Dropdown
          options={Object.keys(armorEfficiencies).map((key) => ({
            value: key as Efficiency,
            label: armorEfficiencies[key as Efficiency],
          }))}
          value={searchState.armorEfficiency}
          onChange={setArmorEfficiency}
          canDeselect={true}
          placeholder='Filter armor resistance'
          noneLabel='Any armor'
          className='rounded-lg border-[1px] border-black bg-gray-300 px-4 py-2 dark:border-white dark:bg-gray-700'
          menuClassName='rounded-md border border-gray-300 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-800 text-lg'
        />
      </div>
    </div>
  )
}
