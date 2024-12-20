import { Dropdown } from '@core/components/dropdown'
import { useToastSnackbar } from '@core/hooks/useToastSnackbar'
import apiRequest from '@core/utils/axios-config'
import AddIcon from '@material-ui/icons/Add'
import ClearIcon from '@material-ui/icons/Clear'
import EditNoteIcon from '@mui/icons-material/EditNote'
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove'
import { Box } from '@mui/material'
import { useRouter } from 'next/router'
import { Fragment, useEffect, useState } from 'react'
import { TUsersComponent } from '../TeamsUser.decorator'

export default function TeamsUserFormComponent(props: TUsersComponent) {
  const { showSnackbar } = useToastSnackbar()
  const { query } = useRouter()
  const { editDataId, setEditDataId, listData, setListData, editData, setEditData, listRef } = props

  const defaultData = {
    userIds: []
  }

  const [formData, setUsersFormData] = useState({ ...defaultData })
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
    apiRequest
      .post(`/teams/${query.id}/share/users`, formData)
      .then(res => {
        showSnackbar('Created Successfully!', { variant: 'success' })
        onClear()
        listRef?.current?.getList(1)
      })
      .catch(error => {
        setErrorMessage(error?.response?.data?.errors)
        showSnackbar(error?.response?.data?.message, { variant: 'error' })
      })
  }

  useEffect(() => {
    setUsersFormData({
      userIds: editData?.['userIds'] || ''
    })
  }, [editDataId, editData])

  const onClear = () => {
    setUsersFormData(prevState => ({ ...defaultData }))
    setEditDataId(null)
    setEditData({})
  }

  return (
    <Fragment>
      <Box className='p-5 mb-8 bg-white rounded-lg shadow-md dark-d:bg-gray-800'>
        <form onSubmit={onSubmit}>
          <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
            <Box sx={{ width: '100%' }}>
              <Dropdown
                url={'users'}
                placeholder='Add user for share with'
                label={'Add user for share with'}
                value={formData.userIds}
                name='userIds'
                onChange={handleTextChange as any}
                multiple
              />
              {!!errorMessage?.['userIds'] &&
                errorMessage?.['userIds']?.map((message: any, index: number) => {
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
