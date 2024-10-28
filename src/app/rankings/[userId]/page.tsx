import fetchData from '@/lib/shaledb/index'
import TierList from '@/components/TierList/TierList'
import { fetchDataForUser, getUserName } from '@/lib/ranking/index'

export const revalidate = 3600 // cache for an hour, I'm not made of $/DB hoursle i

type UserRankingProps = {
  params: {
    userId: string
  }
}

const UserRanking = async ({ params }: UserRankingProps) => {
  const { userId } = params
  const data = await fetchData()
  const username = await getUserName(userId)
  if (!username) {
    return <div>User not found</div>
  }
  const rankings = await fetchDataForUser(userId)
  return (
    <TierList
      schaleData={data}
      globalRankings={rankings}
      namedRankings={username}
    />
  )
}

export default UserRanking
