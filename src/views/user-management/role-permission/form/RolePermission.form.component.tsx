import AddIcon from '@material-ui/icons/Add'
import ClearIcon from '@material-ui/icons/Clear'
import EditNoteIcon from '@mui/icons-material/EditNote'
import { Box } from '@mui/material'
import { Fragment, useEffect, useState } from 'react'
import apiRequest from 'src/@core/utils/axios-config'
import Swal from 'sweetalert2'
import { TRolePermissionComponent } from '../RolePermission.decorator'

export default function RolePermissionFormComponent(props: TRolePermissionComponent) {
  const { editDataId, setEditDataId, listData, setListData, editData, setEditData, roleModalClose, roleSorting } = props

  const defaultData = {
    name: '',
    permissions: ['']
  }

  const [rolesFormData, setRolePermissionFormData] = useState(defaultData)
  const [errorMessage, setErrorMessage] = useState<any>({})

  const handleChange = (e: React.ChangeEvent<any>) => {
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
        .then(res => {
          setListData((prevState: []) => {
            const updatedList: any = [...prevState]
            const editedServiceIndex = updatedList.findIndex(
              (item: any) => item['_id'] === editDataId // Replace 'id' with the actual identifier of your item
            )
            if (editedServiceIndex !== -1) {
              updatedList[editedServiceIndex] = res.data
            }
            roleModalClose()
            Swal.fire({
              title: 'Data Updated Successfully!',
              icon: 'success',
              timer: 1000,
              timerProgressBar: true,
              showConfirmButton: false
            })

            return updatedList
          })

          onClear()
        })
        .catch(error => {
          setErrorMessage(error?.response?.data?.errors)
        })
    } else {
      apiRequest
        .post('/roles', rolesFormData)
        .then(res => {
          setListData((prevState: []) => roleSorting([res.data, ...prevState]))
          roleModalClose()
          Swal.fire({
            title: 'Data Created Successfully!',
            icon: 'success',
            timer: 1000,
            timerProgressBar: true,
            showConfirmButton: false
          })
          onClear()
        })
        .catch(error => {
          setErrorMessage(error?.response?.data?.errors)
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
      <Box className='p-5 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800'>
        <form onSubmit={onSubmit}>
          <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
            <Box sx={{ width: '100%' }}>
              <label className='block text-sm'>
                <span className='text-gray-700 dark:text-gray-400'>Name</span>
                <input
                  className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                  placeholder='Enter Role Name'
                  name='name'
                  value={rolesFormData.name}
                  onChange={handleChange}
                />
                {!!errorMessage?.['name'] &&
                  errorMessage?.['name']?.map((message: any, index: number) => {
                    return (
                      <span key={index} className='text-xs text-red-600 dark:text-red-400'>
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
