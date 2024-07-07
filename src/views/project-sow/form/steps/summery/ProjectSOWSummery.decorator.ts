import { Dispatch, SetStateAction } from 'react'

export type TProjectSOWSummeryFormComponentProps = {
  projectSOWFormData: any
  setSummaryText: Dispatch<SetStateAction<string>>
  summaryText: string
  errorMessage: any
}

export type TProjectSOWSummeryFormViewProps = {
  projectSOWFormData: any
  setSummaryText: Dispatch<SetStateAction<string>>
  summaryText: string
  errorMessage: any
}
