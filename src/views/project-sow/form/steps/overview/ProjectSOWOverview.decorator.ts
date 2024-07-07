import { Dispatch, SetStateAction } from 'react'

export type TProjectSOWOverviewFormComponentProps = {
  projectSOWFormData: any
  setOverviewText: Dispatch<SetStateAction<string>>
  overviewText: string
  errorMessage: any
}

export type TProjectSOWOverviewFormViewProps = {
  projectSOWFormData: any
  setOverviewText: Dispatch<SetStateAction<string>>
  overviewText: string
  errorMessage: any
}
