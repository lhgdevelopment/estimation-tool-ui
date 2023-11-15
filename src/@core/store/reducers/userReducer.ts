const initialState = {
  user: null
}

const userReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'LOGIN_USER':
      return { ...state, user: action.payload }
    default:
      return state
  }
}

export default userReducer
