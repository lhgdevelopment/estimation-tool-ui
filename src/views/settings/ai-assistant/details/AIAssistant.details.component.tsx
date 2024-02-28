import NorthIcon from '@mui/icons-material/North'
import { Box, Button, SelectChangeEvent } from '@mui/material'
import 'md-editor-rt/lib/style.css'
import { useRouter } from 'next/router'
import { ChangeEvent, useEffect, useState } from 'react'
import { Dropdown } from 'src/@core/components/dropdown'
import Preloader from 'src/@core/components/preloader'
import apiRequest from 'src/@core/utils/axios-config'

export default function AIAssistantDetailsComponent() {
  const meetingId = useRouter()?.query['id']

  const [preload, setPreload] = useState<boolean>(false)
  const [detailsData, setDetailsData] = useState<any>({})

  const defaultData = {
    conversation_id: '',
    prompt_id: '',
    message_content: ''
  }
  const [conversationFormData, setConversationFormData] = useState(defaultData)
  const [errorMessage, setErrorMessage] = useState<any>({})

  const getDetails = () => {
    setPreload(true)
    apiRequest.get(`/conversations/${meetingId}`).then(res => {
      setDetailsData(res.data)
      setPreload(false)
    })
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setConversationFormData({
      ...conversationFormData,
      [e?.target?.name]: e.target.value
    })
  }

  const handleSelectChange = (e: SelectChangeEvent<any>) => {
    setConversationFormData({
      ...conversationFormData,
      [e?.target?.name]: e?.target?.value
    })
  }

  useEffect(() => {
    if (meetingId) {
      getDetails()
    }
  }, [meetingId])

  const sowHeadingSx = {
    fontSize: '16x',
    fontWeight: '600',
    textAlign: 'center',

    color: '#6c2bd9'
  }

  const sowBodySx = { p: 2, my: 2 }

  if (preload) {
    return <Preloader close={preload} />
  }

  return (
    <Box sx={{ p: 5 }}>
      <Box>
        <Box className='container px-6 mx-auto' sx={{ height: 'calc(100vh - 126px)', position: 'relative' }}>
          <Box></Box>
          <Box
            sx={{
              position: 'absolute',
              width: '100%',
              bottom: '0',
              left: '0',
              right: '0'
            }}
          >
            <Box sx={{ width: '100%', mb: 2 }}>
              <label className='block text-sm'>
                <span className='text-gray-700 dark:text-gray-400'>Prompt</span>
                <Dropdown
                  url={'prompts'}
                  name='prompt_id'
                  value={conversationFormData.prompt_id}
                  onChange={handleSelectChange}
                  optionConfig={{ id: 'id', title: 'name' }}
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
            <Box
              sx={{
                width: '100%',
                mb: 2,
                position: 'relative',
                border: '1px solid rgba(0, 0, 0, .15)',
                overflow: 'hidden',
                background: '#fff',
                borderRadius: '1rem'
              }}
            >
              <Box
                component={'input'}
                className={`block w-full mt-1 text-sm dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input ${
                  errorMessage?.['clientWebsite'] ? 'border-red-600' : 'dark:border-gray-600 '
                }`}
                placeholder='Chat Prompt...'
                name='message_content'
                value={conversationFormData.message_content}
                onChange={handleChange}
                sx={{
                  paddingBottom: '0.875rem',
                  paddingTop: '0.875rem',
                  paddingLeft: '1rem',
                  margin: '0',
                  borderWidth: '0',
                  overflow: 'hidden',
                  resize: 'none'
                }}
              ></Box>

              <Button
                sx={{
                  position: 'absolute',
                  top: '50%',
                  right: '9px',
                  background: '#e3e3e3',
                  padding: '0',
                  height: '30px',
                  width: '30px',
                  minWidth: 'auto',
                  transform: 'translate(0%, -50%)',
                  color: '#fff',
                  border: '0',
                  outline: '0',
                  borderRadius: '0.5rem',
                  zIndex: 1
                }}
              >
                <NorthIcon />
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
