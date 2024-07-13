import 'md-editor-rt/lib/style.css'
import { enqueueSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import apiRequest from 'src/@core/utils/axios-config'
import { TProjectSOWDeliverableFormComponentProps } from './ProjectSOWDeliverable.decorator'
import ProjectSOWDeliverableFormView from './ProjectSOWDeliverable.view'

export default function ProjectSOWDeliverableFormComponent(props: TProjectSOWDeliverableFormComponentProps) {
  const {
    projectSOWFormData,
    deliverableData,
    deliverableNotesData,
    deliverableServiceQuestionData,
    selectedDeliverableData,
    setSelectedDeliverableData,
    setDeliverableServiceQuestionData,
    setDeliverableNotesData
  } = props
  const [serviceQuestionList, setServiceQuestion] = useState<any>([])

  const handleDeliverableCheckboxBySow = (deliverables: any) => {
    setSelectedDeliverableData((prevState: any) => {
      const deliverableIds = deliverables?.map((deliverable: any) => Number(deliverable?.id))
      const hasSelectedDeliverables = deliverableIds.some((id: number) => prevState.includes(id))

      if (hasSelectedDeliverables) {
        return prevState.filter((id: number) => !deliverableIds.includes(id))
      } else {
        return [...prevState, ...deliverableIds]
      }
    })
  }

  const isSowCheckedInDeliverable = (deliverables: any, selectedDeliverableData: any) => {
    return deliverables.every((deliverable: any) => selectedDeliverableData.includes(deliverable.id))
  }
  const handleDeliverableCheckboxByService = (additionalService: any) => {
    const deliverables = additionalService?.scope_of_works?.flatMap(
      (scopeOfWork: any) => scopeOfWork?.deliverables || []
    )

    const deliverableIds = deliverables?.map((deliverable: any) => Number(deliverable?.id)) || []

    setSelectedDeliverableData((prevState: any) => {
      let newState = [...prevState]

      const allSelected = deliverableIds.every((id: any) => newState.includes(id))

      if (allSelected) {
        // Unselect all deliverables
        newState = newState.filter((id: number) => !deliverableIds.includes(id))
      } else {
        // Select all deliverables
        deliverableIds.forEach((id: number) => {
          if (!newState.includes(id)) {
            newState.push(id)
          }
        })
      }

      return newState
    })
  }
  const handleDeliverableCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked, value } = e.target
    setSelectedDeliverableData((prevState: any) => {
      if (checked) {
        return [...prevState, Number(value)]
      } else {
        return prevState.filter((item: any) => item !== Number(value))
      }
    })
  }
  const handleServiceQuestionInputChange = (answer: string, questionId: any) => {
    const index = deliverableServiceQuestionData.findIndex((item: any) => item.questionId === questionId)
    if (index !== -1) {
      deliverableServiceQuestionData[index].answer = answer
      setDeliverableServiceQuestionData((prevState: any) => [...deliverableServiceQuestionData])
    } else {
      setDeliverableServiceQuestionData((prevState: any) => [...prevState, { questionId, answer }])
    }
  }

  const handleNotesInputChange = (index: number, event: any) => {
    const { name, value } = event.target
    const newNotes = [...deliverableNotesData]
    newNotes[index][name] = value
    setDeliverableNotesData(newNotes)
  }

  const isServiceCheckedInDeliverable = (additionalService: any, selectedDeliverableData: any) => {
    const deliverables = additionalService?.scope_of_works?.flatMap(
      (scopeOfWork: any) => scopeOfWork?.deliverables || []
    )

    return deliverables.every((deliverable: any) => selectedDeliverableData.includes(deliverable.id))
  }

  const getServiceQuestionList = async () => {
    if (projectSOWFormData?.serviceId) {
      await apiRequest
        .get(`/questions?serviceId=${projectSOWFormData?.serviceId}`)
        .then(res => {
          setServiceQuestion(res?.data)
        })
        .catch(error => {
          enqueueSnackbar(error?.message, { variant: 'error' })
        })
    }
  }

  useEffect(() => {
    getServiceQuestionList()
  }, [projectSOWFormData?.serviceId])

  return (
    <ProjectSOWDeliverableFormView
      deliverableData={deliverableData}
      deliverableNotesData={deliverableNotesData}
      deliverableServiceQuestionData={deliverableServiceQuestionData}
      selectedDeliverableData={selectedDeliverableData}
      handleDeliverableCheckboxBySow={handleDeliverableCheckboxBySow}
      isSowCheckedInDeliverable={isSowCheckedInDeliverable}
      handleDeliverableCheckbox={handleDeliverableCheckbox}
      handleServiceQuestionInputChange={handleServiceQuestionInputChange}
      handleNotesInputChange={handleNotesInputChange}
      serviceQuestionList={serviceQuestionList}
      handleDeliverableCheckboxByService={handleDeliverableCheckboxByService}
      isServiceCheckedInDeliverable={isServiceCheckedInDeliverable}
    ></ProjectSOWDeliverableFormView>
  )
}
