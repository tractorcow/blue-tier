import React from 'react'
import fetchData from '@/lib/shaledb/index'
import TierList from '@/components/TierList/TierList'
import { fetchGlobalRankings } from '@/lib/ranking/index'

export const revalidate = 3600 // cache for an hour, I'm not made of $/DB hoursle i

const Home = async () => {
  const data = await fetchData()
  const rankings = await fetchGlobalRankings()
  return <TierList schaleData={data} globalRankings={rankings} />
}

export default Home
