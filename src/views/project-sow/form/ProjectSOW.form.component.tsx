import AddIcon from '@material-ui/icons/Add'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import DeleteIcon from '@mui/icons-material/Delete'
import EditNoteIcon from '@mui/icons-material/EditNote'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove'
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Grid,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
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
  TableRow,
  TextField
} from '@mui/material'
import { useMask } from '@react-input/mask'
import 'md-editor-rt/lib/style.css'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import React, { useEffect, useState } from 'react'
import { Dropdown } from 'src/@core/components/dropdown'
import { MarkdownEditor } from 'src/@core/components/markdown-editor'
import Preloader from 'src/@core/components/preloader'
import apiRequest from 'src/@core/utils/axios-config'
import { getShortStringNumber } from 'src/@core/utils/utils'
import {
  TProjectSOWFormComponent,
  transcriptMeetingLinkAddButtonSx,
  transcriptSectionTitleSx
} from '../ProjectSOW.decorator'

const steps = [
  'Transcript',
  'Summary',
  'Problems & Goals',
  'Overview',
  'SOW',
  'Deliverables',
  'Team Review',
  'Estimation',
  'Review',
  'Approval'
]
function not(a: any[], b: any[]) {
  return a.filter(value => b.indexOf(value) === -1)
}

function intersection(a: any[], b: any[]) {
  return a.filter(value => b.indexOf(value) !== -1)
}

export default function ProjectSOWFormComponent(props: TProjectSOWFormComponent) {
  const router = useRouter()
  const id = router?.query['id']
  const step = router?.query?.['step']
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const { listData, setListData, isEdit = false } = props
  const [serviceDeliverablesChecked, setServiceDeliverablesChecked] = React.useState<any[]>([])
  const [serviceDeliverableLeftList, setServiceDeliverableLeftList] = React.useState<any[]>([])
  const [serviceDeliverableRightList, setServiceDeliverableRightList] = React.useState<any[]>([])

  const phoneInputRef = useMask({
    mask: '(___) ___-____',
    replacement: { _: /\d/ },
    showMask: true,
    separate: true
  })

  const projectSOWDefaultData = {
    transcriptId: '',
    serviceId: null,
    projectName: '',
    company: '',
    clientPhone: '',
    clientEmail: '',
    clientWebsite: '',
    summaryText: '',
    meetingLinks: ['']
  }

  const [activeStep, setActiveStep] = useState(0)
  const [enabledStep, setEnabledStep] = useState(0)
  const [completed, setCompleted] = useState<{
    [k: number]: boolean
  }>({})

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
  const [projectTypeList, setProjectTypeList] = useState<any>([])
  const [serviceList, setServiceList] = useState<any>([])
  const [transcriptMeetingLinks, setTranscriptMeetingLinks] = useState<string[]>([''])

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
      if (subTaskId) {
        serviceDeliverables[serviceId][groupId][sowId][deliverableId][taskId][subTaskId][field] = Number(value)
      } else {
        serviceDeliverables[serviceId][groupId][sowId][deliverableId][taskId][field] = Number(value)
      }
    }

    setServiceDeliverablesFormData((prevState: any) => {
      return { ...prevState, ...serviceDeliverables }
    })
  }

  const handleProjectSOWChange = (e: any) => {
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
  // const handleTranscriptTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
  //   setProjectSOWFormData({
  //     ...projectSOWFormData,
  //     transcriptText: e.target.value
  //   })
  // }
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
      projectSOWFormData.meetingLinks = [...transcriptMeetingLinks]
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
            enqueueSnackbar(error?.response?.data?.message | 'Something went wrong!', { variant: 'error' })
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
            enqueueSnackbar(error?.response?.data?.message | 'Something went wrong!', { variant: 'error' })
          })
      }
    }
    if (activeStep === 1) {
      apiRequest
        .put(`/project-summery/${projectSOWID}`, { summaryText })
        .then(res => {
          if (res?.data?.meeting_transcript && type == 'NEXT') {
            apiRequest
              .post('/problems-and-goals', { transcriptId: res?.data?.meeting_transcript?.id })
              .then(res2 => {
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
              .catch(error => {
                setPreload(false)
                setErrorMessage(error?.response?.data?.errors)
                enqueueSnackbar(error?.response?.data?.message | 'Something went wrong!', { variant: 'error' })
              })
          } else {
            setPreload(false)
          }
        })
        .catch(error => {
          setPreload(false)
          setErrorMessage(error?.response?.data?.errors)
          enqueueSnackbar(error?.response?.data?.message | 'Something went wrong!', { variant: 'error' })
        })
    }
    if (activeStep === 2) {
      apiRequest
        .post(`/problems-and-goals/${problemGoalID}`, { problemGoalText })
        .then(res => {
          if (res?.data && type == 'NEXT') {
            apiRequest
              .post('/project-overview', {
                problemGoalID
              })
              .then(res2 => {
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
              .catch(error => {
                setPreload(false)
                setErrorMessage(error?.response?.data?.errors)
                enqueueSnackbar(error?.response?.data?.message | 'Something went wrong!', { variant: 'error' })
              })
          } else {
            setPreload(false)
          }
        })
        .catch(error => {
          setPreload(false)
          setErrorMessage(error?.response?.data?.errors)
          enqueueSnackbar(error?.response?.data?.message | 'Something went wrong!', { variant: 'error' })
        })
    }
    if (activeStep === 3) {
      apiRequest
        .post(`/project-overview/${overviewTextID}`, { overviewText })
        .then(res => {
          if (res?.data && type == 'NEXT') {
            apiRequest
              .post('/scope-of-work', { problemGoalID })
              .then(res2 => {
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
              .catch(error => {
                setPreload(false)
                setErrorMessage(error?.response?.data?.errors)
                enqueueSnackbar(error?.response?.data?.message | 'Something went wrong!', { variant: 'error' })
              })
          } else {
            setPreload(false)
          }
        })
        .catch(error => {
          setPreload(false)
          setErrorMessage(error?.response?.data?.errors)
          enqueueSnackbar(error?.response?.data?.message | 'Something went wrong!', { variant: 'error' })
        })
    }

    if (activeStep === 4) {
      apiRequest
        .post(`/scope-of-work/${scopeTextID}`, { scopeText })
        .then(res => {
          if (res?.data && type == 'NEXT') {
            apiRequest
              .post('/deliverables', { scopeOfWorkId: scopeTextID })
              .then(res2 => {
                enqueueSnackbar('Created Successfully!', { variant: 'success' })
                setDeliverablesTextID(res2?.data?.id)
                setDeliverablesText(res2?.data?.deliverablesText)
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
                enqueueSnackbar(error?.response?.data?.message | 'Something went wrong!', { variant: 'error' })
              })
          } else {
            setPreload(false)
          }
        })
        .catch(error => {
          setPreload(false)
          setErrorMessage(error?.response?.data?.errors)
          enqueueSnackbar(error?.response?.data?.message | 'Something went wrong!', { variant: 'error' })
        })
    }
    if (activeStep === 5) {
      apiRequest
        .post(`/deliverables/${deliverablesTextID}`, { deliverablesText })
        .then(res => {
          apiRequest
            .get(`/project-summery?page=1`)
            .then(res => {
              if (setListData) {
                setListData(res?.data)
              }
              enqueueSnackbar('Created Successfully!', { variant: 'success' })

              setTimeout(() => {
                setActiveStep(6)
                setPreload(false)

                // setListData(res)
              }, 1000)
            })
            .catch(error => {
              setPreload(false)
              setErrorMessage(error?.response?.data?.errors)
              enqueueSnackbar(error?.response?.data?.message | 'Something went wrong!', { variant: 'error' })
            })
        })
        .catch(error => {
          setPreload(false)
          setErrorMessage(error?.response?.data?.errors)
          enqueueSnackbar(error?.response?.data?.message | 'Something went wrong!', { variant: 'error' })
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
      const transcriptId = res?.data?.id || ''
      const transcriptText = res?.data?.['meeting_transcript']?.['transcriptText'] || ''
      const serviceId = res?.data?.['meeting_transcript']?.['serviceId'] || ''
      const projectName = res?.data?.['meeting_transcript']?.['projectName'] || ''
      const company = res?.data?.['meeting_transcript']?.['company'] || ''
      const clientEmail = res?.data?.['meeting_transcript']?.['clientEmail'] || ''
      const clientPhone = res?.data?.['meeting_transcript']?.['clientPhone'] || ''
      const clientWebsite = res?.data?.['meeting_transcript']?.['clientWebsite'] || ''
      const meetingLinks = res?.data?.['meeting_transcript']?.['meeting_links'].map(
        (meeting_link: any) => meeting_link?.meetingLink
      ) || ['']

      const summaryText = res?.data?.['summaryText'] || ''
      setTranscriptMeetingLinks(
        res?.data?.['meeting_transcript']?.['meeting_links'].map((meeting_link: any) => meeting_link?.meetingLink) || [
          ''
        ]
      )

      setProjectSOWFormData({
        transcriptId,
        serviceId,
        projectName,
        company,
        clientEmail,
        clientPhone,
        clientWebsite,
        meetingLinks,
        summaryText
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

  const getServiceTree = async () => {
    await apiRequest

      // .get(`/service-tree?per_page=500&serviceId=${projectSOWFormData.serviceId}`)
      .get(`/service-tree?per_page=500&serviceId=${4}`)
      .then(res => {
        setServiceTreeData(res?.data?.services)
        setServiceDeliverableLeftList(res?.data?.services?.[0]?.groups)
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
        setServiceDeliverablesFormData(transformServiceTree)

        // setServiceDeliverablesFormData()
      })
      .catch(error => {
        enqueueSnackbar(error?.message, { variant: 'error' })
      })
  }

  // const getProjectTypeList = async () => {
  //   await apiRequest
  //     .get(`/project-type?per_page=1000`)
  //     .then(res => {
  //       setProjectTypeList(res?.data)
  //     })
  //     .catch(error => {
  //       enqueueSnackbar(error?.message, { variant: 'error' })
  //     })
  // }

  const getServiceList = async () => {
    await apiRequest
      .get(`/services`)
      .then(res => {
        setServiceList(res?.data)
      })
      .catch(error => {
        enqueueSnackbar(error?.message, { variant: 'error' })
      })
  }

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

  const leftChecked: any = intersection(
    serviceDeliverablesChecked,
    serviceDeliverableLeftList.map(serviceDeliverable => serviceDeliverable.id)
  )

  const rightChecked: any = intersection(
    serviceDeliverablesChecked,
    serviceDeliverableRightList.map(serviceDeliverable => serviceDeliverable.id)
  )

  const handleCheckedLeftToRight = () => {
    const itemsToAdd = serviceDeliverableLeftList.filter(e => serviceDeliverablesChecked.indexOf(e.id) !== -1)
    setServiceDeliverableRightList(serviceDeliverableRightList.concat(itemsToAdd))
    setServiceDeliverableLeftList(
      serviceDeliverableLeftList.filter(e => serviceDeliverablesChecked.indexOf(e.id) === -1)
    )
    setServiceDeliverablesChecked([])
  }

  const handleCheckedRightToLeft = () => {
    const itemsToAdd = serviceDeliverableRightList.filter(e => serviceDeliverablesChecked.indexOf(e.id) !== -1)
    setServiceDeliverableLeftList(serviceDeliverableLeftList.concat(itemsToAdd))
    setServiceDeliverableRightList(
      serviceDeliverableRightList.filter(e => serviceDeliverablesChecked.indexOf(e.id) === -1)
    )
    setServiceDeliverablesChecked([])
  }

  const serviceTreeList = (items: any[], checkedItems: any[]) => (
    <Paper sx={{ width: '100%', height: '500px', overflow: 'auto' }}>
      <List dense component='div' role='list'>
        {items?.map((item: any) => {
          const labelId = `transfer-list-item-${item.id}-label`
          const handleCheckedToggle = (e: any) => {
            const currentIndex = serviceDeliverablesChecked.indexOf(item.id)
            const newChecked = [...serviceDeliverablesChecked]

            if (currentIndex === -1) {
              newChecked.push(item.id)
            } else {
              newChecked.splice(currentIndex, 1)
            }

            setServiceDeliverablesChecked(newChecked)
          }

          return (
            <ListItemButton key={item.id} role='listitem' onClick={handleCheckedToggle}>
              <ListItemIcon>
                <Checkbox
                  checked={checkedItems.indexOf(item.id) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    'aria-labelledby': labelId
                  }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={<div dangerouslySetInnerHTML={{ __html: item.name as string }} />} />
            </ListItemButton>
          )
        })}
      </List>
    </Paper>
  )

  const projectNameGenerate = () => {
    const projectType = serviceList?.filter((service: any) => service?.id === projectSOWFormData.serviceId)?.[0]?.[
      'project_type'
    ]

    const projectName = `${projectType?.projectTypePrefix ? projectType?.projectTypePrefix : ''} ${
      projectSOWFormData.company ?? projectSOWFormData.company
    } ${projectType?.name ? projectType?.name : ''}`
    if (projectName) {
      setProjectSOWFormData({
        ...projectSOWFormData,
        projectName: projectName
      })
    }
  }

  useEffect(() => {
    onClear()
    setEnabledStep(0)
    setActiveStep(0)
    getServiceList()
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
    if (activeStep === 5 || activeStep === 6) {
      getServiceTree()
    }

    if (activeStep) {
      const currentPath = router.asPath.split('?')?.[0]
      const updatedPath = `${currentPath}?step=${activeStep}`
      router.replace(updatedPath)
    }
  }, [activeStep])

  useEffect(() => {
    projectNameGenerate()
  }, [projectSOWFormData.company, projectSOWFormData.serviceId])

  return (
    <Box>
      {!!preload && <Preloader close={!preload} />}
      <Box sx={{ display: 'flex', width: '100%', mt: '50px', alignItems: 'flex-start' }}>
        <Box
          sx={{
            width: '250px',
            background: '#e1eff8',
            height: 'auto',
            padding: '30px 20px',
            borderRadius: '10px 0 0 10px'
          }}
        >
          <Stepper
            sx={{
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'start',
              '& .Mui-active.MuiStepLabel-iconContainer': {
                position: 'relative',
                padding: '0',
                color: '#fff',
                marginRight: '8px',
                '& .MuiStepIcon-text': {
                  display: 'none'
                },
                '&:after': {
                  content: '"✔"',
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  width: '100%',
                  height: '100%'
                }
              },
              '& .MuiStepLabel-label': {
                fontWeight: '500',
                '&.Mui-active': {
                  color: '#31A0F6'
                }
              }
            }}
            nonLinear
            activeStep={activeStep}
          >
            {steps.map((label, index) => (
              <Step key={label} completed={completed[index]} sx={{ mb: 3, width: '100%' }}>
                <StepButton
                  color='inherit'
                  sx={{ p: '5px', m: 0, justifyContent: 'flex-start' }}
                  onClick={handleStep(index)}
                  disabled={enabledStep < index}
                >
                  {label}
                </StepButton>
              </Step>
            ))}
          </Stepper>
        </Box>
        <Box
          sx={{
            width: 'calc( 100% - 250px )',
            position: 'relative',
            background: '#fff',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
          }}
        >
          <React.Fragment>
            <Box sx={{ p: 8, borderRadius: '0 10px 10px 0' }}>
              {activeStep == 0 && (
                <Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ ...transcriptSectionTitleSx, mt: 0 }}>Client Information</Box>
                    <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
                      <Box sx={{ width: '50%' }}>
                        <TextField
                          id='outlined-multiline-flexible'
                          label='Company Name'
                          className={`block w-full text-sm dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input ${
                            errorMessage?.['projectName'] ? 'border-red-600' : 'dark:border-gray-600 '
                          }`}
                          placeholder='Company Name'
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
                      </Box>
                      <Box sx={{ width: '50%' }}>
                        <TextField
                          id='outlined-multiline-flexible'
                          label='Phone'
                          className={`block w-full text-sm dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input ${
                            errorMessage?.['projectName'] ? 'border-red-600' : 'dark:border-gray-600 '
                          }`}
                          placeholder='(999) 555-1234'
                          name='clientPhone'
                          value={projectSOWFormData.clientPhone}
                          onChange={handleProjectSOWChange}
                          type='tel'
                        />
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
                      <Box sx={{ width: '50%' }}>
                        <TextField
                          id='outlined-multiline-flexible'
                          label='Website'
                          className={`block w-full text-sm dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input ${
                            errorMessage?.['projectName'] ? 'border-red-600' : 'dark:border-gray-600 '
                          }`}
                          placeholder='https://www.company-website.com'
                          name='clientWebsite'
                          value={projectSOWFormData.clientWebsite}
                          onChange={handleProjectSOWChange}
                        />
                      </Box>
                      <Box sx={{ width: '50%' }}>
                        <TextField
                          id='outlined-multiline-flexible'
                          label='Email'
                          className={`block w-full text-sm dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input ${
                            errorMessage?.['projectName'] ? 'border-red-600' : 'dark:border-gray-600 '
                          }`}
                          placeholder='name@company-name.com'
                          name='clientEmail'
                          value={projectSOWFormData.clientEmail}
                          onChange={handleProjectSOWChange}
                        />
                      </Box>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Box sx={transcriptSectionTitleSx}>Project Details</Box>
                    <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
                      <Box sx={{ width: '50%' }}>
                        <Dropdown
                          label={'Services'}
                          url={'services'}
                          name='serviceId'
                          value={projectSOWFormData.serviceId}
                          onChange={handleSelectChange}
                        />
                      </Box>
                      <Box sx={{ width: '50%' }}>
                        <TextField
                          id='outlined-multiline-flexible'
                          className={`block w-full mt-1 text-sm dark:bg-gray-700 dark:text-gray-300 dark:focus:shadow-outline-gray form-input`}
                          placeholder='Project Name'
                          name='projectName'
                          value={projectSOWFormData.projectName}
                          onChange={handleProjectSOWChange}
                          disabled
                          sx={{ borderColor: '#e2e8f0' }}
                        />
                      </Box>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={transcriptSectionTitleSx}>Qualifying Meeting Transcript </Box>
                      <Box
                        sx={transcriptMeetingLinkAddButtonSx}
                        onClick={() => {
                          setTranscriptMeetingLinks(prevState => {
                            const updatedLinks = [...prevState]
                            updatedLinks.push('')

                            return updatedLinks
                          })
                        }}
                      >
                        <AddIcon fontSize='small' />
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 5, mb: 5, flexDirection: 'column' }}>
                      {transcriptMeetingLinks?.map((transcriptMeetingLink: any, index: number) => {
                        return (
                          <Box sx={{ width: '100%', position: 'relative' }} key={index}>
                            <TextField
                              id='outlined-multiline-flexible'
                              label={`${getShortStringNumber(index + 1)} Meeting Link`}
                              className={`block w-full mt-1 text-sm dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input`}
                              placeholder={`${getShortStringNumber(
                                index + 1
                              )} Meeting Link: https://tldv.io/app/meetings/unique-meeting-id/`}
                              name='clientEmail'
                              value={transcriptMeetingLink}
                              onChange={e => {
                                const { value } = e.target
                                setTranscriptMeetingLinks(prevState => {
                                  const updatedLinks = [...prevState]
                                  updatedLinks[index] = value

                                  return updatedLinks
                                })
                              }}
                            />
                            <IconButton
                              onClick={() => {
                                setTranscriptMeetingLinks(prevState => {
                                  const updatedLinks = [...prevState]
                                  updatedLinks.splice(index, 1)

                                  return updatedLinks
                                })
                              }}
                              sx={{
                                position: 'absolute',
                                top: '8px',
                                right: '8px'
                              }}
                              color='error'
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        )
                      })}
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
                          <MarkdownEditor modelValue={summaryText} onChange={setSummaryText} />
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
                          <MarkdownEditor modelValue={problemGoalText} onChange={setProblemGoalText} />
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
                          <MarkdownEditor modelValue={overviewText} onChange={setOverviewText} />
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
                  {/* <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5, mb: 5 }}>
                    <Box sx={{ width: '100%' }}>
                      <label className='block text-sm' htmlFor={'#problemGoalText'}>
                        <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Scope of Work</span>
                        <Box
                          sx={{
                            position: 'relative'
                          }}
                        >
                          <MarkdownEditor modelValue={scopeText} onChange={setScopeText} />
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
                  </Box> */}
                  <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
                    <Grid container spacing={2} justifyContent='center' alignItems='center'>
                      <Grid sx={{ width: 'calc(50% - 50px)' }} item>
                        {serviceTreeList(serviceDeliverableLeftList, serviceDeliverablesChecked)}
                      </Grid>
                      <Grid sx={{ width: '100px' }} item>
                        <Grid container direction='column' alignItems='center'>
                          <Button
                            sx={{ my: 0.5 }}
                            variant='outlined'
                            size='small'
                            onClick={handleCheckedLeftToRight}
                            disabled={serviceDeliverablesChecked.length === 0}
                            aria-label='move selected right'
                          >
                            &gt;
                          </Button>
                          <Button
                            sx={{ my: 0.5 }}
                            variant='outlined'
                            size='small'
                            onClick={handleCheckedRightToLeft}
                            disabled={serviceDeliverablesChecked.length === 0}
                            aria-label='move selected left'
                          >
                            &lt;
                          </Button>
                        </Grid>
                      </Grid>
                      <Grid sx={{ width: 'calc(50% - 50px)' }} item>
                        {serviceTreeList(serviceDeliverableRightList, serviceDeliverablesChecked)}
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              )}

              {activeStep == 5 && (
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
                          <MarkdownEditor modelValue={deliverablesText} onChange={setDeliverablesText} />
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
                  <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
                    <Grid container spacing={2} justifyContent='center' alignItems='center'>
                      <Grid sx={{ width: 'calc(50% - 50px)' }} item>
                        {serviceTreeList(serviceDeliverableLeftList, serviceDeliverablesChecked)}
                      </Grid>
                      <Grid sx={{ width: '100px' }} item>
                        <Grid container direction='column' alignItems='center'>
                          <Button
                            sx={{ my: 0.5 }}
                            variant='outlined'
                            size='small'
                            onClick={handleCheckedLeftToRight}
                            disabled={serviceDeliverablesChecked.length === 0}
                            aria-label='move selected right'
                          >
                            &gt;
                          </Button>
                          <Button
                            sx={{ my: 0.5 }}
                            variant='outlined'
                            size='small'
                            onClick={handleCheckedRightToLeft}
                            disabled={serviceDeliverablesChecked.length === 0}
                            aria-label='move selected left'
                          >
                            &lt;
                          </Button>
                        </Grid>
                      </Grid>
                      <Grid sx={{ width: 'calc(50% - 50px)' }} item>
                        {serviceTreeList(serviceDeliverableRightList, serviceDeliverablesChecked)}
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              )}
              {activeStep == 6 && (
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
                                        <React.Fragment key={`sow-${sow.id}`}>
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
                                            <React.Fragment key={`deliverable-${deliverable.id}`}>
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
                                            </React.Fragment>
                                          ))}
                                        </React.Fragment>
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
