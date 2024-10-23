import { useToastSnackbar } from '@core/hooks/useToastSnackbar'
import apiRequest from '@core/utils/axios-config'
import AddIcon from '@material-ui/icons/Add'
import ClearIcon from '@material-ui/icons/Clear'
import EditNoteIcon from '@mui/icons-material/EditNote'
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove'
import { Box, TextField } from '@mui/material'
import { Fragment, useEffect, useRef, useState } from 'react'
import { THourlyRatesComponent } from '../HourlyRates.decorator'

export default function HourlyRatesFormComponent(props: THourlyRatesComponent) {
  const { showSnackbar } = useToastSnackbar()
  const { editDataId, setEditDataId, listData, setListData, editData, setEditData } = props

  const defaultData = {
    name: '',
    average_hourly: ''
  }

  const [formData, setFormData] = useState(defaultData)
  const [errorMessage, setErrorMessage] = useState<any>({})
  const nameInputRef = useRef<HTMLInputElement>(null) // Add input ref

  const handleTextChange = (e: React.ChangeEvent<any>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const onSubmit = (e: React.FormEvent<any>) => {
    e.preventDefault()
    const apiCall = editDataId
      ? apiRequest.put(`/employee-roles/${editDataId}`, formData)
      : apiRequest.post('/employee-roles', formData)

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
        name: editData?.name || '',
        average_hourly: editData?.average_hourly || ''
      })
      nameInputRef.current?.focus() // Focus input when edit mode is triggered
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
            <Box sx={{ width: '100%' }}>
              <TextField
                label='Role Name'
                name='name'
                value={formData.name}
                onChange={handleTextChange}
                error={!!errorMessage?.name}
                inputRef={nameInputRef} // Attach ref to input
                fullWidth
              />
              {errorMessage?.name?.map((message: any, index: number) => (
                <span key={index} className='text-xs text-red-600 dark-d:text-red-400'>
                  {message}
                </span>
              ))}
            </Box>
            <Box sx={{ width: '100%' }}>
              <TextField
                label='Hourly Rate'
                name='average_hourly'
                value={formData.average_hourly}
                onChange={handleTextChange}
                error={!!errorMessage?.average_hourly}
                fullWidth
              />
              {errorMessage?.average_hourly?.map((message: any, index: number) => (
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
