import AddIcon from '@material-ui/icons/Add'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import EditNoteIcon from '@mui/icons-material/EditNote'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove'
import {
  Box,
  Chip,
  Paper,
  SelectChangeEvent,
  Step,
  StepButton,
  Stepper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material'
import { useMask } from '@react-input/mask'
import { ExposeParam, MdEditor } from 'md-editor-rt'
import 'md-editor-rt/lib/style.css'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { Dropdown } from 'src/@core/components/dropdown'
import MdPreviewTitle from 'src/@core/components/md-preview-title'
import Preloader from 'src/@core/components/preloader'
import apiRequest from 'src/@core/utils/axios-config'
import { TProjectSOWFormComponent } from '../ProjectSOW.decorator'

const steps = [
  'Transcript',
  'Summery',
  'Problems & Goals',
  'Project Overview',
  'SOW',
  'Service Deliverables',
  'Deliverables'
]

export default function ProjectSOWFormComponent(props: TProjectSOWFormComponent) {
  const router = useRouter()
  const id = router?.query['id']
  const step = router?.query?.['step']
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const { listData, setListData, isEdit = false } = props

  const phoneInputRef = useMask({
    mask: '(___) ___-____',
    replacement: { _: /\d/ },
    showMask: true,
    separate: true
  })

  const projectSOWDefaultData = {
    transcriptId: '',
    transcriptText: '',
    projectTypeId: '',
    projectName: '',
    company: '',
    clientPhone: '',
    clientEmail: '',
    clientWebsite: '',
    summaryText: ''
  }

  const [activeStep, setActiveStep] = useState(0)
  const [enabledStep, setEnabledStep] = useState(0)
  const [completed, setCompleted] = useState<{
    [k: number]: boolean
  }>({})

  const summaryTextEditorRef = useRef<ExposeParam>()
  const problemGoalTextEditorRef = useRef<ExposeParam>()
  const overviewTextEditorRef = useRef<ExposeParam>()
  const scopeTextEditorRef = useRef<ExposeParam>()
  const deliverablesTextEditorRef = useRef<ExposeParam>()

  const [projectSOWFormData, setProjectSOWFormData] = useState(projectSOWDefaultData)

  const [preload, setPreload] = useState<boolean>(false)
  const [transcriptTextRows, setTranscriptTextRows] = useState<number>(10)
  const [projectSOWID, setProjectSOWID] = useState<any>(null)
  const [summaryText, setSummaryText] = useState<any>('')
  const [problemGoalID, setProblemGoalID] = useState<any>(null)
  const [problemGoalText, setProblemGoalText] = useState<any>('')
  const [overviewTextID, setOverviewTextID] = useState<any>(null)
  const [overviewText, setOverviewText] = useState<any>('')
  const [scopeTextID, setScopeTextID] = useState<any>(null)
  const [scopeText, setScopeText] = useState<any>('')

  const [serviceTreeData, setServiceTreeData] = useState<any>([])

  type TServiceDeliverablesForm = {
    teamMember: string
    hours: number
    timeline: string
    internal: string
    retail: string
    josh: string
  }
  const serviceDeliverablesFormDefaultData = {
    teamMember: '',
    hours: 0,
    timeline: '',
    internal: '',
    retail: '',
    josh: ''
  }
  const [serviceDeliverablesFormData, setServiceDeliverablesFormData] = useState<any>({})

  const [deliverablesTextID, setDeliverablesTextID] = useState<any>(null)
  const [deliverablesText, setDeliverablesText] = useState<any>('')

  const [errorMessage, setErrorMessage] = useState<any>({})

  interface ITaskHours {
    [key: string]: {
      hours: number
    }
  }
  function countTotalTaskHours(taskHours: ITaskHours = {}): number {
    let totalHours = 0

    for (const key in taskHours) {
      if (taskHours.hasOwnProperty(key)) {
        totalHours += taskHours[key].hours
      }
    }

    return totalHours
  }

  interface IDeliverableHours {
    [key: string]: {
      [key: string]: {
        hours: number
      }
    }
  }

  function countTotalDeliverableHours(deliverableHours: IDeliverableHours = {}) {
    let totalHours = 0

    for (const key1 in deliverableHours) {
      for (const key2 in deliverableHours[key1]) {
        totalHours += deliverableHours[key1][key2].hours
      }
    }

    return totalHours
  }

  const handleTaskTextChange = (
    value = '',
    field = '',
    serviceId = '',
    groupId = '',
    sowId = '',
    deliverableId = '',
    taskId = '',
    subTaskId = null
  ) => {
    const serviceDeliverables = { ...serviceDeliverablesFormData }

    if (
      serviceDeliverables &&
      serviceDeliverables[serviceId] &&
      serviceDeliverables[serviceId][groupId] &&
      serviceDeliverables[serviceId][groupId][sowId] &&
      serviceDeliverables[serviceId][groupId][sowId][deliverableId] &&
      serviceDeliverables[serviceId][groupId][sowId][deliverableId][taskId]
    ) {
      console.log(value)

      if (subTaskId) {
        serviceDeliverables[serviceId][groupId][sowId][deliverableId][taskId][subTaskId][field] = Number(value)
        console.log(serviceDeliverables[serviceId][groupId][sowId][deliverableId][taskId][subTaskId])
      } else {
        serviceDeliverables[serviceId][groupId][sowId][deliverableId][taskId][field] = Number(value)
      }
    }
    console.log(serviceDeliverables)

    setServiceDeliverablesFormData((prevState: any) => {
      return { ...prevState, ...serviceDeliverables }
    })
  }

  const handleProjectSOWChange = (e: SelectChangeEvent<any>) => {
    setProjectSOWFormData({
      ...projectSOWFormData,
      [e.target.name]: e.target.value
    })
  }

  const handleSelectChange = (e: SelectChangeEvent<any>) => {
    setProjectSOWFormData({
      ...projectSOWFormData,
      [e?.target?.name]: e?.target?.value
    })
  }
  const handleTranscriptTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setProjectSOWFormData({
      ...projectSOWFormData,
      transcriptText: e.target.value
    })
  }
  function calculateNumberOfRows(text: string) {
    const numberOfLines = text.split('\n').length
    setTranscriptTextRows(Math.max(5, numberOfLines))
  }

  const totalSteps = () => {
    return steps.length
  }

  const completedSteps = () => {
    return Object.keys(completed).length
  }

  const isLastStep = () => {
    return activeStep === totalSteps() - 1
  }

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps()
  }

  const handleNext = (type: 'SAVE' | 'NEXT' = 'NEXT') => {
    setPreload(true)
    setErrorMessage({})
    const newActiveStep =
      isLastStep() && !allStepsCompleted() ? steps.findIndex((step, i) => !(i in completed)) : activeStep + 1
    if (activeStep === 0) {
      if (projectSOWID) {
        apiRequest
          .put(`/project-summery/${projectSOWID}`, projectSOWFormData)
          .then(res => {
            setProjectSOWFormData({
              ...projectSOWFormData,
              ['transcriptId']: res?.data?.transcriptId
            })
            setProjectSOWID(res?.data?.id)
            setSummaryText(res?.data?.summaryText)

            // onClear()
            setTimeout(() => {
              if (type == 'NEXT') {
                setActiveStep(newActiveStep)
                if (enabledStep < newActiveStep) {
                  setEnabledStep(newActiveStep)
                }
              }

              setPreload(false)
            }, 1000)
          })
          .catch(error => {
            setPreload(false)
            setErrorMessage(error?.response?.data?.errors)
            enqueueSnackbar(error?.response?.data?.message, { variant: 'error' })
          })
      } else {
        apiRequest
          .post('/project-summery', projectSOWFormData)
          .then(res => {
            if (setListData) {
              setListData([])
            }
            apiRequest.get(`/project-summery?page=1`).then(res => {
              if (setListData) {
                setListData(res?.data)
              }
            })

            setProjectSOWFormData({
              ...projectSOWFormData,
              ['transcriptId']: res?.data?.transcriptId
            })
            setProjectSOWID(res?.data?.id)
            setSummaryText(res?.data?.summaryText)

            // onClear()
            setTimeout(() => {
              if (type == 'NEXT') {
                setActiveStep(newActiveStep)
                if (enabledStep < newActiveStep) {
                  setEnabledStep(newActiveStep)
                }
              }

              setPreload(false)
            }, 1000)
          })
          .catch(error => {
            setPreload(false)
            setErrorMessage(error?.response?.data?.errors)
            enqueueSnackbar(error?.response?.data?.message, { variant: 'error' })
          })
      }
    }
    if (activeStep === 1) {
      apiRequest
        .put(`/project-summery/${projectSOWID}`, { summaryText })
        .then(res => {
          if (res?.data?.meeting_transcript && type == 'NEXT') {
            apiRequest.post('/problems-and-goals', { transcriptId: res?.data?.meeting_transcript?.id }).then(res2 => {
              enqueueSnackbar('Created Successfully!', { variant: 'success' })

              setProblemGoalID(res2?.data?.id)
              setProblemGoalText(res2?.data?.problemGoalText)
              setTimeout(() => {
                setActiveStep(newActiveStep)
                if (enabledStep < newActiveStep) {
                  setEnabledStep(newActiveStep)
                }
                setPreload(false)
              }, 1000)
            })
          } else {
            setPreload(false)
          }
        })
        .catch(error => {
          setPreload(false)
          setErrorMessage(error?.response?.data?.errors)
          enqueueSnackbar(error?.response?.data?.message, { variant: 'error' })
        })
    }
    if (activeStep === 2) {
      apiRequest
        .post(`/problems-and-goals/${problemGoalID}`, { problemGoalText })
        .then(res => {
          console.log(res)
          if (res?.data && type == 'NEXT') {
            apiRequest.post('/project-overview', { problemGoalID }).then(res2 => {
              enqueueSnackbar('Created Successfully!', { variant: 'success' })
              setOverviewTextID(res2?.data?.id)
              setOverviewText(res2?.data?.overviewText)
              setTimeout(() => {
                if (type == 'NEXT') {
                  setActiveStep(newActiveStep)
                  if (enabledStep < newActiveStep) {
                    setEnabledStep(newActiveStep)
                  }
                }
                setPreload(false)
              }, 1000)
            })
          } else {
            setPreload(false)
          }
        })
        .catch(error => {
          setPreload(false)
          setErrorMessage(error?.response?.data?.errors)
          enqueueSnackbar(error?.response?.data?.message, { variant: 'error' })
        })
    }
    if (activeStep === 3) {
      apiRequest
        .post(`/project-overview/${overviewTextID}`, { overviewText })
        .then(res => {
          if (res?.data && type == 'NEXT') {
            apiRequest.post('/scope-of-work', { problemGoalID }).then(res2 => {
              enqueueSnackbar('Created Successfully!', { variant: 'success' })
              setScopeTextID(res2?.data?.id)
              setScopeText(res2?.data?.scopeText)
              setTimeout(() => {
                if (type == 'NEXT') {
                  setActiveStep(newActiveStep)
                  if (enabledStep < newActiveStep) {
                    setEnabledStep(newActiveStep)
                  }
                }
                setPreload(false)
              }, 1000)
            })
          } else {
            setPreload(false)
          }
        })
        .catch(error => {
          setPreload(false)
          setErrorMessage(error?.response?.data?.errors)
          enqueueSnackbar(error?.response?.data?.message, { variant: 'error' })
        })
    }

    if (activeStep === 4) {
      setTimeout(() => {
        if (type == 'NEXT') {
          setActiveStep(newActiveStep)
          if (enabledStep < newActiveStep) {
            setEnabledStep(newActiveStep)
          }
        }
        setPreload(false)
      }, 1000)
    }
    if (activeStep === 5) {
      apiRequest
        .post(`/deliverables/${deliverablesTextID}`, { deliverablesText })
        .then(res => {
          apiRequest.get(`/project-summery?page=1`).then(res => {
            if (setListData) {
              setListData(res?.data)
            }
          })

          enqueueSnackbar('Created Successfully!', { variant: 'success' })

          setTimeout(() => {
            if (type == 'NEXT') {
              setActiveStep(newActiveStep)
              if (enabledStep < newActiveStep) {
                setEnabledStep(newActiveStep)
              }
            }
            setPreload(false)
          }, 1000)
        })
        .catch(error => {
          setPreload(false)
          setErrorMessage(error?.response?.data?.errors)
          enqueueSnackbar(error?.response?.data?.message, { variant: 'error' })
        })
    }
    if (activeStep === 6) {
      apiRequest
        .post(`/deliverables/${deliverablesTextID}`, { deliverablesText })
        .then(res => {
          apiRequest.get(`/project-summery?page=1`).then(res => {
            if (setListData) {
              setListData(res?.data)
            }
          })

          enqueueSnackbar('Created Successfully!', { variant: 'success' })

          setTimeout(() => {
            setActiveStep(0)
            setPreload(false)

            // setListData(res)
          }, 1000)
        })
        .catch(error => {
          setPreload(false)
          setErrorMessage(error?.response?.data?.errors)
          enqueueSnackbar(error?.response?.data?.message, { variant: 'error' })
        })
    }
  }

  const handleStep = (step: number) => () => {
    setActiveStep(step)
  }

  const getDetails = (id: string | null | undefined) => {
    if (!id) return
    let getEnableStep = 0

    setPreload(true)
    apiRequest.get(`/project-summery/${id}`).then((res: any) => {
      setProjectSOWFormData({
        transcriptId: res?.data?.id,
        transcriptText: res?.data?.['meeting_transcript']?.['transcriptText'],
        projectTypeId: res?.data?.['meeting_transcript']?.['projectTypeId'],
        projectName: res?.data?.['meeting_transcript']?.['projectName'],
        company: res?.data?.['meeting_transcript']?.['company'],
        clientEmail: res?.data?.['meeting_transcript']?.['clientEmail'],
        clientPhone: res?.data?.['meeting_transcript']?.['clientPhone'],
        clientWebsite: res?.data?.['meeting_transcript']?.['clientWebsite'],
        summaryText: res?.data?.['summaryText']
      })
      setProjectSOWID(id)
      setSummaryText(res?.data?.['summaryText'])
      getEnableStep = 1
      if (res?.data?.['meeting_transcript']?.['problems_and_goals']?.['id']) {
        setProblemGoalID(res?.data?.['meeting_transcript']?.['problems_and_goals']?.['id'])
        setProblemGoalText(res?.data?.['meeting_transcript']?.['problems_and_goals']?.['problemGoalText'])
        getEnableStep = 2
      }

      if (res?.data?.['meeting_transcript']?.['problems_and_goals']?.['project_overview']?.['id']) {
        setOverviewTextID(res?.data?.['meeting_transcript']?.['problems_and_goals']?.['project_overview']?.['id'])
        setOverviewText(
          res?.data?.['meeting_transcript']?.['problems_and_goals']?.['project_overview']?.['overviewText']
        )
        getEnableStep = 3
      }

      if (res?.data?.['meeting_transcript']?.['problems_and_goals']?.['scope_of_work']?.['id']) {
        setScopeTextID(res?.data?.['meeting_transcript']?.['problems_and_goals']?.['scope_of_work']?.['id'])
        setScopeText(res?.data?.['meeting_transcript']?.['problems_and_goals']?.['scope_of_work']?.['scopeText'])
        getEnableStep = 4
      }

      if (res?.data?.['meeting_transcript']?.['problems_and_goals']?.['scope_of_work']?.['deliverables']?.['id']) {
        setDeliverablesTextID(
          res?.data?.['meeting_transcript']?.['problems_and_goals']?.['scope_of_work']?.['deliverables']?.['id']
        )
        setDeliverablesText(
          res?.data?.['meeting_transcript']?.['problems_and_goals']?.['scope_of_work']?.['deliverables']?.[
            'deliverablesText'
          ]
        )
        getEnableStep = 5
      }
      setEnabledStep(getEnableStep)
      setPreload(false)
    })
  }

  const getTree = async () => {
    await apiRequest

      // .get(`/service-tree?per_page=500&projectTypeId=${projectSOWFormData.projectTypeId}`)
      .get(`/service-tree?per_page=500&projectTypeId=${4}`)
      .then(res => {
        setServiceTreeData(res?.data?.services)
        const transformServiceTree = res?.data?.services.map((service: any) => {
          const serviceObj = {
            [service.id]: Object.fromEntries(
              service?.groups?.map((group: any) => {
                const groupObj = Object.fromEntries(
                  group?.sows?.map((sow: any) => {
                    const sowObj = Object.fromEntries(
                      sow?.deliverables?.map((deliverable: any) => {
                        const deliverableObj = Object.fromEntries(
                          deliverable?.tasks?.map((task: any) => {
                            if (task?.sub_tasks?.length) {
                              const taskObj = Object.fromEntries(
                                (task?.sub_tasks || []).map((sub_task: any) => {
                                  return [
                                    [sub_task.id],
                                    {
                                      hours: null
                                    }
                                  ]
                                })
                              )

                              return [task.id, taskObj]
                            }

                            return {
                              hours: null
                            }
                          })
                        )

                        return [deliverable.id, deliverableObj]
                      })
                    )

                    return [sow.id, sowObj]
                  })
                )

                return [group.id, groupObj]
              })
            )
          }

          return serviceObj
        })[0]
        console.log(transformServiceTree)
        setServiceDeliverablesFormData(transformServiceTree)

        // setServiceDeliverablesFormData()
      })
      .catch(error => {
        enqueueSnackbar(error?.message, { variant: 'error' })
      })
  }

  useEffect(() => {
    onClear()
    setEnabledStep(0)
    setActiveStep(0)
  }, [])

  useEffect(() => {
    getDetails(id as string)
  }, [id])

  useEffect(() => {
    if (isEdit && step && Number(step) <= enabledStep) {
      setActiveStep(Number(step))
    }
  }, [enabledStep, isEdit, id, step])

  useEffect(() => {
    if (activeStep === 5) {
      getTree()
    }

    if (activeStep) {
      const currentPath = router.asPath.split('?')?.[0]
      const updatedPath = `${currentPath}?step=${activeStep}`
      router.replace(updatedPath)
    }
  }, [activeStep])

  const onClear = () => {
    setProjectSOWFormData(prevState => ({ ...projectSOWDefaultData }))

    setProjectSOWID(null)
    setSummaryText('')

    setProblemGoalID(null)
    setProblemGoalText('')

    setOverviewTextID(null)
    setOverviewText('')

    setScopeTextID(null)
    setScopeText('')

    setDeliverablesTextID(null)
    setDeliverablesText('')

    setActiveStep(0)
    setEnabledStep(0)
  }

  return (
    <Box>
      {!!preload && <Preloader close={!preload} />}
      <Box sx={{ width: '100%' }}>
        <Stepper nonLinear activeStep={activeStep}>
          {steps.map((label, index) => (
            <Step key={label} completed={completed[index]}>
              <StepButton color='inherit' onClick={handleStep(index)} disabled={enabledStep < index}>
                {label}
              </StepButton>
            </Step>
          ))}
        </Stepper>
        <Box sx={{ position: 'relative' }}>
          <React.Fragment>
            <Box sx={{ mt: 10, p: 10, border: '2px solid #7e3af2', borderRadius: 2 }}>
              {activeStep == 0 && (
                <Box>
                  <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
                    <Box sx={{ width: '100%' }}>
                      <label className='block text-sm'>
                        <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Transcript Text</span>
                        <textarea
                          className={`block w-full mt-1 text-sm dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input ${
                            errorMessage?.['transcriptText'] ? 'border-red-600' : 'dark:border-gray-600 '
                          }`}
                          placeholder='Enter Transcript Text'
                          name='transcriptText'
                          value={projectSOWFormData.transcriptText}
                          onChange={handleTranscriptTextChange}
                          rows={10}

                          // rows={transcriptTextRows}
                        />
                        {!!errorMessage?.['transcriptText'] &&
                          errorMessage?.['transcriptText']?.map((message: any, index: number) => {
                            return (
                              <span key={index} className='text-xs text-red-600 dark:text-red-400'>
                                {message}
                              </span>
                            )
                          })}
                      </label>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
                    <Box sx={{ width: '50%' }}>
                      <label className='block text-sm'>
                        <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Project Type</span>
                        <Dropdown
                          url={'project-type'}
                          name='projectTypeId'
                          value={projectSOWFormData.projectTypeId}
                          onChange={handleSelectChange}
                        />
                        {!!errorMessage?.['projectTypeId'] &&
                          errorMessage?.['projectTypeId']?.map((message: any, index: number) => {
                            return (
                              <span key={index} className='text-xs text-red-600 dark:text-red-400'>
                                {message}
                              </span>
                            )
                          })}
                      </label>
                    </Box>
                    {/* <Box sx={{ width: '50%' }}>
                      <label className='block text-sm'>
                        <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Project Type</span>
                        <Dropdown
                          url={'project-type'}
                          name='projectTypeId'
                          value={projectSOWFormData.projectTypeId}
                          onChange={handleSelectChange}
                          
                        />
                        {!!errorMessage?.['projectTypeId'] &&
                          errorMessage?.['projectTypeId']?.map((message: any, index: number) => {
                            return (
                              <span key={index} className='text-xs text-red-600 dark:text-red-400'>
                                {message}
                              </span>
                            )
                          })}
                      </label>
                    </Box> */}

                    <Box sx={{ width: '50%' }}>
                      <label className='block text-sm'>
                        <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Project Name</span>
                        <input
                          className={`block w-full mt-1 text-sm dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input ${
                            errorMessage?.['projectName'] ? 'border-red-600' : 'dark:border-gray-600 '
                          }`}
                          placeholder='Enter Project Name'
                          name='projectName'
                          value={projectSOWFormData.projectName}
                          onChange={handleProjectSOWChange}
                        />
                        {!!errorMessage?.['projectName'] &&
                          errorMessage?.['projectName']?.map((message: any, index: number) => {
                            return (
                              <span key={index} className='text-xs text-red-600 dark:text-red-400'>
                                {message}
                              </span>
                            )
                          })}
                      </label>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
                    <Box sx={{ width: '50%' }}>
                      <label className='block text-sm'>
                        <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Company</span>
                        <input
                          className={`block w-full mt-1 text-sm dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input ${
                            errorMessage?.['projectName'] ? 'border-red-600' : 'dark:border-gray-600 '
                          }`}
                          placeholder='Enter Company'
                          name='company'
                          value={projectSOWFormData.company}
                          onChange={handleProjectSOWChange}
                        />
                        {!!errorMessage?.['company'] &&
                          errorMessage?.['company']?.map((message: any, index: number) => {
                            return (
                              <span key={index} className='text-xs text-red-600 dark:text-red-400'>
                                {message}
                              </span>
                            )
                          })}
                      </label>
                    </Box>
                    <Box sx={{ width: '50%' }}>
                      <label className='block text-sm'>
                        <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Phone</span>
                        <input
                          className={`block w-full mt-1 text-sm dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input ${
                            errorMessage?.['clientPhone'] ? 'border-red-600' : 'dark:border-gray-600 '
                          }`}
                          placeholder='Enter Phone Number'
                          name='clientPhone'
                          value={projectSOWFormData.clientPhone}
                          onChange={handleProjectSOWChange}
                          type='tel'
                        />
                        {!!errorMessage?.['clientPhone'] &&
                          errorMessage?.['clientPhone']?.map((message: any, index: number) => {
                            return (
                              <span key={index} className='text-xs text-red-600 dark:text-red-400'>
                                {message}
                              </span>
                            )
                          })}
                      </label>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
                    <Box sx={{ width: '50%' }}>
                      <label className='block text-sm'>
                        <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Email</span>
                        <input
                          className={`block w-full mt-1 text-sm dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input ${
                            errorMessage?.['clientEmail'] ? 'border-red-600' : 'dark:border-gray-600 '
                          }`}
                          placeholder='Enter Email'
                          name='clientEmail'
                          value={projectSOWFormData.clientEmail}
                          onChange={handleProjectSOWChange}
                        />
                        {!!errorMessage?.['clientEmail'] &&
                          errorMessage?.['clientEmail']?.map((message: any, index: number) => {
                            return (
                              <span key={index} className='text-xs text-red-600 dark:text-red-400'>
                                {message}
                              </span>
                            )
                          })}
                      </label>
                    </Box>
                    <Box sx={{ width: '50%' }}>
                      <label className='block text-sm'>
                        <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Website</span>
                        <input
                          className={`block w-full mt-1 text-sm dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input ${
                            errorMessage?.['clientWebsite'] ? 'border-red-600' : 'dark:border-gray-600 '
                          }`}
                          placeholder='Enter Website'
                          name='clientWebsite'
                          value={projectSOWFormData.clientWebsite}
                          onChange={handleProjectSOWChange}
                        />
                        {!!errorMessage?.['clientWebsite'] &&
                          errorMessage?.['clientWebsite']?.map((message: any, index: number) => {
                            return (
                              <span key={index} className='text-xs text-red-600 dark:text-red-400'>
                                {message}
                              </span>
                            )
                          })}
                      </label>
                    </Box>
                  </Box>
                </Box>
              )}
              {activeStep == 1 && (
                <Box>
                  <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
                    <Box sx={{ width: '100%' }}>
                      <label className='block text-sm' htmlFor={'#summaryText'}>
                        <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Summary Text</span>
                        <Box
                          sx={{
                            position: 'relative'
                          }}
                        >
                          <MdPreviewTitle />
                          <MdEditor
                            language='en-US'
                            ref={summaryTextEditorRef}
                            modelValue={summaryText}
                            onChange={setSummaryText}
                          />
                        </Box>

                        {!!errorMessage?.['summaryText'] &&
                          errorMessage?.['summaryText']?.map((message: any, index: number) => {
                            return (
                              <span key={index} className='text-xs text-red-600 dark:text-red-400'>
                                {message}
                              </span>
                            )
                          })}
                      </label>
                    </Box>
                  </Box>
                </Box>
              )}
              {activeStep == 2 && (
                <Box>
                  <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
                    <Box sx={{ width: '100%' }}>
                      <label className='block text-sm' htmlFor={'#problemGoalText'}>
                        <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Problem Goal Text</span>

                        <Box
                          sx={{
                            position: 'relative'
                          }}
                        >
                          <MdPreviewTitle />
                          <MdEditor
                            language='en-US'
                            ref={problemGoalTextEditorRef}
                            modelValue={problemGoalText}
                            onChange={setProblemGoalText}
                          />
                        </Box>
                        {!!errorMessage?.['problemGoalText'] &&
                          errorMessage?.['problemGoalText']?.map((message: any, index: number) => {
                            return (
                              <span key={index} className='text-xs text-red-600 dark:text-red-400'>
                                {message}
                              </span>
                            )
                          })}
                      </label>
                    </Box>
                  </Box>
                </Box>
              )}
              {activeStep == 3 && (
                <Box>
                  <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
                    <Box sx={{ width: '100%' }}>
                      <label className='block text-sm' htmlFor={'#problemGoalText'}>
                        <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Overview Text</span>
                        <Box
                          sx={{
                            position: 'relative'
                          }}
                        >
                          <MdPreviewTitle />
                          <MdEditor
                            language='en-US'
                            ref={overviewTextEditorRef}
                            modelValue={overviewText}
                            onChange={setOverviewText}
                          />
                        </Box>
                        {!!errorMessage?.['overviewText'] &&
                          errorMessage?.['overviewText']?.map((message: any, index: number) => {
                            return (
                              <span key={index} className='text-xs text-red-600 dark:text-red-400'>
                                {message}
                              </span>
                            )
                          })}
                      </label>
                    </Box>
                  </Box>
                </Box>
              )}
              {activeStep == 4 && (
                <Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5, mb: 5 }}>
                    <Box sx={{ width: '100%' }}>
                      <label className='block text-sm' htmlFor={'#problemGoalText'}>
                        <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Scope of Work</span>
                        <Box
                          sx={{
                            position: 'relative'
                          }}
                        >
                          <MdPreviewTitle />
                          <MdEditor
                            language='en-US'
                            ref={scopeTextEditorRef}
                            modelValue={scopeText}
                            onChange={setScopeText}
                          />
                        </Box>
                        {!!errorMessage?.['scopeText'] &&
                          errorMessage?.['scopeText']?.map((message: any, index: number) => {
                            return (
                              <span key={index} className='text-xs text-red-600 dark:text-red-400'>
                                {message}
                              </span>
                            )
                          })}
                      </label>
                    </Box>
                  </Box>
                </Box>
              )}
              {activeStep == 5 && (
                <Box>
                  <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
                    <Box sx={{ width: '100%' }}>
                      <TableContainer component={Paper}>
                        <Table aria-label='table'>
                          <TableHead>
                            <TableRow>
                              <TableCell />
                              <TableCell>Deliverable & Timeline</TableCell>
                              <TableCell>Team Member</TableCell>
                              <TableCell>Hours</TableCell>
                              <TableCell>Timeline</TableCell>
                              <TableCell>Internal</TableCell>
                              <TableCell>Retail</TableCell>
                              <TableCell>Josh</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {serviceTreeData?.map((service: any, index: number) => {
                              return (
                                <>
                                  <TableRow key={`service-${service.id}`}>
                                    <TableCell sx={{ width: '70px' }}>
                                      <Chip
                                        label='Service'
                                        sx={{ width: '100%', px: 2, background: '#0a53a8', color: '#fff' }}
                                      />
                                    </TableCell>
                                    <TableCell
                                      component='th'
                                      scope='row'
                                      dangerouslySetInnerHTML={{ __html: service.name }}
                                      sx={{ width: '400px' }}
                                    />
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                  </TableRow>
                                  {service.groups.map((group: any) => (
                                    <>
                                      <TableRow key={`group-${group.id}`}>
                                        <TableCell sx={{ width: '70px' }}>
                                          <Chip
                                            label='Group'
                                            sx={{ width: '100%', px: 2, background: '#bfe1f6', color: '#000' }}
                                          />
                                        </TableCell>
                                        <TableCell
                                          component='th'
                                          scope='row'
                                          dangerouslySetInnerHTML={{ __html: group.name }}
                                          sx={{ width: '400px' }}
                                        />
                                        <TableCell></TableCell>
                                        <TableCell></TableCell>
                                        <TableCell></TableCell>
                                        <TableCell></TableCell>
                                        <TableCell></TableCell>
                                        <TableCell></TableCell>
                                      </TableRow>
                                      {group.sows.map((sow: any) => (
                                        <>
                                          <TableRow key={`sow-${sow.id}`}>
                                            <TableCell sx={{ width: '70px' }}>
                                              <Chip
                                                label='SOW'
                                                sx={{ width: '100%', px: 2, background: '#215a6c', color: '#fff' }}
                                              />
                                            </TableCell>
                                            <TableCell
                                              component='th'
                                              scope='row'
                                              dangerouslySetInnerHTML={{ __html: sow.name }}
                                              sx={{ width: '400px' }}
                                            />
                                            <TableCell></TableCell>
                                            <TableCell></TableCell>
                                            <TableCell></TableCell>
                                            <TableCell></TableCell>
                                            <TableCell></TableCell>
                                            <TableCell></TableCell>
                                          </TableRow>
                                          {sow.deliverables.map((deliverable: any) => (
                                            <>
                                              <TableRow key={`deliverable-${deliverable.id}`}>
                                                <TableCell sx={{ width: '70px' }}>
                                                  <Chip
                                                    label='Deliverable'
                                                    sx={{ width: '100%', px: 2, background: '#c6dbe1', color: '#000' }}
                                                  />
                                                </TableCell>
                                                <TableCell
                                                  component='th'
                                                  scope='row'
                                                  dangerouslySetInnerHTML={{ __html: deliverable.name }}
                                                  sx={{ width: '400px' }}
                                                />
                                                <TableCell></TableCell>
                                                <TableCell align='center'>
                                                  {countTotalDeliverableHours(
                                                    serviceDeliverablesFormData?.[service.id]?.[group.id]?.[sow.id]?.[
                                                      deliverable.id
                                                    ]
                                                  )}
                                                </TableCell>
                                                <TableCell></TableCell>
                                                <TableCell></TableCell>
                                                <TableCell></TableCell>
                                                <TableCell></TableCell>
                                              </TableRow>
                                              {deliverable.tasks.map((task: any) => (
                                                <>
                                                  <TableRow key={`task-${task.id}`}>
                                                    <TableCell sx={{ width: '70px' }}>
                                                      <Chip
                                                        label='Task'
                                                        sx={{
                                                          width: '100%',
                                                          px: 2,
                                                          background: '#ffc8aa',
                                                          color: '#000'
                                                        }}
                                                      />
                                                    </TableCell>
                                                    <TableCell
                                                      component='th'
                                                      scope='row'
                                                      dangerouslySetInnerHTML={{ __html: task.name }}
                                                      sx={{ width: '400px' }}
                                                    />
                                                    {!task?.sub_tasks?.length ? (
                                                      <>
                                                        <TableCell>
                                                          <Dropdown url='' />
                                                        </TableCell>
                                                        <TableCell align='center'>
                                                          <input
                                                            className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input text-center'
                                                            type='number'
                                                            placeholder=''
                                                            name='hours'
                                                            value={
                                                              serviceDeliverablesFormData?.[service.id]?.[group.id]?.[
                                                                sow.id
                                                              ]?.[deliverable.id]?.[task.id]?.hours
                                                            }
                                                            onChange={e => {
                                                              handleTaskTextChange(
                                                                e.target.value,
                                                                'hours',
                                                                service.id,
                                                                group.id,
                                                                sow.id,
                                                                deliverable.id,
                                                                task.id
                                                              )
                                                            }}
                                                          />
                                                        </TableCell>
                                                        <TableCell>
                                                          <input
                                                            className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                                                            placeholder=''
                                                            name='name'
                                                          />
                                                        </TableCell>
                                                        <TableCell>
                                                          <input
                                                            className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                                                            placeholder=''
                                                            name='name'
                                                          />
                                                        </TableCell>
                                                        <TableCell>
                                                          <input
                                                            className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                                                            placeholder=''
                                                            name='name'
                                                          />
                                                        </TableCell>
                                                        <TableCell>
                                                          <input
                                                            className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                                                            placeholder=''
                                                            name='name'
                                                          />
                                                        </TableCell>
                                                      </>
                                                    ) : (
                                                      <>
                                                        <TableCell></TableCell>
                                                        <TableCell align='center'>
                                                          {/* {console.log(
                                                            serviceDeliverablesFormData?.[service.id]?.[group.id]?.[
                                                              sow.id
                                                            ]?.[deliverable.id]?.[task.id]?.reduce(
                                                              (total, sub_task) => total + Number(sub_task?.hours),
                                                              0
                                                            )
                                                          )} */}
                                                          {countTotalTaskHours(
                                                            serviceDeliverablesFormData?.[service.id]?.[group.id]?.[
                                                              sow.id
                                                            ]?.[deliverable.id]?.[task.id]
                                                          )}
                                                        </TableCell>
                                                        <TableCell></TableCell>
                                                        <TableCell></TableCell>
                                                        <TableCell></TableCell>
                                                        <TableCell></TableCell>
                                                      </>
                                                    )}
                                                  </TableRow>
                                                  {task.sub_tasks.map((subTask: any) => (
                                                    <TableRow key={`sub_task-${subTask.id}`}>
                                                      <TableCell sx={{ width: '70px' }}>
                                                        <Chip
                                                          label='Subtask'
                                                          sx={{
                                                            width: '100%',
                                                            px: 2,
                                                            background: '#ffe5a0',
                                                            color: '#000'
                                                          }}
                                                        />
                                                      </TableCell>
                                                      <TableCell
                                                        component='th'
                                                        scope='row'
                                                        dangerouslySetInnerHTML={{ __html: subTask.name }}
                                                        sx={{ width: '400px' }}
                                                      />
                                                      <TableCell>
                                                        <Dropdown url='' />
                                                      </TableCell>
                                                      <TableCell align='center'>
                                                        <input
                                                          className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input text-center'
                                                          type='number'
                                                          placeholder=''
                                                          name='hours'
                                                          value={
                                                            serviceDeliverablesFormData?.[service.id]?.[group.id]?.[
                                                              sow.id
                                                            ]?.[deliverable.id]?.[task.id]?.[subTask.id]?.hours
                                                          }
                                                          onChange={e => {
                                                            handleTaskTextChange(
                                                              e.target.value,
                                                              'hours',
                                                              service.id,
                                                              group.id,
                                                              sow.id,
                                                              deliverable.id,
                                                              task.id,
                                                              subTask.id
                                                            )
                                                          }}
                                                        />
                                                      </TableCell>
                                                      <TableCell>
                                                        <input
                                                          className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                                                          placeholder=''
                                                          name='name'
                                                        />
                                                      </TableCell>
                                                      <TableCell>
                                                        <input
                                                          className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                                                          placeholder=''
                                                          name='name'
                                                        />
                                                      </TableCell>
                                                      <TableCell>
                                                        <input
                                                          className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                                                          placeholder=''
                                                          name='name'
                                                        />
                                                      </TableCell>
                                                      <TableCell>
                                                        <input
                                                          className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                                                          placeholder=''
                                                          name='name'
                                                        />
                                                      </TableCell>
                                                    </TableRow>
                                                  ))}
                                                </>
                                              ))}
                                            </>
                                          ))}
                                        </>
                                      ))}
                                    </>
                                  ))}
                                </>
                              )
                            })}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  </Box>
                </Box>
              )}
              {activeStep == 6 && (
                <Box>
                  <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
                    <Box sx={{ width: '100%' }}>
                      <label className='block text-sm' htmlFor={'#deliverablesText'}>
                        <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Deliverable</span>
                        <Box
                          sx={{
                            position: 'relative'
                          }}
                        >
                          <MdPreviewTitle />
                          <MdEditor
                            language='en-US'
                            ref={deliverablesTextEditorRef}
                            modelValue={deliverablesText}
                            onChange={setDeliverablesText}
                          />
                        </Box>
                        {!!errorMessage?.['deliverablesText'] &&
                          errorMessage?.['deliverablesText']?.map((message: any, index: number) => {
                            return (
                              <span key={index} className='text-xs text-red-600 dark:text-red-400'>
                                {message}
                              </span>
                            )
                          })}
                      </label>
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Box sx={{ flex: '1 1 auto' }} />
              <Box className='my-4 text-right'>
                {!id && (
                  <button
                    onClick={onClear}
                    type='button'
                    className='px-4 py-2 mr-3 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-red-600 border border-transparent rounded-lg active:bg-red-600 hover:bg-red-700 focus:outline-none focus:shadow-outline-red'
                  >
                    Clear <PlaylistRemoveIcon />
                  </button>
                )}
                {activeStep != 0 && (
                  <button
                    onClick={() => {
                      handleNext('SAVE')
                    }}
                    className='mr-2 px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-green-600 border border-transparent rounded-lg active:bg-green-600 hover:bg-green-700 focus:outline-none focus:shadow-outline-green'
                  >
                    {activeStep != totalSteps() && (
                      <>
                        {id ? 'Update ' : 'Save '}

                        {id ? <EditNoteIcon /> : <AddIcon />}
                      </>
                    )}
                    {activeStep == totalSteps() && (
                      <>
                        Finish <CheckCircleIcon />
                      </>
                    )}
                  </button>
                )}
                {activeStep != totalSteps() && (
                  <button
                    onClick={() => {
                      handleNext()
                    }}
                    className='px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-green-600 border border-transparent rounded-lg active:bg-green-600 hover:bg-green-700 focus:outline-none focus:shadow-outline-green'
                  >
                    Next <NavigateNextIcon />
                  </button>
                )}
              </Box>
              {/* {activeStep !== steps.length &&
              (completed[activeStep] ? (
                <Typography variant='caption' sx={{ display: 'inline-block' }}>
                  Step {activeStep + 1} already completed
                </Typography>
              ) : (
                <Button onClick={handleComplete}>
                  {completedSteps() === totalSteps() - 1 ? 'Finish' : 'Complete Step'}
                </Button>
              ))} */}
            </Box>
          </React.Fragment>
        </Box>
      </Box>
    </Box>
  )
}
