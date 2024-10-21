interface ThemeState {
  isDark: boolean
}

interface Action {
  type: string
  payload: any
}

const initialThemeState: ThemeState = {
  isDark: false
}

const themeReducer = (state: ThemeState = initialThemeState, action: Action): ThemeState => {
  switch (action.type) {
    case 'IS_DARK_THEME':
      return { ...state, isDark: action.payload }
    default:
      return state
  }
}

export default themeReducer
