import React from 'react'
import type { Student } from '@/lib/shaleDbTypes'
import Image from 'next/image'

export interface StudentCardProps {
  student: Student
}

const StudentCard = ({ student }: StudentCardProps) => {
  const iconImage = `https://cdn.jsdelivr.net/gh/SchaleDB/SchaleDB@main/images/student/icon/${student.Id}.webp`
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
