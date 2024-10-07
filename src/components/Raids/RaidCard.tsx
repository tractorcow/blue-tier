import React from 'react'
import type { RaidBase } from '@/lib/shaledb/types'
import Image from 'next/image'

type RaidCardProps = {
  raid: RaidBase
}

const RaidCard = ({ raid }: RaidCardProps) => {
  const iconImage = `https://cdn.jsdelivr.net/gh/SchaleDB/SchaleDB@main/images/raid/Boss_Portrait_${raid.PathName}_Lobby.png`
  return (
    <div className='flex w-1/2 items-center rounded border border-gray-300 bg-white p-4 dark:border-gray-600 dark:bg-gray-800'>
      {/* Raid Icon, scaled from 650 x 200 */}
      <div className='mr-4 h-12 w-40 bg-gray-300 dark:bg-gray-600'>
        <Image
          src={iconImage}
          alt={raid.Name}
          width={650}
          height={200}
          className='rounded'
        />
      </div>
      <div>
        <strong className='text-gray-800 dark:text-gray-100'>
          {raid.Name}
        </strong>
      </div>
    </div>
  )
}

export default RaidCard
