import AddIcon from '@material-ui/icons/Add'
import CheckIcon from '@mui/icons-material/Check'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import DeleteIcon from '@mui/icons-material/Delete'
import EditNoteIcon from '@mui/icons-material/EditNote'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove'
import { Box, Checkbox, IconButton, SelectChangeEvent, Step, StepButton, Stepper, TextField } from '@mui/material'
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
  deliverableNoteAddButtonSx,
  deliverableNoteItemSx,
  deliverableNoteRemoveButtonSx,
  scopeOfWorkListContainer,
  scopeOfWorkListSx,
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

  type TDeliverableNote = {
    noteLink: string
    note: string
  }
  const deliverableNoteDefaultData = { noteLink: '', note: '' }
  const [deliverableNotesData, setDeliverableNotesData] = useState<any[]>([deliverableNoteDefaultData])

  // const [serviceTreeData, setServiceTreeData] = useState<any>([])
  const [projectTypeList, setProjectTypeList] = useState<any>([])
  const [serviceList, setServiceList] = useState<any>([])
  const [transcriptMeetingLinks, setTranscriptMeetingLinks] = useState<string[]>([''])

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
          notes: [...deliverableNotesData]
        })
        .then(res => {
          if (res && type == 'NEXT') {
            apiRequest
              .get(`/deliverables?problemGoalId=${problemGoalID}`)
              .then(res2 => {
                console.log(res2?.data)

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
    }
  }

  const handleStep = (step: number) => () => {
    setActiveStep(step)
  }

  const handleScopeOfWorkCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  const getDetails = (id: string | null | undefined) => {
    if (!id) return
    let getEnableStep = 0
    setPreload(true)
    apiRequest.get(`/project-summery/${id}`).then((res: any) => {
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

        console.log({ additionalServiceScopeOfWorkData })
        console.log({ selectedAdditionalServiceScopeOfWorkData })

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

        getEnableStep = 5
      }

      setEnabledStep(getEnableStep)
      setPreload(false)
    })
  }

  // const getServiceTree = async () => {
  //   await apiRequest
  //     // .get(`/service-tree?per_page=500&serviceId=${projectSOWFormData.serviceId}`)
  //     .get(`/service-tree?per_page=500&serviceId=${4}`)
  //     .then(res => {
  //       setServiceTreeData(res?.data?.services)
  //       setServiceDeliverableLeftList(res?.data?.services?.[0]?.groups)
  //       const transformServiceTree = res?.data?.services.map((service: any) => {
  //         const serviceObj = {
  //           [service.id]: Object.fromEntries(
  //             service?.groups?.map((group: any) => {
  //               const groupObj = Object.fromEntries(
  //                 group?.sows?.map((sow: any) => {
  //                   const sowObj = Object.fromEntries(
  //                     sow?.deliverables?.map((deliverable: any) => {
  //                       const deliverableObj = Object.fromEntries(
  //                         deliverable?.tasks?.map((task: any) => {
  //                           if (task?.sub_tasks?.length) {
  //                             const taskObj = Object.fromEntries(
  //                               (task?.sub_tasks || []).map((sub_task: any) => {
  //                                 return [
  //                                   [sub_task.id],
  //                                   {
  //                                     hours: null
  //                                   }
  //                                 ]
  //                               })
  //                             )

  //                             return [task.id, taskObj]
  //                           }

  //                           return {
  //                             hours: null
  //                           }
  //                         })
  //                       )

  //                       return [deliverable.id, deliverableObj]
  //                     })
  //                   )

  //                   return [sow.id, sowObj]
  //                 })
  //               )

  //               return [group.id, groupObj]
  //             })
  //           )
  //         }

  //         return serviceObj
  //       })[0]
  //       setServiceDeliverablesFormData(transformServiceTree)

  //       // setServiceDeliverablesFormData()
  //     })
  //     .catch(error => {
  //       enqueueSnackbar(error?.message, { variant: 'error' })
  //     })
  // }

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
    const grouped = data.reduce((acc: { [key: number]: any }, item: any) => {
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
          serviceScopeTitle: scope_of_work.title,
          scopeOfWorkId: scopeOfWorkId,
          deliverables: []
        }
      }

      acc[scopeOfWorkId].deliverables.push(item)

      return acc
    }, {})

    return Object.values(grouped)
  }

  // console.log(serviceGroupByProjectTypeId(serviceList))

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
  }, [isEdit, id, step])

  useEffect(() => {
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
                            errorMessage?.['projectName'] ? 'border-red-600' : 'dark:border-gray-600'
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
                        <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Overview Text</span>
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
                  <Box sx={scopeOfWorkListContainer}>
                    <Box sx={scopeOfWorkListSx}>
                      {scopeOfWorkData?.map((scopeOfWork: any, index: number) => {
                        return (
                          <Box className={'sow-list-item'} key={index}>
                            <Box className={'sow-list-item-type'}>
                              {scopeOfWork?.['serviceScopeId'] ? (
                                <Box className={'item-type-common item-type-hive'}>HIVE</Box>
                              ) : (
                                <Box className={'item-type-common item-type-sow'}>SOW</Box>
                              )}
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
                    <Box sx={{ fontSize: '20px', fontWeight: '600', color: '#158ddf', mb: 2 }}>Add Services</Box>
                    <Box sx={{ py: 0, px: 5 }}>
                      {serviceGroupByProjectTypeId(serviceList)?.map((projectType: any, index: number) => (
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, fontWeight: '600' }} key={index}>
                          <Box sx={{ mr: 2, color: '#777' }}>{projectType?.projectTypeName}</Box>
                          <Box>
                            {projectType?.services?.map((service: any) => (
                              <Box
                                sx={{
                                  position: 'relative',
                                  display: 'flex',
                                  p: '5px 25px',
                                  borderRadius: '15px',
                                  fontSize: '14px',
                                  lineHeight: 'normal',
                                  background: '#afaeb3',
                                  color: '#fff',
                                  cursor: 'pointer',
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
                  <Box sx={scopeOfWorkListContainer}>
                    <Box sx={scopeOfWorkListSx}>
                      {serviceDeliverableGroupByScopeOfWorkId(
                        deliverableData?.filter((deliverable: any) => !deliverable?.additionalServiceId)
                      )?.map((scopeOfWork: any, index: number) => {
                        return (
                          <Box key={index}>
                            <Box className={'sow-list-item'}>
                              <Box className={'sow-list-item-type'}>
                                {scopeOfWork?.['serviceDeliverablesId'] ? (
                                  <Box className={'item-type-common item-type-hive'}>Hive</Box>
                                ) : (
                                  <Box className={'item-type-common item-type-sow'}>SOW</Box>
                                )}
                              </Box>
                              <Box className={'sow-list-item-check'}>
                                <Checkbox
                                  onChange={handleScopeOfWorkCheckbox}
                                  value={scopeOfWork?.scopeOfWorkId}
                                  checked={selectedDeliverableData?.includes(scopeOfWork?.scopeOfWorkId)}
                                />
                              </Box>
                              <Box className={'sow-list-item-title'}>{scopeOfWork?.serviceScopeTitle}</Box>
                            </Box>
                            {scopeOfWork?.deliverables?.map((deliverable: any, deliverableIndex: number) => {
                              return (
                                <Box className={'sow-list-item'} key={deliverableIndex}>
                                  <Box className={'sow-list-item-type'}>
                                    <Box className={'item-type-common item-type-deliverable'}>Deliverable</Box>
                                  </Box>
                                  <Box className={'sow-list-item-check'}>
                                    <Checkbox
                                      onChange={handleScopeOfWorkCheckbox}
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
                      <Box sx={{ fontSize: '20px', fontWeight: '600', color: '#158ddf', mb: 2 }}>Notes</Box>
                      <Box sx={deliverableNoteAddButtonSx} onClick={handleDeliverableNoteAdd}>
                        <AddIcon fontSize='small' />
                      </Box>
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

                            <IconButton
                              onClick={() => {
                                handleDeliverableNoteRemove(index)
                              }}
                              sx={deliverableNoteRemoveButtonSx}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        )
                      })}
                    </Box>
                  </Box>
                  <Box>
                    <Box sx={{ fontSize: '20px', fontWeight: '600', color: '#158ddf', mb: 2 }}>Added Services</Box>
                    <Box sx={scopeOfWorkListContainer}>
                      <Box sx={scopeOfWorkListSx}>
                        {serviceDeliverableGroupByScopeOfWorkId(
                          deliverableData?.filter((deliverable: any) => !deliverable?.additionalServiceId)
                        )?.map((scopeOfWork: any, index: number) => {
                          return (
                            <Box key={index}>
                              <Box className={'sow-list-item'}>
                                <Box className={'sow-list-item-type'}>
                                  {scopeOfWork?.['serviceDeliverablesId'] ? (
                                    <Box className={'item-type-common item-type-hive'}>Hive</Box>
                                  ) : (
                                    <Box className={'item-type-common item-type-sow'}>SOW</Box>
                                  )}
                                </Box>
                                <Box className={'sow-list-item-check'}>
                                  <Checkbox
                                    onChange={handleScopeOfWorkCheckbox}
                                    value={scopeOfWork?.scopeOfWorkId}
                                    checked={selectedDeliverableData?.includes(scopeOfWork?.scopeOfWorkId)}
                                  />
                                </Box>
                                <Box className={'sow-list-item-title'}>{scopeOfWork?.serviceScopeTitle}</Box>
                              </Box>
                              {scopeOfWork?.deliverables?.map((deliverable: any, deliverableIndex: number) => {
                                return (
                                  <Box className={'sow-list-item'} key={deliverableIndex}>
                                    <Box className={'sow-list-item-type'}>
                                      <Box className={'item-type-common item-type-deliverable'}>Deliverable</Box>
                                    </Box>
                                    <Box className={'sow-list-item-check'}>
                                      <Checkbox
                                        onChange={handleScopeOfWorkCheckbox}
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
                  </Box>
                </Box>
              )}
              {activeStep == 6 && <Box>Team Review</Box>}
              {activeStep == 7 && <Box>Estimation</Box>}
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
    </Box>
  )
}
