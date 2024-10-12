import React from 'react'
import { RaidBase } from '@/lib/shaledb/types'
import { AllArmorType, AllDifficulty, AllType } from '@/lib/ranking/types'
import { determineBulletType } from '@/lib/raids'
import { Optional } from '@/lib/types'
import { attackIcon, defenseIcon } from '@/lib/shaledb'
import Image from 'next/image'
import { armorClasses, bulletClasses } from '@/components/colors'

type RaidCardProps = {
  raid: RaidBase
  difficulty: Optional<AllDifficulty>
  armor: Optional<AllArmorType>
}

const RaidCard = ({ raid, difficulty, armor }: RaidCardProps) => {
  const bulletType = determineBulletType(raid, difficulty)
  const bulletIcon = attackIcon()
  const armorIcon = defenseIcon()
  const bulletBg = bulletType ? bulletClasses[bulletType] : null
  const armorBg = armor && armor !== AllType.All ? armorClasses[armor] : null
  const iconImage = `https://cdn.jsdelivr.net/gh/SchaleDB/SchaleDB@main/images/raid/Boss_Portrait_${raid.PathName}_Lobby.png`
  return (
    <div
      className='relative flex flex-col justify-between overflow-hidden rounded-lg bg-right p-6'
      style={{
        backgroundImage: `url(${iconImage})`,
        backgroundPosition: 'right',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <h2 className='mb-2 text-2xl font-bold'>{raid.Name}</h2>
      {bulletBg && armorBg && (
        <div className='absolute right-1 top-1 flex flex-row space-x-2'>
          <div className={`w-5 rounded-full p-1 ${bulletBg}`}>
            <Image
              src={bulletIcon}
              alt={`${bulletType}`}
              width={32}
              height={32}
            />
          </div>
          <div className={`w-5 rounded-full p-1 ${armorBg}`}>
            <Image src={armorIcon} alt={`${armor}`} width={32} height={32} />
          </div>
        </div>
      )}
    </div>
  )
}

export default RaidCard
