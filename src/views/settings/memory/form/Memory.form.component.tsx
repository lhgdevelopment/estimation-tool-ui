import { Dropdown } from '@core/components/dropdown'
import AppTextInput from '@core/components/input/textInput'
import { useToastSnackbar } from '@core/hooks/useToastSnackbar'
import apiRequest from '@core/utils/axios-config'
import AddIcon from '@material-ui/icons/Add'
import ClearIcon from '@material-ui/icons/Clear'
import EditNoteIcon from '@mui/icons-material/EditNote'
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove'
import { Box, TextField } from '@mui/material'
import { Fragment, useEffect, useState } from 'react'
import { TMemoryComponent } from '../Memory.decorator'

export default function MemoryFormComponent(props: TMemoryComponent) {
  const { showSnackbar } = useToastSnackbar()
  const { editDataId, setEditDataId, listData, setListData, editData, setEditData } = props

  const defaultData = {
    title: '',
    prompt: '',
    promptIds: []
  }

  const [formData, setFormData] = useState(defaultData)
  const [errorMessage, setErrorMessage] = useState<any>({})

  const handleReachText = (value: string, field: string) => {
    setFormData({
      ...formData,
      [field]: value
    })
  }

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
        .put(`/memory/${editDataId}`, formData)
        .then(res => {
          setListData((prevState: []) => {
            const updatedList: any = [...prevState]
            const editedServiceQuestionIndex = updatedList.findIndex((item: any) => item['id'] === editDataId)
            if (editedServiceQuestionIndex !== -1) {
              updatedList[editedServiceQuestionIndex] = res?.data
            }

            return updatedList
          })
          onClear()
          showSnackbar('Updated Successfully!', { variant: 'success' })
        })
        .catch(error => {
          setErrorMessage(error?.response?.data?.errors)
          showSnackbar(error?.response?.data?.message, { variant: 'error' })
        })
    } else {
      apiRequest
        .post('/memory', formData)
        .then(res => {
          setListData((prevState: []) => [...prevState, res?.data])
          showSnackbar('Created Successfully!', { variant: 'success' })
          onClear()
        })
        .catch(error => {
          setErrorMessage(error?.response?.data?.errors)
          showSnackbar(error?.response?.data?.message, { variant: 'error' })
        })
    }
  }

  useEffect(() => {
    setFormData({
      title: editData?.['title'],
      prompt: editData?.['prompt'],
      promptIds: editData?.['promptIds']
    })
  }, [editDataId, editData])

  const onClear = () => {
    setEditDataId(null)
    setEditData({})
    setErrorMessage({})
    setTimeout(() => {
      setFormData(prevState => ({ ...defaultData }))
    }, 200)
  }

  return (
    <Fragment>
      <Box className='p-5 mb-8 bg-white rounded-lg shadow-md dark-d:bg-gray-800'>
        <form onSubmit={onSubmit}>
          <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
            <Box sx={{ width: '50%' }}>
              <AppTextInput
                label={'Memory Title'}
                name='title'
                value={formData.title}
                onChange={handleTextChange}
                hasError={!!errorMessage?.['title']}
              />
              {!!errorMessage?.['title'] &&
                errorMessage?.['title']?.map((message: any, index: number) => {
                  return (
                    <span key={index} className='text-xs text-red-600 dark-d:text-red-400'>
                      {message}
                    </span>
                  )
                })}
            </Box>
            <Box sx={{ width: '50%' }}>
              <Dropdown
                label={'Prompt'}
                url='prompts'
                name='promptIds'
                value={formData.promptIds}
                onChange={handleSelectChange}
                placeholder=''
                error={!!errorMessage?.['promptIds']}
                multiple
              />
              {!!errorMessage?.['promptIds'] &&
                errorMessage?.['promptIds']?.map((message: any, index: number) => {
                  return (
                    <span key={index} className='text-xs text-red-600 dark-d:text-red-400'>
                      {message}
                    </span>
                  )
                })}
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
            <Box sx={{ width: '100%' }}>
              <TextField
                label={'Prompt'}
                name='prompt'
                value={formData.prompt}
                onChange={handleTextChange}
                error={errorMessage?.['prompt']}
                fullWidth
                multiline
                minRows={4}
              />
              {!!errorMessage?.['prompt'] &&
                errorMessage?.['prompt']?.map((message: any, index: number) => {
                  return (
                    <span key={index} className='text-xs text-red-600 dark-d:text-red-400'>
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
