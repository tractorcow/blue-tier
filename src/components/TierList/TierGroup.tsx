import classnames from 'classnames'
import StudentList from '@/components/Students/StudentList'
import { SquadType, Student } from '@/lib/shaledb/types'
import {
  Draggable,
  DraggableStateSnapshot,
  DraggableStyle,
  Droppable,
} from '@hello-pangea/dnd'
import { AllTier, RankingType } from '@/lib/ranking/types'
import StudentCard from '@/components/Students/StudentCard'
import React from 'react'

/**
 * Helper for styling a dragged item
 * @param style
 * @param snapshot
 */
const getStyle = (
  style: DraggableStyle | undefined,
  snapshot: DraggableStateSnapshot
) => {
  if (!snapshot.isDragging) {
    return {}
  }
  if (!snapshot.isDropAnimating) {
    return style
  }

  return {
    ...style,
    // cannot be 0, but make it super tiny
    transitionDuration: `0.001s`,
  }
}

type TierGroupProps = {
  tier: AllTier
  squadType: SquadType
  students: Student[]
  rankingType: RankingType
  className?: string
}

export default function TierGroup({
  tier,
  squadType,
  students,
  rankingType,
  className,
}: TierGroupProps) {
  return (
    <Droppable key={squadType} droppableId={`${tier}-${squadType}`}>
      {(provided, state) => (
        <div
          className={classnames(
            'box-content flex min-h-32 flex-wrap content-start items-start gap-2',
            className,
            state.isDraggingOver ? 'bg-gray-400 dark:bg-gray-700' : ''
          )}
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          <StudentList students={students} tier={tier} squadType={squadType}>
            {(student: Student, index: number) => (
              <Draggable
                key={student.Id}
                draggableId={student.Id.toString()}
                index={index}
                isDragDisabled={rankingType === RankingType.Global}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getStyle(provided.draggableProps.style, snapshot)}
                  >
                    <StudentCard student={student} />
                  </div>
                )}
              </Draggable>
            )}
          </StudentList>
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  )
}
