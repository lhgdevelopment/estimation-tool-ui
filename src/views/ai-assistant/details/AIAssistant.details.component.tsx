import IosShareIcon from '@mui/icons-material/IosShare'
import NorthEastIcon from '@mui/icons-material/North'
import PersonIcon from '@mui/icons-material/Person'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import { blue } from '@mui/material/colors'

import { Box, DialogActions, DialogContent, IconButton, Modal, SelectChangeEvent, TextField } from '@mui/material'
import 'md-editor-rt/lib/style.css'
import { useRouter } from 'next/router'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Dropdown } from 'src/@core/components/dropdown'
import Preloader from 'src/@core/components/preloader'
import { useToastSnackbar } from 'src/@core/hooks/useToastSnackbar'
import apiRequest from 'src/@core/utils/axios-config'
import AIAssistantMessagesEditComponent from './AIAssistantMessageEdit.component'
import AIAssistantMessagesComponent from './AIAssistantMessages.component'

export default function AIAssistantDetailsComponent() {
  const { showSnackbar } = useToastSnackbar()
  const currentUser = useSelector((state: any) => state.user)?.user
  const conversationId = useRouter()?.query['id']

  const [preload, setPreload] = useState<boolean>(false)
  const [isWaiting, setIsWaiting] = useState<boolean>(false)
  const [messagePreload, setMessagePreload] = useState<boolean>(false)
  const [detailsData, setDetailsData] = useState<any>({})

  const [messageEditOpenModal, setMessageEditOpenModal] = useState<boolean>(false)
  const handlemessageEditModalClose = () => setMessageEditOpenModal(false)
  const [editData, setEditData] = useState<boolean>(false)

  const defaultData = {
    conversation_id: conversationId,
    prompt_id: '',
    message_content: ''
  }
  const [conversationFormData, setConversationFormData] = useState(defaultData)
  const [prevConversationFormData, setPrevConversationFormData] = useState(defaultData)
  const [errorMessage, setErrorMessage] = useState<any>({})

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [selectedUserIdsForShare, setSelectedUserIdsForShare] = useState<any[]>([])
  const [selectedShareType, setSelectedShareType] = useState('')

  const handleShareDialogOpen = () => {
    setShareDialogOpen(true)
  }

  const handleShareDialogClose = () => {
    setShareDialogOpen(false)
    setSelectedUserIdsForShare([])
    setSelectedShareType('')
  }

  const handleShareUserOnChange = (ids = []) => {
    setSelectedUserIdsForShare(ids)
  }
  const handleShareTypeonChange = (type = '') => {
    setSelectedShareType(type)
  }

  const handleShareOnSubmit = () => {
    const userAccess = selectedUserIdsForShare.map((id: any) => {
      return {
        user_id: id
      }
    })
    apiRequest.post(`/conversations/share/${conversationId}`, {
      user_access: []
    })
  }

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

  const handleTextChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setConversationFormData({
      ...conversationFormData,
      [e?.target?.name]: e.target.value
    })
  }

  const handleReachText = (value: string, field: string) => {
    setConversationFormData({
      ...conversationFormData,
      [field]: value
    })
  }

  const handleSelectChange = (e: SelectChangeEvent<any>) => {
    setConversationFormData({
      ...conversationFormData,
      [e?.target?.name]: e?.target?.value
    })
  }

  const handleKeyDown = (e: any) => {
    if (String(e?.target?.['value']).trim() && e.key === 'Enter' && !e.shiftKey) {
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
    setIsWaiting(true)
    setErrorMessage({})
    const formData = {
      ...(isRegenerate ? prevConversationFormData : conversationFormData),
      conversation_id: conversationId
    }
    if (formData.message_content || formData.prompt_id) {
      setConversationFormData(defaultData)
      setDetailsData((prevState: any) => ({
        ...prevState,
        messages: [
          ...prevState.messages,
          ...[
            {
              ...formData,
              user: { name: currentUser.name }
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
            messages: [...res?.data?.conversation?.messages, ...res?.data?.messages]
          }))
          /* setDetailsData((prevState: any) => ({
            ...prevState,
            messages: [...prevState.messages.filter((message: any) => message?.id), ...res?.data?.messages]
          })) */
          setPrevConversationFormData(res?.data?.messages?.[0])
          setMessagePreload(false)
          scrollToBottom()
        })
        .catch(error => {
          setErrorMessage(error?.response?.data?.errors)
          showSnackbar(error?.response?.data?.message, { variant: 'error' })
          setDetailsData((prevState: any) => ({
            ...prevState,
            messages: [...prevState.messages.filter((message: any) => message?.id)]
          }))
          setMessagePreload(false)
          scrollToBottom()
        })
        .finally(() => {
          setIsWaiting(false)
        })
    } else {
      return
    }
  }

  const onEdit = (data: any) => {
    setEditData(data)
    setMessageEditOpenModal(true)
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
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 5 }}>
        <Box component={'h1'}>{detailsData?.name}</Box>
        <IconButton
          onClick={e => {
            handleShareDialogOpen()
          }}
        >
          <IosShareIcon />
        </IconButton>
      </Box>
      <Dialog
        open={shareDialogOpen}
        onClose={handleShareDialogClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        sx={{ '& .MuiPaper-root': { maxWidth: '500px', width: '100%' } }}
      >
        <DialogTitle id='alert-dialog-title'>Share "{detailsData?.name}"</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', gap: 5, pt: 2 }}>
            <Box sx={{ width: 'calc(100% - 150px)' }}>
              <Dropdown
                url={'users'}
                placeholder='Add people for share with'
                label={'Add people for share with'}
                value={selectedUserIdsForShare}
                onChange={event => handleShareUserOnChange([...(event?.target?.value as never[])])}
                multiple
              />
            </Box>
            <Box sx={{ width: '150px' }}>
              <Dropdown
                dataList={[
                  { id: 1, name: 'View Only' },
                  { id: 2, name: 'Edit' }
                ]}
                value={selectedShareType}
                onChange={event => handleShareTypeonChange(event?.target?.value as string)}
                label={'Access'}
                searchable={false}
              />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', mt: 4 }}>
            <Box sx={{ fontSize: '16px', fontWeight: 600 }}>People with access</Box>
            <Box>
              <List sx={{ pt: 0 }}>
                {detailsData?.shared_user?.length == 0 && (
                  <ListItem disableGutters>
                    <ListItemButton>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                          <PersonIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={currentUser?.name} secondary={'Owner'} />
                    </ListItemButton>
                  </ListItem>
                )}
                {detailsData?.shared_user?.map((user: any, index: number) => (
                  <ListItem disableGutters key={index}>
                    <ListItemButton>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                          <PersonIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={user?.name} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleShareDialogClose} color='error'>
            Cancel
          </Button>
          <Button onClick={handleShareDialogClose} autoFocus>
            Share
          </Button>
        </DialogActions>
      </Dialog>
      <Box sx={{ p: 5, py: 0, height: 'calc(100vh - 100px)' }}>
        <Box className='container px-6 mx-auto' sx={{ height: '100%', position: 'relative' }}>
          <Box
            sx={{
              height: 'calc(100% - 205px)',
              pr: '24px',
              overflow: 'hidden',
              overflowY: 'auto'
            }}
          >
            {detailsData?.messages?.map((message: any, index: number) => {
              const getIsWaiting = isWaiting && index == detailsData?.messages?.length - 1

              return (
                <AIAssistantMessagesComponent
                  key={index}
                  index={index}
                  message={message}
                  isWaiting={getIsWaiting}
                  onRegenerate={() => {
                    onSubmit(true)
                  }}
                  onEdit={onEdit}
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
              right: '0',
              p: '0 20px'
            }}
            className={'bg-gray-50 dark:bg-gray-900'}
          >
            <Box sx={{ width: '100%', mb: 2 }}>
              <label className='block text-sm'>
                <Dropdown
                  label={'Command'}
                  url={'prompts-allowed'}
                  name='prompt_id'
                  value={conversationFormData.prompt_id}
                  onChange={handleSelectChange}
                  error={errorMessage?.['prompt_id']}
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
                position: 'relative'
              }}
            >
              <TextField
                label={'Details'}
                name='message_content'
                value={conversationFormData.message_content}
                onChange={handleTextChange}
                error={errorMessage?.['message_content']}
                fullWidth
                multiline
                rows={4}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    onSubmit()
                  }
                }}
              />

              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  onClick={() => {
                    onSubmit()
                  }}
                  sx={{
                    //background: String(conversationFormData?.message_content).trim() ? '#000' : '#e3e3e3',
                    position: 'absolute',
                    bottom: '5px',
                    right: '5px',
                    mt: '16px',
                    background: '#000',
                    padding: '0',
                    height: '30px',
                    width: '30px',
                    minWidth: 'auto',
                    color: '#fff',
                    border: '0',
                    outline: '0',
                    borderRadius: '0.5rem',
                    zIndex: 1,
                    '&:hover': {
                      background: '#000'
                    }
                  }}

                  // disabled={!String(conversationFormData?.message_content).trim()}
                >
                  <NorthEastIcon sx={{ fontSize: '16px' }} />
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
        <Modal
          open={messageEditOpenModal}
          onClose={handlemessageEditModalClose}
          aria-labelledby='modal-modal-title'
          aria-describedby='modal-modal-description'
        >
          <AIAssistantMessagesEditComponent
            editData={editData}
            modalClose={handlemessageEditModalClose}
            setDetailsData={setDetailsData}
          />
        </Modal>
      </Box>
    </>
  )
}
