import React from 'react'
import { AllDifficulty } from '@/lib/ranking/types'
import { difficultyNames } from '@/lib/ranking/lists'

type DifficultyButtonProps = {
  difficulty: AllDifficulty
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  selected: boolean
}

const DifficultyButton = ({
  difficulty,
  onClick,
  selected,
}: DifficultyButtonProps) => {
  const selectedClass = selected ? 'border-gray-200' : 'border-transparent'
  const difficultyLabel = difficultyNames[difficulty]
  return (
    <button
      onClick={onClick}
      className={`flex-grow rounded-lg border-2 bg-gray-700 p-2 text-center uppercase text-white hover:bg-gray-600 ${selectedClass}`}
    >
      {difficultyLabel}
    </button>
  )
}

export default DifficultyButton
