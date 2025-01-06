import { useToastSnackbar } from '@core/hooks/useToastSnackbar'
import apiRequest from '@core/utils/axios-config'
import AddIcon from '@material-ui/icons/Add'
import ClearIcon from '@material-ui/icons/Clear'
import EditNoteIcon from '@mui/icons-material/EditNote'
import { Box, TextField } from '@mui/material'
import { Fragment, useEffect, useState } from 'react'
import { TRolePermissionComponent } from '../RolePermission.decorator'

export default function RolePermissionFormComponent(props: TRolePermissionComponent) {
  const { showSnackbar } = useToastSnackbar()
  const { editDataId, setEditDataId, listData, setListData, editData, setEditData, roleModalClose, roleSorting } = props

  const defaultData = {
    name: '',
    permissions: ['']
  }

  const [rolesFormData, setRolePermissionFormData] = useState(defaultData)
  const [errorMessage, setErrorMessage] = useState<any>({})

  const handleTextChange = (e: React.ChangeEvent<any>) => {
    setRolePermissionFormData({
      ...rolesFormData,
      [e.target.name]: e.target.value
    })
  }

  const handleSelectChange = (e: any) => {
    setRolePermissionFormData({
      ...rolesFormData,
      [e?.target?.name]: e?.target?.value
    })
  }

  const onSubmit = (e: React.FormEvent<any>) => {
    e.preventDefault()
    if (editDataId) {
      apiRequest
        .put(`/roles/${editDataId}`, rolesFormData)
        .then((res: any) => {
          setListData((prevState: []) => {
            const updatedList: any = [...prevState]
            const editedServiceIndex = updatedList.findIndex((item: any) => item['id'] === editDataId)
            if (editedServiceIndex !== -1) {
              updatedList[editedServiceIndex] = res?.data
            }

            return updatedList
          })
          roleModalClose()
          onClear()
          showSnackbar('Updated Successfully!', { variant: 'success' })
        })
        .catch((err: any) => {
          setErrorMessage(err?.data?.errors)
          showSnackbar(err?.data?.message, { variant: 'error' })
        })
    } else {
      apiRequest
        .post('/roles', rolesFormData)
        .then((res: any) => {
          setListData((prevState: []) => roleSorting([res?.data, ...prevState]))
          roleModalClose()
          showSnackbar('Created Successfully!', { variant: 'success' })
          onClear()
        })
        .catch((err: any) => {
          setErrorMessage(err?.data?.errors)
          showSnackbar(err?.data?.message, { variant: 'error' })
        })
    }
  }

  useEffect(() => {
    setRolePermissionFormData({
      name: editData?.['name'],
      permissions: editData?.['permissions']
    })
  }, [editDataId, editData])

  const onClear = () => {
    setRolePermissionFormData(prevState => ({ ...defaultData }))
    setEditDataId(null)
    setEditData({})
  }

  return (
    <Fragment>
      <Box className='p-5 mb-8 bg-white rounded-lg shadow-md dark-d:bg-gray-800'>
        <form onSubmit={onSubmit}>
          <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
            <Box sx={{ width: '100%' }}>
              <label className='block text-sm'>
                <TextField
                  id='outlined-multiline-flexible'
                  label='Name'
                  className={`block w-full text-sm dark-d:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark-d:text-gray-300 dark-d:focus:shadow-outline-gray form-input ${
                    errorMessage?.['name'] ? 'border-red-600' : 'dark-d:border-gray-600'
                  }`}
                  placeholder='Name'
                  name='name'
                  value={rolesFormData.name}
                  onChange={handleTextChange}
                />
                {!!errorMessage?.['name'] &&
                  errorMessage?.['name']?.map((message: any, index: number) => {
                    return (
                      <span key={index} className='text-xs text-red-600 dark-d:text-red-400'>
                        {message}
                      </span>
                    )
                  })}
              </label>
            </Box>
          </Box>

          <Box className='my-4 text-right'>
            <button
              onClick={roleModalClose}
              type='button'
              className='px-4 py-2 mr-3 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-red-600 border border-transparent rounded-lg active:bg-red-600 hover:bg-red-700 focus:outline-none focus:shadow-outline-red'
            >
              Cancel
              <ClearIcon />
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
