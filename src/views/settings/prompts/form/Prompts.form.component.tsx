import AddIcon from '@material-ui/icons/Add'
import ClearIcon from '@material-ui/icons/Clear'
import EditNoteIcon from '@mui/icons-material/EditNote'
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove'
import { Box, TextField } from '@mui/material'
import { Fragment, useEffect, useState } from 'react'
import { Dropdown } from '@core/components/dropdown'
import { useToastSnackbar } from '@core/hooks/useToastSnackbar'
import apiRequest from '@core/utils/axios-config'
import { TPromptsComponent, promptsTypeList } from '../Prompts.decorator'

export default function PromptsFormComponent(props: TPromptsComponent) {
  const { showSnackbar } = useToastSnackbar()
  const { editDataId, setEditDataId, listData, setListData, editData, setEditData } = props

  const defaultData = {
    name: '',
    type: null,
    prompt: '',
    serial: '',
    user_id: [],
    action_type: null
  }

  const [formData, setFormData] = useState(defaultData)
  const [errorMessage, setErrorMessage] = useState<any>({})

  const handleTextChange = (e: React.ChangeEvent<any>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
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
    if (editDataId) {
      apiRequest
        .put(`/prompts/${editDataId}`, formData)
        .then(res => {
          setListData((prevState: []) => {
            const updatedList: any = [...prevState]
            const editedServiceIndex = updatedList.findIndex((item: any) => item['id'] === editDataId)
            if (editedServiceIndex !== -1) {
              updatedList[editedServiceIndex] = res?.data
            }

            return updatedList
          })

          showSnackbar('Updated Successfully!', { variant: 'success' })
          setTimeout(() => onClear(), 1000)
        })
        .catch(error => {
          setErrorMessage(error?.response?.data?.errors)
          showSnackbar(error?.response?.data?.message, { variant: 'error' })
        })
    } else {
      apiRequest
        .post('/prompts', formData)
        .then(res => {
          setListData((prevState: []) => [...prevState, res?.data])
          showSnackbar('Created Successfully!', { variant: 'success' })
          setTimeout(() => onClear(), 1000)
        })
        .catch(error => {
          setErrorMessage(error?.response?.data?.errors)
          showSnackbar(error?.response?.data?.message, { variant: 'error' })
        })
    }
  }

  useEffect(() => {
    setFormData({
      name: editData?.['name'],
      type: editData?.['type'],
      prompt: editData?.['prompt'],
      serial: editData?.['serial'],
      user_id: editData?.['shared_user']?.map((user: any) => user.user_id),
      action_type: editData?.['action_type']
    })
  }, [editDataId, editData])

  const onClear = () => {
    setFormData(prevState => defaultData)
    setEditDataId(null)
    setEditData({})
  }

  return (
    <Fragment>
      <Box className='p-5 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800'>
        <form onSubmit={onSubmit}>
          <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
            <Box sx={{ width: '50%' }}>
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
                    <span key={index} className='text-xs text-red-600 dark:text-red-400'>
                      {message}
                    </span>
                  )
                })}
            </Box>
            <Box sx={{ width: '50%' }}>
              <Dropdown
                optionConfig={{
                  title: 'title',
                  id: 'id'
                }}
                dataList={promptsTypeList}
                label='Type'
                name='type'
                value={formData.type}
                onChange={handleSelectChange}
              />
              {!!errorMessage?.['type'] &&
                errorMessage?.['type']?.map((message: any, index: number) => {
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
              <TextField
                label={'Step Number'}
                name='serial'
                value={formData.serial}
                onChange={handleTextChange}
                error={errorMessage?.['serial']}
                fullWidth
              />
              {!!errorMessage?.['serial'] &&
                errorMessage?.['serial']?.map((message: any, index: number) => {
                  return (
                    <span key={index} className='text-xs text-red-600 dark:text-red-400'>
                      {message}
                    </span>
                  )
                })}
            </Box>
            <Box sx={{ width: '50%' }}>
              <Dropdown
                dataList={[
                  { id: 'input-only', name: 'Input Only' },
                  { id: 'expected-output', name: 'Expected Output' }
                ]}
                label='Category'
                name='action_type'
                value={formData.action_type}
                onChange={handleSelectChange}
              />
              {!!errorMessage?.['action_type'] &&
                errorMessage?.['action_type']?.map((message: any, index: number) => {
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
              <Dropdown
                label='Allowed Users'
                url='users'
                name='user_id'
                value={formData.user_id}
                onChange={handleSelectChange}
                multiple
              />
              {!!errorMessage?.['user_id'] &&
                errorMessage?.['user_id']?.map((message: any, index: number) => {
                  return (
                    <span key={index} className='text-xs text-red-600 dark:text-red-400'>
                      {message}
                    </span>
                  )
                })}
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 5 }}>
            <Box sx={{ width: '100%' }}>
              <TextField
                label={'Command / Prompt'}
                className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                placeholder='Examples: Details, Command or Prompt content'
                name='prompt'
                rows={10}
                value={formData.prompt}
                onChange={handleTextChange}
                multiline
              />
              {!!errorMessage?.['prompt'] &&
                errorMessage?.['prompt']?.map((message: any, index: number) => {
                  return (
                    <span key={index} className='text-xs text-red-600 dark:text-red-400'>
                      {message}
                    </span>
                  )
                })}
            </Box>
          </Box>
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
    </Fragment>
  )
}
