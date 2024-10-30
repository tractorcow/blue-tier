'use client'

import React, { useEffect, useReducer, useState } from 'react'
import { useSession } from 'next-auth/react'
import type { SchaleDBData } from '@/lib/shaledb/types'
import {
  FilterActionTypes,
  filterReducer,
  initialFilterState,
} from '@/state/FilterState'
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
  filterStudents,
  generateRankings,
} from '@/lib/ranking'
import useAsyncQueue from '@/state/AsyncQueue'
import { fetchRankings, saveRankings } from '@/lib/user'
import TierFilters from '@/components/Filter/TierFilters'
import LoadingOverlay from '@/components/Loading/Loading'
import {
  Efficiency,
  initialSearchState,
  SearchActionTypes,
  searchReducer,
} from '@/state/SearchState'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import TierSearch from '@/components/Search/TierSearch'
import { Optional } from '@/lib/types'
import TierGrid from '@/components/TierList/TierGrid'

type TierListProps = {
  schaleData: SchaleDBData
  globalRankings: Ranking[]
  namedRankings?: string
}

export default function TierList({
  schaleData,
  globalRankings,
  namedRankings,
}: TierListProps) {
  const { raids, students } = schaleData
  const { data: session } = useSession()

  // Use useReducer for state management
  const [filterState, dispatchFilter] = useReducer(filterReducer, {
    ...initialFilterState,
    raid: raids[0]?.Id,
  })

  const [searchState, dispatchSearch] = useReducer(
    searchReducer,
    initialSearchState
  )

  // Get details of the current raid, armour, difficulty
  const selectedRaid = raids.find((raid) => raid.Id === filterState.raid)
  const selectedArmor =
    filterState.armor < 0
      ? AllType.All
      : selectedRaid?.OptionTypes[filterState.armor]
  const selectedDifficulty =
    filterState.difficulty < 0
      ? AllType.All
      : selectedRaid?.OptionDifficulties[filterState.difficulty]
  const rankingType = filterState.rankingType
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
    dispatchFilter({ type: FilterActionTypes.SET_RAID, payload: payload })
  }

  // Change the difficulty level
  const changeDifficulty = (difficultyLevel: AllDifficulty) => {
    const payload =
      difficultyLevel === AllType.All
        ? -1
        : selectedRaid?.OptionDifficulties.indexOf(difficultyLevel) || 0
    dispatchFilter({
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
    dispatchFilter({ type: FilterActionTypes.SET_ARMOR, payload })
  }

  // Change ranking type
  const setRankingType = (rankingType: RankingType) => {
    dispatchFilter({
      type: FilterActionTypes.SET_RANKING_TYPE,
      payload: rankingType,
    })
  }

  const setNameFilter = (name: string) => {
    dispatchSearch({ type: SearchActionTypes.SET_SEARCH_QUERY, payload: name })
  }

  const setBulletEfficiency = (efficiency: Optional<Efficiency>) => {
    dispatchSearch({
      type: SearchActionTypes.SET_BULLET_EFFICIENCY,
      payload: efficiency,
    })
  }

  const setArmorEfficiency = (efficiency: Optional<Efficiency>) => {
    dispatchSearch({
      type: SearchActionTypes.SET_ARMOR_EFFICIENCY,
      payload: efficiency,
    })
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

  const handleStudentRanked = (studentId: number, tier: AllTier) => {
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

  // Filter students by search state
  const filteredStudents = filterStudents(
    students,
    searchState,
    selectedRaid,
    selectedDifficulty,
    selectedArmor
  )

  const rankings = calculateRankings(
    filteredStudents,
    sourceRankings,
    selectedRaid,
    selectedDifficulty,
    selectedArmor
  )

  const subtitle =
    (rankingType === RankingType.User && 'Editing your rankings') ||
    (namedRankings && `Rankings shared by ${namedRankings}`) ||
    'Global Rankings'

  return (
    <div className='container mx-auto space-y-4 p-2'>
      <Header
        rankingType={rankingType}
        setRankingType={setRankingType}
        subtitle={subtitle}
      />

      <div className='space-y-4 rounded-md bg-gray-400 p-4 dark:bg-gray-900'>
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

        <TierSearch
          searchState={searchState}
          setNameFilter={setNameFilter}
          setArmorEfficiency={setArmorEfficiency}
          setBulletEfficiency={setBulletEfficiency}
        />
      </div>

      <TierGrid
        rankings={rankings}
        rankingType={rankingType}
        onStudentRanked={handleStudentRanked}
      />
      <Footer />
      {loading && <LoadingOverlay />}
    </div>
  )
}
