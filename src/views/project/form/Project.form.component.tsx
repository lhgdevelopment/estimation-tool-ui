import AddIcon from '@material-ui/icons/Add'
import ClearIcon from '@material-ui/icons/Clear'
import EditNoteIcon from '@mui/icons-material/EditNote'
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove'
import { Box } from '@mui/material'
import { Fragment, useEffect, useState } from 'react'
import apiRequest from 'src/@core/utils/axios-config'
import Swal from 'sweetalert2'
import { TProjectComponent } from '../Project.decorator'

export default function ProjectFormComponent(props: TProjectComponent) {
  const { editDataId, setEditDataId, listData, setListData, editData, setEditData } = props

  const defaultData = {
    project_name: '',
    project_description: '',
    total_cost: ''
  }

  const [formData, setFormData] = useState(defaultData)

  const handleTextChange = (e: React.ChangeEvent<any>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const onSubmit = (e: React.FormEvent<any>) => {
    e.preventDefault()
    if (editDataId) {
      apiRequest.put(`/projects/${editDataId}`, formData).then(res => {
        setListData((prevState: []) => {
          const updatedList: any = [...prevState]
          const editedServiceIndex = updatedList.findIndex((item: any) => item['id'] === editDataId)
          if (editedServiceIndex !== -1) {
            updatedList[editedServiceIndex] = res?.data
          }
          Swal.fire({
            title: 'Data Updated Successfully!',
            icon: 'success',
            timer: 1000,
            timerProgressBar: true,
            showConfirmButton: false
          })
          onClear()

          return updatedList
        })
      })
    } else {
      apiRequest.post('/projects', formData).then(res => {
        setListData((prevState: []) => [...prevState, res?.data])
        Swal.fire({
          title: 'Data Created Successfully!',
          icon: 'success',
          timer: 1000,
          timerProgressBar: true,
          showConfirmButton: false
        })
        onClear()
      })
    }
  }

  useEffect(() => {
    setFormData({
      project_name: editData?.['project_name'],
      project_description: editData?.['project_description'],
      total_cost: editData?.['total_cost']
    })
  }, [editDataId, editData])

  const onClear = () => {
    setFormData(prevState => ({ ...defaultData }))
    setEditDataId(null)
    setEditData({})
  }

  return (
    <Fragment>
      <Box className='p-5 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800'>
        <form onSubmit={onSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5, mb: 5 }}>
            <Box sx={{ width: '100%' }}>
              <label className='block text-sm'>
                <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Project Name</span>
                <input
                  className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                  placeholder='Examples: Header, Footer, etc'
                  name='project_name'
                  value={formData.project_name}
                  onChange={handleTextChange}
                />
              </label>
            </Box>
            <Box sx={{ width: '100%' }}>
              <label className='block text-sm'>
                <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Project Description</span>
                <input
                  className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                  placeholder='Examples: Header, Footer, etc'
                  name='project_description'
                  value={formData.project_description}
                  onChange={handleTextChange}
                />
              </label>
            </Box>
            <Box sx={{ width: '100%' }}>
              <label className='block text-sm'>
                <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Total Cost</span>
                <input
                  className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                  placeholder='Examples: Header, Footer, etc'
                  name='total_cost'
                  value={formData.total_cost}
                  onChange={handleTextChange}
                />
              </label>
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
