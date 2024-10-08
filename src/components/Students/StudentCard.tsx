import React from 'react'
import type { Student } from '@/lib/shaleDbTypes'
import Image from 'next/image'

export interface StudentCardProps {
  student: Student
}

const StudentCard = ({ student }: StudentCardProps) => {
  const iconImage = `https://cdn.jsdelivr.net/gh/SchaleDB/SchaleDB@main/images/student/icon/${student.Id}.webp`
  const defenseIcon =
    'https://raw.githubusercontent.com/SchaleDB/SchaleDB/refs/heads/main/images/ui/Type_Defense.png'

  const bulletClasses: { [key: string]: string } = {
    Pierce: 'bg-[#986C04]',
    Explosion: 'bg-[#7C0405]',
    Mystic: 'bg-[#145A86]',
    Sonic: 'bg-[#784294]',
  }

  const armorClasses: { [key: string]: string } = {
    Normal: 'bg-gray-500',
    LightArmor: 'bg-[#7C0405]',
    HeavyArmor: 'bg-[#986C04]',
    Unarmed: 'bg-[#145A86]',
    ElasticArmor: 'bg-[#784294]',
  }

  const bulletTypes = bulletClasses[student.BulletType] || ''
  const armorTypes = armorClasses[student.ArmorType] || ''

  return (
    <div
      key={student.Id}
      className={`flex h-40 w-28 flex-col items-center rounded-lg p-2 shadow-lg ${bulletTypes} cursor-grab`}
    >
      <div className='relative'>
        <div
          className={`w-auto rounded ${armorTypes} absolute left-0 top-0 flex justify-center border-2 border-gray-700 shadow-lg`}
        >
          <Image
            src={defenseIcon}
            alt='asd'
            width={32}
            height={32}
            className='rounded p-1'
          />
          {/* Add bullet type icon if available */}
        </div>

        <Image
          src={iconImage}
          alt={student.Name}
          width={72}
          height={64}
          className='rounded object-fill'
        />
        {/* Optional bullet type icon in the top-left corner */}
      </div>
      <span className='my-2 overflow-hidden text-clip text-center text-base text-gray-200'>
        {student.Name}
      </span>
      {/* Empty div below the name */}
      <div
        className={`w-full rounded ${armorTypes} flex justify-center border-2 border-gray-700 shadow-lg`}
      >
        <Image
          src={defenseIcon}
          alt='asd'
          width={32}
          height={32}
          className='rounded p-1'
        />
      </div>
    </div>
  )
}

export default StudentCard
