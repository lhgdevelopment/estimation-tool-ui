import NorthIcon from '@mui/icons-material/North'
import { Box, Button, SelectChangeEvent } from '@mui/material'
import 'md-editor-rt/lib/style.css'
import { useRouter } from 'next/router'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Dropdown } from 'src/@core/components/dropdown'
import Preloader from 'src/@core/components/preloader'
import apiRequest from 'src/@core/utils/axios-config'
import AIAssistantMessagesComponent from './AIAssistantMessages.component'

export default function AIAssistantDetailsComponent() {
  const { user } = useSelector((state: any) => state.user)
  const conversationId = useRouter()?.query['id']

  const [preload, setPreload] = useState<boolean>(false)
  const [messagePreload, setMessagePreload] = useState<boolean>(false)
  const [detailsData, setDetailsData] = useState<any>({})

  const defaultData = {
    conversation_id: conversationId,
    prompt_id: '',
    message_content: ''
  }
  const [conversationFormData, setConversationFormData] = useState<>(defaultData)
  const [prevConversationFormData, setPrevConversationFormData] = useState<>(defaultData)
  const [errorMessage, setErrorMessage] = useState<any>({})

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const getDetails = () => {
    setPreload(true)
    apiRequest.get(`/conversations/${conversationId}`).then(res => {
      setDetailsData(res?.data)
      const userMessages = res?.data?.messages?.filter((message: any) => message?.role == 'user')

      setPrevConversationFormData({
        ...defaultData,
        ...{
          message_content: userMessages?.length ? userMessages[userMessages.length - 1].message_content : '',
          prompt_id: userMessages?.length ? userMessages[userMessages.length - 1].prompt_id : ''
        }
      })

      setPreload(false)
      setTimeout(() => {
        scrollToBottom()
      }, 100)
    })
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSubmit()
    }
  }

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const onSubmit = (isRegenerate = false) => {
    setErrorMessage({})
    const formData = {
      ...(isRegenerate ? prevConversationFormData : conversationFormData),
      conversation_id: conversationId
    }
    setConversationFormData(defaultData)
    setDetailsData((prevState: any) => ({
      ...prevState,
      messages: [
        ...prevState.messages,
        ...[
          {
            ...formData,
            user: { name: user.name }
          },
          {
            message_content: null,
            role: 'system'
          }
        ]
      ]
    }))
    setTimeout(() => {
      scrollToBottom()
    }, 100)
    setMessagePreload(true)
    apiRequest
      .post(`/conversations/continue`, formData)
      .then(res => {
        setDetailsData((prevState: any) => ({
          ...prevState,
          messages: [...prevState.messages.filter((message: any) => message?.id), ...res?.data?.messages]
        }))
        setPrevConversationFormData(res?.data?.messages?.[0])
        setMessagePreload(false)
        scrollToBottom()
      })
      .catch(error => {
        setErrorMessage(error?.response?.data?.errors)
        setDetailsData((prevState: any) => ({
          ...prevState,
          messages: [...prevState.messages.filter((message: any) => message?.id)]
        }))
        setMessagePreload(false)
        scrollToBottom()
      })
  }

  useEffect(() => {
    if (conversationId) {
      getDetails()
    }
  }, [conversationId])

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
        <Box className='container px-6 mx-auto' sx={{ height: 'calc(100vh - 100px)', position: 'relative' }}>
          <Box
            sx={{
              height: 'calc(100% - 130px)',
              overflow: 'hidden',
              overflowY: 'auto'
            }}
          >
            {detailsData?.messages?.map((message: any, index: number) => {
              return (
                <AIAssistantMessagesComponent
                  key={index}
                  index={index}
                  message={message}
                  isWaiting={!message?.message_content}
                  onRegenerate={() => {
                    onSubmit(true)
                  }}
                />
              )
            })}
            <Box ref={messagesEndRef}></Box>
          </Box>

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
                component={'textarea'}
                className={`block w-full mt-1 text-sm dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input ${
                  errorMessage?.['clientWebsite'] ? 'border-red-600' : 'dark:border-gray-600 '
                }`}
                placeholder='Chat Prompt...'
                name='message_content'
                value={conversationFormData.message_content}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                sx={{
                  paddingBottom: '0.875rem',
                  paddingTop: '0.875rem',
                  paddingLeft: '1rem',
                  margin: '0',
                  borderWidth: '0',
                  overflow: 'hidden',
                  resize: 'none'
                }}
                disabled={messagePreload}
              ></Box>

              <Button
                onClick={() => {
                  onSubmit()
                }}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  right: '9px',
                  background: conversationFormData?.message_content ? '#000' : '#e3e3e3',
                  padding: '0',
                  height: '30px',
                  width: '30px',
                  minWidth: 'auto',
                  transform: 'translate(0%, -50%)',
                  color: '#fff',
                  border: '0',
                  outline: '0',
                  borderRadius: '0.5rem',
                  zIndex: 1,
                  '&:hover': {
                    background: '#000'
                  }
                }}
                disabled={!conversationFormData?.message_content}
              >
                <NorthIcon sx={{ fontSize: '16px' }} />
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
