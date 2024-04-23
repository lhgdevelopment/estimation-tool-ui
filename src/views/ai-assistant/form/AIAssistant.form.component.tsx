import AddIcon from '@material-ui/icons/Add'
import ClearIcon from '@material-ui/icons/Clear'
import EditNoteIcon from '@mui/icons-material/EditNote'
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove'
import { Box } from '@mui/material'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import { Fragment, useEffect, useState } from 'react'
import { Dropdown } from 'src/@core/components/dropdown'
import Preloader from 'src/@core/components/preloader'
import { RichTextEditor } from 'src/@core/components/rich-text-editor'
import apiRequest from 'src/@core/utils/axios-config'
import { TAIAssistantComponent } from '../AIAssistant.decorator'

export default function AIAssistantFormComponent(props: TAIAssistantComponent) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const { editDataId, setEditDataId, listData, setListData, editData, setEditData } = props
  const router = useRouter()

  const defaultData = {
    name: '',
    prompt_id: '',
    message_content: ''
  }

  const [formData, setFormData] = useState(defaultData)
  const [errorMessage, setErrorMessage] = useState<any>({})
  const [prelaod, setPreload] = useState<boolean>(false)

  const handleTextChange = (e: React.ChangeEvent<any>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }
  const handleReachText = (value: string, field: string) => {
    setFormData({
      ...formData,
      [field]: value
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
    setErrorMessage({})
    setPreload(true)
    if (editDataId) {
      apiRequest
        .put(`/conversations/${editDataId}`, formData)
        .then(res => {
          setListData((prevState: []) => {
            const updatedList: any = [...prevState]
            const editedServiceIndex = updatedList.findIndex((item: any) => item['id'] === editDataId)
            console.log(editedServiceIndex)

            if (editedServiceIndex !== -1) {
              updatedList[editedServiceIndex] = res?.data
            }
            enqueueSnackbar('Updated Successfully!', { variant: 'success' })
            onClear()
            setPreload(false)

            return updatedList
          })
        })
        .catch(error => {
          setPreload(false)
          setErrorMessage(error?.response?.data?.errors)
        })
    } else {
      apiRequest
        .post('/conversations/create', formData)
        .then(res => {
          enqueueSnackbar('Created Successfully!', { variant: 'success' })
          onClear()
          setPreload(false)
          router.push(`ai-assistant/${res?.data?.conversation?.id}`)
        })
        .catch(error => {
          setPreload(false)
          setErrorMessage(error?.response?.data?.errors)
          enqueueSnackbar(error?.response?.data?.message, { variant: 'error' })
        })
    }
  }

  useEffect(() => {
    setFormData({
      name: editData?.['name'],
      prompt_id: '',
      message_content: ''
    })
  }, [editDataId, editData])

  const onClear = () => {
    setFormData(prevState => ({ ...defaultData }))
    setEditDataId(null)
    setEditData({})
  }

  return (
    <Fragment>
      {!!prelaod && <Preloader close={!!prelaod} />}
      <Box className='p-5 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800'>
        <form onSubmit={onSubmit}>
          <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
            <Box sx={{ width: editDataId ? '100%' : '50%' }}>
              <label className='block text-sm'>
                <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Name</span>
                <input
                  className={`block w-full mt-1 text-sm dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input ${
                    errorMessage?.['name'] ? 'border-red-600' : 'dark:border-gray-600 '
                  }`}
                  placeholder='Enter Name Here...'
                  name='name'
                  value={formData.name}
                  onChange={handleTextChange}
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
            {!editDataId && (
              <Box sx={{ width: '50%' }}>
                <label className='block text-sm'>
                  <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Prompt</span>
                  <Dropdown
                    url={'prompts'}
                    name='prompt_id'
                    value={formData.prompt_id}
                    onChange={handleSelectChange}
                    className={`block w-full mt-1 text-sm dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input ${
                      errorMessage?.['prompt_id'] ? 'border-red-600' : 'dark:border-gray-600 '
                    }`}
                  />
                  {!!errorMessage?.['prompt_id'] &&
                    errorMessage?.['prompt_id']?.map((message: any, index: number) => {
                      return (
                        <span key={index} className='text-xs text-red-600 dark:text-red-400'>
                          {message}
                        </span>
                      )
                    })}
                </label>
              </Box>
            )}
          </Box>
          {!editDataId && (
            <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
              <Box sx={{ width: '100%' }}>
                <label className='block text-sm'>
                  <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Message</span>
                </label>
                <RichTextEditor
                  value={formData.message_content}
                  onChangeonBluronBlur={newContent => handleReachText(newContent, 'message_content')}
                />
                {!!errorMessage?.['message_content'] &&
                  errorMessage?.['message_content']?.map((message: any, index: number) => {
                    return (
                      <span key={index} className='text-xs text-red-600 dark:text-red-400'>
                        {message}
                      </span>
                    )
                  })}
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
              {editDataId ? 'Update ' : 'Start '}

              {editDataId ? <EditNoteIcon /> : <AddIcon />}
            </button>
          </Box>
        </form>
      </Box>
    </Fragment>
  )
}
