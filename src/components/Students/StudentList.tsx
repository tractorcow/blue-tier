// A list of students with a given filter
import React from 'react'
import { SquadType, Student } from '@/lib/shaledb/types'
import { AllTier } from '@/lib/ranking/types'

type StudentsListProps = {
  students: Student[]
  children: (students: Student, index: number) => React.JSX.Element
  tier?: AllTier
  squadType?: SquadType
}

const StudentsList = ({
  students,
  children,
  tier,
  squadType,
}: StudentsListProps) => {
  // Nothing
  if (!tier || !squadType) {
    return <></>
  }
  return (
    <>
      {students
        .filter((student) => student.SquadType === squadType)
        .map((student, index) => children(student, index))}
    </>
  )
}

export default StudentsList
