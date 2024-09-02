import { SelectChangeEvent } from '@mui/material'
import 'md-editor-rt/lib/style.css'
import { useSnackbar } from 'notistack'
import { useCallback, useEffect, useRef, useState } from 'react'
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
    serviceId
  } = props

  const [preload, setPreload] = useState<boolean>(false)
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
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

  const handleServiceSOWModalOpen = () => {
    setServiceSowModalOpen(true)
  }
  const handleServiceSOWModalClose = () => {
    setServiceSowModalOpen(false)
    handleSOWOnClear()
  }

  const handleScopeOfWorkCheckbox = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const { checked } = e.target

    // Update state and immediately access the updated state in the callback
    setScopeOfWorkData((prevState: any[]) => {
      console.log(prevState)

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
          enqueueSnackbar('Updated Successfully!', { variant: 'success' })
        })
        .catch(error => {
          enqueueSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
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
          enqueueSnackbar('Updated Successfully!', { variant: 'success' })
        })
        .catch(error => {
          enqueueSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
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
          enqueueSnackbar('Updatedf Successfully!', { variant: 'success' })
          handleServiceSOWModalClose()
        })
        .catch(error => {
          setPreload(false)
          setErrorMessage(error?.response?.data?.errors)
          enqueueSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
        })
    } else {
      apiRequest
        .post('/scope-of-work/add-multi', { ...scopeOfWorkFormData, problemGoalId: problemGoalID })
        .then(res => {
          setScopeOfWorkData((prevState: any[]) => [...res?.data, ...prevState])

          setPreload(false)
          enqueueSnackbar('Created Successfully!', { variant: 'success' })
          handleServiceSOWModalClose()
        })
        .catch(error => {
          setPreload(false)
          setErrorMessage(error?.response?.data?.errors)
          enqueueSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
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

  const getScopeOfWorkPhaseList = async () => {
    if (serviceId) {
      await apiRequest
        .get(`/service-groups?serviceId=${serviceId}`)
        .then(res => {
          setScopeOfWorkPhaseList(res?.data)
        })
        .catch(error => {
          enqueueSnackbar(error?.message, { variant: 'error' })
        })
    }
  }

  useEffect(() => {
    getScopeOfWorkPhaseList()
  }, [])

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
    ></ProjectSOWScopeOfWorkFormView>
  )
}
