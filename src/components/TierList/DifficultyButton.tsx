import React from 'react'
import { AllDifficulty } from '@/lib/rankings'

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
    ? 'bg-gray-400 hover:bg-gray-300'
    : 'bg-gray-600 hover:bg-gray-500'
  return (
    <button
      onClick={onClick}
      className={`rounded px-4 py-2 font-semibold text-gray-800 ${selectedClass}`}
    >
      {difficulty}
    </button>
  )
}

export default DifficultyButton
