// A list of students with a given filter
import React from 'react'
import { SquadType, Student } from '@/lib/shaleDbTypes'
import { Tier } from '@/lib/tiers'
import { Ranking } from '@/lib/rankings'

type StudentsListProps = {
  students: Student[]
  rankings: Ranking[]
  children: (students: Student, index: number) => React.JSX.Element
  tier?: Tier
  squadType?: SquadType
}

/**
 * Match a student with a given filter
 * @param student
 * @param tier
 * @param squadType
 * @param rankings
 */
const match = (
  student: Student,
  tier: Tier,
  squadType: SquadType,
  rankings: Ranking[]
): boolean => {
  // Exclude students that are not in the squad type
  if (student.SquadType !== squadType) {
    return false
  }

  // Check if the student is ranked in the given tier
  const rankedStudent = rankings.find(
    (ranking) => ranking.studentId === student.Id
  )

  // Return the student if they are ranked or the tier is unranked
  return rankedStudent ? rankedStudent.tier === tier : tier === Tier.Unranked
}

const StudentsList = ({
  students,
  rankings,
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
        .filter((student) => match(student, tier, squadType, rankings))
        .map((student, index) => children(student, index))}
    </>
  )
}

export default StudentsList
