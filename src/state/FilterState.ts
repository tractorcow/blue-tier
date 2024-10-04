export type FilterState = {
  raid: number
  difficulty: number
  armor: number
}

// Define the initial state
export const initialState: FilterState = {
  raid: 0, // Current raid index (integer)
  difficulty: 0, // Current difficulty level (integer)
  armor: 0, // Current armor type (integer)
}

// Define action types
export enum FilterActionTypes {
  SET_RAID = 'SET_RAID',
  SET_DIFFICULTY = 'SET_DIFFICULTY',
  SET_ARMOR = 'SET_ARMOR',
}

export type FilterAction = {
  payload: number
  type: FilterActionTypes
}

// Reducer function to manage state changes
export const reducer = (state: FilterState, action: FilterAction) => {
  switch (action.type) {
    case FilterActionTypes.SET_RAID:
      return { raid: action.payload, difficulty: 0, armor: 0 } // Reset difficulty and armor on boss change
    case FilterActionTypes.SET_DIFFICULTY:
      return { ...state, difficulty: action.payload, armor: 0 } // Reset armor on difficulty change
    case FilterActionTypes.SET_ARMOR:
      return { ...state, armor: action.payload } // Just set the new armor
    default:
      return state
  }
}
