const initialThemeState = {
  isDark: null
}

const themeReducer = (state = initialThemeState, action: any) => {
  switch (action.type) {
    case 'IS_DARK_THEME':
      return { ...state, isDark: action.payload }
    default:
      return state
  }
}

export default themeReducer
