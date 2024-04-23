import AddIcon from '@material-ui/icons/Add'
import ClearIcon from '@material-ui/icons/Clear'
import BrowserUpdatedIcon from '@mui/icons-material/BrowserUpdated'
import DeleteIcon from '@mui/icons-material/Delete'
import EditNoteIcon from '@mui/icons-material/EditNote'
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove'
import { Box, Button, Checkbox } from '@mui/material'
import { useSnackbar } from 'notistack'
import { Fragment, useEffect, useState } from 'react'
import { Dropdown, ServiceDropdownTree } from 'src/@core/components/dropdown'
import Preloader from 'src/@core/components/preloader'
import { RichTextEditor } from 'src/@core/components/rich-text-editor'
import apiRequest from 'src/@core/utils/axios-config'
import { TServiceDeliverableTasksComponent } from '../ServiceDeliverableTasks.decorator'

export default function ServiceDeliverableTasksFormComponent(props: TServiceDeliverableTasksComponent) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const { editDataId, setEditDataId, listData, setListData, editData, setEditData } = props

  const [errorMessage, setErrorMessage] = useState<any>({})
  const [isPullingTaskFromClickup, setIsPullingTaskFromClickup] = useState<boolean>(false)
  const [isFatchFromClickUp, setIsFatchFromClickUp] = useState<boolean>(false)
  const [clickupLink, setClickupLink] = useState('')
  const [clickupTaskList, setClickupTaskList] = useState<any[]>([])

  const defaultData = {
    tasks: [
      {
        name: '',
        cost: '',
        description: ''
      }
    ],
    name: '',
    cost: '',
    description: '',
    serviceDeliverableId: '',
    parentTaskId: ''
  }
  const [formData, setFormData] = useState<any>(defaultData)

  const handleReachText = (value: string, field: string, index = -1) => {
    if (index !== -1) {
      const tasks: any = [...formData.tasks]
      if (typeof tasks[index] === 'object') {
        tasks[index][field] = value
        setFormData({
          ...formData,
          tasks: [...tasks]
        })
      }
    } else {
      setFormData({
        ...formData,
        [field]: value
      })
    }
  }

  const handleTextChange = (e: React.ChangeEvent<any>, index = -1) => {
    const { name, value } = e.target

    if (index != -1) {
      const tasks: any = [...formData.tasks]
      if (typeof tasks[index] === 'object') {
        tasks[index][name] = value
        setFormData({
          ...formData,
          tasks: [...tasks]
        })
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      })
    }
  }

  const handleSelectChange = (e: any) => {
    setFormData({
      ...formData,
      [e?.target?.name]: e?.target?.value
    })
  }

  const addTaskFields = () => {
    if (formData.tasks?.[0]) {
      setFormData({
        ...formData,
        tasks: [...formData.tasks, defaultData.tasks[0]] // Add an empty string to the tasks array
      })
    } else {
      setFormData({
        ...formData,
        tasks: defaultData.tasks
      })
    }
  }

  const removeTasksFields = (index: number) => {
    const tasks = [...formData.tasks]
    tasks.splice(index, 1)
    setFormData({
      ...formData,
      tasks: tasks
    })
  }

  const handleFetchTaskFromClickup = () => {
    setIsPullingTaskFromClickup(true)
    const data = {
      clickupLink
    }
    apiRequest
      .post('/clickup/list', data)
      .then(res => {
        setClickupTaskList(res?.data)
      })
      .catch(error => {
        setErrorMessage(error?.response?.data?.errors)
        enqueueSnackbar(error?.response?.data?.message, { variant: 'error' })
      })
  }

  const onSubmit = (e: React.FormEvent<any>) => {
    setErrorMessage({})
    e.preventDefault()
    if (editDataId) {
      apiRequest
        .put(`/service-deliverable-tasks/${editDataId}`, formData)
        .then(res => {
          setListData((prevState: []) => {
            const updatedList: any = [...prevState]
            const editedServiceIndex = updatedList.findIndex((item: any) => item['id'] === editDataId)
            if (editedServiceIndex !== -1) {
              updatedList[editedServiceIndex] = res?.data
            }
            enqueueSnackbar('Updated Successfully!', { variant: 'success' })

            return updatedList
          })
          onClear()
        })
        .catch(error => {
          setErrorMessage(error?.response?.data?.errors)
          enqueueSnackbar(error?.response?.data?.message, { variant: 'error' })
        })
    } else {
      apiRequest
        .post('/service-deliverable-tasks', formData)
        .then(res => {
          apiRequest.get(`/service-deliverable-tasks?page=${1}`).then(res => {
            setListData(res?.data)
          })

          enqueueSnackbar('Created Successfully!', { variant: 'success' })
          onClear()
        })
        .catch(error => {
          setErrorMessage(error?.response?.data?.errors)
          enqueueSnackbar(error?.response?.data?.message, { variant: 'error' })
        })
    }
  }
  useEffect(() => {
    console.log(editData)

    setFormData({
      serviceDeliverableId: editData?.serviceDeliverableId || '',
      parentTaskId: editData?.parentTaskId || '',

      name: editData?.name || '',
      cost: editData?.cost || '',
      description: editData?.description || '',
      tasks: defaultData.tasks
    })
  }, [editDataId, editData])

  const onClear = () => {
    setFormData(defaultData)

    // addTaskFields()
    setEditDataId(null)
    setEditData({})
    setErrorMessage({})
  }

  return (
    <Fragment>
      <Box className='p-5 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800'>
        <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
          <Box
            sx={{
              width: '100%',
              '& .MuiInputBase-root': {
                border: errorMessage?.['serviceDeliverableId'] ? '1px solid #dc2626' : ''
              }
            }}
          >
            <label className='block text-sm'>
              <Checkbox
                value={isFatchFromClickUp}
                onChange={e => {
                  setIsFatchFromClickUp(e.target.checked)
                }}
              />
              <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Fetch Task From Clickup</span>
            </label>
          </Box>
        </Box>
        {isFatchFromClickUp ? (
          <>
            {!!isPullingTaskFromClickup && <Preloader close={!!clickupTaskList?.length} />}
            <Box>
              <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
                <Box sx={{ width: '100%' }}>
                  <label className='block text-sm'>
                    <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Clickup Link</span>
                    <input
                      className={`block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input ${
                        !!clickupTaskList?.length ? 'opacity-50' : ''
                      }`}
                      placeholder='Enter clickup task link'
                      name='clickupLink'
                      value={clickupLink}
                      onChange={e => {
                        setClickupLink(e.target.value)
                      }}
                      disabled={!!clickupTaskList?.length}
                    />
                    {!!errorMessage?.['clickupLink'] &&
                      errorMessage?.['clickupLink']?.map((message: any, index: number) => {
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
                <Box sx={{ width: '100%', textAlign: 'right' }}>
                  <button
                    type='button'
                    className={`px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-green-600 border border-transparent rounded-lg active:bg-green-600 hover:bg-green-700 focus:outline-none focus:shadow-outline-green ${
                      !!clickupTaskList?.length ? 'opacity-50' : ''
                    }`}
                    onClick={() => {
                      handleFetchTaskFromClickup()
                    }}
                    disabled={!!clickupTaskList?.length}
                  >
                    Click Here Fetch Task From Clickup
                    <BrowserUpdatedIcon sx={{ ml: 2 }} />
                  </button>
                </Box>
              </Box>
            </Box>

            {!!clickupTaskList?.length && (
              <Box>
                <form onSubmit={onSubmit}>
                  {clickupTaskList.map((clickupTask: any, index: number) => {
                    return (
                      <>
                        <Box>
                          <Box
                            sx={{
                              display: 'flex',
                              gap: 5,
                              mb: 5,
                              flexDirection: 'column',
                              border: '2px solid #9333ea',
                              padding: '24px',
                              borderRadius: '5px'
                            }}
                          >
                            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 5, mb: 5 }}>
                              <Box sx={{ width: '100%' }}>
                                <RichTextEditor
                                  value={clickupTask.name}
                                  onBlur={newContent => handleReachText(newContent, 'name', index)}
                                />
                                {/* {!!errorMessage?.[`tasks.${index}.name`] &&
                                  errorMessage?.[`tasks.${index}.name`]?.map((message: any, index: number) => {
                                    return (
                                      <span key={index} className='text-xs text-red-600 dark:text-red-400'>
                                        {String(message).replaceAll('tasks.0.', '')}
                                      </span>
                                    )
                                  })} */}
                              </Box>
                              <Box sx={{ width: '100%' }}>
                                <RichTextEditor
                                  value={clickupTask.name}
                                  onBlur={newContent => handleReachText(newContent, 'name', index)}
                                />
                                {/* {!!errorMessage?.[`tasks.${index}.name`] &&
                                  errorMessage?.[`tasks.${index}.name`]?.map((message: any, index: number) => {
                                    return (
                                      <span key={index} className='text-xs text-red-600 dark:text-red-400'>
                                        {String(message).replaceAll('tasks.0.', '')}
                                      </span>
                                    )
                                  })} */}
                              </Box>
                            </Box>

                            {!!clickupTask?.subTasks?.length &&
                              clickupTask?.subTasks?.map((subTask: any, subTasksIndex: number) => {
                                return (
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      gap: 5,
                                      mb: 5,
                                      flexDirection: 'column',
                                      border: '2px solid #9333ea',
                                      padding: '24px',
                                      borderRadius: '5px'
                                    }}
                                    key={subTasksIndex}
                                  >
                                    <Box sx={{ width: '100%', display: 'flex', gap: 5, mb: 5 }}>
                                      <Box sx={{ width: '100%' }}>
                                        <label className='block text-sm'>
                                          <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Name</span>
                                        </label>
                                        <Box
                                          className='block text-sm'
                                          sx={{
                                            width: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                          }}
                                        >
                                          <Box
                                            sx={{
                                              width: '100%',
                                              display: 'flex',
                                              flexDirection: 'column',
                                              gap: 5,
                                              mb: 5
                                            }}
                                          >
                                            <Box sx={{ width: '100%' }}>
                                              <RichTextEditor
                                                value={subTask.name}
                                                onBlur={newContent => handleReachText(newContent, 'name', index)}
                                              />
                                              {!!errorMessage?.[`tasks.${index}.name`] &&
                                                errorMessage?.[`tasks.${index}.name`]?.map(
                                                  (message: any, index: number) => {
                                                    return (
                                                      <span
                                                        key={index}
                                                        className='text-xs text-red-600 dark:text-red-400'
                                                      >
                                                        {String(message).replaceAll('tasks.0.', '')}
                                                      </span>
                                                    )
                                                  }
                                                )}
                                            </Box>
                                            <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
                                              <Box sx={{ width: '50%' }}>
                                                <label className='block text-sm'>
                                                  <span className='flex text-gray-700 dark:text-gray-400 mb-1'>
                                                    Hour
                                                  </span>
                                                  <input
                                                    className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                                                    placeholder='Examples: 50.00'
                                                    name='cost'
                                                    value={subTask.cost}
                                                    onChange={e => {
                                                      handleTextChange(e, index)
                                                    }}
                                                  />
                                                  {!!errorMessage?.[`tasks.${index}.cost`] &&
                                                    errorMessage?.[`tasks.${index}.cost`]?.map(
                                                      (message: any, index: number) => {
                                                        return (
                                                          <span
                                                            key={index}
                                                            className='text-xs text-red-600 dark:text-red-400'
                                                          >
                                                            {String(message).replaceAll('tasks.0.', '')}
                                                          </span>
                                                        )
                                                      }
                                                    )}
                                                </label>
                                              </Box>
                                              <Box sx={{ width: '50%' }}>
                                                <label className='block text-sm'>
                                                  <span className='flex text-gray-700 dark:text-gray-400 mb-1'>
                                                    Description
                                                  </span>
                                                  <input
                                                    className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                                                    placeholder='Examples: Company logo for header'
                                                    name='description'
                                                    value={subTask.description}
                                                    onChange={e => {
                                                      handleTextChange(e, index)
                                                    }}
                                                  />
                                                  {!!errorMessage?.[`tasks.${index}.description`] &&
                                                    errorMessage?.[`tasks.${index}.description`]?.map(
                                                      (message: any, index: number) => {
                                                        return (
                                                          <span
                                                            key={index}
                                                            className='text-xs text-red-600 dark:text-red-400'
                                                          >
                                                            {String(message).replaceAll('tasks.0.', '')}
                                                          </span>
                                                        )
                                                      }
                                                    )}
                                                </label>
                                              </Box>
                                            </Box>
                                          </Box>
                                        </Box>
                                      </Box>
                                    </Box>
                                  </Box>
                                )
                              })}
                          </Box>
                        </Box>
                      </>
                    )
                  })}

                  <Box className='my-4 text-right'>
                    <button
                      onClick={onClear}
                      type='button'
                      className='px-4 py-2 mr-3 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-red-600 border border-transparent rounded-lg active:bg-red-600 hover:bg-red-700 focus:outline-none focus:shadow-outline-red'
                    >
                      {editDataId ? 'Cancel ' : 'Clear '}
                      {editDataId ? <ClearIcon /> : <PlaylistRemoveIcon />}
                    </button>
                    <button
                      type='submit'
                      className='px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-green-600 border border-transparent rounded-lg active:bg-green-600 hover:bg-green-700 focus:outline-none focus:shadow-outline-green'
                    >
                      {editDataId ? 'Update ' : 'Save '}
                      {editDataId ? <EditNoteIcon /> : <AddIcon />}
                    </button>
                  </Box>
                </form>
              </Box>
            )}
          </>
        ) : (
          <>
            <form onSubmit={onSubmit}>
              <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
                <Box
                  sx={{
                    width: '50%',
                    '& .MuiInputBase-root': {
                      border: errorMessage?.['serviceDeliverableId'] ? '1px solid #dc2626' : ''
                    }
                  }}
                >
                  <label className='block text-sm'>
                    <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Service Deliverable</span>
                    <ServiceDropdownTree
                      name='serviceDeliverableId'
                      value={formData.serviceDeliverableId}
                      onChange={handleSelectChange}
                      type='deliverables'
                    />
                    {!!errorMessage?.['serviceDeliverableId'] &&
                      errorMessage?.['serviceDeliverableId']?.map((message: any, index: number) => {
                        return (
                          <span key={index} className='text-xs text-red-600 dark:text-red-400'>
                            {message}
                          </span>
                        )
                      })}
                  </label>
                </Box>
                <Box
                  sx={{
                    width: '50%',
                    '& .MuiInputBase-root': {
                      border: errorMessage?.['parentTaskId'] ? '1px solid #dc2626' : ''
                    }
                  }}
                >
                  <label className='block text-sm'>
                    <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Parent Task</span>
                    <Dropdown
                      url={`service-deliverable-tasks?serviceDeliverableId=${formData.serviceDeliverableId}`}
                      name='parentTaskId'
                      value={formData.parentTaskId}
                      onChange={handleSelectChange}
                    />
                    {!!errorMessage?.['parentTaskId'] &&
                      errorMessage?.['parentTaskId']?.map((message: any, index: number) => {
                        return (
                          <span key={index} className='text-xs text-red-600 dark:text-red-400'>
                            {message}
                          </span>
                        )
                      })}
                  </label>
                </Box>
              </Box>
              {editDataId ? (
                <>
                  <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
                    <Box sx={{ width: '100%' }}>
                      <label className='block text-sm'>
                        <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Name</span>
                      </label>
                      <RichTextEditor
                        value={formData.name}
                        onBlur={newContent => handleReachText(newContent, 'name')}
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
                    <Box sx={{ width: '50%' }}>
                      <label className='block text-sm'>
                        <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Hour</span>
                        <input
                          className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                          placeholder='Examples: 50.00'
                          name='cost'
                          value={formData.cost}
                          onChange={e => {
                            handleTextChange(e)
                          }}
                        />
                        {!!errorMessage?.['cost'] &&
                          errorMessage?.['cost']?.map((message: any, index: number) => {
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
                        <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Description</span>
                        <input
                          className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                          placeholder='Examples: Company logo for header'
                          name='description'
                          value={formData.description}
                          onChange={e => {
                            handleTextChange(e)
                          }}
                        />
                        {!!errorMessage?.['description'] &&
                          errorMessage?.['description']?.map((message: any, index: number) => {
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
                    flexDirection: 'column',
                    border: '2px solid #9333ea',
                    padding: '24px',
                    borderRadius: '5px'
                  }}
                >
                  <>
                    {formData.tasks?.map((task: any, index: number) => (
                      <Box key={index} sx={{ width: '100%', display: 'flex', gap: 5, mb: 5 }}>
                        <Box sx={{ width: '100%' }}>
                          <label className='block text-sm'>
                            <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Name</span>
                          </label>
                          <Box
                            className='block text-sm'
                            sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 5, mb: 5 }}>
                              <Box sx={{ width: '100%' }}>
                                <RichTextEditor
                                  value={task.name}
                                  onBlur={newContent => handleReachText(newContent, 'name', index)}
                                />
                                {!!errorMessage?.[`tasks.${index}.name`] &&
                                  errorMessage?.[`tasks.${index}.name`]?.map((message: any, index: number) => {
                                    return (
                                      <span key={index} className='text-xs text-red-600 dark:text-red-400'>
                                        {String(message).replaceAll('tasks.0.', '')}
                                      </span>
                                    )
                                  })}
                              </Box>
                              <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
                                <Box sx={{ width: '50%' }}>
                                  <label className='block text-sm'>
                                    <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Hour</span>
                                    <input
                                      className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                                      placeholder='Examples: 50.00'
                                      name='cost'
                                      value={task.cost}
                                      onChange={e => {
                                        handleTextChange(e, index)
                                      }}
                                    />
                                    {!!errorMessage?.[`tasks.${index}.cost`] &&
                                      errorMessage?.[`tasks.${index}.cost`]?.map((message: any, index: number) => {
                                        return (
                                          <span key={index} className='text-xs text-red-600 dark:text-red-400'>
                                            {String(message).replaceAll('tasks.0.', '')}
                                          </span>
                                        )
                                      })}
                                  </label>
                                </Box>
                                <Box sx={{ width: '50%' }}>
                                  <label className='block text-sm'>
                                    <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Description</span>
                                    <input
                                      className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                                      placeholder='Examples: Company logo for header'
                                      name='description'
                                      value={task.description}
                                      onChange={e => {
                                        handleTextChange(e, index)
                                      }}
                                    />
                                    {!!errorMessage?.[`tasks.${index}.description`] &&
                                      errorMessage?.[`tasks.${index}.description`]?.map(
                                        (message: any, index: number) => {
                                          return (
                                            <span key={index} className='text-xs text-red-600 dark:text-red-400'>
                                              {String(message).replaceAll('tasks.0.', '')}
                                            </span>
                                          )
                                        }
                                      )}
                                  </label>
                                </Box>
                              </Box>
                            </Box>
                            <Button
                              type='button'
                              onClick={() => removeTasksFields(index)}
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
                        </Box>
                      </Box>
                    ))}
                  </>

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      type='button'
                      onClick={addTaskFields}
                      className='px-4 py-2 mr-3 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-blue'
                    >
                      <AddIcon /> Add Another Name
                    </button>
                  </Box>
                </Box>
              )}
              <Box className='my-4 text-right'>
                <button
                  onClick={onClear}
                  type='button'
                  className='px-4 py-2 mr-3 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-red-600 border border-transparent rounded-lg active:bg-red-600 hover:bg-red-700 focus:outline-none focus:shadow-outline-red'
                >
                  {editDataId ? 'Cancel ' : 'Clear '}
                  {editDataId ? <ClearIcon /> : <PlaylistRemoveIcon />}
                </button>
                <button
                  type='submit'
                  className='px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-green-600 border border-transparent rounded-lg active:bg-green-600 hover:bg-green-700 focus:outline-none focus:shadow-outline-green'
                >
                  {editDataId ? 'Update ' : 'Save '}
                  {editDataId ? <EditNoteIcon /> : <AddIcon />}
                </button>
              </Box>
            </form>
          </>
        )}
      </Box>
    </Fragment>
  )
}
