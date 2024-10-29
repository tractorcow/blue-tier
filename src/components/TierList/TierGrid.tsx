import { AllTiers, tierNames } from '@/lib/ranking/lists'
import { DragDropContext, DropResult } from '@hello-pangea/dnd'
import React from 'react'
import { SquadType, Student } from '@/lib/shaledb/types'
import { AllTier, RankingType } from '@/lib/ranking/types'
import TierGroup from '@/components/TierList/TierGroup'

type TiersGridProps = {
  rankings: Record<AllTier, Student[]>
  rankingType: RankingType
  onStudentRanked: (studentId: number, tier: AllTier) => void
}

export default function TierGrid({
  onStudentRanked,
  rankings,
  rankingType,
}: TiersGridProps) {
  /**
   * Handler for drag-drop
   * @param result
   */
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return
    }

    // Get the tier from the droppableId, e.g. "SS-Main" -> "SS"
    const tier = result.destination.droppableId.split('-')?.[0] as AllTier
    const studentId = parseInt(result.draggableId)

    onStudentRanked(studentId, tier)
  }

  return (
    <>
      {/*Header Row*/}
      <div className='flex items-center space-x-4 rounded-md bg-gray-300 p-4 dark:bg-gray-800'>
        <div className='flex-grow text-lg font-bold'>Striker</div>
        <div className='w-16'></div>
        <div className='flex-grow text-right text-lg font-bold'>Support</div>
      </div>

      {/* Repeated Rows for SS, S, A, B, C, D, and Unranked (non-droppable) */}
      <DragDropContext onDragEnd={handleDragEnd}>
        {AllTiers.map((tier) => (
          <div
            key={tier}
            className='grid grid-cols-[1fr_auto_1fr] items-start gap-4 rounded-md bg-gray-300 p-4 dark:bg-gray-800'
          >
            {/* Left Column */}
            <TierGroup
              students={rankings[tier]}
              tier={tier}
              squadType={SquadType.Main}
              rankingType={rankingType}
              className='justify-start'
            />

            {/* Center Column - Ranking */}
            <div className='w-16 text-center text-xl font-bold text-gray-800 dark:text-gray-200'>
              <label className='box-content flex h-32 items-center justify-center text-xl'>
                {tierNames[tier]}
              </label>
            </div>

            {/* Right Column */}
            <TierGroup
              students={rankings[tier]}
              tier={tier}
              squadType={SquadType.Support}
              rankingType={rankingType}
              className='justify-end'
            />
          </div>
        ))}
      </DragDropContext>
    </>
  )
}
