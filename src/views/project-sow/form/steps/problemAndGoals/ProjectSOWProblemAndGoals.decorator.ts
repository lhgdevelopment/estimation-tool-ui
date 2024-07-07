import { Dispatch, SetStateAction } from 'react'

export type TProjectSOWProblemAndGoalsFormComponentProps = {
  projectSOWFormData: any
  setProblemGoalText: Dispatch<SetStateAction<string>>
  problemGoalText: string
  errorMessage: any
}

export type TProjectSOWProblemAndGoalsFormViewProps = {
  projectSOWFormData: any
  setProblemGoalText: Dispatch<SetStateAction<string>>
  problemGoalText: string
  errorMessage: any
}
