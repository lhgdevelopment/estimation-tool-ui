import { Dropdown } from '@core/components/dropdown'
import Preloader from '@core/components/preloader'
import { useToastSnackbar } from '@core/hooks/useToastSnackbar'
import apiRequest from '@core/utils/axios-config'
import AddIcon from '@material-ui/icons/Add'
import ClearIcon from '@material-ui/icons/Clear'
import EditNoteIcon from '@mui/icons-material/EditNote'
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove'
import { Box, TextField } from '@mui/material'
import { useRouter } from 'next/router'
import { Fragment, useEffect, useState } from 'react'
import { TAIAssistantComponent } from '../AIAssistant.decorator'

export default function AIAssistantFormComponent(props: TAIAssistantComponent) {
  const { showSnackbar } = useToastSnackbar()
  const { editDataId, setEditDataId, listData, setListData, editData, setEditData } = props
  const router = useRouter()

  const defaultData = {
    name: '',
    prompt_id: '',
    workflow_id: '',
    message_content: ''
  }

  const [formData, setFormData] = useState(defaultData)
  const [errorMessage, setErrorMessage] = useState<any>({})
  const [prelaod, setPreload] = useState<boolean>(false)

  const handleTextChange = (e: React.ChangeEvent<any>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleReachText = (value: string, field: string) => {
    setFormData({
      ...formData,
      [field]: value
    })
  }
  const handleSelectChange = (e: any) => {
    setFormData({
      ...formData,
      [e?.target?.name]: e?.target?.value
    })
  }

  const onSubmit = (e: React.FormEvent<any>) => {
    e.preventDefault()
    setErrorMessage({})
    setPreload(true)
    if (editDataId) {
      apiRequest
        .put(`/conversations/${editDataId}`, formData)
        .then(res => {
          setListData((prevState: []) => {
            const updatedList: any = [...prevState]
            const editedServiceIndex = updatedList.findIndex((item: any) => item['id'] === editDataId)

            if (editedServiceIndex !== -1) {
              updatedList[editedServiceIndex]['name'] = res?.data?.name
            }

            return updatedList
          })

          setPreload(false)
          showSnackbar('Updated Successfully!', { variant: 'success' })
          onClear()
        })
        .catch(error => {
          setPreload(false)
          setErrorMessage(error?.response?.data?.errors)
        })
    } else {
      apiRequest
        .post('/conversations/create', formData)
        .then(res => {
          showSnackbar('Created Successfully!', { variant: 'success' })
          onClear()

          router.push(`ai-assistant/${res?.data?.conversation?.id}`)
          setPreload(false)
        })
        .catch(error => {
          setPreload(false)
          setErrorMessage(error?.response?.data?.errors)
          showSnackbar(error?.response?.data?.message, { variant: 'error' })
        })
    }
  }

  useEffect(() => {
    setFormData({
      name: editData?.['name'] ?? '',
      prompt_id: '',
      workflow_id: '',
      message_content: ''
    })
  }, [editDataId, editData])

  const onClear = () => {
    setFormData(prevState => ({ ...defaultData }))
    setEditDataId(null)
    setEditData({})
  }

  return (
    <Fragment>
      {!!prelaod && <Preloader />}
      <Box className='p-5 mb-8 bg-white rounded-lg shadow-md dark-d:bg-gray-800'>
        <form onSubmit={onSubmit}>
          <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
            <Box sx={{ width: editDataId ? '100%' : '50%' }}>
              <TextField
                label={'Name'}
                name='name'
                value={formData.name}
                onChange={handleTextChange}
                error={errorMessage?.['name']}
                fullWidth
              />
              {!!errorMessage?.['name'] &&
                errorMessage?.['name']?.map((message: any, index: number) => {
                  return (
                    <span key={index} className='text-xs text-red-600 dark-d:text-red-400'>
                      {message}
                    </span>
                  )
                })}
            </Box>
            {!editDataId && (
              <Box sx={{ width: '50%' }}>
                <Dropdown
                  label='Type'
                  url={'prompts-allowed'}
                  name='prompt_id'
                  value={formData.prompt_id}
                  onChange={handleSelectChange}
                />

                {!!errorMessage?.['prompt_id'] &&
                  errorMessage?.['prompt_id']?.map((message: any, index: number) => {
                    return (
                      <span key={index} className='text-xs text-red-600 dark-d:text-red-400'>
                        {message}
                      </span>
                    )
                  })}
              </Box>
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
            {!editDataId && (
              <Box sx={{ width: '100%' }}>
                <Dropdown
                  label='Workflow'
                  url={'workflows'}
                  name='workflow_id'
                  value={formData.workflow_id}
                  onChange={handleSelectChange}
                  optionConfig={{
                    title: 'title',
                    id: 'id'
                  }}
                />

                {!!errorMessage?.['workflow_id'] &&
                  errorMessage?.['workflow_id']?.map((message: any, index: number) => {
                    return (
                      <span key={index} className='text-xs text-red-600 dark-d:text-red-400'>
                        {message}
                      </span>
                    )
                  })}
              </Box>
            )}
          </Box>
          {!editDataId && (
            <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
              <Box sx={{ width: '100%' }}>
                <TextField
                  label={'Message'}
                  name='message_content'
                  value={formData.message_content}
                  onChange={handleTextChange}
                  error={errorMessage?.['message_content']}
                  fullWidth
                  multiline
                  rows={4}
                />
                {!!errorMessage?.['message_content'] &&
                  errorMessage?.['message_content']?.map((message: any, index: number) => {
                    return (
                      <span key={index} className='text-xs text-red-600 dark-d:text-red-400'>
                        {message}
                      </span>
                    )
                  })}
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
              {editDataId ? 'Update ' : 'Start '}

              {editDataId ? <EditNoteIcon /> : <AddIcon />}
            </button>
          </Box>
        </form>
      </Box>
    </Fragment>
  )
}
