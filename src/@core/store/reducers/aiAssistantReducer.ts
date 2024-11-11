interface AiAssistantState {
  messageForInput: any
}

interface Action {
  type: string
  payload: any
}

const initialAiAssistantState: AiAssistantState = {
  messageForInput: null
}

const AiAssistantReducer = (state: AiAssistantState = initialAiAssistantState, action: Action): AiAssistantState => {
  switch (action.type) {
    case 'AI_ASSISTANT_MESSAGE':
      return { ...state, messageForInput: action.payload }
    default:
      return state
  }
}

export default AiAssistantReducer
