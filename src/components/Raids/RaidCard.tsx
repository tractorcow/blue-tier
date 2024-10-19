import React from 'react'
import { RaidBase } from '@/lib/shaledb/types'
import { AllArmorType, AllDifficulty, AllType } from '@/lib/ranking/types'
import { determineBulletType } from '@/lib/raids'
import { Optional } from '@/lib/types'
import { attackIcon, defenseIcon } from '@/lib/shaledb'
import Image from 'next/image'
import { armorClasses, bulletClasses } from '@/components/colors'
import { armorNames, bulletNames } from '@/lib/ranking/lists'

type RaidCardProps = {
  raids: RaidBase[]
  raid: Optional<RaidBase>
  difficulty: Optional<AllDifficulty>
  armor: Optional<AllArmorType>
  changeRaid: (raidId: number) => void
}

const RaidCard = ({
  raids,
  raid,
  difficulty,
  armor,
  changeRaid,
}: RaidCardProps) => {
  // Attack and defense icons
  const bulletType = determineBulletType(raid, difficulty)
  const bulletIcon = attackIcon()
  const armorIcon = defenseIcon()
  const bulletBg = bulletType ? bulletClasses[bulletType] : null
  const bulletName = bulletType ? `${bulletNames[bulletType]} Attack` : null
  const armorBg = armor && armor !== AllType.All ? armorClasses[armor] : null
  const armorName = armor ? `${armorNames[armor]} Armor` : null

  // Raid icon
  const iconImage = raid
    ? `https://cdn.jsdelivr.net/gh/SchaleDB/SchaleDB@main/images/raid/Boss_Portrait_${raid.PathName}_Lobby.png`
    : null
  return (
    <div
      className='relative flex h-full flex-col justify-between overflow-hidden rounded-lg bg-gray-300 bg-right p-6 py-8 dark:bg-gray-800'
      style={{
        backgroundImage: iconImage ? `url(${iconImage})` : undefined,
        backgroundPosition: 'right',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <select
        id='raid-select'
        onChange={(e) => changeRaid(parseInt(e.target.value))}
        value={raid?.Id || 0}
        className='w-3/4 rounded-xl border-[1px] border-gray-400 bg-gray-600 bg-opacity-20 p-2 text-2xl font-bold text-gray-700 dark:text-gray-200'
      >
        <option value={0}>Select Raid</option>
        {raids.map((raid) => (
          <option key={raid.Id} value={raid.Id}>
            {raid.Name}
          </option>
        ))}
      </select>
      {bulletBg && armorBg && bulletName && armorName && (
        <div className='absolute right-1 top-1 flex flex-row space-x-2'>
          <div className={`w-5 rounded-full p-1 ${bulletBg}`}>
            <Image
              src={bulletIcon}
              alt={bulletName}
              width={32}
              height={32}
              title={bulletName}
            />
          </div>
          <div className={`w-5 rounded-full p-1 ${armorBg}`}>
            <Image
              src={armorIcon}
              alt={armorName}
              width={32}
              height={32}
              title={armorName}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default RaidCard
