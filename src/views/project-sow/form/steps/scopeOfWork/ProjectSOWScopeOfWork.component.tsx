import { SelectChangeEvent } from '@mui/material'
import 'md-editor-rt/lib/style.css'
import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import apiRequest from 'src/@core/utils/axios-config'
import { TProjectSOWScopeOfWorkFormComponentProps } from './ProjectSOWScopeOfWork.decorator'
import ProjectSOWScopeOfWorkFormView from './ProjectSOWScopeOfWork.view'

export default function ProjectSOWScopeOfWorkFormComponent(props: TProjectSOWScopeOfWorkFormComponentProps) {
  const {
    scopeOfWorkData,
    setScopeOfWorkData,
    problemGoalID,
    selectedScopeOfWorkData,
    setSelectedScopeOfWorkData,
    selectedAdditionalServiceData,
    handleAdditionalServiceSelection,
    serviceList,
    serviceId
  } = props

  const [preload, setPreload] = useState<boolean>(false)
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const [errorMessage, setErrorMessage] = useState<any>({})
  const [serviceSOWModalOpen, setServiceSowModalOpen] = useState<boolean>(false)

  const handleServiceSOWModalOpen = () => {
    setServiceSowModalOpen(true)
  }
  const handleServiceSOWModalClose = () => {
    setServiceSowModalOpen(false)
    handleSOWOnClear()
  }
  const handleScopeOfWorkCheckbox: any = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked, value } = e.target
    setSelectedScopeOfWorkData((prevState: any) => {
      if (checked) {
        return [...prevState, Number(value)]
      } else {
        return prevState.filter((item: any) => item !== Number(value))
      }
    })
  }

  const [scopeOfWorkPhaseList, setScopeOfWorkPhaseList] = useState<any[]>([])

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
          setSelectedScopeOfWorkData((prevState: any[]) => [...res?.data.map((sow: any) => sow?.id), ...prevState])

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
      selectedScopeOfWorkData={selectedScopeOfWorkData}
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
    ></ProjectSOWScopeOfWorkFormView>
  )
}
