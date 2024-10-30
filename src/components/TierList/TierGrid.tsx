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
            className='grid grid-cols-[1fr_1fr] items-start gap-x-2 gap-y-4 rounded-md bg-gray-300 p-4 md:grid-cols-[1fr_auto_1fr] md:grid-rows-1 md:gap-x-4 dark:bg-gray-800'
          >
            {/* Center Column - Ranking */}
            <div className='order-1 col-span-2 w-full text-center text-xl font-bold text-gray-800 md:order-2 md:col-span-1 md:w-16 dark:text-gray-200'>
              <label className='box-content flex items-center justify-center text-xl md:h-32'>
                {tierNames[tier]}
              </label>
            </div>

            {/* Left Column */}
            <TierGroup
              students={rankings[tier]}
              tier={tier}
              squadType={SquadType.Main}
              rankingType={rankingType}
              className='order-2 w-full justify-start md:order-1 md:w-auto'
            />

            {/* Right Column */}
            <TierGroup
              students={rankings[tier]}
              tier={tier}
              squadType={SquadType.Support}
              rankingType={rankingType}
              className='order-3 w-full justify-end md:w-auto'
            />
          </div>
        ))}
      </DragDropContext>
    </>
  )
}
