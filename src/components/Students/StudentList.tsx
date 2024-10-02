// A list of students with a given filter
import React from 'react'
import { SquadType, Student } from '@/lib/shaleDbTypes'
import { Tier } from '@/lib/tiers'

type StudentsListProps = {
  students: Student[]
  children: (students: Student) => React.JSX.Element
  tier?: Tier
  squadType?: SquadType
}

/**
 * Match a student with a given filter
 * @param student
 * @param tier
 * @param squadType
 */
const match = (
  student: Student,
  tier?: Tier,
  squadType?: SquadType
): boolean => {
  // For now all are unranked
  if (tier && tier != Tier.Unranked) {
    return false
  }
  if (squadType && student.SquadType !== squadType) {
    return false
  }
  return true
}

const StudentsList = ({
  students,
  children,
  tier,
  squadType,
}: StudentsListProps) => {
  return (
    <>
      {students
        .filter((student) => match(student, tier, squadType))
        .map((student) => children(student))}
    </>
  )
}

export default StudentsList
