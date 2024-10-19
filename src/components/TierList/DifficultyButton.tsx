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
  const selectedClass = selected
    ? 'border-white text-white'
    : 'border-transparent text-black'
  const difficultyLabel = difficultyNames[difficulty]
  return (
    <button
      onClick={onClick}
      className={`flex-grow rounded-lg border-2 bg-gray-500 p-2 text-center font-bold uppercase text-white hover:border-white hover:text-white dark:bg-gray-600 ${selectedClass}`}
    >
      {difficultyLabel}
    </button>
  )
}

export default DifficultyButton
