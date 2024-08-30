import { SelectChangeEvent } from '@mui/material'
import 'md-editor-rt/lib/style.css'
import { useSnackbar } from 'notistack'
import { useCallback, useRef, useState } from 'react'
import apiRequest from 'src/@core/utils/axios-config'
import { debounce } from 'src/@core/utils/utils'
import { TProjectSOWPhaseFormComponentProps } from './ProjectSOWPhase.decorator'
import ProjectSOWPhaseFormView from './ProjectSOWPhase.view'

export default function ProjectSOWPhaseFormComponent(props: TProjectSOWPhaseFormComponentProps) {
  const { phaseData, setPhaseData, problemGoalID } = props

  const [preload, setPreload] = useState<boolean>(false)
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const [errorMessage, setErrorMessage] = useState<any>({})
  const [phaseDataList, setPhaseDataList] = useState<any[]>(phaseData?.sort((a: any, b: any) => a?.serial - b?.serial))
  const [servicePhaseModalOpen, setServiceSowModalOpen] = useState<boolean>(false)

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

  const slInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({})

  const handleServicePhaseModalOpen = () => {
    setServiceSowModalOpen(true)
  }
  const handleServicePhaseModalClose = () => {
    setServiceSowModalOpen(false)
    handlePhaseOnClear()
  }

  const handlePhaseCheckbox = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const { checked } = e.target

    // Update state and immediately access the updated state in the callback
    setPhaseDataList((prevState: any[]) => {
      const updatedList = prevState.map((phase: any) =>
        phase?.id === id ? { ...phase, isChecked: !!checked, isPreloading: true } : phase
      )

      // Make API request with the updated list
      apiRequest
        .post(`/phase-select/`, {
          problemGoalId: problemGoalID,
          phaseIds: updatedList.filter(phase => phase?.isChecked).map(phase => phase?.id)
        })
        .then(res => {
          console.log(res)
          enqueueSnackbar('Updated Successfully!', { variant: 'success' })
        })
        .catch(error => {
          enqueueSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
        })
        .finally(() => {
          setPhaseDataList(prevList =>
            prevList.map((phase: any) => (phase?.id === id ? { ...phase, isPreloading: false } : phase))
          )
        })

      return updatedList
    })
  }

  const debouncedSetPhaseSlOnChange = useCallback(
    debounce((sl: number, id: number) => {
      apiRequest
        .patch(`/phase/${id}/serial`, { serial: sl })
        .then(res => {
          enqueueSnackbar('Updated Successfully!', { variant: 'success' })
        })
        .catch(error => {
          enqueueSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
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
        slInputRefs.current[id]?.focus()
      }, 100)
    }

    debouncedSetPhaseSlOnChange(sl, id)
  }

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
          setPhaseDataList((prevState: any[]) => [
            ...prevState.map((phase: any) => {
              if (phase?.id === phaseEditId) return res.data

              return phase
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
          setPhaseDataList([...res?.data, ...phaseData])

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

  return (
    <ProjectSOWPhaseFormView
      phaseData={phaseDataList}
      handleServicePhaseModalOpen={handleServicePhaseModalOpen}
      handlePhaseCheckbox={handlePhaseCheckbox}
      handlePhaseOnEdit={handlePhaseOnEdit}
      servicePhaseModalOpen={servicePhaseModalOpen}
      handleServicePhaseModalClose={handleServicePhaseModalClose}
      errorMessage={errorMessage}
      phaseEditId={phaseEditId}
      phaseFormData={phaseFormData}
      handlePhaseInputChange={handlePhaseInputChange}
      handlePhaseSaveOnClick={handlePhaseSaveOnClick}
      handlePhaseSelectChange={handlePhaseSelectChange}
      handleAddNewSow={handleAddNewSow}
      handlePhaseMultipleInputChange={handlePhaseMultipleInputChange}
      handleRemoveSow={handleRemoveSow}
      handlePhaseSlOnChange={handlePhaseSlOnChange}
      handlePhaseOnClear={handlePhaseOnClear}
      slInputRefs={slInputRefs}
    ></ProjectSOWPhaseFormView>
  )
}
