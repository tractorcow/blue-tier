import React from 'react'
import { useSession } from 'next-auth/react'
import ModeToggle from '@/components/Header/ModeToggle'
import { RankingType } from '@/lib/ranking/types'
import AuthComponent from '@/components/Auth/AuthComponent'
import HelpButton from '@/components/Help/HelpButton'

type HeaderProps = {
  subtitle: string
  rankingType: RankingType
  setRankingType: (rankingType: RankingType) => void
}

export default function Header({
  subtitle,
  rankingType,
  setRankingType,
}: HeaderProps) {
  const { data: session } = useSession()
  return (
    <div className='flex flex-row justify-between py-4'>
      <div>
        <h1 className='text-xl font-bold'>Blue Archive Tier List</h1>
        <h2 className='text-lg font-semibold'>{subtitle}</h2>
      </div>
      <div className='ml-auto flex items-center space-x-4'>
        {session && (
          <ModeToggle
            onChange={(e) => {
              setRankingType(
                e.target.checked ? RankingType.User : RankingType.Global
              )
            }}
            selected={rankingType == RankingType.User}
          >
            Edit My Rankings
          </ModeToggle>
        )}
        <HelpButton />
        <AuthComponent />
      </div>
    </div>
  )
}
