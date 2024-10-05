import React from 'react'
import fetchData from '@/lib/shaleDb'
import TierList from '@/components/TierList/TierList'
import { fetchGlobalRankings } from '@/lib/rankings'

export const revalidate = 600 // invalidate every 5 minutes

const Home = async () => {
  const data = await fetchData()
  const rankings = await fetchGlobalRankings()
  return <TierList data={data} rankings={rankings} />
}

export default Home
