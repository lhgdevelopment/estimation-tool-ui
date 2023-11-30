import EditNoteIcon from '@mui/icons-material/EditNote'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import { Box, CircularProgress, SelectChangeEvent, Step, StepButton, Stepper } from '@mui/material'
import JoditEditor from 'jodit-react'
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import apiRequest from 'src/@core/utils/axios-config'
import Swal from 'sweetalert2'
import { TProjectSummeryComponent } from '../ProjectSummery.decorator'

const steps = ['Meeting Summery', 'Problems and Goals', 'Project Overview', 'SOW']

export default function ProjectSummeryFormComponent(props: TProjectSummeryComponent) {
  const editor = useRef(null)
  const { editDataId, setEditDataId, listData, setListData, editData, setEditData } = props
  const [activeStep, setActiveStep] = useState(0)
  const [completed, setCompleted] = useState<{
    [k: number]: boolean
  }>({})

  const meetingSummaryDefaultData = {
    transcriptText: '',
    projectName: '',
    clientPhone: '',
    clientEmail: '',
    clientWebsite: ''
  }

  const [meetingSummaryFormData, setMeetingSummaryFormData] = useState(meetingSummaryDefaultData)

  const [preload, setPreload] = useState<boolean>(false)
  const [transcriptId, setTranscriptId] = useState<any>(null)
  const [problemGoalID, setProblemGoalID] = useState<any>(null)
  const [problemGoalText, setProblemGoalText] = useState<any>(null)
  const [overviewTextID, setOverviewTextID] = useState<any>(null)
  const [overviewText, setOverviewText] = useState<any>(null)
  const [scopeTextID, setScopeTextID] = useState<any>(null)
  const [scopeText, setScopeText] = useState<any>(null)

  const handleMeetingSummaryChange = (e: SelectChangeEvent<any>) => {
    setMeetingSummaryFormData({
      ...meetingSummaryFormData,
      [e.target.name]: e.target.value
    })
  }

  const handleTranscriptTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMeetingSummaryFormData({
      ...meetingSummaryFormData,
      transcriptText: e.target.value
    })
  }

  // const onSubmitProjectSummery = () => {
  //   if (editDataId) {
  //     apiRequest.put(`/project-summery/${editDataId}`, meetingSummaryFormData).then(res => {
  //       setListData((prevState: []) => {
  //         const updatedList: any = [...prevState]
  //         const editedServiceIndex = updatedList.findIndex(
  //           (item: any) => item['_id'] === editDataId // Replace 'id' with the actual identifier of your item
  //         )
  //         if (editedServiceIndex !== -1) {
  //           updatedList[editedServiceIndex] = res.data
  //         }
  //         Swal.fire({
  //           title: 'Data Updated Successfully!',
  //           icon: 'success',
  //           timer: 1000,
  //           timerProgressBar: true,
  //           showConfirmButton: false
  //         })

  //         return updatedList
  //       })
  //       onClear()
  //     })
  //   } else {
  //     apiRequest.post('/project-summery', meetingSummaryFormData).then(res => {
  //       setListData((prevState: []) => [...prevState, res.data])
  //       Swal.fire({
  //         title: 'Data Created Successfully!',
  //         icon: 'success',
  //         timer: 1000,
  //         timerProgressBar: true,
  //         showConfirmButton: false
  //       })
  //       onClear()
  //     })
  //   }
  // }

  useEffect(() => {
    setMeetingSummaryFormData({
      transcriptText: editData?.['transcriptText'],
      projectName: editData?.['projectName'],
      clientPhone: editData?.['clientPhone'],
      clientEmail: editData?.['clientEmail'],
      clientWebsite: editData?.['clientWebsite']
    })
  }, [editDataId, editData])

  const onClear = () => {
    setMeetingSummaryFormData(prevState => ({ ...meetingSummaryDefaultData }))
    setEditDataId(null)
    setEditData({})
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

  const handleNext = () => {
    console.log(activeStep)
    setPreload(true)
    const newActiveStep =
      isLastStep() && !allStepsCompleted() ? steps.findIndex((step, i) => !(i in completed)) : activeStep + 1
    if (activeStep === 0) {
      apiRequest
        .post('/project-summery', meetingSummaryFormData)
        .then(res => {
          if (res?.data?.meetingTranscript) {
            setTranscriptId(res?.data?.meetingTranscript?.id)
            apiRequest.post('/problems-and-goals', { transcriptId: res?.data?.meetingTranscript?.id }).then(res2 => {
              Swal.fire({
                title: 'Data Created Successfully!',
                icon: 'success',
                timer: 1000,
                timerProgressBar: true,
                showConfirmButton: false
              })
              setProblemGoalID(res2?.data?.id)
              setProblemGoalText(res2?.data?.problemGoalText)
              onClear()
              setActiveStep(newActiveStep)
              setPreload(false)
            })
          }
        })
        .catch(() => {
          setPreload(false)
        })
    }
    if (activeStep === 1) {
      apiRequest
        .post(`/problems-and-goals/${problemGoalID}`, { problemGoalText })
        .then(res => {
          console.log(res)
          if (res?.data) {
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
              setActiveStep(newActiveStep)
              setPreload(false)
            })
          }
        })
        .catch(() => {
          setPreload(false)
        })
    }
    if (activeStep === 2) {
      apiRequest
        .post(`/project-overview/${overviewTextID}`, { overviewText })
        .then(res => {
          console.log(res)
          if (res?.data) {
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
              setActiveStep(newActiveStep)
              setPreload(false)
            })
          }
        })
        .catch(() => {
          setPreload(false)
        })
    }

    if (activeStep === 3) {
      apiRequest
        .post(`/scope-of-work/${scopeTextID}`, { scopeText })
        .then(res => {
          console.log(res)
          Swal.fire({
            title: 'Data Created Successfully!',
            icon: 'success',
            timer: 1000,
            timerProgressBar: true,
            showConfirmButton: false
          })
          setActiveStep(0)
          setPreload(false)
        })
        .catch(() => {
          setPreload(false)
        })
    }
  }

  const handleStep = (step: number) => () => {
    setActiveStep(step)
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper nonLinear activeStep={activeStep}>
        {steps.map((label, index) => (
          <Step key={label} completed={completed[index]}>
            <StepButton color='inherit' disabled>
              {label}
            </StepButton>
          </Step>
        ))}
      </Stepper>
      <Box sx={{ position: 'relative' }}>
        {preload && (
          <Box
            sx={{
              position: 'absolute',
              top: '0',
              left: '0',
              width: '100%',
              height: '100%',
              background: '#0000006e',
              zIndex: '111'
            }}
          >
            <CircularProgress
              sx={{
                position: 'absolute',
                top: 'calc(50% - 20px)',
                left: 'calc(50% - 20px)'
              }}
            />
          </Box>
        )}
        <React.Fragment>
          <Box sx={{ mt: 10, p: 10, border: '2px solid #7e3af2', borderRadius: 2 }}>
            {activeStep == 0 && (
              <Box>
                <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
                  <Box sx={{ width: '100%' }}>
                    <label className='block text-sm'>
                      <span className='text-gray-700 dark:text-gray-400'>Transcript Text</span>
                      <textarea
                        className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                        placeholder='Enter Transcript Text'
                        name='transcriptText'
                        value={meetingSummaryFormData.transcriptText}
                        onChange={handleTranscriptTextChange}
                      />
                    </label>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
                  <Box sx={{ width: '50%' }}>
                    <label className='block text-sm'>
                      <span className='text-gray-700 dark:text-gray-400'>Project Name</span>
                      <input
                        className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                        placeholder='Enter Project Name'
                        name='projectName'
                        value={meetingSummaryFormData.projectName}
                        onChange={handleMeetingSummaryChange}
                      />
                    </label>
                  </Box>
                  <Box sx={{ width: '50%' }}>
                    <label className='block text-sm'>
                      <span className='text-gray-700 dark:text-gray-400'>Client Phone</span>
                      <input
                        className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                        placeholder='Enter Client Phone Number'
                        name='clientPhone'
                        value={meetingSummaryFormData.clientPhone}
                        onChange={handleMeetingSummaryChange}
                      />
                    </label>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
                  <Box sx={{ width: '50%' }}>
                    <label className='block text-sm'>
                      <span className='text-gray-700 dark:text-gray-400'>Client Email</span>
                      <input
                        className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                        placeholder='Enter Client Email'
                        name='clientEmail'
                        value={meetingSummaryFormData.clientEmail}
                        onChange={handleMeetingSummaryChange}
                      />
                    </label>
                  </Box>
                  <Box sx={{ width: '50%' }}>
                    <label className='block text-sm'>
                      <span className='text-gray-700 dark:text-gray-400'>Client Website</span>
                      <input
                        className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                        placeholder='Enter Client Website'
                        name='clientWebsite'
                        value={meetingSummaryFormData.clientWebsite}
                        onChange={handleMeetingSummaryChange}
                      />
                    </label>
                  </Box>
                </Box>
              </Box>
            )}
            {activeStep == 1 && (
              <Box>
                <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
                  <Box sx={{ width: '100%' }}>
                    <label className='block text-sm'>
                      <span className='text-gray-700 dark:text-gray-400'>Problem Goal Text</span>

                      <JoditEditor
                        ref={editor}
                        value={problemGoalText}
                        onBlur={newContent => setProblemGoalText(newContent)} // preferred to use only this option to update the content for performance reasons
                        onChange={newContent => {
                          setProblemGoalText(newContent)
                        }}
                      />
                    </label>
                  </Box>
                </Box>
              </Box>
            )}
            {activeStep == 2 && (
              <Box>
                <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
                  <Box sx={{ width: '100%' }}>
                    <label className='block text-sm'>
                      <span className='text-gray-700 dark:text-gray-400'>Overview Text</span>
                      <JoditEditor
                        ref={editor}
                        value={overviewText}
                        onBlur={newContent => setOverviewText(newContent)}
                        onChange={newContent => {
                          setOverviewText(newContent)
                        }}
                      />
                    </label>
                  </Box>
                </Box>
              </Box>
            )}
            {activeStep == 3 && (
              <Box>
                <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
                  <Box sx={{ width: '100%' }}>
                    <label className='block text-sm'>
                      <span className='text-gray-700 dark:text-gray-400'>Scope of Work</span>
                      <JoditEditor
                        ref={editor}
                        value={scopeText}
                        onBlur={newContent => setScopeText(newContent)}
                        onChange={newContent => {
                          setScopeText(newContent)
                        }}
                      />
                    </label>
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            {/* <Button color='inherit' disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
                Back
              </Button> */}
            <Box sx={{ flex: '1 1 auto' }} />
            <Box className='my-4 text-right'>
              {/* <button
                onClick={onClear}
                type='button'
                className='px-4 py-2 mr-3 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-red-600 border border-transparent rounded-lg active:bg-red-600 hover:bg-red-700 focus:outline-none focus:shadow-outline-red'
              >
                {editDataId ? 'Cancel ' : 'Clear '}
                {editDataId ? <PlaylistRemoveIcon /> : <ClearIcon />}
              </button> */}
              <button
                onClick={handleNext}
                className='px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-green-600 border border-transparent rounded-lg active:bg-green-600 hover:bg-green-700 focus:outline-none focus:shadow-outline-green'
              >
                {editDataId ? 'Update ' : 'Save & Next'}

                {editDataId ? <EditNoteIcon /> : <NavigateNextIcon />}
              </button>
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
  )
}
