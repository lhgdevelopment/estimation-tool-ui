import { Dispatch, SetStateAction } from 'react'

export type TProjectSOWTeamReviewFormComponentProps = {
  projectSOWFormData: any
  setOverviewText: Dispatch<SetStateAction<string>>
  overviewText: string
  errorMessage: any
}

export type TProjectSOWTeamReviewFormViewProps = {
  projectSOWFormData: any
  setOverviewText: Dispatch<SetStateAction<string>>
  overviewText: string
  errorMessage: any
}
