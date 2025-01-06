import { combineReducers } from 'redux'
import AiAssistantReducer from './aiAssistantReducer'
import settingReducer from './settingReducer'
import themeReducer from './themeReducer'
import userReducer from './userReducer'

export interface RootState {
  user:
    | {
        user: any
      }
    | any
  theme:
    | {
        isDark: boolean
        // Other theme-related properties...
      }
    | any
  settings:
    | {
        isNavbarCollapsed: boolean
      }
    | any
  aiAssistant:
    | {
        messageForInput: any
      }
    | any
  // Other slices of the state...
}

const rootReducer = combineReducers<RootState>({
  user: userReducer,
  theme: themeReducer,
  settings: settingReducer,
  aiAssistant: AiAssistantReducer
})
export default rootReducer
