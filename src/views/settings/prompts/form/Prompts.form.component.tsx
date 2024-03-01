import AddIcon from '@material-ui/icons/Add'
import ClearIcon from '@material-ui/icons/Clear'
import EditNoteIcon from '@mui/icons-material/EditNote'
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove'
import { Box } from '@mui/material'
import { Fragment, useEffect, useState } from 'react'
import { Dropdown } from 'src/@core/components/dropdown'
import apiRequest from 'src/@core/utils/axios-config'
import Swal from 'sweetalert2'
import { TPromptsComponent, promptsTypeList } from '../Prompts.decorator'

export default function PromptsFormComponent(props: TPromptsComponent) {
  const { editDataId, setEditDataId, listData, setListData, editData, setEditData } = props

  const defaultData = {
    name: '',
    type: null,
    prompt: ''
  }

  const [promptsPromptsFormData, setPromptsFormData] = useState(defaultData)
  const [errorMessage, setErrorMessage] = useState<any>({})

  const handleChange = (e: React.ChangeEvent<any>) => {
    setPromptsFormData({
      ...promptsPromptsFormData,
      [e.target.name]: e.target.value
    })
  }

  const handleSelectChange = (e: any) => {
    setPromptsFormData({
      ...promptsPromptsFormData,
      [e?.target?.name]: e?.target?.value
    })
  }

  const onSubmit = (e: React.FormEvent<any>) => {
    e.preventDefault()
    if (editDataId) {
      apiRequest
        .put(`/prompts/${editDataId}`, promptsPromptsFormData)
        .then(res => {
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
            onClear()

            return updatedList
          })
        })
        .catch(error => {
          setErrorMessage(error?.response?.data?.errors)
        })
    } else {
      apiRequest
        .post('/prompts', promptsPromptsFormData)
        .then(res => {
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
        .catch(error => {
          setErrorMessage(error?.response?.data?.errors)
        })
    }
  }

  useEffect(() => {
    setPromptsFormData({
      name: editData?.['name'],
      type: editData?.['type'],
      prompt: editData?.['prompt']
    })
  }, [editDataId, editData])

  const onClear = () => {
    setPromptsFormData(prevState => defaultData)
    setEditDataId(null)
    setEditData({})
  }

  return (
    <Fragment>
      <Box className='p-5 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800'>
        <form onSubmit={onSubmit}>
          <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
            <Box sx={{ width: '50%' }}>
              <label className='block text-sm'>
                <span className='text-gray-700 dark:text-gray-400'>Name</span>
                <input
                  className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                  placeholder='Enter prompt name'
                  name='name'
                  value={promptsPromptsFormData.name}
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
            <Box sx={{ width: '50%' }}>
              <label className='block text-sm'>
                <span className='text-gray-700 dark:text-gray-400'>Type</span>
                <Dropdown
                  isEnumField
                  enumList={promptsTypeList}
                  name='type'
                  value={promptsPromptsFormData.type}
                  onChange={handleSelectChange}
                />
                {!!errorMessage?.['type'] &&
                  errorMessage?.['type']?.map((message: any, index: number) => {
                    return (
                      <span key={index} className='text-xs text-red-600 dark:text-red-400'>
                        {message}
                      </span>
                    )
                  })}
              </label>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 5 }}>
            <Box sx={{ width: '100%' }}>
              <label className='block text-sm'>
                <span className='text-gray-700 dark:text-gray-400'>Prompt</span>
                <textarea
                  className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                  placeholder='Examples: Prompt content'
                  name='prompt'
                  rows={10}
                  value={promptsPromptsFormData.prompt}
                  onChange={handleChange}
                />
                {!!errorMessage?.['prompt'] &&
                  errorMessage?.['prompt']?.map((message: any, index: number) => {
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
