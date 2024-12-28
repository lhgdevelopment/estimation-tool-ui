interface UserState {
  user: any
}

interface Action {
  type: string
  payload: any
}

const initialUserState: UserState = {
  user: null
}

const userReducer = (state: UserState = initialUserState, action: Action): UserState => {
  switch (action.type) {
    case 'LOGEDIN_USER':
      return { ...state, user: action.payload }
    default:
      return state
  }
}

export default userReducer
