import React from 'react'
import { BulletType, Student } from '@/lib/shaledb/types'
import Image from 'next/image'
import { Optional } from '@/lib/types'
import { imageUrl, roleIcon, studentIcon } from '@/lib/shaledb'

export interface StudentCardProps {
  student: Student
  bulletType: Optional<BulletType>
}

const StudentCard = ({ student, bulletType }: StudentCardProps) => {
  // @todo - compare boss bullet type to this student's armor type
  console.log(bulletType)
  const iconImage = studentIcon(student)

  // Icon for the student's role
  const roleIcon = roleIcon(student.TacticRole)

  return (
    <div
      key={student.Id}
      className='flex h-28 w-24 flex-col items-center rounded bg-gray-300 p-2 dark:bg-gray-600'
    >
      <Image
        src={iconImage}
        alt={student.Name}
        width={64}
        height={64}
        className='rounded'
      />
      <span className='mt-2 text-center text-sm text-gray-800 dark:text-gray-200'>
        {student.Name}
      </span>
    </div>
  )
}

export default StudentCard
