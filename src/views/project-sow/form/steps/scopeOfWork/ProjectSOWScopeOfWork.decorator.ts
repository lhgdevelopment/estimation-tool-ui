import { SelectChangeEvent } from '@mui/material'
import { Dispatch } from 'react'

export type TProjectSOWScopeOfWorkFormComponentProps = {
  scopeOfWorkData: any
  setScopeOfWorkData: Dispatch<any>
  problemGoalID: any
  selectedScopeOfWorkData: any
  setSelectedScopeOfWorkData: Dispatch<any>
  selectedAdditionalServiceData: any
  handleAdditionalServiceSelection: (id: any) => void
  serviceList: any
  serviceId: any
}

export type TProjectSOWScopeOfWorkFormViewProps = {
  handleScopeOfWorkCheckbox: () => void
  scopeOfWorkData: any
  selectedScopeOfWorkData: any
  handleServiceSOWModalOpen: () => void
  handleSOWOnEdit: (data: any) => void
  serviceGroupByProjectTypeId: (data: any) => any[]
  selectedAdditionalServiceData: any
  handleAdditionalServiceSelection: (data: any) => void
  serviceList: any
  serviceSOWModalOpen: boolean
  handleServiceSOWModalClose: () => void
  errorMessage: any
  scopeOfWorkEditId: any
  scopeOfWorkFormData: any
  handleScopeOfWorkInputChange: (event: any) => void
  handleSOWSaveOnClick: () => void
  handleScopeOfWorkSelectChange: (e: SelectChangeEvent<any>) => void
  handleAddNewSow: () => void
  scopeOfWorkPhaseList: any[]
  handleScopeOfWorkMultipleInputChange: (event: any, index: number) => void
  handleRemoveSow: (index: number) => void
  handleSOWOnClear: () => void
}
