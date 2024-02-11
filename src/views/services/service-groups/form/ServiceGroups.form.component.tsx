import AddIcon from '@material-ui/icons/Add'
import ClearIcon from '@material-ui/icons/Clear'
import EditNoteIcon from '@mui/icons-material/EditNote'
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove'
import { Box } from '@mui/material'
import dynamic from 'next/dynamic'
import { Fragment, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Dropdown } from 'src/@core/components/dropdown'
import { RootState } from 'src/@core/store/reducers'
import apiRequest from 'src/@core/utils/axios-config'
import Swal from 'sweetalert2'
import { TServiceGroupsComponent } from '../ServiceGroups.decorator'

export default function ServiceGroupsFormComponent(props: TServiceGroupsComponent) {
  const { editDataId, setEditDataId, listData, setListData, editData, setEditData } = props

  const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false })
  const isDark = useSelector((state: RootState) => state.theme.isDark)
  const nameEditorRef = useRef(null)

  const defaultData = {
    serviceId: '',
    name: '',
    names: ['']
  }

  const [formData, setFormData] = useState(defaultData)

  const handleReachText = (value: string, field: string, index = -1) => {
    if (index != -1) {
      const names = [...formData.names]
      names[index] = value
      setFormData({
        ...formData,
        names: names
      })
    } else {
      setFormData({
        ...formData,
        [field]: value
      })
    }
  }

  const handleChange = (e: React.ChangeEvent<any>, index = -1) => {
    const { name, value } = e.target
    if (index != -1) {
      const names = [...formData.names]
      names[index] = value
      setFormData({
        ...formData,
        names: names
      })
    } else {
      setFormData({
        ...formData,
        [e?.target?.name]: e?.target?.value
      })
    }
  }

  const handleSelectChange = (e: any) => {
    setFormData({
      ...formData,
      [e?.target?.name]: e?.target?.value
    })
  }

  const addNameField = () => {
    setFormData({
      ...formData,
      names: [...formData.names, ''] // Add an empty string to the names array
    })
  }

  const removeNameField = (index: number) => {
    const names = [...formData.names]
    names.splice(index, 1)
    setFormData({
      ...formData,
      names: names
    })
  }

  const onSubmit = (e: React.FormEvent<any>) => {
    e.preventDefault()
    if (editDataId) {
      apiRequest.put(`/service-groups/${editDataId}`, formData).then(res => {
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
      apiRequest.post('/service-groups', formData).then(res => {
        setListData((prevState: []) => [...prevState, ...res.data])
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
      serviceId: editData?.serviceId || '',
      name: editData?.name || '',
      names: editData?.names || ['']
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
          </Box>
          {editDataId ? (
            <>
              <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
                <Box sx={{ width: '100%' }}>
                  <label className='block text-sm'>
                    <span className='text-gray-700 dark:text-gray-400'>Name</span>
                  </label>
                  <JoditEditor
                    ref={nameEditorRef}
                    config={{ enter: 'br', theme: isDark ? 'dark' : '' }}
                    value={formData.name}
                    onBlur={newContent => handleReachText(newContent, 'name')}
                  />
                </Box>
              </Box>
            </>
          ) : (
            <Box
              sx={{
                display: 'flex',
                gap: 5,
                mb: 5,
                flexDirection: 'column',
                border: '2px solid #9333ea',
                padding: '24px',
                borderRadius: '5px'
              }}
            >
              <>
                {formData.names?.map((name, index) => (
                  <Box key={index} sx={{ width: '100%', display: 'flex', gap: 5, mb: 5 }}>
                    <Box sx={{ width: '100%' }}>
                      <label className='block text-sm'>
                        <span className='text-gray-700 dark:text-gray-400'>Name</span>
                      </label>
                      <JoditEditor
                        ref={nameEditorRef}
                        config={{ enter: 'br', theme: isDark ? 'dark' : '' }}
                        value={formData.name}
                        onBlur={newContent => handleReachText(newContent, 'name', index)}
                      />
                    </Box>
                  </Box>
                ))}
              </>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type='button'
                  onClick={addNameField}
                  className='px-4 py-2 mr-3 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-blue'
                >
                  <AddIcon /> Add Another Name
                </button>
              </Box>
            </Box>
          )}
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
