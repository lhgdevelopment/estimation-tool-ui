import { useToastSnackbar } from '@core/hooks/useToastSnackbar'
import apiRequest from '@core/utils/axios-config'
import AddIcon from '@material-ui/icons/Add'
import ClearIcon from '@material-ui/icons/Clear'
import EditNoteIcon from '@mui/icons-material/EditNote'
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove'
import { Box, TextField } from '@mui/material'
import { useRouter } from 'next/router'
import { Fragment, useEffect, useRef, useState } from 'react'
import { TUsersComponent } from '../Teams.decorator'

export default function TeamsFormComponent(props: TUsersComponent) {
  const router = useRouter()
  const { showSnackbar } = useToastSnackbar()
  const { editDataId, setEditDataId, listData, setListData, editData, setEditData } = props

  const defaultData = { name: '' }

  const [formData, setUsersFormData] = useState(defaultData)
  const [errorMessage, setErrorMessage] = useState<any>({})
  const nameInputRef = useRef<HTMLInputElement>(null) // Ref for input focus

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsersFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const apiCall = editDataId ? apiRequest.put(`/teams/${editDataId}`, formData) : apiRequest.post('/teams', formData)

    apiCall
      .then((res: any) => {
        if (editDataId) {
          setListData((prevState: any[]) => prevState.map(item => (item.id === editDataId ? res.data : item)))
          showSnackbar('Updated Successfully!', { variant: 'success' })
        } else {
          showSnackbar('Created Successfully!', { variant: 'success' })
          router.push(`/user-management/teams/${res.data.id}/users`)
        }
        onClear()
      })
      .catch((err: any) => {
        setErrorMessage(err?.data?.errors || {})
        showSnackbar(err?.data?.message || 'Something went wrong!', { variant: 'error' })
      })
  }

  useEffect(() => {
    if (editDataId) {
      setUsersFormData({ name: editData?.name || '' })
      nameInputRef.current?.focus() // Focus input on edit mode
    } else {
      setUsersFormData(defaultData)
    }
  }, [editDataId, editData])

  const onClear = () => {
    setUsersFormData(defaultData)
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
                inputRef={nameInputRef} // Attach ref for focus
                error={!!errorMessage?.name}
                helperText={errorMessage?.name?.[0] || ''}
                fullWidth
              />
            </Box>
          </Box>

          <Box className='my-4 text-right'>
            <button
              onClick={onClear}
              type='button'
              className='px-4 py-2 mr-3 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none'
            >
              {editDataId ? 'Cancel ' : 'Clear '}
              {editDataId ? <ClearIcon /> : <PlaylistRemoveIcon />}
            </button>
            <button
              type='submit'
              className='px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none'
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
