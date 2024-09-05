import AddIcon from '@material-ui/icons/Add'
import ClearIcon from '@material-ui/icons/Clear'
import EditNoteIcon from '@mui/icons-material/EditNote'
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove'
import { Box, TextField } from '@mui/material'
import { Fragment, useEffect, useState } from 'react'
import { Dropdown } from 'src/@core/components/dropdown'
import { useToastSnackbar } from 'src/@core/hooks/useToastSnackbar'
import apiRequest from 'src/@core/utils/axios-config'
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

  const handleTextChange = (e: React.ChangeEvent<any>) => {
    setUsersFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSelectChange = (e: any) => {
    setUsersFormData({
      ...formData,
      [e?.target?.name]: e?.target?.value
    })
  }

  const onSubmit = (e: React.FormEvent<any>) => {
    e.preventDefault()
    if (editDataId) {
      apiRequest
        .put(`/users/${editDataId}`, formData)
        .then(res => {
          setListData((prevState: []) => {
            const updatedList: any = [...prevState]
            const editedServiceIndex = updatedList.findIndex((item: any) => item['id'] === editDataId)
            if (editedServiceIndex !== -1) {
              updatedList[editedServiceIndex] = res?.data
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
        .post('/users', formData)
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
    setUsersFormData({
      name: editData?.['name'],
      email: editData?.['email'],
      role: editData?.['roles']?.[0]?.['name'],
      password: '',
      password_confirmation: ''
    })
  }, [editDataId, editData])

  const onClear = () => {
    setUsersFormData(prevState => ({ ...defaultData }))
    setEditDataId(null)
    setEditData({})
  }

  return (
    <Fragment>
      <Box className='p-5 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800'>
        <form onSubmit={onSubmit}>
          <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
            <Box sx={{ width: '100%' }}>
              <TextField
                id='outlined-multiline-flexible'
                label='Name'
                className={`block w-full text-sm dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input ${
                  errorMessage?.['name'] ? 'border-red-600' : 'dark:border-gray-600'
                }`}
                placeholder='Name'
                name='name'
                value={formData.name}
                onChange={handleTextChange}
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
              <Dropdown
                label={'Role'}
                url={'roles'}
                name='role'
                value={formData.role}
                onChange={handleSelectChange}
                optionConfig={{ id: 'name', title: 'name' }}
                placeholder=''
              />
            </Box>
            <Box sx={{ width: '50%' }}>
              <TextField
                id='outlined-multiline-flexible'
                label='Email'
                className={`block w-full text-sm dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input ${
                  errorMessage?.['email'] ? 'border-red-600' : 'dark:border-gray-600'
                }`}
                placeholder='Email'
                name='email'
                value={formData.email}
                onChange={handleTextChange}
              />
              {!!errorMessage?.['email'] &&
                errorMessage?.['email']?.map((message: any, index: number) => {
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
                id='outlined-multiline-flexible'
                label='Password'
                className={`block w-full text-sm dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input ${
                  errorMessage?.['password'] ? 'border-red-600' : 'dark:border-gray-600'
                }`}
                placeholder='Password'
                name='password'
                value={formData.password}
                onChange={handleTextChange}
              />
              {!!errorMessage?.['password'] &&
                errorMessage?.['password']?.map((message: any, index: number) => {
                  return (
                    <span key={index} className='text-xs text-red-600 dark:text-red-400'>
                      {message}
                    </span>
                  )
                })}
            </Box>
            <Box sx={{ width: '50%' }}>
              <TextField
                id='outlined-multiline-flexible'
                label='Confirm Password'
                className={`block w-full text-sm dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input ${
                  errorMessage?.['password_confirmation'] ? 'border-red-600' : 'dark:border-gray-600'
                }`}
                placeholder='Confirm Password'
                name='password_confirmation'
                value={formData.password_confirmation}
                onChange={handleTextChange}
              />
              {!!errorMessage?.['password_confirmation'] &&
                errorMessage?.['password_confirmation']?.map((message: any, index: number) => {
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
