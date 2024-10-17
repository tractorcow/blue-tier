import React from 'react'
import type { Student } from '@/lib/shaledb/types'
import Image from 'next/image'
import classNames from 'classnames'
import {
  armorClasses,
  bulletClasses,
  cardArmorClasses,
  cardBulletClasses,
} from '@/components/colors'
import { defenseIcon, roleIcon } from '@/lib/shaledb'

export interface StudentCardProps {
  student: Student
}

const StudentCard = ({ student }: StudentCardProps) => {
  const iconImage = `https://cdn.jsdelivr.net/gh/SchaleDB/SchaleDB@main/images/student/icon/${student.Id}.webp`
  // split student.Name where we see the first opening round bracket
  // and get the first element
  const braceSplit = student.Name.indexOf('(')
  const [name, suffix] =
    braceSplit === -1
      ? [student.Name, '']
      : [
          student.Name.slice(0, braceSplit).trim(),
          student.Name.slice(braceSplit).trim(),
        ]

  const cardClasses = classNames(
    'h-20 w-20 overflow-hidden rounded-lg border-2 relative',
    cardBulletClasses[student.BulletType],
    cardArmorClasses[student.ArmorType]
  )

  const bulletBg = bulletClasses[student.BulletType]
  const armorBg = armorClasses[student.ArmorType]
  const roleImage = roleIcon(student.TacticRole)
  const armorIcon = defenseIcon()

  return (
    <div
      key={student.Id}
      className='flex h-32 w-20 flex-col items-center overflow-hidden rounded-lg bg-gray-300 dark:bg-gray-600'
    >
      <div className={cardClasses}>
        <Image
          src={iconImage}
          alt={student.Name}
          width={128}
          height={128}
          className='h-20 w-20'
        />
        <div
          className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full p-0.5 ${bulletBg}`}
        >
          <Image
            src={roleImage}
            alt={student.TacticRole}
            width={32}
            height={32}
          />
        </div>
        <div
          className={`absolute bottom-0.5 right-0.5 h-4 w-4 rounded-full p-0.5 ${armorBg}`}
        >
          <Image
            src={armorIcon}
            alt={student.ArmorType}
            width={32}
            height={32}
          />
        </div>
      </div>
      <div className='flex h-12 flex-col justify-center text-center text-gray-800 dark:text-gray-200'>
        {suffix ? (
          <>
            <div className='text-sm font-bold'>{name}</div>
            <div className='text-xs'>{suffix}</div>
          </>
        ) : (
          <div className='text-base font-bold'>{name}</div>
        )}
      </div>
    </div>
  )
}

export default StudentCard
