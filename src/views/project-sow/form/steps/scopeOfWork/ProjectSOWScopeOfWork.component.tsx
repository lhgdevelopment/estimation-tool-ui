import { SelectChangeEvent } from '@mui/material'
import 'md-editor-rt/lib/style.css'
import { useCallback, useRef, useState } from 'react'
import { useToastSnackbar } from 'src/@core/hooks/useToastSnackbar'
import apiRequest from 'src/@core/utils/axios-config'
import { debounce } from 'src/@core/utils/utils'
import { TProjectSOWScopeOfWorkFormComponentProps } from './ProjectSOWScopeOfWork.decorator'
import ProjectSOWScopeOfWorkFormView from './ProjectSOWScopeOfWork.view'

export default function ProjectSOWScopeOfWorkFormComponent(props: TProjectSOWScopeOfWorkFormComponentProps) {
  const {
    scopeOfWorkData,
    setScopeOfWorkData,
    problemGoalID,
    selectedAdditionalServiceData,
    handleAdditionalServiceSelection,
    serviceList,
    serviceId,
    phaseData,
    setPhaseData
  } = props

  const [preload, setPreload] = useState<boolean>(false)
  const { showSnackbar } = useToastSnackbar()
  const [errorMessage, setErrorMessage] = useState<any>({})
  const [serviceSOWModalOpen, setServiceSowModalOpen] = useState<boolean>(false)

  const slInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({})

  const [scopeOfWorkPhaseList, setScopeOfWorkPhaseList] = useState<any[]>([])

  const scopeOfWorkDefaultData = {
    scopeOfWorkId: '',
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

  const [phaseDataList, setPhaseDataList] = useState<any[]>(phaseData?.sort((a: any, b: any) => a?.serial - b?.serial))
  const [servicePhaseModalOpen, setServicePhaseModalOpen] = useState<boolean>(false)

  const phaseDefaultData = {
    title: '',
    phases: [
      {
        title: '',
        serial: ''
      }
    ]
  }

  const [phaseFormData, setPhaseFormData] = useState<any>(phaseDefaultData)
  const [phaseEditId, setPhaseEditId] = useState<any>(null)

  const phaseSlInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({})

  const handleServicePhaseModalOpen = () => {
    setServicePhaseModalOpen(true)
  }
  const handleServicePhaseModalClose = () => {
    setServicePhaseModalOpen(false)
    handlePhaseOnClear()
  }

  const handlePhaseCheckbox = (e: React.ChangeEvent<HTMLInputElement>, id: number, sowIds: number[]) => {
    setPhaseDataList(prevList =>
      prevList.map((phase: any) => (phase?.id === id ? { ...phase, isPreloading: true } : phase))
    )

    const { checked } = e.target

    // Update state and immediately access the updated state in the callback
    setPhaseDataList((prevState: any[]) => {
      const updatedPhaseList = prevState.map((phase: any) =>
        phase?.id === id ? { ...phase, isChecked: !!checked, isPreloading: false } : phase
      )
      // Make API request with the updated list
      apiRequest
        .post(`/phase-select/`, {
          problemGoalId: problemGoalID,
          phaseIds: updatedPhaseList.filter(phase => phase?.isChecked).map(phase => phase?.id)
        })
        .then(res => {
          setScopeOfWorkData((prevState: any[]) => {
            const updatedSOWList = prevState.map((scopeOfWork: any) =>
              sowIds?.includes(scopeOfWork?.id)
                ? { ...scopeOfWork, isChecked: !!checked, isPreloading: false }
                : scopeOfWork
            )

            // Make API request with the updated list
            apiRequest
              .post(`/scope-of-work-select/`, {
                problemGoalId: problemGoalID,
                scopeOfWorkIds: updatedSOWList
                  .filter(scopeOfWork => scopeOfWork?.isChecked)
                  .map(scopeOfWork => scopeOfWork?.id),
                serviceIds: selectedAdditionalServiceData
              })
              .then(res => {
                showSnackbar('Updated Successfully!', { variant: 'success' })
              })
              .catch(error => {
                showSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
              })
              .finally(() => {
                setScopeOfWorkData((prevList: any) =>
                  prevList.map((scopeOfWork: any) =>
                    scopeOfWork?.id === id ? { ...scopeOfWork, isPreloading: false } : scopeOfWork
                  )
                )
              })

            return updatedSOWList
          })
        })
        .catch(error => {
          showSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
        })
        .finally(() => {
          setPhaseDataList((prevState: any[]) =>
            prevState.map((phase: any) => (phase?.id === id ? { ...phase, isPreloading: false } : phase))
          )
        })

      return updatedPhaseList
    })
  }

  const debouncedSetPhaseSlOnChange = useCallback(
    debounce((sl: number, id: number) => {
      apiRequest
        .patch(`/phase/${id}/serial`, { serial: sl })
        .then(res => {
          showSnackbar('Updated Successfully!', { variant: 'success' })
        })
        .catch(error => {
          showSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
        })
        .finally(() => {
          setPhaseDataList((prevState: any[]) =>
            prevState
              ?.sort((a: any, b: any) => a?.serial - b?.serial)
              .map((phase: any) => (phase?.id === id ? { ...phase, serial: sl, isPreloading: false } : phase))
          )
        })
    }, 1000),
    []
  )

  const handlePhaseSlOnChange = (sl: number, id: number) => {
    setPhaseDataList((prevState: any[]) =>
      prevState.map((phase: any) => (phase?.id === id ? { ...phase, serial: sl, isPreloading: true } : phase))
    )

    if (slInputRefs.current[id]) {
      setTimeout(() => {
        phaseSlInputRefs.current[id]?.focus()
      }, 100)
    }

    debouncedSetPhaseSlOnChange(sl, id)
  }

  const handleGenerateSOWWithAI = (phaseId: any) => {
    setPhaseDataList((prevState: any[]) =>
      prevState.map((phase: any) => (phase?.id === phaseId ? { ...phase, isPreloading: true } : phase))
    )
    apiRequest
      .post(`/scope-of-work/`, {
        problemGoalID,
        phaseId
      })
      .then(res => {
        setScopeOfWorkData((prevState: any[]) => res?.data)
        showSnackbar('Generated Successfully!', { variant: 'success' })
      })
      .catch(error => {
        showSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
      })
      .finally(() => {
        setPhaseDataList((prevState: any[]) =>
          prevState.map((phase: any) => (phase?.id === phaseId ? { ...phase, isPreloading: false } : phase))
        )
      })
  }

  const handlePhaseSelectChange = (e: SelectChangeEvent<any>) => {
    setPhaseFormData({
      ...phaseFormData,
      [e?.target?.name]: e?.target?.value
    })
  }

  const handleAddNewPhase = () => {
    const phases = [...phaseFormData.phases]
    phases.push({
      title: '',
      serial: ''
    })
    setPhaseFormData(() => ({ ...phaseFormData, phases }))
  }

  const handleRemovePhase = (index: number) => {
    const phases = [...phaseFormData.phases]
    phases.splice(index, 1)
    setPhaseFormData(() => ({ ...phaseFormData, phases }))
  }

  const handlePhaseMultipleInputChange = (event: any, index: number) => {
    const { name, value } = event.target
    const phases = [...phaseFormData.phases]
    phases[index][name] = value
    setPhaseFormData(() => ({ ...phaseFormData, phases }))
  }

  const handlePhaseInputChange = (event: any) => {
    const { name, value } = event.target
    const phases = phaseFormData
    phases[name] = value
    setPhaseFormData(() => ({ ...phaseFormData, ...phases }))
  }

  const handlePhaseOnClear = () => {
    setPhaseFormData(phaseDefaultData)
    setPhaseEditId(null)
  }

  const handlePhaseOnEdit = (data: any) => {
    const { id, title, serial } = data
    setPhaseEditId(id)
    setPhaseFormData({
      title
    })
    handleServicePhaseModalOpen()
  }

  const handlePhaseSaveOnClick = () => {
    setPreload(true)
    if (phaseEditId) {
      apiRequest
        .post(`/phase/${phaseEditId}`, { ...phaseFormData })
        .then(res => {
          setPhaseDataList((prevState: any[]) => [
            ...prevState.map((phase: any) => {
              if (phase?.id === phaseEditId) return res.data

              return phase
            })
          ])

          setPreload(false)
          showSnackbar('Updatedf Successfully!', { variant: 'success' })
          handleServicePhaseModalClose()
        })
        .catch(error => {
          setPreload(false)
          setErrorMessage(error?.response?.data?.errors)
          showSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
        })
    } else {
      apiRequest
        .post('/phase/add-multi', { ...phaseFormData, problemGoalId: problemGoalID })
        .then(res => {
          setPhaseDataList([...res?.data, ...phaseData])

          setPreload(false)
          showSnackbar('Created Successfully!', { variant: 'success' })
          handleServicePhaseModalClose()
        })
        .catch(error => {
          setPreload(false)
          setErrorMessage(error?.response?.data?.errors)
          showSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
        })
    }
  }

  const handleServiceSOWModalOpen = () => {
    setServiceSowModalOpen(true)
  }
  const handleServiceSOWModalClose = () => {
    setServiceSowModalOpen(false)
    handleSOWOnClear()
  }

  const handleScopeOfWorkCheckbox = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const { checked } = e.target

    setScopeOfWorkData((prevState: any[]) => {
      const updatedList = prevState.map((scopeOfWork: any) =>
        scopeOfWork?.id === id ? { ...scopeOfWork, isChecked: !!checked, isPreloading: true } : scopeOfWork
      )

      // Make API request with the updated list
      apiRequest
        .post(`/scope-of-work-select/`, {
          problemGoalId: problemGoalID,
          scopeOfWorkIds: updatedList.filter(scopeOfWork => scopeOfWork?.isChecked).map(scopeOfWork => scopeOfWork?.id),
          serviceIds: selectedAdditionalServiceData
        })
        .then(res => {
          console.log(res)
          showSnackbar('Updated Successfully!', { variant: 'success' })
        })
        .catch(error => {
          showSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
        })
        .finally(() => {
          setScopeOfWorkData((prevList: any) =>
            prevList.map((scopeOfWork: any) =>
              scopeOfWork?.id === id ? { ...scopeOfWork, isPreloading: false } : scopeOfWork
            )
          )
        })

      return updatedList
    })
  }

  const debouncedSetScopeOfWorkSlOnChange = useCallback(
    debounce((sl: number, id: number) => {
      apiRequest
        .patch(`/scope-of-work/${id}/serial`, { serial: sl })
        .then(res => {
          showSnackbar('Updated Successfully!', { variant: 'success' })
        })
        .catch(error => {
          showSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
        })
        .finally(() => {
          setScopeOfWorkData((prevState: any[]) =>
            prevState
              ?.sort((a: any, b: any) => a?.serial - b?.serial)
              .map((scopeOfWork: any) =>
                scopeOfWork?.id === id ? { ...scopeOfWork, serial: sl, isPreloading: false } : scopeOfWork
              )
          )
        })
    }, 1000),
    []
  )

  const handleScopeOfWorkSlOnChange = (sl: number, id: number) => {
    setScopeOfWorkData((prevState: any[]) =>
      prevState?.map((scopeOfWork: any) =>
        scopeOfWork?.id === id ? { ...scopeOfWork, serial: sl, isPreloading: true } : scopeOfWork
      )
    )

    if (slInputRefs.current[id]) {
      setTimeout(() => {
        slInputRefs.current[id]?.focus()
      }, 100)
    }

    debouncedSetScopeOfWorkSlOnChange(sl, id)
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

  const handleSOWSaveOnClick = () => {
    setPreload(true)
    if (scopeOfWorkEditId) {
      apiRequest
        .post(`/scope-of-work/${scopeOfWorkEditId}`, { ...scopeOfWorkFormData })
        .then(res => {
          setScopeOfWorkData((prevState: any[]) => [
            ...prevState.map((sow: any) => {
              if (sow?.id === scopeOfWorkEditId) return res.data

              return sow
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
          setScopeOfWorkData((prevState: any[]) => [...res?.data, ...prevState])

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
  function serviceGroupByProjectTypeId(data: any) {
    const grouped = data?.reduce((acc: { [key: number]: any }, item: any) => {
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
    }, {})

    return Object.values(grouped)
  }

  return (
    <ProjectSOWScopeOfWorkFormView
      scopeOfWorkData={scopeOfWorkData}
      handleServiceSOWModalOpen={handleServiceSOWModalOpen}
      handleScopeOfWorkCheckbox={handleScopeOfWorkCheckbox}
      handleSOWOnEdit={handleSOWOnEdit}
      serviceGroupByProjectTypeId={serviceGroupByProjectTypeId}
      selectedAdditionalServiceData={selectedAdditionalServiceData}
      handleAdditionalServiceSelection={handleAdditionalServiceSelection}
      serviceList={serviceList}
      serviceSOWModalOpen={serviceSOWModalOpen}
      handleServiceSOWModalClose={handleServiceSOWModalClose}
      errorMessage={errorMessage}
      scopeOfWorkEditId={scopeOfWorkEditId}
      scopeOfWorkFormData={scopeOfWorkFormData}
      handleScopeOfWorkInputChange={handleScopeOfWorkInputChange}
      handleSOWSaveOnClick={handleSOWSaveOnClick}
      handleScopeOfWorkSelectChange={handleScopeOfWorkSelectChange}
      handleAddNewSow={handleAddNewSow}
      scopeOfWorkPhaseList={scopeOfWorkPhaseList}
      handleScopeOfWorkMultipleInputChange={handleScopeOfWorkMultipleInputChange}
      handleRemoveSow={handleRemoveSow}
      handleSOWOnClear={handleSOWOnClear}
      slInputRefs={slInputRefs}
      handleScopeOfWorkSlOnChange={handleScopeOfWorkSlOnChange}
      phaseDataList={phaseDataList}
      handlePhaseCheckbox={handlePhaseCheckbox}
      handleServicePhaseModalOpen={handleServicePhaseModalOpen}
      handlePhaseOnEdit={handlePhaseOnEdit}
      servicePhaseModalOpen={servicePhaseModalOpen}
      handleServicePhaseModalClose={handleServicePhaseModalClose}
      handleAddNewPhase={handleAddNewPhase}
      handlePhaseMultipleInputChange={handlePhaseMultipleInputChange}
      handleRemovePhase={handleRemovePhase}
      handlePhaseSaveOnClick={handlePhaseSaveOnClick}
      handlePhaseSelectChange={handlePhaseSelectChange}
      handlePhaseOnClear={handlePhaseOnClear}
      handlePhaseSlOnChange={handlePhaseSlOnChange}
      phaseEditId={phaseEditId}
      phaseFormData={phaseFormData}
      handlePhaseInputChange={handlePhaseInputChange}
      phaseSlInputRefs={phaseSlInputRefs}
      handleGenerateSOWWithAI={handleGenerateSOWWithAI}
    ></ProjectSOWScopeOfWorkFormView>
  )
}
