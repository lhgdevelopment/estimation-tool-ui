import AddIcon from '@material-ui/icons/Add'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import EditNoteIcon from '@mui/icons-material/EditNote'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove'
import { Box, Step, StepButton, Stepper } from '@mui/material'
import 'md-editor-rt/lib/style.css'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Preloader from '@core/components/preloader'
import { useToastSnackbar } from '@core/hooks/useToastSnackbar'
import apiRequest from '@core/utils/axios-config'
import { TProjectSOWFormComponent } from '../ProjectSOW.decorator'
import ProjectSOWDeliverableFormComponent from './steps/deliverable/ProjectSOWDeliverable.component'
import ProjectSOWEstimationFormComponent from './steps/eastimation/ProjectSOWEstimation.component'
import ProjectSOWOverviewFormComponent from './steps/overview/ProjectSOWOverview.component'
import ProjectSOWProblemAndGoalsFormComponent from './steps/problemAndGoals/ProjectSOWProblemAndGoals.component'
import ProjectSOWScopeOfWorkFormComponent from './steps/scopeOfWork/ProjectSOWScopeOfWork.component'
import ProjectSOWSummeryFormComponent from './steps/summery/ProjectSOWSummery.component'
import ProjectSOWTeamReviewFormComponent from './steps/teamReview/ProjectSOWTeamReview.component'
import ProjectSOWTranscriptFormComponent from './steps/transcript/ProjectSOWTranscript.component'

const steps = [
  'Transcript',
  'Summary',
  'Problems & Goals',
  'Overview',
  'Phase & SOW',
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
  const { showSnackbar } = useToastSnackbar()
  const { listData, setListData, isEdit = false } = props

  const projectSOWDefaultData = {
    serviceId: '',
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
  const [errorMessage, setErrorMessage] = useState<any>({})
  const [preload, setPreload] = useState<boolean>(false)
  const [projectSOWID, setProjectSOWID] = useState<any>(null)
  const [transcriptId, setTranscriptId] = useState<any>(null)
  const [summaryText, setSummaryText] = useState<any>('')
  const [problemGoalID, setProblemGoalID] = useState<any>(null)
  const [problemGoalText, setProblemGoalText] = useState<any>('')
  const [overviewTextID, setOverviewTextID] = useState<any>(null)
  const [overviewText, setOverviewText] = useState<any>('')
  const [phasesData, setPhasesData] = useState<any>([])
  const [scopeOfWorkData, setScopeOfWorkData] = useState<any>([])
  const [selectedScopeOfWorkData, setSelectedScopeOfWorkData] = useState<any>([])
  const [taskList, setTasksList] = useState<any>([])

  const [additionalServiceData, setAdditionalServiceData] = useState<any>([])
  const [selectedAdditionalServiceData, setSelectedAdditionalServiceData] = useState<any>([])
  const [deliverableData, setDeliverableData] = useState<any>([])
  const [selectedDeliverableData, setSelectedDeliverableData] = useState<any>([])

  const [deliverableServiceQuestionData, setDeliverableServiceQuestionData] = useState<any[]>([])

  const deliverableNoteDefaultData = { noteLink: '', note: '' }
  const [deliverableNotesData, setDeliverableNotesData] = useState<any[]>([deliverableNoteDefaultData])

  const [serviceList, setServiceList] = useState<any>([])

  const [teamUserList, setTeamUserList] = useState<any>([])

  const [associatedUserWithRole, setAssociatedUserWithRole] = useState<
    {
      employeeRoleId: string
      associateId: string
    }[]
  >([])

  const [transcriptMeetingLinks, setTranscriptMeetingLinks] = useState<string[]>([''])

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
    setPreload(prevState => true)
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
              ...projectSOWFormData
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
              showSnackbar('Updated Successfully!', { variant: 'success' })
            }, 1000)
          })
          .catch(error => {
            setPreload(false)
            setErrorMessage(error?.response?.data?.errors)
            showSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
          })
      } else {
        apiRequest
          .post('/project-summery', projectSOWFormData)
          .then(res => {
            setProjectSOWFormData({
              ...projectSOWFormData
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
              showSnackbar('Created Successfully!', { variant: 'success' })
            }, 1000)
          })
          .catch(error => {
            setPreload(false)
            setErrorMessage(error?.response?.data?.errors)
            showSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
          })
      }
    }
    if (activeStep === 1) {
      apiRequest
        .put(`/project-summery/${projectSOWID}`, { summaryText })
        .then(res => {
          setTranscriptId(res?.data?.meeting_transcript?.id)
          if (transcriptId && type == 'NEXT') {
            apiRequest
              .post('/problems-and-goals', { transcriptId })
              .then(res2 => {
                setProblemGoalID(res2?.data?.id)
                setProblemGoalText(res2?.data?.problemGoalText)
                setTimeout(() => {
                  setActiveStep(newActiveStep)
                  if (enabledStep < newActiveStep) {
                    setEnabledStep(newActiveStep)
                  }
                  setPreload(false)
                  showSnackbar('Created Successfully!', { variant: 'success' })
                }, 1000)
              })
              .catch(error => {
                setPreload(false)
                setErrorMessage(error?.response?.data?.errors)
                showSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
              })
          } else {
            setPreload(false)
          }
        })
        .catch(error => {
          setPreload(false)
          setErrorMessage(error?.response?.data?.errors)
          showSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
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
                  showSnackbar('Created Successfully!', { variant: 'success' })
                }, 1000)
              })
              .catch(error => {
                setPreload(false)
                setErrorMessage(error?.response?.data?.errors)
                showSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
              })
          } else {
            setPreload(false)
          }
        })
        .catch(error => {
          setPreload(false)
          setErrorMessage(error?.response?.data?.errors)
          showSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
        })
    }
    if (activeStep === 3) {
      apiRequest
        .post(`/project-overview/${overviewTextID}`, { overviewText })
        .then(res => {
          if (res?.data && type == 'NEXT') {
            apiRequest
              .get(`/phase?problemGoalId=${problemGoalID}`)
              .then(res2 => {
                if (res2?.data?.phases.length) {
                  setPhasesData(res2?.data?.phases)
                  setTimeout(() => {
                    if (type == 'NEXT') {
                      setActiveStep(newActiveStep)
                      if (enabledStep < newActiveStep) {
                        setEnabledStep(newActiveStep)
                      }
                    }
                    setPreload(false)
                    showSnackbar('Generated Successfully!', { variant: 'success' })
                  }, 1000)
                } else {
                  apiRequest
                    .post(`/phase`, { problemGoalID })
                    .then(res3 => {
                      setPhasesData(res3?.data)
                      apiRequest
                        .get(`/scope-of-work?problemGoalId=${problemGoalID}`)
                        .then(res4 => {
                          if (res4.data.scopeOfWorks?.length) {
                            setScopeOfWorkData(res4?.data?.scopeOfWorks)
                            setSelectedScopeOfWorkData(res4?.data?.scopeOfWorks?.map((item: any) => item?.id))
                            setTimeout(() => {
                              if (type == 'NEXT') {
                                setActiveStep(newActiveStep)
                                if (enabledStep < newActiveStep) {
                                  setEnabledStep(newActiveStep)
                                }
                              }
                              setPreload(false)
                              showSnackbar('Generated Successfully!', { variant: 'success' })
                            }, 1000)
                          } else {
                            apiRequest
                              .post(`/scope-of-work/`, {
                                problemGoalID: problemGoalID,
                                phaseId: res3?.data?.[0]?.id
                              })
                              .then(res5 => {
                                setScopeOfWorkData(res5?.data)
                                setSelectedScopeOfWorkData(res5?.data?.map((item: any) => item?.id))
                                setTimeout(() => {
                                  if (type == 'NEXT') {
                                    setActiveStep(newActiveStep)
                                    if (enabledStep < newActiveStep) {
                                      setEnabledStep(newActiveStep)
                                    }
                                  }
                                  setPreload(false)
                                  showSnackbar('Generated Successfully!', { variant: 'success' })
                                }, 1000)
                              })
                              .catch(error => {
                                setPreload(false)
                                setErrorMessage(error?.response?.data?.errors)
                                showSnackbar(error?.response?.data?.message ?? 'Something went wrong!', {
                                  variant: 'error'
                                })
                              })
                          }
                        })
                        .catch(error => {
                          setPreload(false)
                          setErrorMessage(error?.response?.data?.errors)
                          showSnackbar(error?.response?.data?.message ?? 'Something went wrong!', {
                            variant: 'error'
                          })
                        })
                    })
                    .catch(error => {
                      setPreload(false)
                      setErrorMessage(error?.response?.data?.errors)
                      showSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
                    })
                }
              })
              .catch(error => {
                setPreload(false)
                setErrorMessage(error?.response?.data?.errors)
                showSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
              })
          } else {
            setPreload(false)
          }
        })
        .catch(error => {
          setPreload(false)
          setErrorMessage(error?.response?.data?.errors)
          showSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
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
                  showSnackbar('Generated Successfully!', { variant: 'success' })
                }, 1000)
              } else {
                apiRequest
                  .post(`/deliverables`, { problemGoalId: problemGoalID, scopeOfWorkId: scopeOfWorkData?.[0]?.id })
                  .then(res3 => {
                    setDeliverableData(res3?.data)
                    setSelectedDeliverableData(res3?.data?.map((deliverable: any) => deliverable?.id))
                    apiRequest.post(`/deliverables/additional-service`, { problemGoalId: problemGoalID }).then(res4 => {
                      setDeliverableData((prevState: any) => [...prevState, ...res4?.data])
                      setSelectedDeliverableData((prevState: any) => [
                        ...prevState,
                        ...res4?.data?.map((deliverable: any) => deliverable?.id)
                      ])
                      setTimeout(() => {
                        if (type == 'NEXT') {
                          setActiveStep(newActiveStep)
                          if (enabledStep < newActiveStep) {
                            setEnabledStep(newActiveStep)
                          }
                        }
                        setPreload(false)
                        showSnackbar('Generated Successfully!', { variant: 'success' })
                      }, 1000)
                    })
                  })
                  .catch(error => {
                    setPreload(false)
                    setErrorMessage(error?.response?.data?.errors)
                    showSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
                  })
              }
            })
            .catch(error => {
              setPreload(false)
              setErrorMessage(error?.response?.data?.errors)
              showSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
            })
        })
        .catch(error => {
          setPreload(false)
          setErrorMessage(error?.response?.data?.errors)
          showSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
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
                    showSnackbar('Generated Successfully!', { variant: 'success' })
                  }, 1000)
                } else {
                  apiRequest
                    .post(`/deliverables`, { problemGoalId: problemGoalID })
                    .then(res3 => {
                      setDeliverableData(res3?.data?.deliverable)
                      setSelectedDeliverableData(res3?.data?.deliverables?.map((deliverable: any) => deliverable?.id))

                      apiRequest
                        .post(`/deliverables/additional-service`, { problemGoalId: problemGoalID })
                        .then(res4 => {
                          setDeliverableData((prevState: any) => [...prevState, ...res4?.data])
                          setSelectedDeliverableData((prevState: any) => [
                            ...prevState,
                            ...res4?.data?.map((deliverable: any) => deliverable?.id)
                          ])
                          setTimeout(() => {
                            if (type == 'NEXT') {
                              setActiveStep(newActiveStep)
                              if (enabledStep < newActiveStep) {
                                setEnabledStep(newActiveStep)
                              }
                            }
                            setPreload(false)
                            showSnackbar('Generated Successfully!', { variant: 'success' })
                          }, 1000)
                        })
                    })
                    .catch(error => {
                      setPreload(false)
                      setErrorMessage(error?.response?.data?.errors)
                      showSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
                    })
                }
              })
              .catch(error => {
                setPreload(false)
                setErrorMessage(error?.response?.data?.errors)
                showSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
              })
          } else {
            setPreload(false)
          }
        })
        .catch(error => {
          setPreload(false)
          setErrorMessage(error?.response?.data?.errors)
          showSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
        })
    }

    if (activeStep === 6) {
      apiRequest
        .post(`/team-review/`, {
          transcriptId,
          teams: [...associatedUserWithRole]
        })
        .then(res => {
          apiRequest
            .get(`/estimation-tasks?problemGoalId=${problemGoalID}`)
            .then(res2 => {
              if (res?.data?.projectTeams?.length) {
                setAssociatedUserWithRole([
                  ...res?.data?.tasksData?.projectTeams?.map((projectTeam: any) => ({
                    employeeRoleId: projectTeam?.employeeRoleId,
                    associateId: projectTeam?.associateId
                  }))
                ])
              }
              if (res2?.data.tasks.length) {
                setTasksList(res2?.data?.tasks)
                setTimeout(() => {
                  if (type == 'NEXT') {
                    setActiveStep(newActiveStep)
                    if (enabledStep < newActiveStep) {
                      setEnabledStep(newActiveStep)
                    }
                  }
                  setPreload(false)
                  showSnackbar('Generated Successfully!', { variant: 'success' })
                }, 1000)
              } else {
                apiRequest
                  .post(`/estimation-tasks/`, {
                    problemGoalId: problemGoalID,
                    deliverableId: deliverableData?.[0]?.id
                  })
                  .then(res3 => {
                    setTasksList(res3?.data)
                    apiRequest
                      .post(`/estimation-tasks/additional-service`, { problemGoalId: problemGoalID })
                      .then(res4 => {
                        setTasksList((prevState: any) => [...prevState, ...res4?.data])

                        setTimeout(() => {
                          if (type == 'NEXT') {
                            setActiveStep(newActiveStep)
                            if (enabledStep < newActiveStep) {
                              setEnabledStep(newActiveStep)
                            }
                          }
                          setPreload(false)
                          showSnackbar('Generated Successfully!', { variant: 'success' })
                        }, 1000)
                      })
                  })
                  .catch(error => {
                    setPreload(false)
                    setErrorMessage(error?.response?.data?.errors)
                    showSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
                  })
              }
            })
            .catch(error => {
              setPreload(false)
              setErrorMessage(error?.response?.data?.errors)
              showSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
            })
        })
        .catch(error => {
          setPreload(false)
          setErrorMessage(error?.response?.data?.errors)
          showSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
        })
    }
    if (activeStep === 7) {
      apiRequest
        .get(`/estimation-tasks?problemGoalId=${problemGoalID}`)
        .then(res => {
          if (res?.data?.tasks?.length) {
            setPreload(false)
          } else {
            apiRequest
              .post(`/estimation-tasks/`, {
                problemGoalId: problemGoalID,
                deliverableId: deliverableData?.[0]?.id
              })
              .then(res3 => {
                setTasksList(res3?.data)
                apiRequest.post(`/estimation-tasks/additional-service`, { problemGoalId: problemGoalID }).then(res4 => {
                  setTasksList((prevState: any) => [...prevState, ...res4?.data])

                  setTimeout(() => {
                    if (type == 'NEXT') {
                      setActiveStep(newActiveStep)
                      if (enabledStep < newActiveStep) {
                        setEnabledStep(newActiveStep)
                      }
                    }
                    setPreload(false)
                    showSnackbar('Generated Successfully!', { variant: 'success' })
                  }, 1000)
                })
              })
              .catch(error => {
                setPreload(false)
                setErrorMessage(error?.response?.data?.errors)
                showSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
              })
          }
        })
        .catch(error => {
          console.log(error)
        })
    } else {
      // setPreload(false)
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

  const getDetails = (id: string | null | undefined) => {
    if (!id) return
    let getEnableStep = 0
    setPreload(true)
    apiRequest
      .get(`/project-summery/${id}`)
      .then((res: any) => {
        setTranscriptId(res?.data?.meeting_transcript?.id)
        const transcriptText = res?.data?.meeting_transcript?.['transcriptText'] || ''
        const serviceId = res?.data?.meeting_transcript?.['serviceId'] || ''
        const projectName = res?.data?.meeting_transcript?.['projectName'] || ''
        const company = res?.data?.meeting_transcript?.['company'] || ''
        const clientEmail = res?.data?.meeting_transcript?.['clientEmail'] || ''
        const clientPhone = res?.data?.meeting_transcript?.['clientPhone'] || ''
        const clientWebsite = res?.data?.meeting_transcript?.['clientWebsite'] || ''
        const meetingLinks = res?.data?.meeting_transcript?.['meeting_links']?.map(
          (meeting_link: any) => meeting_link?.meetingLink
        ) || ['']

        const summaryText = res?.data?.['summaryText'] || ''
        setTranscriptMeetingLinks(
          res?.data?.meeting_transcript?.['meeting_links']?.map((meeting_link: any) => meeting_link?.meetingLink) || [
            ''
          ]
        )

        setProjectSOWFormData({
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

        if (res?.data?.phaseData && res?.data?.phaseData?.phases?.length) {
          setPhasesData([...res?.data?.phaseData?.phases])
          // setSelectedScopeOfWorkData(
          //   res?.data?.scopeOfWorksData?.scopeOfWorks
          //     ?.filter((scopeOfWork: any) => !scopeOfWork?.additionalServiceId)
          //     ?.map((scopeOfWork: any) => scopeOfWork?.id)
          // )

          getEnableStep = 4
        }

        if (res?.data?.scopeOfWorksData && res?.data?.scopeOfWorksData?.scopeOfWorks?.length) {
          setScopeOfWorkData(res?.data?.scopeOfWorksData?.scopeOfWorks)
          setSelectedScopeOfWorkData(
            res?.data?.scopeOfWorksData?.scopeOfWorks?.map((scopeOfWork: any) => scopeOfWork?.id)
          )

          setSelectedAdditionalServiceData(
            res?.data?.scopeOfWorksData?.additionalServices?.map(
              (additionalService: any) => additionalService?.selectedServiceId
            )
          )

          setAdditionalServiceData(res?.data?.scopeOfWorksData?.additionalServices)

          getEnableStep = 5
        }

        // console.log(res?.data?.deliverablesData?.deliverables)
        // console.log(res?.data)

        if (res?.data?.deliverablesData && res?.data?.deliverablesData?.deliverables?.length) {
          setDeliverableData(res?.data?.deliverablesData?.deliverables)
          setSelectedDeliverableData(
            res?.data?.deliverablesData?.deliverables?.map((deliverable: any) => deliverable?.id)
          )
          if (res?.data?.deliverablesData?.deliverableNotes?.length) {
            setDeliverableNotesData(res?.data?.deliverablesData?.deliverableNotes ?? [])
          }

          // setSelectedAdditionalServiceScopeOfWorkData(
          //   res?.data?.deliverablesData?.deliverables
          //     ?.filter((deliverable: any) => !!deliverable?.additionalServiceId)
          //     ?.map((deliverable: any) => deliverable?.id)
          // )
          // setAdditionalServiceScopeOfWorkData(
          //   res?.data?.deliverablesData?.deliverables?.filter((deliverable: any) => !!deliverable?.additionalServiceId)
          // )

          setDeliverableServiceQuestionData(
            res?.data?.deliverablesData?.questionAnswers?.map((questionAnswer: any) => ({
              questionId: questionAnswer?.questionId,
              answer: questionAnswer?.answer
            }))
          )

          getEnableStep = 9
        }

        if (res?.data?.tasksData && res?.data?.tasksData?.projectTeams?.length) {
          setAssociatedUserWithRole([
            ...res?.data?.tasksData?.projectTeams?.map((projectTeam: any) => ({
              employeeRoleId: projectTeam?.employeeRoleId,
              associateId: projectTeam?.associateId
            }))
          ])
          getEnableStep = 9
        }
        if (res?.data?.tasksData && res?.data?.tasksData?.tasks?.length) {
          setTasksList(res?.data?.tasksData?.tasks)

          getEnableStep = 9
        }

        setEnabledStep(getEnableStep)
        setPreload(false)
      })
      .catch(error => {
        setEnabledStep(0)
        setPreload(false)
        showSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
      })
  }

  const getServiceList = async () => {
    await apiRequest
      .get(`/services`)
      .then(res => {
        setServiceList(res?.data)
      })
      .catch(error => {
        showSnackbar(error?.message, { variant: 'error' })
      })
  }

  const getUserList = async () => {
    await apiRequest
      .get(`/associates`)
      .then(res => {
        setTeamUserList(res?.data)
      })
      .catch(error => {
        showSnackbar(error?.message, { variant: 'error' })
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

  useEffect(() => {
    onClear()
    setEnabledStep(0)
    setActiveStep(0)
    getServiceList()
    getUserList()
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
            {steps?.map((label, index) => (
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
                <ProjectSOWSummeryFormComponent
                  errorMessage={errorMessage}
                  projectSOWFormData={projectSOWFormData}
                  setSummaryText={setSummaryText}
                  summaryText={summaryText}
                ></ProjectSOWSummeryFormComponent>
              )}
              {activeStep == 2 && (
                <ProjectSOWProblemAndGoalsFormComponent
                  errorMessage={errorMessage}
                  projectSOWFormData={projectSOWFormData}
                  problemGoalText={problemGoalText}
                  setProblemGoalText={setProblemGoalText}
                ></ProjectSOWProblemAndGoalsFormComponent>
              )}
              {activeStep == 3 && (
                <ProjectSOWOverviewFormComponent
                  errorMessage={errorMessage}
                  projectSOWFormData={projectSOWFormData}
                  overviewText={overviewText}
                  setOverviewText={setOverviewText}
                ></ProjectSOWOverviewFormComponent>
              )}

              {activeStep == 4 && (
                <ProjectSOWScopeOfWorkFormComponent
                  handleAdditionalServiceSelection={handleAdditionalServiceSelection}
                  selectedAdditionalServiceData={selectedAdditionalServiceData}
                  selectedScopeOfWorkData={selectedScopeOfWorkData}
                  setSelectedScopeOfWorkData={setSelectedScopeOfWorkData}
                  problemGoalID={problemGoalID}
                  scopeOfWorkData={scopeOfWorkData}
                  setScopeOfWorkData={setScopeOfWorkData}
                  serviceList={serviceList}
                  serviceId={projectSOWFormData.serviceId}
                  phaseData={phasesData}
                  setPhaseData={setScopeOfWorkData}
                ></ProjectSOWScopeOfWorkFormComponent>
              )}

              {activeStep == 5 && (
                <ProjectSOWDeliverableFormComponent
                  deliverableData={deliverableData}
                  projectSOWFormData={projectSOWFormData}
                  deliverableNotesData={deliverableNotesData}
                  deliverableServiceQuestionData={deliverableServiceQuestionData}
                  setDeliverableNotesData={setDeliverableNotesData}
                  setDeliverableServiceQuestionData={setDeliverableServiceQuestionData}
                  selectedDeliverableData={selectedDeliverableData}
                  setSelectedDeliverableData={setSelectedDeliverableData}
                  problemGoalID={problemGoalID}
                  serviceId={projectSOWFormData.serviceId}
                  setScopeOfWorkData={setScopeOfWorkData}
                  selectedAdditionalServiceData={selectedAdditionalServiceData}
                  scopeOfWorkData={scopeOfWorkData}
                  phaseDataList={phasesData}
                  additionalServiceData={additionalServiceData}
                ></ProjectSOWDeliverableFormComponent>
              )}
              {activeStep == 6 && (
                <ProjectSOWTeamReviewFormComponent
                  projectSOWFormData={projectSOWFormData}
                  setOverviewText={setOverviewText}
                  overviewText={overviewText}
                  associatedUserWithRole={associatedUserWithRole}
                  errorMessage={errorMessage}
                  problemGoalText={problemGoalText}
                  setAssociatedUserWithRole={setAssociatedUserWithRole}
                ></ProjectSOWTeamReviewFormComponent>
              )}
              {activeStep == 7 && (
                <ProjectSOWEstimationFormComponent
                  associatedUserWithRole={associatedUserWithRole}
                  setSelectedDeliverableData={setSelectedDeliverableData}
                  overviewText={overviewText}
                  problemGoalID={problemGoalID}
                  problemGoalText={problemGoalText}
                  projectSOWFormData={projectSOWFormData}
                  setAssociatedUserWithRole={setAssociatedUserWithRole}
                  taskList={taskList}
                  setTasksList={setTasksList}
                  teamUserList={teamUserList}
                  transcriptId={transcriptId}
                  scopeOfWorkData={scopeOfWorkData}
                  phaseData={phasesData}
                  additionalServiceData={additionalServiceData}
                  deliverableData={deliverableData}
                  setDeliverableData={setDeliverableData}
                ></ProjectSOWEstimationFormComponent>
              )}
              {activeStep == 8 && <Box>Review</Box>}
              {activeStep == 9 && <Box>Approval</Box>}
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
            </Box>
          </React.Fragment>
        </Box>
      </Box>
    </Box>
  )
}
