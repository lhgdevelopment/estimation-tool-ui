import AddIcon from '@material-ui/icons/Add'
import ClearIcon from '@material-ui/icons/Clear'
import CheckIcon from '@mui/icons-material/Check'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import EditNoteIcon from '@mui/icons-material/EditNote'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove'
import { Accordion, Box, Checkbox, Modal, SelectChangeEvent, Step, StepButton, Stepper, TextField } from '@mui/material'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import { MdPreview } from 'md-editor-rt'
import 'md-editor-rt/lib/style.css'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import React, { useEffect, useState } from 'react'
import { Dropdown, ServiceDropdownTree } from 'src/@core/components/dropdown'
import { MarkdownEditor } from 'src/@core/components/markdown-editor'
import Preloader from 'src/@core/components/preloader'
import apiRequest from 'src/@core/utils/axios-config'
import { getShortStringNumber } from 'src/@core/utils/utils'
import { TProjectSOWFormComponent } from '../ProjectSOW.decorator'
import {
  deliverableNoteItemSx,
  formTitleSx,
  scopeOfWorkListContainer,
  scopeOfWorkListSx,
  sectionSubTitleSx,
  sectionTitleSx,
  serviceQuestionItemSx,
  sowAddButtonSx,
  teamReviewBoxSx
} from '../ProjectSOW.style'
import ProjectSOWTranscriptFormComponent from './steps/transcript/ProjectSOWTranscript.component'

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
  const [projectSOWID, setProjectSOWID] = useState<any>(null)
  const [summaryText, setSummaryText] = useState<any>('')
  const [problemGoalID, setProblemGoalID] = useState<any>(null)
  const [problemGoalText, setProblemGoalText] = useState<any>('')
  const [overviewTextID, setOverviewTextID] = useState<any>(null)
  const [overviewText, setOverviewText] = useState<any>('')
  const [scopeTextID, setScopeTextID] = useState<any>(null)
  const [scopeText, setScopeText] = useState<any>('')
  const [scopeOfWorkData, setScopeOfWorkData] = useState<any>([])
  const [selectedScopeOfWorkData, setSelectedScopeOfWorkData] = useState<any>([])
  const [additionalServiceScopeOfWorkData, setAdditionalServiceScopeOfWorkData] = useState<any>([])
  const [selectedAdditionalServiceScopeOfWorkData, setSelectedAdditionalServiceScopeOfWorkData] = useState<any>([])
  const [additionalServiceData, setAdditionalServiceData] = useState<any>([])
  const [selectedAdditionalServiceData, setSelectedAdditionalServiceData] = useState<any>([])
  const [deliverableData, setDeliverableData] = useState<any>([])
  const [selectedDeliverableData, setSelectedDeliverableData] = useState<any>([])

  const [estimationTaskData, setEstimationTaskData] = useState<any>([])

  const [deliverableServiceQuestionData, setDeliverableServiceQuestionData] = useState<any[]>([])

  type TDeliverableNote = {
    noteLink: string
    note: string
  }
  const deliverableNoteDefaultData = { noteLink: '', note: '' }
  const [deliverableNotesData, setDeliverableNotesData] = useState<any[]>([deliverableNoteDefaultData])

  const [serviceList, setServiceList] = useState<any>([])
  const [serviceQuestionList, setServiceQuestion] = useState<any>([])
  const [teamUserList, setTeamUserList] = useState<any>([])

  const [associatedUserWithRole, setAssociatedUserWithRole] = useState<
    {
      employeeRoleId: number
      associateId: number
    }[]
  >([])

  const getAssociatedUserWithRole = (roleId: number, userId: number) => {
    setAssociatedUserWithRole((prevState: any) => {
      if (prevState.some((item: any) => item.employeeRoleId === roleId)) {
        return prevState.map((item: any) => {
          if (item.employeeRoleId === roleId) {
            return { ...item, associateId: userId }
          }

          return item
        })
      } else {
        return [...prevState, { employeeRoleId: roleId, associateId: userId }]
      }
    })
    console.log(associatedUserWithRole)
  }

  const [transcriptMeetingLinks, setTranscriptMeetingLinks] = useState<string[]>([''])
  const [employeeRoleData, setEmployeeRole] = useState<any>([])

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

  const [serviceSOWModalOpen, setServiceSowModalOpen] = useState<boolean>(false)
  const [serviceSOWEditDataId, setServiceSOWEditDataId] = useState<null | string>(null)
  const handleServiceSOWModalOpen = () => {
    setServiceSowModalOpen(true)
    setErrorMessage({})
  }
  const handleServiceSOWModalClose = () => {
    setServiceSowModalOpen(false)
    setErrorMessage({})
  }
  const serviceSOWDefaultData = {
    serviceGroupId: '',
    name: '',
    order: '',
    scopes: [{ name: '', order: '' }]
  }

  const [serviceSOWFormData, setServiceSOWFormData] = useState(serviceSOWDefaultData)
  const onServiceSOWClear = () => {
    setServiceSOWFormData(prevState => ({ ...serviceSOWDefaultData }))
    setServiceSOWEditDataId(null)
    handleServiceSOWModalClose()
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

  const handleNotesInputChange = (index: number, event: any) => {
    const { name, value } = event.target
    const newNotes = [...deliverableNotesData]
    newNotes[index][name] = value
    setDeliverableNotesData(newNotes)
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
  console.log(deliverableServiceQuestionData)

  const handleDeliverableNoteAdd = () => {
    setDeliverableNotesData(prevState => [...prevState, deliverableNoteDefaultData])
  }
  const handleDeliverableNoteRemove = (index: number) => {
    const newNotes = deliverableNotesData.filter((_, noteIndex) => noteIndex !== index)
    setDeliverableNotesData(newNotes)
  }

  // const handleTranscriptTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
  //   setProjectSOWFormData({
  //     ...projectSOWFormData,
  //     transcriptText: e.target.value
  //   })
  // }

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
    // console.log({ activeStep })
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
              enqueueSnackbar('Updated Successfully!', { variant: 'success' })
            }, 1000)
          })
          .catch(error => {
            setPreload(false)
            setErrorMessage(error?.response?.data?.errors)
            enqueueSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
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
              enqueueSnackbar('Created Successfully!', { variant: 'success' })
            }, 1000)
          })
          .catch(error => {
            setPreload(false)
            setErrorMessage(error?.response?.data?.errors)
            enqueueSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
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
                setProblemGoalID(res2?.data?.id)
                setProblemGoalText(res2?.data?.problemGoalText)
                setTimeout(() => {
                  setActiveStep(newActiveStep)
                  if (enabledStep < newActiveStep) {
                    setEnabledStep(newActiveStep)
                  }
                  setPreload(false)
                  enqueueSnackbar('Created Successfully!', { variant: 'success' })
                }, 1000)
              })
              .catch(error => {
                setPreload(false)
                setErrorMessage(error?.response?.data?.errors)
                enqueueSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
              })
          } else {
            setPreload(false)
          }
        })
        .catch(error => {
          setPreload(false)
          setErrorMessage(error?.response?.data?.errors)
          enqueueSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
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
                  enqueueSnackbar('Created Successfully!', { variant: 'success' })
                }, 1000)
              })
              .catch(error => {
                setPreload(false)
                setErrorMessage(error?.response?.data?.errors)
                enqueueSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
              })
          } else {
            setPreload(false)
          }
        })
        .catch(error => {
          setPreload(false)
          setErrorMessage(error?.response?.data?.errors)
          enqueueSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
        })
    }
    if (activeStep === 3) {
      apiRequest
        .post(`/project-overview/${overviewTextID}`, { overviewText })
        .then(res => {
          if (res?.data && type == 'NEXT') {
            apiRequest
              .get(`/scope-of-work?problemGoalId=${problemGoalID}`)
              .then(res2 => {
                if (res2?.data?.scopeOfWorks.length) {
                  setScopeOfWorkData(res2?.data?.scopeOfWorks)
                  setSelectedScopeOfWorkData(res2?.data?.scopeOfWorks?.map((scopeOfWork: any) => scopeOfWork?.id))
                  setSelectedAdditionalServiceData(
                    res2?.data?.additionalServices?.map(
                      (additionalService: any) => additionalService?.selectedServiceId
                    )
                  )
                  setTimeout(() => {
                    if (type == 'NEXT') {
                      setActiveStep(newActiveStep)
                      if (enabledStep < newActiveStep) {
                        setEnabledStep(newActiveStep)
                      }
                    }
                    setPreload(false)
                    enqueueSnackbar('Generated Successfully!', { variant: 'success' })
                  }, 1000)
                } else {
                  apiRequest
                    .post(`/scope-of-work`, { problemGoalID })
                    .then(res3 => {
                      setScopeOfWorkData(res3?.data?.filter((scopeOfWork: any) => !scopeOfWork?.additionalServiceId))
                      setSelectedScopeOfWorkData(
                        res3?.data
                          ?.filter((scopeOfWork: any) => !scopeOfWork?.additionalServiceId)
                          ?.map((scopeOfWork: any) => scopeOfWork?.id)
                      )

                      setSelectedAdditionalServiceScopeOfWorkData(
                        res3?.data
                          ?.filter((scopeOfWork: any) => !!scopeOfWork?.additionalServiceId)
                          ?.map((scopeOfWork: any) => scopeOfWork?.id)
                      )
                      setAdditionalServiceScopeOfWorkData(
                        res3?.data?.filter((scopeOfWork: any) => !!scopeOfWork?.additionalServiceId)
                      )
                      setTimeout(() => {
                        if (type == 'NEXT') {
                          setActiveStep(newActiveStep)
                          if (enabledStep < newActiveStep) {
                            setEnabledStep(newActiveStep)
                          }
                        }
                        setPreload(false)
                        enqueueSnackbar('Generated Successfully!', { variant: 'success' })
                      }, 1000)
                    })
                    .catch(error => {
                      setPreload(false)
                      setErrorMessage(error?.response?.data?.errors)
                      enqueueSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
                    })
                }
              })
              .catch(error => {
                setPreload(false)
                setErrorMessage(error?.response?.data?.errors)
                enqueueSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
              })
          } else {
            setPreload(false)
          }
        })
        .catch(error => {
          setPreload(false)
          setErrorMessage(error?.response?.data?.errors)
          enqueueSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
        })
    }

    if (activeStep === 4) {
      apiRequest
        .post(`/scope-of-work-select/`, {
          problemGoalId: problemGoalID,
          scopeOfWorkIds: [...selectedScopeOfWorkData],
          serviceIds: [...selectedAdditionalServiceData]
        })
        .then(res => {
          if (res && type == 'NEXT') {
            apiRequest
              .get(`/deliverables?problemGoalId=${problemGoalID}`)
              .then(res2 => {
                if (res2?.data?.deliverables.length) {
                  setDeliverableData(res2?.data?.deliverables)
                  setSelectedDeliverableData(res2?.data?.deliverables?.map((deliverable: any) => deliverable?.id))
                  if (res2?.data?.deliverableNotes?.length) {
                    setDeliverableNotesData(res2?.data?.deliverableNotes)
                  } else {
                    setDeliverableNotesData([deliverableNoteDefaultData])
                  }
                  setTimeout(() => {
                    if (type == 'NEXT') {
                      setActiveStep(newActiveStep)
                      if (enabledStep < newActiveStep) {
                        setEnabledStep(newActiveStep)
                      }
                    }
                    setPreload(false)
                    enqueueSnackbar('Generated Successfully!', { variant: 'success' })
                  }, 1000)
                } else {
                  apiRequest
                    .post(`/deliverables`, { problemGoalId: problemGoalID })
                    .then(res3 => {
                      setDeliverableData(res3?.data?.deliverable)
                      setSelectedDeliverableData(res3?.data?.deliverables?.map((deliverable: any) => deliverable?.id))
                      setTimeout(() => {
                        if (type == 'NEXT') {
                          setActiveStep(newActiveStep)
                          if (enabledStep < newActiveStep) {
                            setEnabledStep(newActiveStep)
                          }
                        }
                        setPreload(false)
                        enqueueSnackbar('Generated Successfully!', { variant: 'success' })
                      }, 1000)
                    })
                    .catch(error => {
                      setPreload(false)
                      setErrorMessage(error?.response?.data?.errors)
                      enqueueSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
                    })
                }
              })
              .catch(error => {
                setPreload(false)
                setErrorMessage(error?.response?.data?.errors)
                enqueueSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
              })
          } else {
            setPreload(false)
          }
        })
        .catch(error => {
          setPreload(false)
          setErrorMessage(error?.response?.data?.errors)
          enqueueSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
        })
    }
    if (activeStep === 5) {
      apiRequest
        .post(`/deliverables-select/`, {
          problemGoalId: problemGoalID,
          deliverableIds: [...selectedDeliverableData],
          notes: [...deliverableNotesData],
          questions: [...deliverableServiceQuestionData]
        })
        .then(res => {
          if (res && type == 'NEXT') {
            apiRequest
              .get(`/deliverables?problemGoalId=${problemGoalID}`)
              .then(res2 => {
                // console.log(res2?.data)

                if (res2?.data?.deliverables.length) {
                  setDeliverableData(res2?.data?.deliverables)
                  setSelectedDeliverableData(res2?.data?.deliverables?.map((deliverable: any) => deliverable?.id))
                  if (res2?.data?.deliverableNotes?.length) {
                    setDeliverableNotesData(res2?.data?.deliverableNotes)
                  } else {
                    setDeliverableNotesData([deliverableNoteDefaultData])
                  }
                  setTimeout(() => {
                    if (type == 'NEXT') {
                      setActiveStep(newActiveStep)
                      if (enabledStep < newActiveStep) {
                        setEnabledStep(newActiveStep)
                      }
                    }
                    setPreload(false)
                    enqueueSnackbar('Generated Successfully!', { variant: 'success' })
                  }, 1000)
                } else {
                  apiRequest
                    .post(`/deliverables`, { problemGoalId: problemGoalID })
                    .then(res3 => {
                      setDeliverableData(res3?.data?.deliverable)
                      setSelectedDeliverableData(res3?.data?.deliverables?.map((deliverable: any) => deliverable?.id))
                      setTimeout(() => {
                        if (type == 'NEXT') {
                          setActiveStep(newActiveStep)
                          if (enabledStep < newActiveStep) {
                            setEnabledStep(newActiveStep)
                          }
                        }
                        setPreload(false)
                        enqueueSnackbar('Generated Successfully!', { variant: 'success' })
                      }, 1000)
                    })
                    .catch(error => {
                      setPreload(false)
                      setErrorMessage(error?.response?.data?.errors)
                      enqueueSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
                    })
                }
              })
              .catch(error => {
                setPreload(false)
                setErrorMessage(error?.response?.data?.errors)
                enqueueSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
              })
          } else {
            setPreload(false)
          }
        })
        .catch(error => {
          setPreload(false)
          setErrorMessage(error?.response?.data?.errors)
          enqueueSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
        })
    }

    if (activeStep === 6) {
      apiRequest
        .post(`/team-review/`, {
          transcriptId: projectSOWFormData.transcriptId,
          teams: [...associatedUserWithRole]
        })
        .then(res => {
          setTimeout(() => {
            if (type == 'NEXT') {
              setActiveStep(newActiveStep)
              if (enabledStep < newActiveStep) {
                setEnabledStep(newActiveStep)
              }
            }
            setPreload(false)
            enqueueSnackbar('Generated Successfully!', { variant: 'success' })
          }, 1000)
        })
        .catch(error => {
          setPreload(false)
          setErrorMessage(error?.response?.data?.errors)
          enqueueSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
        })
    }
    if (activeStep === 7) {
      apiRequest
        .get(`/estimation-tasks?problemGoalId=${problemGoalID}`)
        .then(res => {
          console.log(res)
          if (res?.data?.tasks?.length) {
            setEstimationTaskData(res?.data?.tasks)
          } else {
            apiRequest
              .post(`/estimation-tasks`, { problemGoalId: problemGoalID })
              .then(res2 => {
                setEstimationTaskData(res?.data)
                setTimeout(() => {
                  if (type == 'NEXT') {
                    setActiveStep(newActiveStep)
                    if (enabledStep < newActiveStep) {
                      setEnabledStep(newActiveStep)
                    }
                  }
                  setPreload(false)
                  enqueueSnackbar('Generated Successfully!', { variant: 'success' })
                }, 1000)
              })
              .catch(error => {
                setPreload(false)
                setErrorMessage(error?.response?.data?.errors)
                enqueueSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
              })
          }
        })
        .catch(error => {
          console.log(error)
        })
    } else {
      setPreload(false)
    }
  }

  const handleStep = (step: number) => () => {
    setActiveStep(step)
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

  const handleAdditionalServiceSelection = (id: any) => {
    setSelectedAdditionalServiceData((prevState: any) => {
      if (!prevState?.includes(id)) {
        return [...prevState, Number(id)]
      } else {
        return prevState.filter((item: any) => item !== Number(id))
      }
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

  const handleDeliverableCheckboxBySow = (deliverables: any) => {
    setSelectedDeliverableData((prevState: any) => {
      const deliverableIds = deliverables.map((deliverable: any) => Number(deliverable?.id))
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

  const isServiceCheckedInDeliverable = (additionalService: any, selectedDeliverableData: any) => {
    const deliverables = additionalService?.scope_of_works?.flatMap(
      (scopeOfWork: any) => scopeOfWork?.deliverables || []
    )

    return deliverables.every((deliverable: any) => selectedDeliverableData.includes(deliverable.id))
  }

  const getDetails = (id: string | null | undefined) => {
    if (!id) return
    let getEnableStep = 0
    setPreload(true)
    apiRequest
      .get(`/project-summery/${id}`)
      .then((res: any) => {
        const transcriptId = res?.data?.id || ''
        const transcriptText = res?.data?.meeting_transcript?.['transcriptText'] || ''
        const serviceId = res?.data?.meeting_transcript?.['serviceId'] || ''
        const projectName = res?.data?.meeting_transcript?.['projectName'] || ''
        const company = res?.data?.meeting_transcript?.['company'] || ''
        const clientEmail = res?.data?.meeting_transcript?.['clientEmail'] || ''
        const clientPhone = res?.data?.meeting_transcript?.['clientPhone'] || ''
        const clientWebsite = res?.data?.meeting_transcript?.['clientWebsite'] || ''
        const meetingLinks = res?.data?.meeting_transcript?.['meeting_links'].map(
          (meeting_link: any) => meeting_link?.meetingLink
        ) || ['']

        const summaryText = res?.data?.['summaryText'] || ''
        setTranscriptMeetingLinks(
          res?.data?.meeting_transcript?.['meeting_links'].map((meeting_link: any) => meeting_link?.meetingLink) || ['']
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
        if (res?.data?.meeting_transcript?.problems_and_goals?.['id']) {
          setProblemGoalID(res?.data?.meeting_transcript?.problems_and_goals?.['id'])
          setProblemGoalText(res?.data?.meeting_transcript?.problems_and_goals?.problemGoalText)
          getEnableStep = 2
        }

        if (res?.data?.meeting_transcript?.problems_and_goals?.project_overview?.['id']) {
          setOverviewTextID(res?.data?.meeting_transcript?.problems_and_goals?.project_overview?.['id'])
          setOverviewText(res?.data?.meeting_transcript?.problems_and_goals?.project_overview?.overviewText)
          getEnableStep = 3
        }

        if (res?.data?.scopeOfWorksData && res?.data?.scopeOfWorksData?.scopeOfWorks?.length) {
          setScopeOfWorkData(
            res?.data?.scopeOfWorksData?.scopeOfWorks?.filter((scopeOfWork: any) => !scopeOfWork?.additionalServiceId)
          )
          setSelectedScopeOfWorkData(
            res?.data?.scopeOfWorksData?.scopeOfWorks
              ?.filter((scopeOfWork: any) => !scopeOfWork?.additionalServiceId)
              ?.map((scopeOfWork: any) => scopeOfWork?.id)
          )

          // console.log({ additionalServiceScopeOfWorkData })
          // console.log({ selectedAdditionalServiceScopeOfWorkData })

          setSelectedAdditionalServiceData(
            res?.data?.scopeOfWorksData?.additionalServices?.map(
              (additionalService: any) => additionalService?.selectedServiceId
            )
          )

          getEnableStep = 4
        }

        // console.log(res?.data?.deliverablesData?.deliverables)
        // console.log(res?.data)

        if (res?.data?.deliverablesData && res?.data?.deliverablesData?.deliverables?.length) {
          setDeliverableData(res?.data?.deliverablesData?.deliverables)
          setSelectedDeliverableData(
            res?.data?.deliverablesData?.deliverables?.map((deliverable: any) => deliverable?.id)
          )
          setDeliverableNotesData(res?.data?.deliverablesData?.deliverableNotes)
          setSelectedAdditionalServiceScopeOfWorkData(
            res?.data?.deliverablesData?.deliverables
              ?.filter((deliverable: any) => !!deliverable?.additionalServiceId)
              ?.map((deliverable: any) => deliverable?.id)
          )
          setAdditionalServiceScopeOfWorkData(
            res?.data?.deliverablesData?.deliverables?.filter((deliverable: any) => !!deliverable?.additionalServiceId)
          )

          setDeliverableServiceQuestionData(
            res?.data?.deliverablesData?.questionAnswers?.map((questionAnswer: any) => ({
              questionId: questionAnswer?.questionId,
              answer: questionAnswer?.answer
            }))
          )

          getEnableStep = 9
        }

        setEnabledStep(getEnableStep)
        setPreload(false)
      })
      .catch(error => {
        setEnabledStep(0)
        setPreload(false)
        enqueueSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
      })
  }

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

  const getServiceQuestionList = async () => {
    await apiRequest
      .get(`/questions?serviceId=${projectSOWFormData?.serviceId}`)
      .then(res => {
        setServiceQuestion(res?.data)
      })
      .catch(error => {
        enqueueSnackbar(error?.message, { variant: 'error' })
      })
  }

  const getUserList = async () => {
    await apiRequest
      .get(`/associates`)
      .then(res => {
        setTeamUserList(res?.data)
      })
      .catch(error => {
        enqueueSnackbar(error?.message, { variant: 'error' })
      })
  }

  // const getUserList = async () => {
  //   await axios
  //     .get('https://time.cloud.lhgdev.com/en/api/payroll/users', {
  //       headers: {
  //         'X-AUTH-USER': 'lhg-raju',
  //         'X-AUTH-TOKEN': 'raju@2016'
  //       }
  //     })
  //     .then(res => {
  //       setTeamUserList(
  //         res?.data?.map((item: any) => {
  //           return { ...item, title: item?.name }
  //         })
  //       )
  //     })
  //     .catch(error => {
  //       enqueueSnackbar(error?.message, { variant: 'error' })
  //     })
  // }
  const getEmployeeRoleList = async () => {
    await apiRequest
      .get(`/employee-roles`)
      .then(res => {
        setEmployeeRole(
          res?.data?.map((item: any) => {
            return { ...item, title: item?.name }
          })
        )
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

  function serviceDeliverableGroupByScopeOfWorkId(data: any) {
    const grouped = data.reduce((acc: { [key: number]: any }, item: any) => {
      const { scopeOfWorkId, scope_of_work } = item

      if (!acc[scopeOfWorkId]) {
        acc[scopeOfWorkId] = {
          ...scope_of_work,
          additional_service_info: item?.additional_service_info,
          deliverables: []
        }
      }

      acc[scopeOfWorkId].deliverables.push(item)

      return acc
    }, {})

    return Object.values(grouped)
  }

  function scopeOfWorkGroupByAdditionalServiceId(data: any) {
    const groupedData = data.reduce((acc: { [key: number]: any }, item: any) => {
      const key = item.additionalServiceId ?? ''

      if (!acc[key]) {
        acc[key] = []
      }

      acc[key].push(item)

      return acc
    }, {})

    const result = Object.keys(groupedData).map(key => {
      return {
        ...groupedData[key][0]?.additional_service_info,
        scope_of_works: groupedData[key]
      }
    })

    return result
  }

  useEffect(() => {
    onClear()
    setEnabledStep(0)
    setActiveStep(0)
    getServiceList()
    getUserList()
    getEmployeeRoleList()
    getServiceQuestionList()
  }, [])

  useEffect(() => {
    getServiceQuestionList()
  }, [projectSOWFormData?.serviceId])

  useEffect(() => {
    getDetails(id as string)
  }, [id])

  useEffect(() => {
    if (isEdit && step && Number(step) <= enabledStep) {
      setActiveStep(Number(step))
    }
  }, [isEdit, id, step])

  useEffect(() => {
    if (activeStep) {
      const currentPath = router.asPath.split('?')[0]
      const updatedPath = `${currentPath}?step=${activeStep}`
      router.replace(updatedPath, undefined, { shallow: true })
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
                <ProjectSOWTranscriptFormComponent
                  transcriptMeetingLinks={transcriptMeetingLinks}
                  errorMessage={errorMessage}
                  projectSOWFormData={projectSOWFormData}
                  setProjectSOWFormData={setProjectSOWFormData}
                  setTranscriptMeetingLinks={setTranscriptMeetingLinks}
                />
              )}
              {activeStep == 1 && (
                <Box>
                  <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
                    <Box sx={{ width: '100%' }}>
                      <label className='block text-sm' htmlFor={'#summaryText'}>
                        <Box sx={{ ...formTitleSx, mt: 0 }}>
                          {projectSOWFormData?.projectName} - Qualifying Meeting Summary
                        </Box>
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
                        <Box sx={{ ...formTitleSx, mt: 0 }}> {projectSOWFormData?.projectName}'s Problem & Goal</Box>
                        <Box
                          sx={{
                            position: 'relative'
                          }}
                        >
                          <MarkdownEditor modelValue={problemGoalText} onChange={setProblemGoalText} />
                        </Box>
                        {!!errorMessage?.problemGoalText &&
                          errorMessage?.problemGoalText?.map((message: any, index: number) => {
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
                        <Box sx={{ ...formTitleSx, mt: 0 }}>Project Overview</Box>
                        <Box
                          sx={{
                            position: 'relative'
                          }}
                        >
                          <MarkdownEditor modelValue={overviewText} onChange={setOverviewText} />
                        </Box>
                        {!!errorMessage?.overviewText &&
                          errorMessage?.overviewText?.map((message: any, index: number) => {
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
                  <Box sx={{ ...sectionTitleSx, display: 'flex' }}>
                    Scope Of Work
                    <Box
                      sx={sowAddButtonSx}
                      onClick={() => {
                        handleServiceSOWModalOpen()
                      }}
                    >
                      <AddIcon fontSize='small' />
                    </Box>
                  </Box>
                  <Box sx={scopeOfWorkListContainer}>
                    <Box sx={scopeOfWorkListSx}>
                      {scopeOfWorkData?.map((scopeOfWork: any, index: number) => {
                        return (
                          <Box className={'sow-list-item'} key={index}>
                            <Box className={'sow-list-item-sl'}>{index + 1}</Box>
                            <Box className={'sow-list-item-type'}>
                              <Box
                                className={`item-type-common item-type-sow ${
                                  scopeOfWork?.['serviceDeliverablesId'] ? 'item-type-hive' : ''
                                }`}
                              >
                                SOW
                              </Box>
                            </Box>
                            <Box className={'sow-list-item-check'}>
                              <Checkbox
                                onChange={handleScopeOfWorkCheckbox}
                                value={scopeOfWork?.['id']}
                                checked={selectedScopeOfWorkData?.includes(scopeOfWork?.['id'])}
                              />
                            </Box>
                            <Box className={'sow-list-item-title'}>{scopeOfWork?.['title']}</Box>
                          </Box>
                        )
                      })}
                      {/* selectedAdditionalServiceData */}
                    </Box>
                  </Box>
                  <Box>
                    <Box sx={sectionTitleSx}>Add Services</Box>
                    <Box sx={{ py: 0, px: 5 }}>
                      {serviceGroupByProjectTypeId(serviceList)?.map((projectType: any, index: number) => (
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, fontWeight: '600' }} key={index}>
                          <Box sx={{ mr: 2, color: '#777' }}>{projectType?.projectTypeName}</Box>
                          <Box sx={{ my: 3 }}>
                            {projectType?.services?.map((service: any) => (
                              <Box
                                sx={{
                                  position: 'relative',
                                  display: 'flex',
                                  p: '5px 25px',
                                  borderRadius: '15px',
                                  fontSize: '14px',
                                  lineHeight: '14px',
                                  background: '#afaeb3',
                                  color: '#fff',
                                  cursor: 'pointer',
                                  mb: 1,
                                  '&.selected': {
                                    background: '#31A0F6'
                                  }
                                }}
                                key={index}
                                className={`${selectedAdditionalServiceData?.includes(service?.id) ? 'selected' : ''}`}
                                onClick={() => {
                                  handleAdditionalServiceSelection(service?.id)
                                }}
                              >
                                {selectedAdditionalServiceData.includes(service?.id) ? (
                                  <CheckIcon
                                    sx={{
                                      position: 'absolute',
                                      top: '50%',
                                      left: '5px',
                                      transform: 'translate(0, -50%)',
                                      fontSize: '18px',
                                      mr: 1
                                    }}
                                  />
                                ) : (
                                  <></>
                                )}
                                {service.name}
                              </Box>
                            ))}
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Box>
              )}

              {activeStep == 5 && (
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Box sx={sectionTitleSx}>Deliverable</Box>
                  <Box sx={scopeOfWorkListContainer}>
                    <Box sx={scopeOfWorkListSx}>
                      {serviceDeliverableGroupByScopeOfWorkId(
                        deliverableData?.filter((deliverable: any) => !deliverable?.additionalServiceId)
                      )?.map((scopeOfWork: any, index: number) => {
                        return (
                          <Box key={index}>
                            <Box className={'sow-list-item'} component={'label'}>
                              <Box className={'sow-list-item-sl'}>{index + 1}</Box>
                              <Box className={'sow-list-item-type'}>
                                <Box
                                  className={`item-type-common item-type-sow ${
                                    !scopeOfWork?.['additionalServiceId'] ? 'item-type-hive' : ''
                                  }`}
                                >
                                  SOW
                                </Box>
                              </Box>
                              <Box className={'sow-list-item-check'}>
                                <Checkbox
                                  onChange={() => {
                                    handleDeliverableCheckboxBySow(scopeOfWork?.deliverables)
                                  }}
                                  value={scopeOfWork?.id}
                                  checked={isSowCheckedInDeliverable(
                                    scopeOfWork?.deliverables,
                                    selectedDeliverableData
                                  )}
                                />
                              </Box>
                              <Box className={'sow-list-item-title'}>{scopeOfWork?.title}</Box>
                            </Box>
                            {scopeOfWork?.deliverables?.map((deliverable: any, deliverableIndex: number) => {
                              return (
                                <Box className={'sow-list-item'} key={deliverableIndex} component={'label'}>
                                  <Box className={'sow-list-item-sl'}>{`${index + 1}.${deliverableIndex + 1}`}</Box>
                                  <Box className={'sow-list-item-type'}>
                                    <Box className={'item-type-common item-type-deliverable'}>Deliverable</Box>
                                  </Box>
                                  <Box className={'sow-list-item-check'}>
                                    <Checkbox
                                      onChange={handleDeliverableCheckbox}
                                      value={deliverable?.['id']}
                                      checked={selectedDeliverableData?.includes(deliverable?.['id'])}
                                    />
                                  </Box>
                                  <Box className={'sow-list-item-title'}>{deliverable?.['title']}</Box>
                                </Box>
                              )
                            })}
                          </Box>
                        )
                      })}
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', mt: 5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 5 }}>
                      <Box sx={sectionTitleSx}>Service Question</Box>
                    </Box>
                    <Box sx={{ width: '100%', display: 'flex', flexWrap: 'wrap' }}>
                      {serviceQuestionList?.map((serviceQuestion: any, index: number) => {
                        return (
                          <Box sx={serviceQuestionItemSx} key={index}>
                            <Box sx={{ width: '100%' }}>
                              <Box component='label' sx={{ mb: 2 }}>
                                {`${serviceQuestion.title} #${index + 1}`}
                              </Box>
                              <TextField
                                // label={`Service Related Questions Answer #${index}`}
                                name='answer'
                                value={
                                  deliverableServiceQuestionData?.find(
                                    (item: any) => item?.questionId === serviceQuestion?.id
                                  )?.answer
                                }
                                onChange={e => {
                                  handleServiceQuestionInputChange(e.target.value, serviceQuestion?.id)
                                }}
                                placeholder={`Service Related Questions Answer #${index + 1}`}
                                fullWidth
                              />
                            </Box>
                          </Box>
                        )
                      })}
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', mt: 5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 5 }}>
                      <Box sx={sectionTitleSx}>Project Notes</Box>
                    </Box>

                    <Box>
                      {deliverableNotesData?.map((deliverableNote: any, index: number) => {
                        return (
                          <Box sx={deliverableNoteItemSx} key={index}>
                            <Box sx={{ width: '100%' }}>
                              <TextField
                                label={'Meeting Link'}
                                name='noteLink'
                                value={deliverableNote?.noteLink}
                                onChange={e => {
                                  handleNotesInputChange(index, e)
                                }}
                                placeholder={`${getShortStringNumber(
                                  index + 1
                                )} Meeting Link: https://tldv.io/app/meetings/unique-meeting-id/`}
                                fullWidth
                              />
                            </Box>
                            <Box sx={{ width: '100%' }}>
                              <TextField
                                label={'Note'}
                                name='note'
                                value={deliverableNote?.note}
                                onChange={e => {
                                  handleNotesInputChange(index, e)
                                }}
                                placeholder={`Type any additional notes here that will help the estimating team`}
                                fullWidth
                              />
                            </Box>
                          </Box>
                        )
                      })}
                    </Box>
                  </Box>
                  <Box>
                    <Box sx={sectionTitleSx}>Added Services</Box>
                    <Box>
                      {scopeOfWorkGroupByAdditionalServiceId(
                        serviceDeliverableGroupByScopeOfWorkId(
                          deliverableData?.filter((deliverable: any) => !!deliverable?.additionalServiceId)
                        )
                      )?.map((additionalService: any, additionalServiceIndex: number) => {
                        return (
                          <Box key={additionalServiceIndex}>
                            <Box sx={sectionSubTitleSx} component={'label'}>
                              <Checkbox
                                onChange={() => {
                                  handleDeliverableCheckboxByService(additionalService)
                                }}
                                value={additionalService?.id}
                                checked={isServiceCheckedInDeliverable(additionalService, selectedDeliverableData)}
                                sx={{ p: 0, mr: 2 }}
                              />
                              {additionalService?.name}
                            </Box>
                            <Box sx={scopeOfWorkListContainer}>
                              <Box sx={scopeOfWorkListSx}>
                                {additionalService?.scope_of_works?.map(
                                  (scopeOfWork: any, scopeOfWorkIndex: number) => {
                                    return (
                                      <Box key={scopeOfWorkIndex}>
                                        <Box className={'sow-list-item'} component={'label'}>
                                          <Box className={'sow-list-item-type'}>
                                            <Box
                                              className={`item-type-common item-type-sow ${
                                                !scopeOfWork?.['additionalServiceId'] ? 'item-type-hive' : ''
                                              }`}
                                            >
                                              SOW
                                            </Box>
                                          </Box>
                                          <Box className={'sow-list-item-check'}>
                                            <Checkbox
                                              onChange={() => {
                                                handleDeliverableCheckboxBySow(scopeOfWork?.deliverables)
                                              }}
                                              value={scopeOfWork?.id}
                                              checked={isSowCheckedInDeliverable(
                                                scopeOfWork?.deliverables,
                                                selectedDeliverableData
                                              )}
                                            />
                                          </Box>
                                          <Box className={'sow-list-item-title'}>{scopeOfWork?.title}</Box>
                                        </Box>
                                        {scopeOfWork?.deliverables?.map(
                                          (deliverable: any, deliverableIndex: number) => {
                                            return (
                                              <Box
                                                className={'sow-list-item'}
                                                key={deliverableIndex}
                                                component={'label'}
                                              >
                                                <Box className={'sow-list-item-type'}>
                                                  <Box className={'item-type-common item-type-deliverable'}>
                                                    Deliverable
                                                  </Box>
                                                </Box>
                                                <Box className={'sow-list-item-check'}>
                                                  <Checkbox
                                                    onChange={handleDeliverableCheckbox}
                                                    value={deliverable?.['id']}
                                                    checked={selectedDeliverableData?.includes(deliverable?.['id'])}
                                                  />
                                                </Box>
                                                <Box className={'sow-list-item-title'}>{deliverable?.['title']}</Box>
                                              </Box>
                                            )
                                          }
                                        )}
                                      </Box>
                                    )
                                  }
                                )}
                              </Box>
                            </Box>
                          </Box>
                        )
                      })}
                    </Box>
                  </Box>
                </Box>
              )}
              {activeStep == 6 && (
                <Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ ...formTitleSx, mt: 0 }}>Team Review - {projectSOWFormData?.projectName}</Box>

                    <Accordion sx={teamReviewBoxSx}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls='client-information-content'
                        id='client-information-header'
                      >
                        Client Information
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
                          <Box sx={{ width: '30%' }}>
                            <TextField
                              id='outlined-multiline-flexible'
                              label='Company Name'
                              className={`block w-full text-sm dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input ${
                                errorMessage?.['projectName'] ? 'border-red-600' : 'dark:border-gray-600'
                              }`}
                              name='company'
                              value={projectSOWFormData.company}
                              disabled
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
                          <Box sx={{ width: '70%' }}>
                            <TextField
                              id='outlined-multiline-flexible'
                              label='Website'
                              className={`block w-full text-sm dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input ${
                                errorMessage?.['projectName'] ? 'border-red-600' : 'dark:border-gray-600 '
                              }`}
                              name='clientWebsite'
                              value={projectSOWFormData.clientWebsite}
                              disabled
                            />
                          </Box>
                        </Box>
                        <Box className='team-review-box-title'>Project Details</Box>
                        <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
                          <Box sx={{ width: '30%' }}>
                            <Dropdown
                              label={'Services'}
                              url={'services'}
                              name='serviceId'
                              value={projectSOWFormData.serviceId}
                              disabled
                            />
                          </Box>
                          <Box sx={{ width: '70%' }}>
                            <TextField
                              id='outlined-multiline-flexible'
                              label='Project Name'
                              className={`block w-full text-sm dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input ${
                                errorMessage?.['projectName'] ? 'border-red-600' : 'dark:border-gray-600 '
                              }`}
                              name='projectName'
                              value={projectSOWFormData.projectName}
                              disabled
                            />
                          </Box>
                        </Box>
                        <Box className='team-review-box-title'>Qualifying Meeting Transcripts</Box>
                        <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
                          <Box sx={{ width: '50%' }}>
                            <TextField
                              id='outlined-multiline-flexible'
                              label='Meeting Transcripts'
                              className={`block w-full text-sm dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input ${
                                errorMessage?.['projectName'] ? 'border-red-600' : 'dark:border-gray-600 '
                              }`}
                              name='projectName'
                              value={''}
                              disabled
                            />
                          </Box>
                          <Box sx={{ width: '50%' }}>
                            <TextField
                              id='outlined-multiline-flexible'
                              label='Meeting Transcripts'
                              className={`block w-full text-sm dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input ${
                                errorMessage?.['projectName'] ? 'border-red-600' : 'dark:border-gray-600 '
                              }`}
                              name='projectName'
                              value={''}
                              disabled
                            />
                          </Box>
                        </Box>
                        <Box className='team-review-box-title'>Account Manager Notes</Box>
                        <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
                          <Box sx={{ width: '50%' }}>
                            <TextField
                              id='outlined-multiline-flexible'
                              label='Account Manager Notes'
                              className={`block w-full text-sm dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input ${
                                errorMessage?.['projectName'] ? 'border-red-600' : 'dark:border-gray-600 '
                              }`}
                              name='projectName'
                              value={''}
                              disabled
                            />
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
                          <Box sx={{ width: '100%' }}>
                            <Box
                              component={'textarea'}
                              id='outlined-multiline-flexible'
                              className={`block w-full text-sm dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input ${
                                errorMessage?.['projectName'] ? 'border-red-600' : 'dark:border-gray-600 '
                              }`}
                              name='projectName'
                              rows={5}
                            />
                          </Box>
                        </Box>
                      </AccordionDetails>
                    </Accordion>

                    <Accordion sx={teamReviewBoxSx}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls='problemAndGoal-content'
                        id='problemAndGoal-header'
                      >
                        Problem & Goals
                      </AccordionSummary>
                      <AccordionDetails>
                        <MdPreview modelValue={problemGoalText} />
                      </AccordionDetails>
                    </Accordion>

                    <Accordion sx={teamReviewBoxSx}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls='problemAndGoal-content'
                        id='problemAndGoal-header'
                      >
                        Project Overview
                      </AccordionSummary>
                      <AccordionDetails>
                        <MarkdownEditor modelValue={overviewText} onChange={setOverviewText} />
                      </AccordionDetails>
                    </Accordion>

                    <Box sx={{ ...teamReviewBoxSx, p: '15px' }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ width: '100%' }}>
                          <Box className='team-review-box-title'>Project Team Needed</Box>
                        </Box>
                        <Box className='team-review-team-need-box'>
                          {employeeRoleData?.map((employeeRole: any, index: number) => {
                            return (
                              <Box className='team-review-team-need-item' key={index}>
                                <Box className='team-review-team-need-item-title'>{employeeRole?.name}</Box>
                                <Box className='team-review-team-need-item-input'>
                                  <Dropdown
                                    dataList={teamUserList}
                                    optionConfig={{ id: 'id', title: 'name' }}
                                    onChange={event => {
                                      getAssociatedUserWithRole(employeeRole?.id, Number(event?.target?.value))
                                    }}
                                    value={
                                      associatedUserWithRole?.find(
                                        (item: any) => item?.employeeRoleId === employeeRole?.id
                                      )?.associateId
                                    }
                                  />
                                </Box>
                              </Box>
                            )
                          })}
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              )}
              {activeStep == 7 && (
                <Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ ...formTitleSx, mt: 0 }}>Estimation - {projectSOWFormData?.projectName}</Box>

                    <Accordion sx={teamReviewBoxSx}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls='client-information-content'
                        id='client-information-header'
                      >
                        Client Information
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
                          <Box sx={{ width: '30%' }}>
                            <TextField
                              id='outlined-multiline-flexible'
                              label='Company Name'
                              className={`block w-full text-sm dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input ${
                                errorMessage?.['projectName'] ? 'border-red-600' : 'dark:border-gray-600'
                              }`}
                              name='company'
                              value={projectSOWFormData.company}
                              disabled
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
                          <Box sx={{ width: '70%' }}>
                            <TextField
                              id='outlined-multiline-flexible'
                              label='Website'
                              className={`block w-full text-sm dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input ${
                                errorMessage?.['projectName'] ? 'border-red-600' : 'dark:border-gray-600 '
                              }`}
                              name='clientWebsite'
                              value={projectSOWFormData.clientWebsite}
                              disabled
                            />
                          </Box>
                        </Box>
                        <Box className='team-review-box-title'>Project Details</Box>
                        <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
                          <Box sx={{ width: '30%' }}>
                            <Dropdown
                              label={'Services'}
                              url={'services'}
                              name='serviceId'
                              value={projectSOWFormData.serviceId}
                              disabled
                            />
                          </Box>
                          <Box sx={{ width: '70%' }}>
                            <TextField
                              id='outlined-multiline-flexible'
                              label='Project Name'
                              className={`block w-full text-sm dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input ${
                                errorMessage?.['projectName'] ? 'border-red-600' : 'dark:border-gray-600 '
                              }`}
                              name='projectName'
                              value={projectSOWFormData.projectName}
                              disabled
                            />
                          </Box>
                        </Box>
                        <Box className='team-review-box-title'>Qualifying Meeting Transcripts</Box>
                        <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
                          <Box sx={{ width: '50%' }}>
                            <TextField
                              id='outlined-multiline-flexible'
                              label='Meeting Transcripts'
                              className={`block w-full text-sm dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input ${
                                errorMessage?.['projectName'] ? 'border-red-600' : 'dark:border-gray-600 '
                              }`}
                              name='projectName'
                              value={''}
                              disabled
                            />
                          </Box>
                          <Box sx={{ width: '50%' }}>
                            <TextField
                              id='outlined-multiline-flexible'
                              label='Meeting Transcripts'
                              className={`block w-full text-sm dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input ${
                                errorMessage?.['projectName'] ? 'border-red-600' : 'dark:border-gray-600 '
                              }`}
                              name='projectName'
                              value={''}
                              disabled
                            />
                          </Box>
                        </Box>
                        <Box className='team-review-box-title'>Account Manager Notes</Box>
                        <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
                          <Box sx={{ width: '50%' }}>
                            <TextField
                              id='outlined-multiline-flexible'
                              label='Account Manager Notes'
                              className={`block w-full text-sm dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input ${
                                errorMessage?.['projectName'] ? 'border-red-600' : 'dark:border-gray-600 '
                              }`}
                              name='projectName'
                              value={''}
                              disabled
                            />
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
                          <Box sx={{ width: '100%' }}>
                            <Box
                              component={'textarea'}
                              id='outlined-multiline-flexible'
                              className={`block w-full text-sm dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input ${
                                errorMessage?.['projectName'] ? 'border-red-600' : 'dark:border-gray-600 '
                              }`}
                              name='projectName'
                              rows={5}
                            />
                          </Box>
                        </Box>
                      </AccordionDetails>
                    </Accordion>

                    <Accordion sx={teamReviewBoxSx}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls='problemAndGoal-content'
                        id='problemAndGoal-header'
                      >
                        Problem & Goals
                      </AccordionSummary>
                      <AccordionDetails>
                        <MdPreview modelValue={problemGoalText} />
                      </AccordionDetails>
                    </Accordion>

                    <Accordion sx={teamReviewBoxSx}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls='problemAndGoal-content'
                        id='problemAndGoal-header'
                      >
                        Project Overview
                      </AccordionSummary>
                      <AccordionDetails>
                        <MdPreview modelValue={overviewText} />
                      </AccordionDetails>
                    </Accordion>

                    <Box sx={{ ...teamReviewBoxSx, p: '15px' }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ width: '100%' }}>
                          <Box className='team-review-box-title'>Project Team Needed</Box>
                        </Box>
                        <Box className='team-review-team-need-box'>
                          {employeeRoleData?.map((employeeRole: any, index: number) => {
                            return (
                              <Box className='team-review-team-need-item' key={index}>
                                <Box className='team-review-team-need-item-title'>{employeeRole?.name}</Box>
                                <Box className='team-review-team-need-item-input'>
                                  <Dropdown
                                    dataList={teamUserList}
                                    optionConfig={{ id: 'id', title: 'name' }}
                                    onChange={event => {
                                      getAssociatedUserWithRole(employeeRole?.id, Number(event?.target?.value))
                                    }}
                                    value={
                                      associatedUserWithRole?.find(
                                        (item: any) => item?.employeeRoleId === employeeRole?.id
                                      )?.associateId
                                    }
                                  />
                                </Box>
                              </Box>
                            )
                          })}
                        </Box>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Box sx={sectionTitleSx}>SOWs, Deliverables, Tasks, and Subtasks</Box>
                      <Box sx={scopeOfWorkListContainer}>
                        <Box sx={scopeOfWorkListSx}>
                          {serviceDeliverableGroupByScopeOfWorkId(
                            deliverableData?.filter((deliverable: any) => !deliverable?.additionalServiceId)
                          )?.map((scopeOfWork: any, index: number) => {
                            console.log(scopeOfWork)

                            return (
                              <Box key={index}>
                                <Box className={'sow-list-item'} component={'label'}>
                                  <Box className={'sow-list-item-type'}>
                                    <Box
                                      className={`item-type-common item-type-sow ${
                                        !scopeOfWork?.['additionalServiceId'] ? 'item-type-hive' : ''
                                      }`}
                                    >
                                      SOW
                                    </Box>
                                  </Box>
                                  <Box className={'sow-list-item-check'}>
                                    <Checkbox
                                      onChange={() => {
                                        handleDeliverableCheckboxBySow(scopeOfWork?.deliverables)
                                      }}
                                      value={scopeOfWork?.id}
                                      checked={isSowCheckedInDeliverable(
                                        scopeOfWork?.deliverables,
                                        selectedDeliverableData
                                      )}
                                    />
                                  </Box>
                                  <Box className={'sow-list-item-title'}>{scopeOfWork?.title}</Box>
                                </Box>
                                {scopeOfWork?.deliverables?.map((deliverable: any, deliverableIndex: number) => {
                                  return (
                                    <Box key={deliverableIndex}>
                                      <Box className={'sow-list-item'} component={'label'}>
                                        <Box className={'sow-list-item-type'}>
                                          <Box
                                            className={`item-type-common item-type-deliverable ${
                                              !scopeOfWork?.['additionalServiceId'] ? 'item-type-hive' : ''
                                            }`}
                                          >
                                            Deliverable
                                          </Box>
                                        </Box>
                                        <Box className={'sow-list-item-check'}>
                                          <Checkbox
                                            onChange={handleDeliverableCheckbox}
                                            value={deliverable?.['id']}
                                            checked={selectedDeliverableData?.includes(deliverable?.['id'])}
                                          />
                                        </Box>
                                        <Box className={'sow-list-item-title'}>{deliverable?.['title']}</Box>
                                      </Box>
                                      <Box className={'sow-list-item'} component={'label'}>
                                        <Box className={'sow-list-item-type'}>
                                          <Box
                                            className={`item-type-common item-type-task ${
                                              !scopeOfWork?.['additionalServiceId'] ? 'item-type-hive' : ''
                                            }`}
                                          >
                                            Task
                                          </Box>
                                        </Box>
                                        <Box className={'sow-list-item-check'}>
                                          <Checkbox
                                            onChange={handleDeliverableCheckbox}
                                            value={deliverable?.['id']}
                                            checked={selectedDeliverableData?.includes(deliverable?.['id'])}
                                          />
                                        </Box>
                                        <Box className={'sow-list-item-title'}>{deliverable?.['title']}</Box>
                                        {selectedDeliverableData?.includes(deliverable?.['id']) && (
                                          <Box className={'sow-list-item-input'}>
                                            <Dropdown dataList={teamUserList} />
                                            <TextField className={'sow-list-item-text-input'} />
                                          </Box>
                                        )}
                                      </Box>
                                      <Box className={'sow-list-item'} component={'label'}>
                                        <Box className={'sow-list-item-type'}>
                                          <Box
                                            className={`item-type-common item-type-subtask ${
                                              !scopeOfWork?.['additionalServiceId'] ? 'item-type-hive' : ''
                                            }`}
                                          >
                                            Subtask
                                          </Box>
                                        </Box>
                                        <Box className={'sow-list-item-check'}>
                                          <Checkbox
                                            onChange={handleDeliverableCheckbox}
                                            value={deliverable?.['id']}
                                            checked={selectedDeliverableData?.includes(deliverable?.['id'])}
                                          />
                                        </Box>
                                        <Box className={'sow-list-item-title'}>{deliverable?.['title']}</Box>
                                        {selectedDeliverableData?.includes(deliverable?.['id']) && (
                                          <Box className={'sow-list-item-input'}>
                                            <Dropdown dataList={teamUserList} />
                                            <TextField className={'sow-list-item-text-input'} />
                                          </Box>
                                        )}
                                      </Box>
                                    </Box>
                                  )
                                })}
                              </Box>
                            )
                          })}
                        </Box>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Box sx={sectionTitleSx}>Added Services</Box>
                      <Box>
                        {scopeOfWorkGroupByAdditionalServiceId(
                          serviceDeliverableGroupByScopeOfWorkId(
                            deliverableData?.filter((deliverable: any) => !!deliverable?.additionalServiceId)
                          )
                        )?.map((additionalService: any, additionalServiceIndex: number) => {
                          return (
                            <Box key={additionalServiceIndex}>
                              <Box sx={sectionSubTitleSx} component={'label'}>
                                <Checkbox
                                  onChange={() => {
                                    handleDeliverableCheckboxByService(additionalService)
                                  }}
                                  value={additionalService?.id}
                                  checked={isServiceCheckedInDeliverable(additionalService, selectedDeliverableData)}
                                  sx={{ p: 0, mr: 2 }}
                                />

                                {additionalService?.name}
                              </Box>
                              <Box sx={scopeOfWorkListContainer}>
                                <Box sx={scopeOfWorkListSx}>
                                  {additionalService?.scope_of_works?.map(
                                    (scopeOfWork: any, scopeOfWorkIndex: number) => {
                                      return (
                                        <Box key={scopeOfWorkIndex}>
                                          <Box className={'sow-list-item'} component={'label'}>
                                            <Box className={'sow-list-item-type'}>
                                              {/* {scopeOfWork?.['serviceDeliverablesId'] ? (
                                                <Box className={'item-type-common item-type-hive'}>Hive</Box>
                                              ) : (
                                                <Box className={'item-type-common item-type-sow'}>SOW</Box>
                                              )} */}
                                              <Box
                                                className={`item-type-common item-type-sow ${
                                                  scopeOfWork?.['serviceDeliverablesId'] ? 'item-type-hive' : ''
                                                }`}
                                              >
                                                SOW
                                              </Box>
                                            </Box>
                                            <Box className={'sow-list-item-check'}>
                                              <Checkbox
                                                onChange={() => {
                                                  handleDeliverableCheckboxBySow(scopeOfWork?.deliverables)
                                                }}
                                                value={scopeOfWork?.id}
                                                checked={isSowCheckedInDeliverable(
                                                  scopeOfWork?.deliverables,
                                                  selectedDeliverableData
                                                )}
                                              />
                                            </Box>
                                            <Box className={'sow-list-item-title'}>{scopeOfWork?.title}</Box>
                                          </Box>
                                          {scopeOfWork?.deliverables?.map(
                                            (deliverable: any, deliverableIndex: number) => {
                                              return (
                                                <Box
                                                  className={'sow-list-item'}
                                                  key={deliverableIndex}
                                                  component={'label'}
                                                >
                                                  <Box className={'sow-list-item-type'}>
                                                    <Box className={'item-type-common item-type-deliverable'}>
                                                      Deliverable
                                                    </Box>
                                                  </Box>
                                                  <Box className={'sow-list-item-check'}>
                                                    <Checkbox
                                                      onChange={handleDeliverableCheckbox}
                                                      value={deliverable?.['id']}
                                                      checked={selectedDeliverableData?.includes(deliverable?.['id'])}
                                                    />
                                                  </Box>
                                                  <Box className={'sow-list-item-title'}>{deliverable?.['title']}</Box>
                                                </Box>
                                              )
                                            }
                                          )}
                                        </Box>
                                      )
                                    }
                                  )}
                                </Box>
                              </Box>
                            </Box>
                          )
                        })}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              )}
              {activeStep == 8 && <Box>Review</Box>}
              {activeStep == 9 && <Box>Approval</Box>}
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
      <Modal
        open={serviceSOWModalOpen}
        onClose={handleServiceSOWModalClose}
        aria-labelledby='service-modal-title'
        aria-describedby='service-modal-description'
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Box
          className='p-5 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800'
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '50%',
            overflowY: 'auto',
            p: '50px',
            maxHeight: '100%',
            '& form': { width: '100%', display: 'flex', flexDirection: 'column' }
          }}
        >
          <Box sx={{ mb: '20px' }}>
            <h2 id='service-modal-title' className='my-6 text-xl font-semibold text-gray-700 dark:text-gray-200'>
              Add SOW
            </h2>
          </Box>

          <form>
            <Box sx={{ display: 'flex', width: '100%', gap: 5, mb: 5 }}>
              <Box
                sx={{
                  width: '100%',
                  '& .MuiInputBase-root': {
                    border: errorMessage?.['serviceId'] ? '1px solid #dc2626' : ''
                  }
                }}
              >
                <label className='block text-sm'>
                  <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Service Group</span>
                  <ServiceDropdownTree
                    name='serviceGroupId'
                    value={serviceSOWFormData.serviceGroupId}
                    // onChange={e => {
                    //   handleSelectChange(e, serviceSOWFormData, setServiceSOWFormData)
                    // }}
                    type='groups'
                  />
                  {!!errorMessage?.['serviceGroupId'] &&
                    errorMessage?.['serviceGroupId']?.map((message: any, index: number) => {
                      return (
                        <span key={index} className='text-xs text-red-600 dark:text-red-400'>
                          {message}
                        </span>
                      )
                    })}
                </label>
              </Box>
            </Box>

            {/* {serviceSOWEditDataId ? (
                <>
                  <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
                    <Box sx={{ width: '100%' }}>
                      <label className='block text-sm'>
                        <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Name</span>
                      </label>
                      <RichTextEditor
                        value={serviceSOWFormData.name}
                        onBlur={newContent =>
                          handleReachText(newContent, 'name', serviceSOWFormData, setServiceSOWFormData)
                        }
                      />
                      {!!errorMessage?.['name'] &&
                        errorMessage?.['name']?.map((message: any, index: number) => {
                          return (
                            <span key={index} className='text-xs text-red-600 dark:text-red-400'>
                              {message}
                            </span>
                          )
                        })}
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
                    <Box sx={{ width: '100%' }}>
                      <label className='block text-sm'>
                        <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Order</span>
                        <input
                          className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                          placeholder='Examples: 1'
                          name='order'
                          value={serviceSOWFormData.order}
                          onChange={e => {
                            handleTextChange(e, serviceSOWFormData, setServiceSOWFormData)
                          }}
                        />
                        {!!errorMessage?.['order'] &&
                          errorMessage?.['order']?.map((message: any, index: number) => {
                            return (
                              <span key={index} className='text-xs text-red-600 dark:text-red-400'>
                                {message}
                              </span>
                            )
                          })}
                      </label>
                    </Box>
                  </Box>
                </>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    gap: 5,
                    mb: 5,
                    flexDirection: 'column'
                  }}
                >
                  <>
                    {serviceSOWFormData.scopes?.map((scope, index) => (
                      <Box
                        key={index}
                        sx={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          p: '20px',
                          padding: '24px'
                        }}
                      >
                        <Box sx={{ width: '100%' }}>
                          <Box sx={{ width: '100%', display: 'flex', gap: 5, mb: 5 }}>
                            <Box sx={{ width: '100%' }}>
                              <label className='block text-sm'>
                                <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Name</span>
                              </label>

                              <Box sx={{ width: '100%' }}>
                                <RichTextEditor
                                  value={scope.name}
                                  onBlur={newContent =>
                                    handleMultipleReachTextChange(
                                      newContent,
                                      'name',
                                      index,
                                      serviceSOWFormData,
                                      setServiceSOWFormData,
                                      'scopes'
                                    )
                                  }
                                />
                              </Box>

                              {!!errorMessage?.[`names.${index}`] &&
                                errorMessage?.[`names.${index}`]?.map((message: any, index: number) => {
                                  return (
                                    <span key={index} className='text-xs text-red-600 dark:text-red-400'>
                                      {String(message).replaceAll('names.0', 'name')}
                                    </span>
                                  )
                                })}
                            </Box>
                          </Box>
                          <Box sx={{ width: '100%', display: 'flex', gap: 5, mb: 5 }}>
                            <Box sx={{ width: '100%' }}>
                              <label className='block text-sm'>
                                <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Order</span>
                                <input
                                  className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                                  placeholder='Examples: 1'
                                  name='order'
                                  value={scope.order}
                                  onChange={e => {
                                    handleMultipleTextChange(
                                      e,
                                      serviceSOWFormData,
                                      setServiceSOWFormData,
                                      index,
                                      'scopes'
                                    )
                                  }}
                                />
                              </label>
                            </Box>
                          </Box>
                        </Box>
                        <Button
                          type='button'
                          onClick={() => removeNameField(index, serviceSOWFormData, setServiceSOWFormData, 'scopes')}
                          className='mt-1 p-0 bg-red-500 text-white rounded-md'
                          sx={{
                            p: 0,
                            border: '1px solid #dc2626',
                            borderRadius: '50%',
                            minWidth: 'auto',
                            height: '35px',
                            width: '35px',
                            color: '#dc2626',
                            ml: 2,
                            '&:hover': {
                              background: '#dc2626',
                              color: '#fff'
                            }
                          }}
                        >
                          <DeleteIcon />
                        </Button>
                      </Box>
                    ))}
                  </>

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      type='button'
                      onClick={() => {
                        addSubField(serviceSOWFormData, setServiceSOWFormData, 'scopes', serviceSOWDefaultData.scopes)
                      }}
                      className='px-4 py-2 mr-3 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-blue'
                    >
                      <AddIcon /> Add Another Scope
                    </button>
                  </Box>
                </Box>
              )} */}
            <Box className='my-4 text-right'>
              <button
                onClick={onServiceSOWClear}
                type='button'
                className='px-4 py-2 mr-3 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-red-600 border border-transparent rounded-lg active:bg-red-600 hover:bg-red-700 focus:outline-none focus:shadow-outline-red'
              >
                Close <ClearIcon />
              </button>
              <button
                type='submit'
                className='px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-green-600 border border-transparent rounded-lg active:bg-green-600 hover:bg-green-700 focus:outline-none focus:shadow-outline-green'
              >
                <AddIcon />
                Save
              </button>
            </Box>
          </form>
        </Box>
      </Modal>
    </Box>
  )
}
