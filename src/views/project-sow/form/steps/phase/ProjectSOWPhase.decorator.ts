import { SelectChangeEvent } from '@mui/material'
import { Dispatch } from 'react'

export type TProjectSOWPhaseFormComponentProps = {
  phaseData: any
  setPhaseData: Dispatch<any>
  problemGoalID: any
  selectedPhaseData: any
  setSelectedPhaseData: Dispatch<any>
  selectedAdditionalServiceData: any
  handleAdditionalServiceSelection: (id: any) => void
  serviceList: any
  serviceId: any
}

export type TProjectSOWPhaseFormViewProps = {
  handlePhaseCheckbox: () => void
  phaseData: any
  selectedPhaseData: any
  handleServicePhaseModalOpen: () => void
  handlePhaseOnEdit: (data: any) => void
  serviceGroupByProjectTypeId: (data: any) => any[]
  selectedAdditionalServiceData: any
  handleAdditionalServiceSelection: (data: any) => void
  serviceList: any
  servicePhaseModalOpen: boolean
  handleServicePhaseModalClose: () => void
  errorMessage: any
  phaseEditId: any
  phaseFormData: any
  handlePhaseInputChange: (event: any) => void
  handlePhaseSaveOnClick: () => void
  handlePhaseSelectChange: (e: SelectChangeEvent<any>) => void
  handleAddNewSow: () => void
  phasePhaseList: any[]
  handlePhaseMultipleInputChange: (event: any, index: number) => void
  handleRemoveSow: (index: number) => void
  handlePhaseOnClear: () => void
}
