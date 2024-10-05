'use client'

import React, { useEffect, useReducer, useState } from 'react'
import {
  DragDropContext,
  Draggable,
  DraggableStateSnapshot,
  DraggableStyle,
  Droppable,
  DropResult,
} from '@hello-pangea/dnd'
import { SchaleDBData, Student } from '@/lib/shaleDbTypes'
import { AllTiers, SquadTypes, Tier } from '@/lib/tiers'
import StudentList from '@/components/Students/StudentList'
import StudentCard from '@/components/Students/StudentCard'
import { FilterActionTypes, initialState, reducer } from '@/state/FilterState'
import ArmorButton from '@/components/TierList/ArmorButton'
import RaidCard from '@/components/Raids/RaidCard'
import AuthComponent from '@/components/Auth/AuthComponent'
import { Ranking } from '@/lib/rankings'
import { useSession } from 'next-auth/react'

type TierListProps = {
  schaleData: SchaleDBData
  globalRankings: Ranking[]
}

enum RankingType {
  Global = 'Global',
  User = 'User',
}

const getStyle = (
  style: DraggableStyle | undefined,
  snapshot: DraggableStateSnapshot
) => {
  if (!snapshot.isDragging) {
    return {}
  }
  if (!snapshot.isDropAnimating) {
    return style
  }

  return {
    ...style,
    // cannot be 0, but make it super tiny
    transitionDuration: `0.001s`,
  }
}

export default function TierList({
  schaleData,
  globalRankings,
}: TierListProps) {
  const { raids, students } = schaleData
  const { data: session } = useSession()

  // Use useReducer for state management
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    raid: raids[0]?.Id,
  })

  // Get details of the current raid, armour, difficulty
  const selectedRaid = raids.find((raid) => raid.Id === state.raid)
  const selectedArmor = selectedRaid?.OptionTypes[state.armor]
  const selectedDifficulty = selectedRaid?.OptionDifficulties[state.difficulty]

  // Toggle between Global and User Rankings
  const [rankingType, setRankingType] = useState<RankingType>(
    RankingType.Global
  )

  // Local storage for user rankings
  const [userRankings, setUserRankings] = useState<Ranking[] | undefined>(
    undefined
  )
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingError, setError] = useState<string | undefined>(undefined)
  const resolveError = (err: unknown) => {
    console.error(err)
    if (err instanceof Error) {
      setError(err.message || 'An unexpected error occurred')
    } else {
      setError('An unexpected error occurred')
    }
  }

  useEffect(() => {
    const fetchUserRankings = async () => {
      if (
        rankingType === RankingType.User &&
        session &&
        !loadingError &&
        userRankings === undefined
      ) {
        try {
          setLoading(true)
          setError(undefined) // Reset error state

          // Fetch details from /api/rankings/[userId]
          const response = await fetch(`/api/rankings/${session.user.id}`)
          if (!response.ok) {
            resolveError(`Failed to load rankings: ${response.statusText}`)
            return
          }

          const data: Ranking[] = await response.json()
          setUserRankings(data)
        } catch (err: unknown) {
          resolveError(err)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchUserRankings()
  }, [rankingType, session, loadingError, userRankings])

  // Selecting another boss
  const changeBoss = (payload: number) => {
    dispatch({ type: FilterActionTypes.SET_RAID, payload: payload })
  }

  // When the user changes difficulty
  const changeDifficulty = (difficultyLevel: number) => {
    dispatch({
      type: FilterActionTypes.SET_DIFFICULTY,
      payload: difficultyLevel,
    })
  }

  // Change defence type
  const changeArmour = (armourIndex: number) => {
    dispatch({ type: FilterActionTypes.SET_ARMOR, payload: armourIndex })
  }

  const updateRanking = (newRanking: Ranking) => {
    setUserRankings((prevRankings) => {
      if (!prevRankings) {
        // If the state is initially undefined, create a new array with the new ranking
        return [newRanking]
      }

      // Check if an existing ranking has the same unique fields (other than tier)
      const existingIndex = prevRankings.findIndex(
        (r) =>
          r.raidId === newRanking.raidId &&
          r.armorType === newRanking.armorType &&
          r.difficulty === newRanking.difficulty &&
          r.studentId === newRanking.studentId
      )

      if (existingIndex !== -1) {
        // Replace the existing ranking with the new one
        const updatedRankings = [...prevRankings]
        updatedRankings[existingIndex] = newRanking
        return updatedRankings
      } else {
        // Add new ranking to the array
        return [...prevRankings, newRanking]
      }
    })
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return
    }

    // Get the tier from the droppableId, e.g. "SS-Main" -> "SS"
    const tier = result.destination.droppableId.split('-')?.[0] as Tier
    const studentId = parseInt(result.draggableId)

    // Validate we have all the details for this ranking
    if (
      !tier ||
      !selectedRaid ||
      !selectedArmor ||
      !selectedDifficulty ||
      !studentId
    ) {
      resolveError('Please select a raid, armour, and difficulty first')
      return
    }

    // Generate a new ranking
    updateRanking({
      raidId: selectedRaid.Id,
      armorType: selectedArmor,
      difficulty: selectedDifficulty,
      studentId: studentId,
      tier: tier,
    })
  }

  // Get rankings for the current state
  const sourceRankings =
    rankingType === RankingType.Global ? globalRankings : userRankings || []
  const rankings = sourceRankings.filter(
    (ranking) =>
      ranking.raidId === selectedRaid?.Id &&
      ranking.armorType === selectedArmor &&
      ranking.difficulty === selectedDifficulty
  )

  return (
    <div className='container mx-auto px-4 py-6 dark:bg-gray-900'>
      <AuthComponent />
      {/* Header Section */}
      <div className='mb-8 border-b-2 border-gray-300 pb-4 dark:border-gray-700'>
        {/* Boss Selector and Info Box */}
        <div className='mb-4 flex justify-between'>
          <select
            value={state.raid}
            onChange={(e) => changeBoss(parseInt(e.target.value))}
            className='rounded border border-gray-300 px-4 py-2 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200'
          >
            <option value={0}>Select Raid</option>
            {raids.map((raid) => (
              <option key={raid.Id} value={raid.Id}>
                {raid.Name}
              </option>
            ))}
          </select>
          {selectedRaid && <RaidCard raid={selectedRaid} />}
        </div>

        {/* Difficulty Selector */}
        {selectedRaid && (
          <div className='mb-4 flex space-x-4'>
            {selectedRaid.OptionDifficulties.map((difficulty, index) => {
              const selectedClass =
                state.difficulty === index
                  ? 'bg-gray-400 hover:bg-gray-300'
                  : 'bg-gray-600 hover:bg-gray-500'
              return (
                <button
                  key={difficulty}
                  onClick={() => changeDifficulty(index)}
                  className={`rounded px-4 py-2 font-semibold text-gray-800 ${selectedClass}`}
                >
                  {difficulty}
                </button>
              )
            })}
          </div>
        )}

        {/* Color Selector */}
        {selectedRaid && (
          <div className='mb-4 flex space-x-4'>
            {selectedRaid.OptionTypes.map((armor, index) => (
              <ArmorButton
                key={armor}
                armor={armor}
                selected={state.armor === index}
                onClick={() => changeArmour(index)}
              />
            ))}
          </div>
        )}

        {/* Filter Box */}
        <input
          type='text'
          className='w-1/2 rounded border border-gray-300 bg-white px-4 py-2 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200'
          placeholder='Filter by Student Name'
        />
      </div>

      {/* Main Area */}
      <div className='flex flex-col space-y-4'>
        {/* Global Rankings Toggle */}
        <div className='text-right'>
          <label className='mr-4 text-gray-800 dark:text-gray-300'>
            <input
              type='radio'
              name='view'
              checked={rankingType === RankingType.Global}
              onChange={() => setRankingType(RankingType.Global)}
              className='mr-2'
            />{' '}
            Global Rankings
          </label>
          <label className='text-gray-800 dark:text-gray-300'>
            <input
              type='radio'
              name='view'
              className='mr-2'
              checked={rankingType == RankingType.User}
              onChange={() => setRankingType(RankingType.User)}
              disabled={!session}
            />{' '}
            {session ? 'My Rankings' : 'Login to Rank'}
          </label>
        </div>

        {loading && <div>Loading your rankings...</div>}

        {/* Tier Rows */}
        <div className='rounded-lg bg-white p-4 shadow-md dark:bg-gray-800'>
          <div className='grid grid-cols-[150px_1fr_1fr] gap-4 p-4'>
            {/*Header Row*/}
            <div />
            {SquadTypes.map((category) => (
              <div
                key={category.title}
                className='text-center text-lg font-bold'
              >
                {category.title}
              </div>
            ))}

            {/* Repeated Rows for SS, S, A, B, C, D, and Unranked */}
            <DragDropContext onDragEnd={handleDragEnd}>
              {AllTiers.map((tier) => (
                <React.Fragment key={tier}>
                  <div className='text-center font-semibold'>{tier}</div>
                  {SquadTypes.map((category) => (
                    <Droppable
                      key={category.squadType}
                      droppableId={`${tier}-${category.squadType}`}
                    >
                      {(provided) => (
                        <div
                          className='flex flex-wrap content-start items-start justify-start gap-2'
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          <StudentList
                            students={students}
                            rankings={rankings}
                            tier={tier}
                            squadType={category.squadType}
                          >
                            {(student: Student, index: number) => (
                              <Draggable
                                key={student.Id}
                                draggableId={student.Id.toString()}
                                index={index}
                                isDragDisabled={
                                  rankingType === RankingType.Global
                                }
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={getStyle(
                                      provided.draggableProps.style,
                                      snapshot
                                    )}
                                  >
                                    <StudentCard student={student} />
                                  </div>
                                )}
                              </Draggable>
                            )}
                          </StudentList>
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  ))}
                </React.Fragment>
              ))}
            </DragDropContext>
          </div>
        </div>
      </div>
    </div>
  )
}
