import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import authOptions from '@/lib/authoptions'
import { AllDifficulties } from '@/lib/ranking/lists'
import importCSV from '@/lib/import'

export async function POST(
  request: NextRequest,
  { params }: { params: { difficulty: string; userId: string } }
) {
  const { userId, difficulty } = params
  if (!userId) {
    return NextResponse.json(
      { error: 'Invalid or missing userId' },
      { status: 400 }
    )
  }

  // Get the user's session
  const session = await getServerSession(authOptions)
  //
  // // Check if session exists
  // if (!session || !session.user) {
  //   return NextResponse.json(
  //     { error: 'User is not authenticated' },
  //     { status: 401 }
  //   )
  // }
  //
  // // Compare the provided `userId` with the session user ID
  // if (session.user.id !== userId) {
  //   return NextResponse.json(
  //     { error: 'User ID does not match the logged-in user' },
  //     { status: 403 }
  //   )
  // }

  const body = await request.text()
  if (!body) {
    return NextResponse.json(
      { error: 'Invalid or missing data' },
      { status: 400 }
    )
  }

  // check difficulty
  const difficultyValue = AllDifficulties.find((next) => next == difficulty)
  if (!difficultyValue) {
    return NextResponse.json({ error: 'Invalid difficulty' }, { status: 400 })
  }
  try {
    const imported = await importCSV(body, userId, difficultyValue)
    return NextResponse.json(
      { body: `Success: Imported ${imported} ratings` },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ error: 'Unknown error' }, { status: 500 })
  }
}
