import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { fetchDataForUser } from '@/lib/ranking'
import authOptions from '@/lib/authoptions'
import { Ranking } from '@/lib/ranking/types'

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

export async function POST(
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

  // Get the user's session
  const session = await getServerSession(authOptions)

  // Check if session exists
  if (!session || !session.user) {
    return NextResponse.json(
      { error: 'User is not authenticated' },
      { status: 401 }
    )
  }

  // Compare the provided `userId` with the session user ID
  if (session.user.id !== userId) {
    return NextResponse.json(
      { error: 'User ID does not match the logged-in user' },
      { status: 403 }
    )
  }

  const body = (await request.json()) as Ranking[]
  if (!body) {
    return NextResponse.json(
      { error: 'Invalid or missing data' },
      { status: 400 }
    )
  }

  try {
    // @TODO: Save the data to the database
    console.log(body, userId, 'posted body')

    // Save the data to the database
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Error saving rankings:', error)
    return NextResponse.json(
      { error: 'An error occurred while saving rankings' },
      { status: 500 }
    )
  }
}
