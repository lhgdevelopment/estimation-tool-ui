import AddIcon from '@material-ui/icons/Add'
import ClearIcon from '@material-ui/icons/Clear'
import EditNoteIcon from '@mui/icons-material/EditNote'
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove'
import { Box } from '@mui/material'
import { Fragment, useEffect, useState } from 'react'
import { Dropdown } from 'src/@core/components/dropdown'
import { RichTextEditor } from 'src/@core/components/rich-text-editor'
import apiRequest from 'src/@core/utils/axios-config'
import Swal from 'sweetalert2'
import { TServiceComponent } from '../Service.decorator'

export default function ServiceFormComponent(props: TServiceComponent) {
  const { editDataId, setEditDataId, listData, setListData, editData, setEditData } = props

  const defaultData = {
    name: '',
    projectTypeId: ''
  }

  const [formData, setFormData] = useState(defaultData)

  const handleReachText = (value: string, field: string) => {
    setFormData({
      ...formData,
      [field]: value
    })
  }

  const handleTextChange = (e: React.ChangeEvent<any>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSelectChange = (e: any) => {
    setFormData({
      ...formData,
      [e?.target?.name]: e?.target?.value
    })
  }

  const onSubmit = (e: React.FormEvent<any>) => {
    e.preventDefault()
    if (editDataId) {
      apiRequest.put(`/services/${editDataId}`, formData).then(res => {
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
      apiRequest.post('/services', formData).then(res => {
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
      name: editData?.['name'],
      projectTypeId: editData?.['projectTypeId']
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
          <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
            <Box sx={{ width: '100%' }}>
              <label className='block text-sm'>
                <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Project Type</span>
                <Dropdown
                  url={'project-type'}
                  name='projectTypeId'
                  value={formData.projectTypeId}
                  onChange={handleSelectChange}
                />
              </label>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
            <Box sx={{ width: '100%' }}>
              <label className='block text-sm'>
                <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Name</span>
              </label>
              <RichTextEditor value={formData.name} onBlur={newContent => handleReachText(newContent, 'name')} />
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
