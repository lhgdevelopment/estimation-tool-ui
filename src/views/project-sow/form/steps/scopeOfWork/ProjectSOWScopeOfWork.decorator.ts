import { SelectChangeEvent } from '@mui/material'
import { Dispatch, MutableRefObject } from 'react'

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
  phaseData: any
  setPhaseData: Dispatch<any>
}

export type TProjectSOWScopeOfWorkFormViewProps = {
  handleScopeOfWorkCheckbox: (event: any, id: number) => void
  scopeOfWorkData: any
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
  handleScopeOfWorkSlOnChange: (sl: number, id: number) => void
  slInputRefs: MutableRefObject<{ [key: number]: HTMLInputElement | null }>
  phaseDataList: any
  handlePhaseCheckbox: (event: any, id: number, sowIds: number[]) => void
  handleServicePhaseModalOpen: () => void
  handlePhaseOnEdit: (data: any) => void
  servicePhaseModalOpen: boolean
  handleServicePhaseModalClose: () => void
  phaseEditId: any
  phaseFormData: any
  handlePhaseInputChange: (event: any) => void
  handlePhaseSaveOnClick: () => void
  handlePhaseSelectChange: (e: SelectChangeEvent<any>) => void
  handleAddNewPhase: () => void
  handlePhaseMultipleInputChange: (event: any, index: number) => void
  handleRemovePhase: (index: number) => void
  handlePhaseSlOnChange: (sl: number, id: number) => void
  handlePhaseOnClear: () => void
  phaseSlInputRefs: MutableRefObject<{ [key: number]: HTMLInputElement | null }>
  handleGenerateSOWWithAI: (phaseId: any) => void
}
