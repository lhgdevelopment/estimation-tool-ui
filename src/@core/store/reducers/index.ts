import { combineReducers } from 'redux'
import themeReducer from './themeReducer'
import userReducer from './userReducer'

export interface RootState {
  theme: {
    isDark: boolean

    // Other theme-related properties...
  }

  // Other slices of the state...
}
const rootReducer = combineReducers({
  user: userReducer,
  theme: themeReducer
})

export default rootReducer
