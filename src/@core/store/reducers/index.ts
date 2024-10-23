import { combineReducers } from 'redux'
import settingReducer from './settingReducer'
import themeReducer from './themeReducer'
import userReducer from './userReducer'

export interface RootState {
  user: {
    user: any
  }
  theme: {
    isDark: boolean
    // Other theme-related properties...
  }
  settings: {
    isNavbarCollapsed: boolean
  }
  // Other slices of the state...
}

const rootReducer = combineReducers<RootState>({
  user: userReducer,
  theme: themeReducer,
  settings: settingReducer // Fixed key to match state structure
})

export default rootReducer
