import { SelectChangeEvent } from '@mui/material'
import 'md-editor-rt/lib/style.css'
import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import apiRequest from 'src/@core/utils/axios-config'
import { TProjectSOWPhaseFormComponentProps } from './ProjectSOWPhase.decorator'
import ProjectSOWPhaseFormView from './ProjectSOWPhase.view'

export default function ProjectSOWPhaseFormComponent(props: TProjectSOWPhaseFormComponentProps) {
  const {
    phaseData,
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
  const [servicePhaseModalOpen, setServiceSowModalOpen] = useState<boolean>(false)

  const handleServicePhaseModalOpen = () => {
    setServiceSowModalOpen(true)
  }
  const handleServicePhaseModalClose = () => {
    setServiceSowModalOpen(false)
    handlePhaseOnClear()
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

  const [phasePhaseList, setScopeOfWorkPhaseList] = useState<any[]>([])

  const phaseDefaultData = {
    phaseId: '',
    title: '',
    phases: [
      {
        title: '',
        serial: ''
      }
    ]
  }

  const [phaseFormData, setScopeOfWorkFormData] = useState<any>(phaseDefaultData)
  const [phaseEditId, setScopeOfWorkEditId] = useState<any>(null)

  const handleScopeOfWorkSelectChange = (e: SelectChangeEvent<any>) => {
    setScopeOfWorkFormData({
      ...phaseFormData,
      [e?.target?.name]: e?.target?.value
    })
  }

  const handleAddNewSow = () => {
    const phases = [...phaseFormData.phases]
    phases.push({
      title: '',
      order: ''
    })
    setScopeOfWorkFormData(() => ({ ...phaseFormData, phases }))
  }

  const handleRemoveSow = (index: number) => {
    const phases = [...phaseFormData.phases]
    phases.splice(index, 1)
    setScopeOfWorkFormData(() => ({ ...phaseFormData, phases }))
  }

  const handleScopeOfWorkMultipleInputChange = (event: any, index: number) => {
    const { name, value } = event.target
    const phases = [...phaseFormData.phases]
    phases[index][name] = value
    setScopeOfWorkFormData(() => ({ ...phaseFormData, phases }))
  }

  const handleScopeOfWorkInputChange = (event: any) => {
    const { name, value } = event.target
    const phases = phaseFormData
    phases[name] = value
    setScopeOfWorkFormData(() => ({ ...phaseFormData, ...phases }))
  }

  const handlePhaseOnClear = () => {
    setScopeOfWorkFormData(phaseDefaultData)
    setScopeOfWorkEditId(null)
  }

  const handlePhaseOnEdit = (data: any) => {
    const { id, title, serial } = data
    setScopeOfWorkEditId(id)
    setScopeOfWorkFormData({
      title
    })
    handleServicePhaseModalOpen()
  }

  const handlePhaseSaveOnClick = () => {
    setPreload(true)
    if (phaseEditId) {
      apiRequest
        .post(`/scope-of-work/${phaseEditId}`, { ...phaseFormData })
        .then(res => {
          setScopeOfWorkData((prevState: any[]) => [
            ...prevState.map((sow: any) => {
              if (sow?.id === phaseEditId) return res.data

              return sow
            })
          ])

          setPreload(false)
          enqueueSnackbar('Updatedf Successfully!', { variant: 'success' })
          handleServicePhaseModalClose()
        })
        .catch(error => {
          setPreload(false)
          setErrorMessage(error?.response?.data?.errors)
          enqueueSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
        })
    } else {
      apiRequest
        .post('/scope-of-work/add-multi', { ...phaseFormData, problemGoalId: problemGoalID })
        .then(res => {
          setScopeOfWorkData((prevState: any[]) => [...res?.data, ...prevState])
          setSelectedScopeOfWorkData((prevState: any[]) => [...res?.data.map((sow: any) => sow?.id), ...prevState])

          setPreload(false)
          enqueueSnackbar('Created Successfully!', { variant: 'success' })
          handleServicePhaseModalClose()
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
    <ProjectSOWPhaseFormView
      phaseData={phaseData}
      selectedScopeOfWorkData={selectedScopeOfWorkData}
      handleServicePhaseModalOpen={handleServicePhaseModalOpen}
      handleScopeOfWorkCheckbox={handleScopeOfWorkCheckbox}
      handlePhaseOnEdit={handlePhaseOnEdit}
      serviceGroupByProjectTypeId={serviceGroupByProjectTypeId}
      selectedAdditionalServiceData={selectedAdditionalServiceData}
      handleAdditionalServiceSelection={handleAdditionalServiceSelection}
      serviceList={serviceList}
      servicePhaseModalOpen={servicePhaseModalOpen}
      handleServicePhaseModalClose={handleServicePhaseModalClose}
      errorMessage={errorMessage}
      phaseEditId={phaseEditId}
      phaseFormData={phaseFormData}
      handleScopeOfWorkInputChange={handleScopeOfWorkInputChange}
      handlePhaseSaveOnClick={handlePhaseSaveOnClick}
      handleScopeOfWorkSelectChange={handleScopeOfWorkSelectChange}
      handleAddNewSow={handleAddNewSow}
      phasePhaseList={phasePhaseList}
      handleScopeOfWorkMultipleInputChange={handleScopeOfWorkMultipleInputChange}
      handleRemoveSow={handleRemoveSow}
      handlePhaseOnClear={handlePhaseOnClear}
    ></ProjectSOWPhaseFormView>
  )
}
