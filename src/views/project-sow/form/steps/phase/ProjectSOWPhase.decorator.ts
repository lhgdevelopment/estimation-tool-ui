import { SelectChangeEvent } from '@mui/material'
import { Dispatch, MutableRefObject } from 'react'

export type TProjectSOWPhaseFormComponentProps = {
  phaseData: any
  setPhaseData: Dispatch<any>
  problemGoalID: any
}

export type TProjectSOWPhaseFormViewProps = {
  handlePhaseCheckbox: (event: any, id: number) => void
  phaseData: any
  handleServicePhaseModalOpen: () => void
  handlePhaseOnEdit: (data: any) => void
  servicePhaseModalOpen: boolean
  handleServicePhaseModalClose: () => void
  errorMessage: any
  phaseEditId: any
  phaseFormData: any
  handlePhaseInputChange: (event: any) => void
  handlePhaseSaveOnClick: () => void
  handlePhaseSelectChange: (e: SelectChangeEvent<any>) => void
  handleAddNewSow: () => void
  handlePhaseMultipleInputChange: (event: any, index: number) => void
  handleRemoveSow: (index: number) => void
  handlePhaseSlOnChange: (sl: number, id: number) => void
  handlePhaseOnClear: () => void
  slInputRefs: MutableRefObject<{ [key: number]: HTMLInputElement | null }>
}
