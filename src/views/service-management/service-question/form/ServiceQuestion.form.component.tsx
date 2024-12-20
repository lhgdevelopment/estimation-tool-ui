import { Dropdown } from '@core/components/dropdown'
import { useToastSnackbar } from '@core/hooks/useToastSnackbar'
import apiRequest from '@core/utils/axios-config'
import AddIcon from '@material-ui/icons/Add'
import ClearIcon from '@material-ui/icons/Clear'
import EditNoteIcon from '@mui/icons-material/EditNote'
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove'
import { Box, TextField } from '@mui/material'
import { Fragment, useEffect, useRef, useState } from 'react'
import { TServiceQuestionComponent } from '../ServiceQuestion.decorator'

export default function ServiceQuestionFormComponent(props: TServiceQuestionComponent) {
  const { showSnackbar } = useToastSnackbar()
  const { editDataId, setEditDataId, listData, setListData, editData, setEditData } = props

  const defaultData = {
    title: '',
    serviceIds: []
  }

  const [formData, setFormData] = useState(defaultData)
  const [errorMessage, setErrorMessage] = useState<any>({})
  const titleInputRef = useRef<HTMLInputElement>(null) // Add ref for input focus

  const handleTextChange = (e: React.ChangeEvent<any>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSelectChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const onSubmit = (e: React.FormEvent<any>) => {
    e.preventDefault()
    const apiCall = editDataId
      ? apiRequest.put(`/questions/${editDataId}`, formData)
      : apiRequest.post('/questions', formData)

    apiCall
      .then(res => {
        setListData((prevState: any[]) =>
          editDataId ? prevState.map(item => (item.id === editDataId ? res.data : item)) : [...prevState, res.data]
        )
        showSnackbar(editDataId ? 'Updated Successfully!' : 'Created Successfully!', { variant: 'success' })
        onClear()
      })
      .catch(error => {
        setErrorMessage(error?.response?.data?.errors || {})
        showSnackbar(error?.response?.data?.message || 'Something went wrong!', { variant: 'error' })
      })
  }

  useEffect(() => {
    if (editDataId) {
      setFormData({
        title: editData?.title || '',
        serviceIds: editData?.serviceIds || []
      })
      titleInputRef.current?.focus() // Focus title input on edit mode
    } else {
      setFormData(defaultData)
    }
  }, [editDataId, editData])

  const onClear = () => {
    setFormData({ ...defaultData })
    setEditDataId(null)
    setEditData({})
    setErrorMessage({})
  }

  return (
    <Fragment>
      <Box className='p-5 mb-8 bg-white rounded-lg shadow-md dark-d:bg-gray-800'>
        <form onSubmit={onSubmit}>
          <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
            <Box sx={{ width: '50%' }}>
              <TextField
                label='What question needs to be asked?'
                name='title'
                value={formData.title}
                onChange={handleTextChange}
                error={!!errorMessage?.title}
                inputRef={titleInputRef} // Attach ref to input
                fullWidth
              />
              {errorMessage?.title?.map((message: any, index: number) => (
                <span key={index} className='text-xs text-red-600 dark-d:text-red-400'>
                  {message}
                </span>
              ))}
            </Box>
            <Box sx={{ width: '50%' }}>
              <Dropdown
                label='Service'
                url='services'
                name='serviceIds'
                value={formData.serviceIds}
                onChange={handleSelectChange}
                error={!!errorMessage?.serviceIds}
                multiple
              />
              {errorMessage?.serviceIds?.map((message: any, index: number) => (
                <span key={index} className='text-xs text-red-600 dark-d:text-red-400'>
                  {message}
                </span>
              ))}
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
