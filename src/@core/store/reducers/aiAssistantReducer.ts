// Define specific action types as an enum
enum AiAssistantActionTypes {
  SET_MESSAGE = 'AI_ASSISTANT_MESSAGE'
}

// Define the structure of the AiAssistant state
interface AiAssistantState {
  messageForInput: string | null // Specify the type of the message, if possible
}

// Define the structure of actions
interface AiAssistantAction {
  type: AiAssistantActionTypes
  payload?: string // Optional, depending on the action
}

// Define the initial state
const initialAiAssistantState: AiAssistantState = {
  messageForInput: null
}

// Reducer function with stricter typing
const AiAssistantReducer = (
  state: AiAssistantState = initialAiAssistantState,
  action: AiAssistantAction
): AiAssistantState => {
  switch (action.type) {
    case AiAssistantActionTypes.SET_MESSAGE:
      return { ...state, messageForInput: action.payload || null }
    default:
      return state
  }
}

export default AiAssistantReducer
