import { ChangeEvent, Dispatch, SetStateAction } from 'react'

export type TProjectSOWDeliverableFormComponentProps = {
  projectSOWFormData: any
  deliverableData: any
  selectedDeliverableData: any
  deliverableServiceQuestionData: any
  deliverableNotesData: any
  setSelectedDeliverableData: Dispatch<SetStateAction<any>>
  setDeliverableServiceQuestionData: Dispatch<SetStateAction<any>>
  setDeliverableNotesData: Dispatch<SetStateAction<any>>
  serviceId: string
  problemGoalID: string
  scopeOfWorkData: any
}

export type TProjectSOWDeliverableFormViewProps = {
  preload: boolean
  deliverableDataList: any
  selectedDeliverableData: any
  deliverableServiceQuestionData: any
  deliverableNotesData: any
  serviceQuestionList: any
  handleDeliverableCheckboxBySow: (deliverables: any) => void
  isSowCheckedInDeliverable: (deliverables: any, selectedDeliverableData: any) => any
  handleDeliverableCheckbox: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleServiceQuestionInputChange: (answer: string, questionId: any) => void
  handleNotesInputChange: (index: number, event: any) => void
  handleDeliverableCheckboxByService: (additionalService: any) => void
  isServiceCheckedInDeliverable: (additionalService: any, selectedDeliverableData: any) => any
  scopeOfWorkEditId: string
  serviceSOWModalOpen: boolean
  handleServiceSOWModalClose: () => void
  scopeOfWorkFormData: any
  handleScopeOfWorkSelectChange: (additionalService: any, selectedDeliverableData: any) => any
  scopeOfWorkPhaseList: any[]
  errorMessage: any
  handleScopeOfWorkInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => any
  handleAddNewSow: () => void
  handleScopeOfWorkMultipleInputChange: (additionalService: any, selectedDeliverableData: any) => void
  handleRemoveSow: (id: any) => void
  handleSOWSaveOnClick: () => void
  handleSOWOnClear: () => void
  handleSOWOnEdit: (data: any) => void
  serviceDeliverableModalOpen: boolean
  handleDeliverableInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => any
  handleAddNewDeliverable: () => void
  handleDeliverableMultipleInputChange: (additionalService: any, selectedDeliverableData: any) => void
  handleRemoveDeliverable: (id: any) => void
  handleDeliverableSaveOnClick: () => void
  handleDeliverableOnClear: () => void
  handleDeliverableOnEdit: (data: any) => void
  handleServiceDeliverableModalClose: () => void
  handleServiceDeliverableModalOpen: () => void
  deliverableEditId: string
  deliverableFormData: any
  problemGoalId: string
  scopeOfWorkData: any
}

export function serviceGroupByProjectTypeId(data: any) {
  const grouped =
    data?.reduce((acc: { [key: number]: any }, item: any) => {
      const { projectTypeId, project_type } = item

      if (!acc[projectTypeId]) {
        acc[projectTypeId] = {
          projectTypeName: project_type.name,
          projectTypeId: projectTypeId,
          services: []
        }
      }

      acc[projectTypeId].services.push(item)

      return acc
    }, {}) || {}

  return Object?.values(grouped)
}

export function serviceDeliverableGroupByScopeOfWorkId(data: any) {
  const grouped =
    data?.reduce((acc: { [key: number]: any }, item: any) => {
      const { scopeOfWorkId, scope_of_work } = item

      if (!acc[scopeOfWorkId]) {
        acc[scopeOfWorkId] = {
          ...scope_of_work,
          additional_service_info: item?.additional_service_info,
          deliverables: []
        }
      }

      acc[scopeOfWorkId].deliverables.push(item)

      return acc
    }, {}) || {}

  return Object.values(grouped)
}
