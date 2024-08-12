import { SelectChangeEvent } from '@mui/material'
import { Dispatch } from 'react'

export type TProjectSOWPhaseFormComponentProps = {
  phaseData: any
  setScopeOfWorkData: Dispatch<any>
  problemGoalID: any
  selectedScopeOfWorkData: any
  setSelectedScopeOfWorkData: Dispatch<any>
  selectedAdditionalServiceData: any
  handleAdditionalServiceSelection: (id: any) => void
  serviceList: any
  serviceId: any
}

export type TProjectSOWPhaseFormViewProps = {
  handleScopeOfWorkCheckbox: () => void
  phaseData: any
  selectedScopeOfWorkData: any
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
  handleScopeOfWorkInputChange: (event: any) => void
  handlePhaseSaveOnClick: () => void
  handleScopeOfWorkSelectChange: (e: SelectChangeEvent<any>) => void
  handleAddNewSow: () => void
  phasePhaseList: any[]
  handleScopeOfWorkMultipleInputChange: (event: any, index: number) => void
  handleRemoveSow: (index: number) => void
  handlePhaseOnClear: () => void
}
