import { RankingType } from '@/lib/ranking/types'

export type FilterState = {
  raid: number
  difficulty: number
  armor: number
  rankingType: RankingType
}

// Define the initial state
export const initialState: FilterState = {
  raid: 0, // Current raid index (integer)
  difficulty: 0, // Current difficulty level (integer). -1 means "all"
  armor: 0, // Current armor type (integer). -1 means "all"
  rankingType: RankingType.Global, // Current ranking type (enum)
}

// Define action types
export enum FilterActionTypes {
  SET_RAID = 'SET_RAID',
  SET_DIFFICULTY = 'SET_DIFFICULTY',
  SET_ARMOR = 'SET_ARMOR',
  SET_RANKING_TYPE = 'SET_RANKING_TYPE',
}

export type FilterAction = {
  payload: number | RankingType
  type: FilterActionTypes
}

// Reducer function to manage state changes
export const reducer = (
  state: FilterState,
  action: FilterAction
): FilterState => {
  switch (action.type) {
    case FilterActionTypes.SET_RAID:
      return {
        ...state,
        raid: action.payload as number,
        difficulty: 0,
        armor: 0,
      } // Reset difficulty and armor on boss change
    case FilterActionTypes.SET_DIFFICULTY:
      // Reset armor on difficulty change, unless it's -1
      const armor = state.armor === -1 ? -1 : 0
      return { ...state, difficulty: action.payload as number, armor }
    case FilterActionTypes.SET_ARMOR:
      return { ...state, armor: action.payload as number } // Just set the new armor
    case FilterActionTypes.SET_RANKING_TYPE:
      if (action.payload === state.rankingType) {
        return state // Don't update if it's the same
      }
      // If switching to global rankings, hide "All" difficulty and armor
      if (action.payload === RankingType.Global) {
        const difficulty = Math.max(state.difficulty, 0)
        const armor = Math.max(state.armor, 0)
        return {
          ...state,
          difficulty,
          armor,
          rankingType: action.payload as RankingType,
        } // Just set the new ranking type
      }
      return { ...state, rankingType: action.payload as RankingType } // Just set the new ranking type
    default:
      return state
  }
}
