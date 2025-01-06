import { useToastSnackbar } from '@core/hooks/useToastSnackbar'
import apiRequest from '@core/utils/axios-config'
import AddIcon from '@material-ui/icons/Add'
import ClearIcon from '@material-ui/icons/Clear'
import EditNoteIcon from '@mui/icons-material/EditNote'
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove'
import { Box, TextField } from '@mui/material'
import { Fragment, useEffect, useRef, useState } from 'react'
import { TProjectTypeComponent } from '../ProjectType.decorator'

export default function ProjectTypeFormComponent(props: TProjectTypeComponent) {
  const { showSnackbar } = useToastSnackbar()
  const { editDataId, setEditDataId, listData, setListData, editData, setEditData } = props

  // Refs for both input fields
  const nameInputRef = useRef<HTMLInputElement>(null)
  const prefixInputRef = useRef<HTMLInputElement>(null)

  const defaultData = {
    name: '',
    projectTypePrefix: ''
  }

  const [formData, setFormData] = useState(defaultData)
  const [errorMessage, setErrorMessage] = useState<any>({})

  const handleTextChange = (e: React.ChangeEvent<any>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const onSubmit = (e: React.FormEvent<any>) => {
    setErrorMessage({})
    e.preventDefault()
    if (editDataId) {
      apiRequest
        .put(`/project-type/${editDataId}`, formData)
        .then((res: any) => {
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
        .catch((err: any) => {
          setErrorMessage(err?.data?.errors)
        })
    } else {
      apiRequest
        .post('/project-type', formData)
        .then((res: any) => {
          setListData((prevState: []) => [...prevState, res?.data])
          showSnackbar('Created Successfully!', { variant: 'success' })
          onClear()
        })
        .catch((err: any) => {
          setErrorMessage(err?.data?.errors)
        })
    }
  }

  useEffect(() => {
    if (editDataId) {
      setFormData({
        name: editData?.['name'] || '',
        projectTypePrefix: editData?.['projectTypePrefix'] || ''
      })
      // Focus the name input field by default when edit mode is triggered
      nameInputRef.current?.focus()
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
                id='outlined-multiline-flexible'
                label='Project Type'
                className={`block w-full text-sm dark-d:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark-d:text-gray-300 dark-d:focus:shadow-outline-gray form-input ${
                  errorMessage?.['name'] ? 'border-red-600' : 'dark-d:border-gray-600 '
                }`}
                placeholder='Project Type'
                name='name'
                value={formData.name}
                onChange={handleTextChange}
                inputRef={nameInputRef} // Attach ref to the name input
              />
              {!!errorMessage?.['name'] &&
                errorMessage?.['name']?.map((message: any, index: number) => (
                  <span key={index} className='text-xs text-red-600 dark-d:text-red-400'>
                    {message}
                  </span>
                ))}
            </Box>
            <Box sx={{ width: '50%' }}>
              <TextField
                id='outlined-multiline-flexible'
                label='Project Type Prefix'
                className={`block w-full text-sm dark-d:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark-d:text-gray-300 dark-d:focus:shadow-outline-gray form-input ${
                  errorMessage?.['projectTypePrefix'] ? 'border-red-600' : 'dark-d:border-gray-600 '
                }`}
                placeholder='Project Type Prefix'
                name='projectTypePrefix'
                value={formData.projectTypePrefix}
                onChange={handleTextChange}
                inputRef={prefixInputRef} // Attach ref to the prefix input
              />
              {!!errorMessage?.['projectTypePrefix'] &&
                errorMessage?.['projectTypePrefix']?.map((message: any, index: number) => (
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
