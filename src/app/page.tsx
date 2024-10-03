import React from 'react'
import fetchData from '@/lib/shaleDb'
import TierList from '@/components/TierList/TierList'

export const revalidate = 600 // invalidate every 5 minutes

const Home = async () => {
  const data = await fetchData()
  return <TierList data={data} />
}

export default Home
