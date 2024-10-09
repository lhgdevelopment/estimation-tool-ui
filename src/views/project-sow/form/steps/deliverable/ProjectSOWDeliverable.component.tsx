import { SelectChangeEvent } from '@mui/material'
import 'md-editor-rt/lib/style.css'
import { useEffect, useState } from 'react'
import apiRequest from '@core/utils/axios-config'
import { TProjectSOWDeliverableFormComponentProps } from './ProjectSOWDeliverable.decorator'
import ProjectSOWDeliverableFormView from './ProjectSOWDeliverable.view'
import { useToastSnackbar } from '@core/hooks/useToastSnackbar'

export default function ProjectSOWDeliverableFormComponent(props: TProjectSOWDeliverableFormComponentProps) {
  const {
    projectSOWFormData,
    deliverableData,
    deliverableNotesData,
    deliverableServiceQuestionData,
    selectedDeliverableData,
    setSelectedDeliverableData,
    setDeliverableServiceQuestionData,
    setDeliverableNotesData,
    serviceId,
    problemGoalID,
    setScopeOfWorkData,
    scopeOfWorkData,
    phaseDataList,
    selectedAdditionalServiceData,
    additionalServiceData
  } = props

  const { showSnackbar } = useToastSnackbar()
  const [preload, setPreload] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<any[]>([])
  const [deliverableDataList, setDeliverableDataList] = useState<any[]>([])
  const [scopeOfWorkPhaseList, setScopeOfWorkPhaseList] = useState<any[]>([])

  const [serviceQuestionList, setServiceQuestion] = useState<any>([])

  const scopeOfWorkDefaultData = {
    phaseId: '',
    title: '',
    scopeOfWorks: [
      {
        title: '',
        serial: ''
      }
    ]
  }

  const [scopeOfWorkFormData, setScopeOfWorkFormData] = useState<any>(scopeOfWorkDefaultData)
  const [scopeOfWorkEditId, setScopeOfWorkEditId] = useState<any>(null)
  const [serviceSOWModalOpen, setServiceSowModalOpen] = useState<boolean>(false)

  const handleServiceSOWModalOpen = () => {
    setServiceSowModalOpen(true)
  }
  const handleServiceSOWModalClose = () => {
    setServiceSowModalOpen(false)
    handleSOWOnClear()
  }

  const handleScopeOfWorkSelectChange = (e: SelectChangeEvent<any>) => {
    setScopeOfWorkFormData({
      ...scopeOfWorkFormData,
      [e?.target?.name]: e?.target?.value
    })
  }

  const handleAddNewSow = () => {
    const scopeOfWorks = [...scopeOfWorkFormData.scopeOfWorks]
    scopeOfWorks.push({
      title: '',
      order: ''
    })
    setScopeOfWorkFormData(() => ({ ...scopeOfWorkFormData, scopeOfWorks }))
  }

  const handleRemoveSow = (index: number) => {
    const scopeOfWorks = [...scopeOfWorkFormData.scopeOfWorks]
    scopeOfWorks.splice(index, 1)
    setScopeOfWorkFormData(() => ({ ...scopeOfWorkFormData, scopeOfWorks }))
  }

  const handleScopeOfWorkMultipleInputChange = (event: any, index: number) => {
    const { name, value } = event.target
    const scopeOfWorks = [...scopeOfWorkFormData.scopeOfWorks]
    scopeOfWorks[index][name] = value
    setScopeOfWorkFormData(() => ({ ...scopeOfWorkFormData, scopeOfWorks }))
  }

  const handleScopeOfWorkInputChange = (event: any) => {
    const { name, value } = event.target
    const scopeOfWorks = scopeOfWorkFormData
    scopeOfWorks[name] = value
    setScopeOfWorkFormData(() => ({ ...scopeOfWorkFormData, ...scopeOfWorks }))
  }

  const handleSOWOnClear = () => {
    setScopeOfWorkFormData(scopeOfWorkDefaultData)
    setScopeOfWorkEditId(null)
  }

  const handleSOWOnEdit = (data: any) => {
    const { id, title, serial } = data
    setScopeOfWorkEditId(id)
    setScopeOfWorkFormData({
      title
    })
    handleServiceSOWModalOpen()
  }

  const deliverableDefaultData = {
    phaseId: '',
    title: '',
    deliverables: [
      {
        title: '',
        scopeOfWorkId: '',
        serial: ''
      }
    ]
  }

  const [deliverableFormData, setDeliverableFormData] = useState<any>(deliverableDefaultData)
  const [deliverableEditId, setDeliverableEditId] = useState<any>(null)
  const [serviceDeliverableModalOpen, setServiceDeliverableModalOpen] = useState<boolean>(false)

  const handleServiceDeliverableModalOpen = () => {
    setServiceDeliverableModalOpen(true)
  }
  const handleServiceDeliverableModalClose = () => {
    setServiceDeliverableModalOpen(false)
    handleDeliverableOnClear()
  }

  const handleAddNewDeliverable = () => {
    const deliverables = [...deliverableFormData.deliverables]
    deliverables.push({
      title: '',
      scopeOfWorkId: ''
    })
    setDeliverableFormData(() => ({ ...deliverableFormData, deliverables }))
  }

  const handleRemoveDeliverable = (index: number) => {
    const deliverables = [...deliverableFormData.deliverables]
    deliverables.splice(index, 1)
    setDeliverableFormData(() => ({ ...deliverableFormData, deliverables }))
  }

  const handleDeliverableMultipleInputChange = (event: any, index: number) => {
    const { name, value } = event.target
    const deliverables = [...deliverableFormData.deliverables]
    deliverables[index][name] = value
    setDeliverableFormData(() => ({ ...deliverableFormData, deliverables }))
  }

  const handleDeliverableInputChange = (event: any) => {
    const { name, value } = event.target
    const deliverables = deliverableFormData
    deliverables[name] = value
    setDeliverableFormData(() => ({ ...deliverableFormData, ...deliverables }))
  }

  const handleDeliverableOnClear = () => {
    setDeliverableFormData(deliverableDefaultData)
    setDeliverableEditId(null)
  }

  const handleDeliverableOnEdit = (data: any) => {
    const { id, title, serial } = data
    setDeliverableEditId(id)
    setDeliverableFormData({
      title
    })
    handleServiceDeliverableModalOpen()
  }
  const handleSowCheckbox = (
    e: React.ChangeEvent<HTMLInputElement>,
    scopeOfWorkId: number,
    deliverableIds: number[]
  ) => {
    const { checked } = e.target
    setScopeOfWorkData((prevState: any[]) => {
      const updatedList = prevState.map((scopeOfWork: any) =>
        scopeOfWork?.id === scopeOfWorkId ? { ...scopeOfWork, isChecked: !!checked, isPreloading: true } : scopeOfWork
      )

      // Make API request with the updated list
      apiRequest
        .post(`/scope-of-work-select/`, {
          problemGoalId: problemGoalID,
          scopeOfWorkIds: updatedList.filter(scopeOfWork => scopeOfWork?.isChecked).map(scopeOfWork => scopeOfWork?.id),
          serviceIds: selectedAdditionalServiceData
        })
        .then(res => {
          setSelectedDeliverableData((prevState: any) => {
            const hasSelectedDeliverables = deliverableIds?.some((id: number) => prevState.includes(id))
            if (hasSelectedDeliverables) {
              return prevState.filter((id: number) => !deliverableIds.includes(id))
            } else {
              return [...prevState, ...deliverableIds]
            }
          })
          showSnackbar('Updated Successfully!', { variant: 'success' })
        })
        .catch(error => {
          showSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
        })
        .finally(() => {
          setScopeOfWorkData((prevList: any) =>
            prevList.map((scopeOfWork: any) =>
              scopeOfWork?.id === scopeOfWorkId ? { ...scopeOfWork, isPreloading: false } : scopeOfWork
            )
          )
        })

      return updatedList
    })
  }

  const isSowCheckedInDeliverable = (deliverables: any, selectedDeliverableData: any) => {
    return deliverables?.every((deliverable: any) => selectedDeliverableData.includes(deliverable.id))
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

  const handleGenerateSOWWithAI = (scopeOfWorkId: any) => {
    setScopeOfWorkData((prevList: any) =>
      prevList.map((scopeOfWork: any) =>
        scopeOfWork?.id === scopeOfWorkId ? { ...scopeOfWork, isPreloading: true } : scopeOfWork
      )
    )
    apiRequest
      .post(`/deliverables/`, {
        problemGoalId: problemGoalID,
        scopeOfWorkId
      })
      .then(res => {
        setDeliverableDataList((prevState: any[]) => res?.data)
        setSelectedDeliverableData((prevState: any) => [...prevState, ...res?.data?.map((item: any) => item?.id)])
        showSnackbar('Generated Successfully!', { variant: 'success' })
      })
      .catch(error => {
        showSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
      })
      .finally(() => {
        setScopeOfWorkData((prevList: any) =>
          prevList.map((scopeOfWork: any) =>
            scopeOfWork?.id === scopeOfWorkId ? { ...scopeOfWork, isPreloading: false } : scopeOfWork
          )
        )
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

    return deliverables?.every((deliverable: any) => selectedDeliverableData.includes(deliverable.id))
  }

  const getServiceQuestionList = async () => {
    if (projectSOWFormData?.serviceId) {
      await apiRequest
        .get(`/questions?serviceId=${projectSOWFormData?.serviceId}`)
        .then(res => {
          setServiceQuestion(res?.data)
        })
        .catch(error => {
          showSnackbar(error?.message, { variant: 'error' })
        })
    }
  }

  const getScopeOfWorkPhaseList = async () => {
    if (serviceId) {
      await apiRequest
        .get(`/service-groups?serviceId=${serviceId}`)
        .then(res => {
          setScopeOfWorkPhaseList(res?.data)
        })
        .catch(error => {
          showSnackbar(error?.message, { variant: 'error' })
        })
    }
  }

  const handleSOWSaveOnClick = () => {
    setPreload(true)
    if (scopeOfWorkEditId) {
      apiRequest
        .post(`/scope-of-work/${scopeOfWorkEditId}`, { ...scopeOfWorkFormData })
        .then(res => {
          setDeliverableDataList((prevState: any[]) => [
            ...prevState.map((deliverable: any) => {
              if (deliverable?.scopeOfWorkId === scopeOfWorkEditId) return { ...deliverable, scope_of_work: res.data }

              return deliverable
            })
          ])

          setPreload(false)
          showSnackbar('Updatedf Successfully!', { variant: 'success' })
          handleServiceSOWModalClose()
        })
        .catch(error => {
          setPreload(false)
          setErrorMessage(error?.response?.data?.errors)
          showSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
        })
    } else {
      apiRequest
        .post('/scope-of-work/add-multi', { ...scopeOfWorkFormData, problemGoalId: problemGoalID })
        .then(res => {
          // setScopeOfWorkData((prevState: any[]) => [...res?.data, ...prevState])
          // setSelectedScopeOfWorkData((prevState: any[]) => [...res?.data.map((sow: any) => sow?.id), ...prevState])

          setPreload(false)
          showSnackbar('Created Successfully!', { variant: 'success' })
          handleServiceSOWModalClose()
        })
        .catch(error => {
          setPreload(false)
          setErrorMessage(error?.response?.data?.errors)
          showSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
        })
    }
  }

  const handleDeliverableSaveOnClick = () => {
    setPreload(true)
    if (deliverableEditId) {
      apiRequest
        .post(`/deliverables/${deliverableEditId}`, { ...deliverableFormData })
        .then(res => {
          setDeliverableDataList((prevState: any[]) => [
            ...prevState.map((deliverable: any) => {
              if (deliverable?.id === deliverableEditId) return res.data

              return deliverable
            })
          ])

          setPreload(false)
          showSnackbar('Updatedf Successfully!', { variant: 'success' })
          handleServiceDeliverableModalClose()
        })
        .catch(error => {
          setPreload(false)
          setErrorMessage(error?.response?.data?.errors)
          showSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
        })
    } else {
      apiRequest
        .post('/deliverables/add-multi', { ...deliverableFormData })
        .then(res => {
          setDeliverableDataList((prevState: any[]) => [...res?.data, ...prevState])

          setPreload(false)
          showSnackbar('Created Successfully!', { variant: 'success' })
          handleServiceDeliverableModalClose()
        })
        .catch(error => {
          setPreload(false)
          setErrorMessage(error?.response?.data?.errors)
          showSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
        })
    }
  }

  useEffect(() => {
    getServiceQuestionList()
    getScopeOfWorkPhaseList()
    setDeliverableDataList([...deliverableData])
  }, [projectSOWFormData?.serviceId, deliverableData])

  return (
    <ProjectSOWDeliverableFormView
      preload={preload}
      deliverableDataList={deliverableDataList}
      deliverableNotesData={deliverableNotesData}
      deliverableServiceQuestionData={deliverableServiceQuestionData}
      selectedDeliverableData={selectedDeliverableData}
      handleSowCheckbox={handleSowCheckbox}
      isSowCheckedInDeliverable={isSowCheckedInDeliverable}
      handleDeliverableCheckbox={handleDeliverableCheckbox}
      handleServiceQuestionInputChange={handleServiceQuestionInputChange}
      handleNotesInputChange={handleNotesInputChange}
      serviceQuestionList={serviceQuestionList}
      handleDeliverableCheckboxByService={handleDeliverableCheckboxByService}
      isServiceCheckedInDeliverable={isServiceCheckedInDeliverable}
      scopeOfWorkEditId={scopeOfWorkEditId}
      serviceSOWModalOpen={serviceSOWModalOpen}
      handleServiceSOWModalClose={handleServiceSOWModalClose}
      scopeOfWorkFormData={scopeOfWorkFormData}
      handleScopeOfWorkSelectChange={handleScopeOfWorkSelectChange}
      scopeOfWorkPhaseList={scopeOfWorkPhaseList}
      errorMessage={errorMessage}
      handleScopeOfWorkInputChange={handleScopeOfWorkInputChange}
      handleAddNewSow={handleAddNewSow}
      handleScopeOfWorkMultipleInputChange={handleScopeOfWorkMultipleInputChange}
      handleRemoveSow={handleRemoveSow}
      handleSOWSaveOnClick={handleSOWSaveOnClick}
      handleSOWOnClear={handleSOWOnClear}
      handleSOWOnEdit={handleSOWOnEdit}
      serviceDeliverableModalOpen={serviceDeliverableModalOpen}
      handleDeliverableInputChange={handleDeliverableInputChange}
      handleAddNewDeliverable={handleAddNewDeliverable}
      handleDeliverableMultipleInputChange={handleDeliverableMultipleInputChange}
      handleRemoveDeliverable={handleRemoveDeliverable}
      handleDeliverableSaveOnClick={handleDeliverableSaveOnClick}
      handleDeliverableOnClear={handleDeliverableOnClear}
      handleDeliverableOnEdit={handleDeliverableOnEdit}
      handleServiceDeliverableModalClose={handleServiceDeliverableModalClose}
      deliverableEditId={deliverableEditId}
      deliverableFormData={deliverableFormData}
      handleServiceDeliverableModalOpen={handleServiceDeliverableModalOpen}
      problemGoalId={problemGoalID}
      scopeOfWorkData={scopeOfWorkData}
      phaseDataList={phaseDataList}
      handleGenerateSOWWithAI={handleGenerateSOWWithAI}
      additionalServiceData={additionalServiceData}
    ></ProjectSOWDeliverableFormView>
  )
}
