import React from 'react'
import { AllArmorType } from '@/lib/ranking/types'
import { armorNames } from '@/lib/ranking/lists'
import { armorClasses } from '@/components/colors'

type ArmorButtonProps = {
  armor: AllArmorType
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  selected: boolean
}

const ArmorButton = ({ armor, onClick, selected }: ArmorButtonProps) => {
  const armorClass = armorClasses[armor]
  const armorLabel = armorNames[armor]
  const selectedClass = selected
    ? 'border-white text-white'
    : 'border-transparent text-black'
  return (
    <button
      onClick={onClick}
      className={`flex-grow rounded-lg border-2 p-2 text-center font-bold uppercase hover:border-white hover:text-white ${selectedClass} ${armorClass}`}
    >
      {armorLabel}
    </button>
  )
}

export default ArmorButton
