import { Ranking } from '@/lib/ranking/types'
import { Session } from 'next-auth'

export const fetchRankings = async (
  session?: Session | null
): Promise<Ranking[]> => {
  if (!session) {
    throw new Error('Session not found')
  }
  const response = await fetch(`/api/rankings/${session.user.id}`)
  if (!response.ok) {
    throw new Error(`Failed to load rankings: ${response.statusText}`)
  }

  return (await response.json()) as Ranking[]
}

export const saveRankings = async (
  rankings: Ranking[],
  session?: Session | null
): Promise<void> => {
  if (!session) {
    throw new Error('Session not found')
  }
  const response = await fetch(`/api/rankings/${session.user.id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(rankings),
  })

  if (!response.ok) {
    throw new Error(`Failed to save rankings: ${response.statusText}`)
  }
}
