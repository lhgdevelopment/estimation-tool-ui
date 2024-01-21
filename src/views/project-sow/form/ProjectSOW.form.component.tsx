import AddIcon from '@material-ui/icons/Add'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import EditNoteIcon from '@mui/icons-material/EditNote'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove'
import { Box, SelectChangeEvent, Step, StepButton, Stepper } from '@mui/material'
import { useMask } from '@react-input/mask'
import { ExposeParam, MdEditor } from 'md-editor-rt'
import 'md-editor-rt/lib/style.css'
import { useRouter } from 'next/router'
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { Dropdown } from 'src/@core/components/dropdown'
import MdPreviewTitle from 'src/@core/components/md-preview-title'
import Preloader from 'src/@core/components/preloader'
import apiRequest from 'src/@core/utils/axios-config'
import Swal from 'sweetalert2'
import { TProjectSOWFormComponent, projectTypeList } from '../ProjectSOW.decorator'

const steps = ['Transcript', 'Summery', 'Problems & Goals', 'Project Overview', 'SOW', 'Deliverables']

export default function ProjectSOWFormComponent(props: TProjectSOWFormComponent) {
  const { listData, setListData, isEdit = false } = props
  const router = useRouter()

  const phoneInputRef = useMask({
    mask: '(___) ___-____',
    replacement: { _: /\d/ },
    showMask: true,
    separate: true
  })

  const projectSOWDefaultData = {
    transcriptId: '',
    transcriptText: '',
    projectType: '',
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
  const [deliverablesTextID, setDeliverablesTextID] = useState<any>(null)
  const [deliverablesText, setDeliverablesText] = useState<any>('')

  const [errorMessage, setSrrorMessage] = useState<any>({})

  const handleProjectSOWChange = (e: SelectChangeEvent<any>) => {
    setProjectSOWFormData({
      ...projectSOWFormData,
      [e.target.name]: e.target.value
    })
  }

  const handleSelectChange = (e: any) => {
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
    setSrrorMessage({})
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
            setSrrorMessage(error?.response?.data?.errors)
          })
      } else {
        apiRequest
          .post('/project-summery', projectSOWFormData)
          .then(res => {
            apiRequest.get(`/project-summery?page=1`).then(res => {
              if (setListData) {
                setListData(res.data)
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
            setSrrorMessage(error?.response?.data?.errors)
          })
      }
    }
    if (activeStep === 1) {
      apiRequest
        .put(`/project-summery/${projectSOWID}`, { summaryText })
        .then(res => {
          if (res?.data?.meeting_transcript && type == 'NEXT') {
            apiRequest.post('/problems-and-goals', { transcriptId: res?.data?.meeting_transcript?.id }).then(res2 => {
              Swal.fire({
                title: 'Data Created Successfully!',
                icon: 'success',
                timer: 1000,
                timerProgressBar: true,
                showConfirmButton: false
              })

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
          setSrrorMessage(error?.response?.data?.errors)
        })
    }
    if (activeStep === 2) {
      apiRequest
        .post(`/problems-and-goals/${problemGoalID}`, { problemGoalText })
        .then(res => {
          console.log(res)
          if (res?.data && type == 'NEXT') {
            apiRequest.post('/project-overview', { problemGoalID }).then(res2 => {
              Swal.fire({
                title: 'Data Created Successfully!',
                icon: 'success',
                timer: 1000,
                timerProgressBar: true,
                showConfirmButton: false
              })
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
          setSrrorMessage(error?.response?.data?.errors)
        })
    }
    if (activeStep === 3) {
      apiRequest
        .post(`/project-overview/${overviewTextID}`, { overviewText })
        .then(res => {
          if (res?.data && type == 'NEXT') {
            apiRequest.post('/scope-of-work', { problemGoalID }).then(res2 => {
              Swal.fire({
                title: 'Data Created Successfully!',
                icon: 'success',
                timer: 1000,
                timerProgressBar: true,
                showConfirmButton: false
              })
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
          setSrrorMessage(error?.response?.data?.errors)
        })
    }

    if (activeStep === 4) {
      apiRequest
        .post(`/scope-of-work/${scopeTextID}`, { scopeText })
        .then(res => {
          console.log(res)
          if (res?.data && type == 'NEXT') {
            apiRequest.post('/deliverables', { scopeOfWorkId: scopeTextID }).then(res2 => {
              Swal.fire({
                title: 'Data Created Successfully!',
                icon: 'success',
                timer: 1000,
                timerProgressBar: true,
                showConfirmButton: false
              })
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
          } else {
            setPreload(false)
          }
        })
        .catch(error => {
          setPreload(false)
          setSrrorMessage(error?.response?.data?.errors)
        })
    }
    if (activeStep === 5) {
      apiRequest
        .post(`/deliverables/${deliverablesTextID}`, { deliverablesText })
        .then(res => {
          apiRequest.get(`/project-summery?page=1`).then(res => {
            if (setListData) {
              setListData(res.data)
            }
          })

          Swal.fire({
            title: 'Data Created Successfully!',
            icon: 'success',
            timer: 1000,
            timerProgressBar: true,
            showConfirmButton: false
          })

          setTimeout(() => {
            setActiveStep(0)
            setPreload(false)

            // setListData(res)
          }, 1000)
        })
        .catch(error => {
          setPreload(false)
          setSrrorMessage(error?.response?.data?.errors)
        })
    }
  }

  const handleStep = (step: number) => () => {
    setActiveStep(step)
  }

  const getDetails = (id: string | null | undefined) => {
    if (!id) return

    setPreload(true)
    apiRequest.get(`/project-summery/${id}`).then((res: any) => {
      setActiveStep(0)

      setProjectSOWFormData({
        transcriptId: res?.data?.id,
        transcriptText: res?.data?.['meeting_transcript']?.['transcriptText'],
        projectType: res?.data?.['meeting_transcript']?.['projectType'],
        projectName: res?.data?.['meeting_transcript']?.['projectName'],
        company: res?.data?.['meeting_transcript']?.['company'],
        clientEmail: res?.data?.['meeting_transcript']?.['clientEmail'],
        clientPhone: res?.data?.['meeting_transcript']?.['clientPhone'],
        clientWebsite: res?.data?.['meeting_transcript']?.['clientWebsite'],
        summaryText: res?.data?.['summaryText']
      })
      setProjectSOWID(id)
      setSummaryText(res?.data?.['summaryText'])
      setEnabledStep(1)
      if (res?.data?.['meeting_transcript']?.['problems_and_goals']?.['id']) {
        setProblemGoalID(res?.data?.['meeting_transcript']?.['problems_and_goals']?.['id'])
        setProblemGoalText(res?.data?.['meeting_transcript']?.['problems_and_goals']?.['problemGoalText'])
        setEnabledStep(2)
      }

      if (res?.data?.['meeting_transcript']?.['problems_and_goals']?.['project_overview']?.['id']) {
        setOverviewTextID(res?.data?.['meeting_transcript']?.['problems_and_goals']?.['project_overview']?.['id'])
        setOverviewText(
          res?.data?.['meeting_transcript']?.['problems_and_goals']?.['project_overview']?.['overviewText']
        )
        setEnabledStep(3)
      }

      if (res?.data?.['meeting_transcript']?.['problems_and_goals']?.['scope_of_work']?.['id']) {
        setScopeTextID(res?.data?.['meeting_transcript']?.['problems_and_goals']?.['scope_of_work']?.['id'])
        setScopeText(res?.data?.['meeting_transcript']?.['problems_and_goals']?.['scope_of_work']?.['scopeText'])
        setEnabledStep(4)
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
        setEnabledStep(5)
      }

      console.log(Number(router?.query?.['step']) < enabledStep)
      console.log(enabledStep)
      console.log(Number(router?.query?.['step']))

      setPreload(false)
    })
  }

  useEffect(() => {
    getDetails(router?.query['id'] as string)
  }, [router?.query['id']])

  useEffect(() => {
    if (isEdit && router?.query?.['step'] && Number(router?.query?.['step']) <= enabledStep) {
      setActiveStep(Number(router?.query?.['step']))
    }
  }, [enabledStep])

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
                        <span className='text-gray-700 dark:text-gray-400'>Transcript Text</span>
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
                        <span className='text-gray-700 dark:text-gray-400'>Project Type</span>
                        <Dropdown
                          isEnumField
                          enumList={projectTypeList}
                          name='projectType'
                          value={projectSOWFormData.projectType}
                          onChange={handleSelectChange}
                        />
                      </label>
                    </Box>
                    {/* <Box sx={{ width: '50%' }}>
                      <label className='block text-sm'>
                        <span className='text-gray-700 dark:text-gray-400'>Project Type</span>
                        <Dropdown
                          url={'project-type'}
                          name='projectType'
                          value={projectSOWFormData.projectType}
                          onChange={handleSelectChange}
                          optionConfig={{ id: 'id', title: 'name' }}
                        />
                        {!!errorMessage?.['projectType'] &&
                          errorMessage?.['projectType']?.map((message: any, index: number) => {
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
                        <span className='text-gray-700 dark:text-gray-400'>Project Name</span>
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
                        <span className='text-gray-700 dark:text-gray-400'>Company</span>
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
                        <span className='text-gray-700 dark:text-gray-400'>Phone</span>
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
                        <span className='text-gray-700 dark:text-gray-400'>Email</span>
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
                        <span className='text-gray-700 dark:text-gray-400'>Website</span>
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
                        <span className='text-gray-700 dark:text-gray-400'>Summary Text</span>
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
                        <span className='text-gray-700 dark:text-gray-400'>Problem Goal Text</span>

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
                        <span className='text-gray-700 dark:text-gray-400'>Overview Text</span>
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
                  <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
                    <Box sx={{ width: '100%' }}>
                      <label className='block text-sm' htmlFor={'#problemGoalText'}>
                        <span className='text-gray-700 dark:text-gray-400'>Scope of Work</span>
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
                      <label className='block text-sm' htmlFor={'#deliverablesText'}>
                        <span className='text-gray-700 dark:text-gray-400'>Deliverable</span>
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
                {!router?.query['id'] && (
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
                        {router?.query['id'] ? 'Update ' : 'Save '}

                        {router?.query['id'] ? <EditNoteIcon /> : <AddIcon />}
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
