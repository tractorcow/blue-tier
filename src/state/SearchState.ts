export enum Efficiency {
  Strong = 'Strong',
  Neutral = 'Neutral',
}

export const bulletEFficiencies = {
  [Efficiency.Strong]: 'Strong',
  [Efficiency.Neutral]: 'Strong/Neutral',
}

export const armorEfficiencies = {
  [Efficiency.Strong]: 'Resist',
  [Efficiency.Neutral]: 'Resist/Neutral',
}

export type SearchState = {
  searchQuery: string
  bulletEfficiency: Efficiency | null
  armorEfficiency: Efficiency | null
}

// Define action types
export enum SearchActionTypes {
  SET_SEARCH_QUERY = 'SET_SEARCH_QUERY',
  SET_BULLET_EFFICIENCY = 'SET_BULLET_EFFICIENCY',
  SET_ARMOR_EFFICIENCY = 'SET_ARMOR_EFFICIENCY',
  RESET_SEARCH_STATE = 'RESET_SEARCH_STATE',
}

// Define action interfaces
interface SetSearchQueryAction {
  type: SearchActionTypes.SET_SEARCH_QUERY
  payload: string
}

interface SetBulletEfficiencyAction {
  type: SearchActionTypes.SET_BULLET_EFFICIENCY
  payload: Efficiency | null
}

interface SetArmorEfficiencyAction {
  type: SearchActionTypes.SET_ARMOR_EFFICIENCY
  payload: Efficiency | null
}

interface ResetSearchStateAction {
  type: SearchActionTypes.RESET_SEARCH_STATE
}

type SearchActions =
  | SetSearchQueryAction
  | SetBulletEfficiencyAction
  | SetArmorEfficiencyAction
  | ResetSearchStateAction

// Define the initial state
export const initialSearchState: SearchState = {
  searchQuery: '',
  bulletEfficiency: null,
  armorEfficiency: null,
}

// Reducer function
export const searchReducer = (
  state: SearchState,
  action: SearchActions
): SearchState => {
  switch (action.type) {
    case SearchActionTypes.SET_SEARCH_QUERY:
      return {
        ...state,
        searchQuery: action.payload,
      }
    case SearchActionTypes.SET_BULLET_EFFICIENCY:
      return {
        ...state,
        bulletEfficiency: action.payload,
      }
    case SearchActionTypes.SET_ARMOR_EFFICIENCY:
      return {
        ...state,
        armorEfficiency: action.payload,
      }
    case SearchActionTypes.RESET_SEARCH_STATE:
      return initialSearchState
    default:
      return state
  }
}
