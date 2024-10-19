'use client'

import React, { useEffect, useReducer, useState } from 'react'
import { useSession } from 'next-auth/react'
import {
  DragDropContext,
  Draggable,
  DraggableStateSnapshot,
  DraggableStyle,
  Droppable,
  DropResult,
} from '@hello-pangea/dnd'
import type { SchaleDBData, Student } from '@/lib/shaledb/types'
import { AllTiers, SquadTypes } from '@/lib/ranking/lists'
import StudentList from '@/components/Students/StudentList'
import StudentCard from '@/components/Students/StudentCard'
import { FilterActionTypes, initialState, reducer } from '@/state/FilterState'
import AuthComponent from '@/components/Auth/AuthComponent'
import {
  AllArmorType,
  AllDifficulty,
  AllTier,
  AllType,
  Ranking,
  RankingType,
} from '@/lib/ranking/types'
import {
  calculateRankings,
  filterStudentsByName,
  generateRankings,
} from '@/lib/ranking'
import useAsyncQueue from '@/state/AsyncQueue'
import { fetchRankings, saveRankings } from '@/lib/user'
import TierFilters from '@/components/TierList/TierFilters'
import ModeToggle from '@/components/TierList/ModeToggle'
import LoadingOverlay from '@/components/TierList/Loading'
import classnames from 'classnames'

type TierListProps = {
  schaleData: SchaleDBData
  globalRankings: Ranking[]
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
  const selectedArmor =
    state.armor < 0 ? AllType.All : selectedRaid?.OptionTypes[state.armor]
  const selectedDifficulty =
    state.difficulty < 0
      ? AllType.All
      : selectedRaid?.OptionDifficulties[state.difficulty]
  const rankingType = state.rankingType
  const optionDifficulties = selectedRaid
    ? [
        ...(rankingType === RankingType.User ? [AllType.All] : []),
        ...selectedRaid.OptionDifficulties,
      ]
    : []
  const optionArmors = selectedRaid
    ? [
        ...(rankingType === RankingType.User ? [AllType.All] : []),
        ...selectedRaid.OptionTypes,
      ]
    : []

  // State for name filter
  const [nameFilter, setNameFilter] = useState<string>('')

  // Local storage for user rankings
  const [userRankings, setUserRankings] = useState<Ranking[] | undefined>(
    undefined
  )
  const [loading, setLoading] = useState<boolean>(false)

  // Helper for setting errors
  const [loadingError, setError] = useState<string | undefined>(undefined)
  const resolveError = (err: unknown) => {
    console.error(err)
    if (err instanceof Error) {
      setError(err.message || 'An unexpected error occurred')
    } else {
      setError('An unexpected error occurred')
    }
  }

  // Bootstrap user rankings when the user has logged in, and selects the User ranking type
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
          const data = await fetchRankings(session)
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

  // Change the difficulty level
  const changeDifficulty = (difficultyLevel: AllDifficulty) => {
    const payload =
      difficultyLevel === AllType.All
        ? -1
        : selectedRaid?.OptionDifficulties.indexOf(difficultyLevel) || 0
    dispatch({
      type: FilterActionTypes.SET_DIFFICULTY,
      payload,
    })
  }

  // Change defence type
  const changeArmour = (armourIndex: AllArmorType) => {
    const payload =
      armourIndex === AllType.All
        ? -1
        : selectedRaid?.OptionTypes.indexOf(armourIndex) || 0
    dispatch({ type: FilterActionTypes.SET_ARMOR, payload })
  }

  // Change ranking type
  const setRankingType = (rankingType: RankingType) => {
    dispatch({ type: FilterActionTypes.SET_RANKING_TYPE, payload: rankingType })
  }

  // Setup queue for saving rankings to the database
  // This does a bit of batching and has a debounce timer of 1.2 seconds
  // to prevent lots of requests being sent at once
  const { enqueue } = useAsyncQueue<Ranking>(
    async (rankings) => {
      await saveRankings(rankings, session)
    },
    {
      debounceTime: 1200,
    }
  )

  const updateRankings = (newRankings: Ranking[]) => {
    // Store rankings in DB
    enqueue(newRankings)

    // Update local state
    setUserRankings((prevRankings) => {
      if (!prevRankings) {
        // If the state is initially undefined, create a new array with the new rankings
        return [...newRankings]
      }

      // Create a copy of the current rankings to modify
      const updatedRankings = [...prevRankings]

      // Iterate through each new ranking and either replace or add it to the updatedRankings array
      newRankings.forEach((newRanking) => {
        // Check if an existing ranking has the same unique fields (other than tier)
        const existingIndex = updatedRankings.findIndex(
          (r) =>
            r.raidId === newRanking.raidId &&
            r.armorType === newRanking.armorType &&
            r.difficulty === newRanking.difficulty &&
            r.studentId === newRanking.studentId
        )

        if (existingIndex !== -1) {
          // Replace the existing ranking with the new one
          updatedRankings[existingIndex] = newRanking
        } else {
          // Add the new ranking to the array
          updatedRankings.push(newRanking)
        }
      })

      return updatedRankings
    })
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return
    }

    // Get the tier from the droppableId, e.g. "SS-Main" -> "SS"
    const tier = result.destination.droppableId.split('-')?.[0] as AllTier
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

    // Save all rankings
    const newRankings = generateRankings(
      studentId,
      tier,
      selectedRaid,
      selectedDifficulty,
      selectedArmor
    )
    updateRankings(newRankings)
  }

  // Get rankings for the current state
  const sourceRankings =
    rankingType === RankingType.Global ? globalRankings : userRankings || []

  // Filter students
  const filteredStudents = filterStudentsByName(students, nameFilter)

  const rankings = calculateRankings(
    filteredStudents,
    sourceRankings,
    selectedRaid,
    selectedDifficulty,
    selectedArmor
  )

  return (
    <div className='container mx-auto'>
      {/* Header Section */}
      <div className='flex flex-row justify-between py-4'>
        <h1 className='text-xl font-bold'>Blue Archive Tier List</h1>
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
          <AuthComponent />
        </div>
      </div>

      <div className='space-y-4 px-4 py-6 dark:bg-gray-900'>
        <TierFilters
          raids={raids}
          selectedRaid={selectedRaid}
          changeRaid={changeBoss}
          difficulties={optionDifficulties}
          selectedDifficulty={selectedDifficulty}
          changeDifficulty={changeDifficulty}
          armors={optionArmors}
          selectedArmor={selectedArmor}
          changeArmour={changeArmour}
        />

        {/* Main Area */}
        <div className='flex flex-col space-y-4'>
          {/* Global Rankings Toggle */}
          <div className='text-right'>
            <input
              type='text'
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              placeholder='Filter students by name'
              className='w-full rounded-lg border-0 bg-gray-700 px-4 py-2 text-white placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>

          {loading && <LoadingOverlay />}

          {/* Tier Rows */}
          <div className='rounded-lg bg-white p-4 shadow-md dark:bg-gray-800'>
            <div className='grid grid-cols-[0fr_1fr_1fr] gap-x-4 p-4'>
              {/*Header Row*/}
              <div className='p-2' />
              {SquadTypes.map((category) => (
                <div
                  key={category.title}
                  className='p-2 text-center text-lg font-bold'
                >
                  {category.title}
                </div>
              ))}

              {/* Repeated Rows for SS, S, A, B, C, D, and Unranked (non-droppable) */}
              <DragDropContext onDragEnd={handleDragEnd}>
                {AllTiers.map((tier) => (
                  <React.Fragment key={tier}>
                    <div className='p-2 text-center font-semibold'>
                      <label className='box-content flex h-32 items-center justify-center text-xl'>
                        {tier}
                      </label>
                    </div>
                    {SquadTypes.map((category) => (
                      <Droppable
                        key={category.squadType}
                        droppableId={`${tier}-${category.squadType}`}
                      >
                        {(provided, state) => (
                          <div
                            className={classnames(
                              'box-content flex min-h-32 flex-wrap content-start items-start justify-start gap-2 border-t-[1px] border-gray-500 p-2',
                              state.isDraggingOver ? 'bg-gray-700' : ''
                            )}
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                          >
                            <StudentList
                              students={rankings[tier]}
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
    </div>
  )
}
