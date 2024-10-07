import React from 'react'
import { ArmorType } from '@prisma/client'
import { AllArmorType, AllType } from '@/lib/ranking/types'

const ArmorClasses = {
  [ArmorType.Normal]: {
    class: 'bg-gray-300 hover:bg-gray-400',
    label: 'Normal',
    selected: 'bg-gray-500 hover:bg-gray-600',
  },
  [ArmorType.LightArmor]: {
    class: 'bg-red-300 hover:bg-red-400',
    label: 'Explosive',
    selected: 'bg-red-500 hover:bg-red-600',
  },
  [ArmorType.HeavyArmor]: {
    class: 'bg-yellow-300 hover:bg-yellow-400',
    label: 'Piercing',
    selected: 'bg-yellow-500 hover:bg-yellow-600',
  },
  [ArmorType.Unarmed]: {
    class: 'bg-blue-300 hover:bg-blue-400',
    label: 'Mystic',
    selected: 'bg-blue-500 hover:bg-blue-600',
  },
  [ArmorType.ElasticArmor]: {
    class: 'bg-purple-300 hover:bg-purple-400',
    label: 'Elastic',
    selected: 'bg-purple-500 hover:bg-purple-600',
  },
  [AllType.All]: {
    class: 'bg-green-300 hover:bg-green-400',
    label: 'All',
    selected: 'bg-green-500 hover:bg-green-600',
  },
}

type ArmorButtonProps = {
  armor: AllArmorType
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  selected: boolean
}

const ArmorButton = ({ armor, onClick, selected }: ArmorButtonProps) => {
  if (!ArmorClasses[armor]) {
    return null
  }
  const armourSpec = ArmorClasses[armor]
  return (
    <button
      onClick={onClick}
      className={`rounded px-4 py-2 font-semibold text-white ${selected ? armourSpec.selected : armourSpec.class}`}
    >
      {armourSpec.label}
    </button>
  )
}

export default ArmorButton
