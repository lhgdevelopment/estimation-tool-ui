import Preloader from '@core/components/preloader'
import { useToastSnackbar } from '@core/hooks/useToastSnackbar'
import apiRequest from '@core/utils/axios-config'
import ClearIcon from '@material-ui/icons/Clear'
import EditNoteIcon from '@mui/icons-material/EditNote'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import { Box, TextField } from '@mui/material'
import 'md-editor-rt/lib/style.css'
import { useRouter } from 'next/router'
import { Fragment, useState } from 'react'

export default function WorkflowFormComponent(props: { editId?: string; onClose?: () => void }) {
  const { editId, onClose } = props
  const [preload, setPreload] = useState(false)
  const { showSnackbar } = useToastSnackbar()
  const router = useRouter()

  const defaultData = {
    title: ''
  }

  const [formData, setFormData] = useState(defaultData)
  const [errorMessage, setErrorMessage] = useState<any>({})

  const handleTextChange = (e: React.ChangeEvent<any>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleCheckChange = (e: React.ChangeEvent<any>) => {
    const { name, checked } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: checked
    }))
  }

  const handleSelectChange = (e: any) => {
    setFormData({
      ...formData,
      [e?.target?.name]: e?.target?.value
    })
  }

  const onSubmit = (e: React.FormEvent<any>) => {
    setPreload(true)
    e.preventDefault()
    setErrorMessage({})

    if (editId) {
      apiRequest
        .put(`/workflows/${editId}`, formData)
        .then(res => {
          setPreload(false)
          onClear()
          showSnackbar('Updated Successfully!', { variant: 'success' })
          router.push('/workflows/')
        })
        .catch(error => {
          setPreload(false)
          setErrorMessage(error?.response?.data?.errors)
          showSnackbar(error?.response?.data?.message, { variant: 'error' })
        })
    } else {
      apiRequest
        .post('/workflows', formData)
        .then(res => {
          showSnackbar('Created Successfully!', { variant: 'success' })
          router.push(`/core/workflow/editor/${res?.id}`)
        })
        .catch(error => {
          setPreload(false)
          setErrorMessage(error?.response?.data?.errors)
          showSnackbar(error?.response?.data?.message, { variant: 'error' })
        })
    }
  }

  const onClear = () => {
    setFormData(prevState => ({ ...defaultData }))
    setErrorMessage({})
  }

  return (
    <Fragment>
      {!!preload && <Preloader />}

      <Box>
        <Box>
          <Box component={'h1'} className='mt-5 mb-4 text-xl font-semibold text-gray-600 dark-d:text-gray-300'>
            {editId ? 'Update' : 'Create New'} Workflow
          </Box>
        </Box>
        <form onSubmit={onSubmit}>
          <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
            <Box sx={{ width: '100%' }}>
              <TextField
                label={'Title'}
                name='title'
                value={formData.title}
                onChange={handleTextChange}
                error={errorMessage?.['title']}
                fullWidth
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
          </Box>

          <Box className='my-4 text-right'>
            <Box
              onClick={onClose}
              component={'button'}
              type='button'
              className='px-4 py-2 mr-3 inline-block text-sm font-medium leading-5 text-white transition-colors duration-150 bg-red-600 border border-transparent rounded-lg active:bg-red-600 hover:bg-red-700 focus:outline-none focus:shadow-outline-red'
              aria-label='View'
            >
              Close
              <ClearIcon />
            </Box>

            <Box
              component={'button'}
              type='submit'
              className='px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-green-600 border border-transparent rounded-lg active:bg-green-600 hover:bg-green-700 focus:outline-none focus:shadow-outline-green'
            >
              {editId ? 'Update ' : 'Next'}

              {editId ? <EditNoteIcon /> : <NavigateNextIcon />}
            </Box>
          </Box>
        </form>
      </Box>
    </Fragment>
  )
}
