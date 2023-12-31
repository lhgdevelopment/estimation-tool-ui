import AddIcon from '@material-ui/icons/Add'
import ClearIcon from '@material-ui/icons/Clear'
import EditNoteIcon from '@mui/icons-material/EditNote'
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove'
import { Box } from '@mui/material'
import { Fragment, useEffect, useState } from 'react'
import { Dropdown } from 'src/@core/components/dropdown'
import apiRequest from 'src/@core/utils/axios-config'
import Swal from 'sweetalert2'
import { TServiceDeliverableTasksComponent } from '../ServiceDeliverableTasks.decorator'

export default function ServiceDeliverableTasksFormComponent(props: TServiceDeliverableTasksComponent) {
  const { editDataId, setEditDataId, listData, setListData, editData, setEditData } = props

  const defaultData = {
    name: '',
    serviceId: '',
    serviceScopeId: '',
    serviceDeliverableId: '',
    cost: '',
    description: ''

  }

  const [formData, setFormData] = useState(defaultData)
  const [serviceScopeUrl, setServiceScopeUrl] = useState('service-scopes')
  const [serviceDeliverableUrl, setServiceDeliverableUrl] = useState('service-deliverables')

  const handleChange = (e: React.ChangeEvent<any>) => {
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
      apiRequest.put(`/service-deliverable-tasks/${editDataId}`, formData).then(res => {
        setListData((prevState: []) => {
          const updatedList: any = [...prevState]
          const editedServiceIndex = updatedList.findIndex(
            (item: any) => item['_id'] === editDataId // Replace 'id' with the actual identifier of your item
          )
          if (editedServiceIndex !== -1) {
            updatedList[editedServiceIndex] = res.data
          }
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
    } else {
      apiRequest.post('/service-deliverable-tasks', formData).then(res => {
        setListData((prevState: []) => [...prevState, res.data])
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
    if (formData.serviceId) {
      setServiceScopeUrl(`service-scopes?serviceId=${formData.serviceId}`);
    } else {
      setServiceScopeUrl(''); // Reset the URL when serviceId is not selected
    }
  }, [formData.serviceId]);

  useEffect(() => {
    if (formData.serviceScopeId) {
      setServiceDeliverableUrl(`service-deliverables?serviceScopeId=${formData.serviceScopeId}`);
    } else {
      setServiceDeliverableUrl('');
    }
  }, [formData.serviceScopeId]);

  useEffect(() => {
    setFormData({
      name: editData?.['name'],
      serviceId: editData?.['serviceId'],
      serviceScopeId: editData?.['serviceScopeId'],
      serviceDeliverableId: editData?.['serviceDeliverableId'],
      cost: editData?.['cost'],
      description: editData?.['description']
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
            <Box sx={{ width: '33%' }}>
              <label className='block text-sm'>
                <span className='text-gray-700 dark:text-gray-400'>Name</span>
                <input
                  className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                  placeholder='Examples: Logo'
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                />
              </label>
            </Box>
            <Box sx={{ width: '33%' }}>
              <label className='block text-sm'>
                <span className='text-gray-700 dark:text-gray-400'>Service</span>
                <Dropdown
                  url={'services'}
                  name='serviceId'
                  value={formData.serviceId}
                  onChange={handleSelectChange}
                  optionConfig={{ id: 'id', title: 'name' }}
                />
              </label>
            </Box>
            <Box sx={{ width: '33%' }}>
              <label className='block text-sm'>
                <span className='text-gray-700 dark:text-gray-400'>Service Scope</span>
                <Dropdown
                  url={serviceScopeUrl}
                  name='serviceScopeId'
                  value={formData.serviceScopeId}
                  onChange={handleSelectChange}
                  optionConfig={{ id: 'id', title: 'name' }}
                />
              </label>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 5 }}>
            <Box sx={{ width: '33%' }}>
              <label className='block text-sm'>
                <span className='text-gray-700 dark:text-gray-400'>Service Deliverable</span>
                <Dropdown
                  url={serviceDeliverableUrl}
                  name='serviceDeliverableId'
                  value={formData.serviceDeliverableId}
                  onChange={handleSelectChange}
                  optionConfig={{ id: 'id', title: 'name' }}
                />
              </label>
            </Box>
            <Box sx={{ width: '33%' }}>
              <label className='block text-sm'>
                <span className='text-gray-700 dark:text-gray-400'>Cost</span>
                <input
                  className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                  placeholder='Examples: 50.00'
                  name='cost'
                  value={formData.cost}
                  onChange={handleChange}
                />
              </label>
            </Box>
            <Box sx={{ width: '33%' }}>
              <label className='block text-sm'>
                <span className='text-gray-700 dark:text-gray-400'>Description</span>
                <input
                  className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                  placeholder='Examples: Company logo for header'
                  name='description'
                  value={formData.description}
                  onChange={handleChange}
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
