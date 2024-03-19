import AddIcon from '@material-ui/icons/Add'
import ClearIcon from '@material-ui/icons/Clear'
import EditNoteIcon from '@mui/icons-material/EditNote'
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove'
import { Box, SelectChangeEvent } from '@mui/material'
import { Fragment, useEffect, useState } from 'react'
import { Dropdown } from 'src/@core/components/dropdown'
import UiSkeleton from 'src/@core/components/ui-skeleton'
import apiRequest from 'src/@core/utils/axios-config'
import Swal from 'sweetalert2'
import { TProjectComponentComponent } from '../ProjectComponent.decorator'

export default function ProjectComponentFormComponent(props: TProjectComponentComponent) {
  const { editDataId, setEditDataId, listData, setListData, editData, setEditData } = props

  const defaultData = {
    project_id: '',
    components: ['']
  }

  const handleTextChange = (e: SelectChangeEvent<any>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const [formData, setFormData] = useState(defaultData)

  const handleMultipleSelectChange = (e: any) => {
    const selectedValue = e?.target?.value
    const selectedArray = Array.isArray(selectedValue) ? selectedValue : [selectedValue]

    setFormData({
      ...formData,
      [e?.target?.name]: selectedArray
    })
  }

  const onSubmit = (e: React.FormEvent<any>) => {
    e.preventDefault()
    if (editDataId) {
      apiRequest.put(`/project-components/${editDataId}`, formData).then(res => {
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
      apiRequest.post('/project-components', formData).then(res => {
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
      project_id: editData?.['project_id'],
      components: editData?.['components']
    })
  }, [editDataId, editData])

  const onClear = () => {
    setFormData(prevState => ({ ...defaultData }))
    setEditDataId(null)
    setEditData({})
  }

  if (!listData?.length) {
    return <UiSkeleton />
  }

  return (
    <Fragment>
      <Box className='p-5 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800'>
        <form onSubmit={onSubmit}>
          <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
            <Box sx={{ width: '50%' }}>
              <label className='block text-sm'>
                <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Project</span>
                <Dropdown
                  url={'projects'}
                  name='project_id'
                  value={formData.project_id}
                  onChange={handleTextChange}
                  optionConfig={{ id: 'project_id', title: 'project_name' }}
                />
              </label>
            </Box>
            <Box sx={{ width: '50%' }}>
              <label className='block text-sm'>
                <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Components</span>
                <Dropdown
                  url={'components'}
                  name='components'
                  value={formData.components}
                  onChange={handleMultipleSelectChange}
                  optionConfig={{ id: 'component_id', title: 'component_name' }}
                  multiple
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
