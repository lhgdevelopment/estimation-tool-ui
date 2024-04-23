import EditNoteIcon from '@mui/icons-material/EditNote'
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove'
import { Box } from '@mui/material'
import { useSnackbar } from 'notistack'
import { Dispatch, useState } from 'react'
import { RichTextEditor } from 'src/@core/components/rich-text-editor'
import apiRequest from 'src/@core/utils/axios-config'

type TAIAssistantMessagesEditComponentProps = {
  editData: any
  modalClose: () => void
  setDetailsData: Dispatch<any>
}
export default function AIAssistantMessagesEditComponent(props: TAIAssistantMessagesEditComponentProps) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const { modalClose, editData, setDetailsData } = props

  const [formData, setFormData] = useState(editData)
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

  const onSubmit = (e: React.FormEvent<any>) => {
    e.preventDefault()
    setErrorMessage({})
    setPreload(true)
    if (formData?.['id']) {
      apiRequest
        .put(`/conversations/message/${formData?.['id']}`, formData)
        .then(res => {
          setDetailsData((prevState: any) => {
            const updatedList: any = [...prevState?.['messages']]
            const editedServiceIndex = updatedList.findIndex((item: any) => item['id'] === formData?.['id'])

            if (editedServiceIndex !== -1) {
              updatedList[editedServiceIndex] = res?.data
            }
            enqueueSnackbar('Updated Successfully!', { variant: 'success' })
            onClear()

            return {
              ...prevState,
              messages: updatedList
            }
          })
        })
        .catch(error => {
          setPreload(false)
          setErrorMessage(error?.response?.data?.errors)
        })
    }
  }
  const onClear = () => {
    setFormData({})
    modalClose()
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '0 auto'
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: '1000px'
        }}
      >
        <Box className='p-5 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800'>
          <Box component={'h1'} className='mt-5 mb-4 text-xl font-semibold text-gray-600 dark:text-gray-300'>
            Update Hive AI Message
          </Box>
          <form onSubmit={onSubmit}>
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
            <Box className='my-4 text-right'>
              <button
                onClick={onClear}
                type='button'
                className='px-4 py-2 mr-3 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-red-600 border border-transparent rounded-lg active:bg-red-600 hover:bg-red-700 focus:outline-none focus:shadow-outline-red'
              >
                Cancel <PlaylistRemoveIcon />
              </button>
              <button
                type='submit'
                className='px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-green-600 border border-transparent rounded-lg active:bg-green-600 hover:bg-green-700 focus:outline-none focus:shadow-outline-green'
              >
                Update
                <EditNoteIcon />
              </button>
            </Box>
          </form>
        </Box>
      </Box>
    </Box>
  )
}
