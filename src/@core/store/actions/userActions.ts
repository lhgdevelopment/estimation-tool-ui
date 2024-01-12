export const loginUser = (user: any) => ({
  type: 'LOGIN_USER',
  payload: user
})

export const isDarkTheme = (data: boolean) => ({
  type: 'IS_DARK_THEME',
  payload: data
})
