import { Dropdown } from '@core/components/dropdown'
import { useToastSnackbar } from '@core/hooks/useToastSnackbar'
import apiRequest from '@core/utils/axios-config'
import AddIcon from '@material-ui/icons/Add'
import ClearIcon from '@material-ui/icons/Clear'
import EditNoteIcon from '@mui/icons-material/EditNote'
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove'
import { Box, TextField } from '@mui/material'
import { Fragment, useEffect, useRef, useState } from 'react'
import { TUsersComponent } from '../Users.decorator'

export default function UsersFormComponent(props: TUsersComponent) {
  const { showSnackbar } = useToastSnackbar()
  const { editDataId, setEditDataId, listData, setListData, editData, setEditData } = props

  const defaultData = {
    name: '',
    email: '',
    role: '',
    password: '',
    password_confirmation: ''
  }

  const [formData, setUsersFormData] = useState(defaultData)
  const [errorMessage, setErrorMessage] = useState<any>({})
  const nameInputRef = useRef<HTMLInputElement>(null) // Add ref for input focus

  const handleTextChange = (e: React.ChangeEvent<any>) => {
    setUsersFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSelectChange = (e: any) => {
    setUsersFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const onSubmit = (e: React.FormEvent<any>) => {
    e.preventDefault()
    const apiCall = editDataId ? apiRequest.put(`/users/${editDataId}`, formData) : apiRequest.post('/users', formData)

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
      setUsersFormData({
        name: editData?.name || '',
        email: editData?.email || '',
        role: editData?.roles?.[0]?.name || '',
        password: '',
        password_confirmation: ''
      })
      nameInputRef.current?.focus() // Focus input on edit mode
    } else {
      setUsersFormData(defaultData)
    }
  }, [editDataId, editData])

  const onClear = () => {
    setUsersFormData({ ...defaultData })
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
                label='Name'
                name='name'
                value={formData.name}
                onChange={handleTextChange}
                error={!!errorMessage?.name}
                inputRef={nameInputRef} // Attach ref to input
                fullWidth
              />
              {errorMessage?.name?.map((msg: string, index: number) => (
                <span key={index} className='text-xs text-red-600 dark-d:text-red-400'>
                  {msg}
                </span>
              ))}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
            <Box sx={{ width: '50%' }}>
              <Dropdown
                label='Role'
                url='roles'
                name='role'
                value={formData.role}
                onChange={handleSelectChange}
                optionConfig={{ id: 'name', title: 'name' }}
                placeholder=''
              />
            </Box>
            <Box sx={{ width: '50%' }}>
              <TextField
                label='Email'
                name='email'
                value={formData.email}
                onChange={handleTextChange}
                error={!!errorMessage?.email}
                fullWidth
              />
              {errorMessage?.email?.map((msg: string, index: number) => (
                <span key={index} className='text-xs text-red-600 dark-d:text-red-400'>
                  {msg}
                </span>
              ))}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
            <Box sx={{ width: '50%' }}>
              <TextField
                label='Password'
                name='password'
                value={formData.password}
                onChange={handleTextChange}
                error={!!errorMessage?.password}
                fullWidth
              />
              {errorMessage?.password?.map((msg: string, index: number) => (
                <span key={index} className='text-xs text-red-600 dark-d:text-red-400'>
                  {msg}
                </span>
              ))}
            </Box>
            <Box sx={{ width: '50%' }}>
              <TextField
                label='Confirm Password'
                name='password_confirmation'
                value={formData.password_confirmation}
                onChange={handleTextChange}
                error={!!errorMessage?.password_confirmation}
                fullWidth
              />
              {errorMessage?.password_confirmation?.map((msg: string, index: number) => (
                <span key={index} className='text-xs text-red-600 dark-d:text-red-400'>
                  {msg}
                </span>
              ))}
            </Box>
          </Box>

          <Box className='my-4 text-right'>
            <button
              onClick={onClear}
              type='button'
              className='px-4 py-2 mr-3 text-sm font-medium text-white transition-colors duration-150 bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none'
            >
              {editDataId ? 'Cancel ' : 'Clear '}
              {editDataId ? <ClearIcon /> : <PlaylistRemoveIcon />}
            </button>
            <button
              type='submit'
              className='px-4 py-2 text-sm font-medium text-white transition-colors duration-150 bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none'
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
