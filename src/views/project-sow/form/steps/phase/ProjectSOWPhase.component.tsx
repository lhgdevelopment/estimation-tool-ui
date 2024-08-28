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
    setPhaseData,
    problemGoalID,
    selectedPhaseData,
    setSelectedPhaseData,
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
  const handlePhaseCheckbox: any = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked, value } = e.target
    setSelectedPhaseData((prevState: any) => {
      if (checked) {
        return [...prevState, Number(value)]
      } else {
        return prevState.filter((item: any) => item !== Number(value))
      }
    })
  }

  const [phasePhaseList, setPhasePhaseList] = useState<any[]>([])

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

  const handlePhaseSelectChange = (e: SelectChangeEvent<any>) => {
    setPhaseFormData({
      ...phaseFormData,
      [e?.target?.name]: e?.target?.value
    })
  }

  const handleAddNewSow = () => {
    const phases = [...phaseFormData.phases]
    phases.push({
      title: '',
      serial: ''
    })
    setPhaseFormData(() => ({ ...phaseFormData, phases }))
  }

  const handleRemoveSow = (index: number) => {
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
          setPhaseData((prevState: any[]) => [
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
        .post('/phase/add-multi', { ...phaseFormData, problemGoalId: problemGoalID })
        .then(res => {
          setPhaseData((prevState: any[]) => [...res?.data, ...prevState])
          setSelectedPhaseData((prevState: any[]) => [...res?.data.map((sow: any) => sow?.id), ...prevState])

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

  const getPhasePhaseList = async () => {
    if (serviceId) {
      await apiRequest
        .get(`/service-groups?serviceId=${serviceId}`)
        .then(res => {
          setPhasePhaseList(res?.data)
        })
        .catch(error => {
          enqueueSnackbar(error?.message, { variant: 'error' })
        })
    }
  }

  useEffect(() => {
    getPhasePhaseList()
  }, [])

  return (
    <ProjectSOWPhaseFormView
      phaseData={phaseData}
      selectedPhaseData={selectedPhaseData}
      handleServicePhaseModalOpen={handleServicePhaseModalOpen}
      handlePhaseCheckbox={handlePhaseCheckbox}
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
      handlePhaseInputChange={handlePhaseInputChange}
      handlePhaseSaveOnClick={handlePhaseSaveOnClick}
      handlePhaseSelectChange={handlePhaseSelectChange}
      handleAddNewSow={handleAddNewSow}
      phasePhaseList={phasePhaseList}
      handlePhaseMultipleInputChange={handlePhaseMultipleInputChange}
      handleRemoveSow={handleRemoveSow}
      handlePhaseOnClear={handlePhaseOnClear}
    ></ProjectSOWPhaseFormView>
  )
}
