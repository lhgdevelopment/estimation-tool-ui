import Cookies from 'js-cookie'

// Ensure proper boolean parsing from cookies
const initialSettingState = {
  isNavbarCollapsed: Cookies.get('isNavbarCollapsed') === 'true' || false
}

interface SettingState {
  isNavbarCollapsed: boolean
}

interface Action {
  type: string
  payload: any
}

const settingReducer = (state: SettingState = initialSettingState, action: Action): SettingState => {
  switch (action.type) {
    case 'IS_NAVBAR_COLLAPSED':
      return { ...state, isNavbarCollapsed: action.payload }
    default:
      return state
  }
}

export default settingReducer
