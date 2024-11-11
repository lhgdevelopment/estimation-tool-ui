export const LOGIN_USER = 'LOGIN_USER'
export const IS_DARK_THEME = 'IS_DARK_THEME'
export const IS_NAVBAR_COLLAPSED = 'IS_NAVBAR_COLLAPSED'
export const ALL_SETTINGS = 'ALL_SETTINGS'
export const AI_ASSISTANT_MESSAGE = 'AI_ASSISTANT_MESSAGE'

export const loginUser = (user: any) => ({
  type: LOGIN_USER,
  payload: user
})

export const isDarkTheme = (data: boolean) => ({
  type: IS_DARK_THEME,
  payload: data
})

export const isNavbarCollapsed = (data: boolean) => ({
  type: IS_NAVBAR_COLLAPSED,
  payload: data
})

export const setAiAssistantMessage = (data: string) => ({
  type: AI_ASSISTANT_MESSAGE,
  payload: data
})
