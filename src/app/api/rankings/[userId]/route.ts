import { NextRequest, NextResponse } from 'next/server'
import { fetchDataForUser } from '@/lib/ranking'

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  const { userId } = params

  if (!userId) {
    return NextResponse.json(
      { error: 'Invalid or missing userId' },
      { status: 400 }
    )
  }

  try {
    const data = await fetchDataForUser(userId)
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Error fetching rankings:', error)
    return NextResponse.json(
      { error: 'An error occurred while fetching rankings' },
      { status: 500 }
    )
  }
}
