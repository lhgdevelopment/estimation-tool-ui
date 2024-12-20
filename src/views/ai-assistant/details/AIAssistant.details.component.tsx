import { Dropdown } from '@core/components/dropdown'
import Preloader from '@core/components/preloader'
import { useToastSnackbar } from '@core/hooks/useToastSnackbar'
import { RootState } from '@core/store/reducers'
import apiRequest from '@core/utils/axios-config'
import BookmarksIcon from '@mui/icons-material/Bookmarks'
import IosShareIcon from '@mui/icons-material/IosShare'
import NorthEastIcon from '@mui/icons-material/North'
import PersonIcon from '@mui/icons-material/Person'
import {
  Box,
  DialogActions,
  DialogContent,
  IconButton,
  ListItemSecondaryAction,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  TextField,
  Tooltip
} from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import { blue } from '@mui/material/colors'
import 'md-editor-rt/lib/style.css'
import { useRouter } from 'next/router'
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import Swal from 'sweetalert2'
import { shareAccessLevel } from '../AIAssistant.decorator'
import AIAssistantMessagesEditComponent from './AIAssistantMessageEdit.component'
import AIAssistantMessagesComponent from './AIAssistantMessages.component'
import BookmarkDrawer from './bookmark/BookmarkDrawer'

export default function AIAssistantDetailsComponent() {
  const { showSnackbar } = useToastSnackbar()
  const currentUser = useSelector((state: any) => state.user)?.user
  const router = useRouter()

  const conversationId = router.query['id']
  const conversationDetailId = router.query['conversationDetailId']

  const [preload, setPreload] = useState<boolean>(false)
  const [isWaiting, setIsWaiting] = useState<boolean>(false)
  const [messagePreload, setMessagePreload] = useState<boolean>(false)
  const [detailsData, setDetailsData] = useState<any>({})

  const messageRefs = useRef<any[]>([])
  const [selectedBookmarkMessageId, setSelectedBookmarkMessageId] = useState<number | null>(null)

  const [messageEditOpenModal, setMessageEditOpenModal] = useState<boolean>(false)
  const handlemessageEditModalClose = () => setMessageEditOpenModal(false)
  const [editData, setEditData] = useState<boolean>(false)
  const [hasEditAccess, setHasEditAccess] = useState<boolean>(false)

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

  const [openBookmarkDrawer, setOpenBookmarkDrawer] = useState(false)

  const [bookmarkList, setBookmarkList] = useState<any[]>([])
  const [bookmarkFormData, setBookmarkFormData] = useState<any>({})
  const [bookmarkEditId, setBookmarkEditId] = useState<number | null>(null)
  const [bookmarkDialogOpen, setBookmarkDialogOpen] = useState(false)

  const messageForInput = useSelector((state: RootState) => state.aiAssistant.messageForInput)

  const handleBookmarkDialogOpen = () => {
    setBookmarkDialogOpen(true)
  }

  const handleBookmarkDialogClose = () => {
    setBookmarkEditId(null)
    setBookmarkDialogOpen(false)
  }
  const bookmarkTitleInputRef = useRef<HTMLInputElement | null>(null)
  const handleBookmarkTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setBookmarkFormData((prevState: any) => ({
      ...prevState,
      title: e.target.value
    }))
  }

  const scrollToMessageOnBookmarkClick = (messageId: number) => {
    setSelectedBookmarkMessageId(messageId)
    const messageIndex = detailsData?.messages?.findIndex((message: any) => message?.id === messageId)

    if (messageIndex !== -1 && messageRefs.current[messageIndex]) {
      // Scroll into view and use a Promise to wait for the scrolling to complete
      new Promise<void>(resolve => {
        messageRefs.current[messageIndex].scrollIntoView({ behavior: 'smooth' })
        const observer = new IntersectionObserver(entries => {
          if (entries[0].isIntersecting) {
            resolve()
            observer.disconnect()
          }
        })
        observer.observe(messageRefs.current[messageIndex])
      }).then(() => {
        setOpenBookmarkDrawer(false)

        // Start the timeout after scrolling completes
        setTimeout(() => {
          setSelectedBookmarkMessageId(null)
        }, 5000)
      })
    }
  }

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

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

  const handleShareOnSubmitMessage = () => {
    const userAccess = selectedUserIdsForShare.map((id: any) => {
      return {
        user_id: id,
        access_level: selectedShareType
      }
    })
    apiRequest
      .post(`/conversations/share/${conversationId}`, {
        user_access: userAccess
      })
      .then(res => {
        showSnackbar('Successfully shared with selected users', { variant: 'success' })
        setDetailsData((prevState: any) => ({
          ...prevState,
          shared_user: res?.data?.shared_user
        }))
        setSelectedUserIdsForShare([])
        setSelectedShareType('')
      })
      .catch(err => {
        showSnackbar(err?.message, { variant: 'error' })
      })
  }

  const handleShareAccessUpdateOnChange = (userId: any, accessLevel: any) => {
    if (accessLevel === 'REMOVE') {
      handleSharedUserOnRemove(userId)
    } else {
      apiRequest
        .post(`/conversations/share/${conversationId}`, {
          user_access: [
            {
              user_id: userId,
              access_level: accessLevel
            }
          ]
        })
        .then(res => {
          showSnackbar('Successfully shared with selected users', { variant: 'success' })
          setDetailsData((prevState: any) => ({
            ...prevState,
            shared_user: res?.data?.shared_user
          }))
          setSelectedUserIdsForShare([])
          setSelectedShareType('')
        })
        .catch(err => {
          showSnackbar(err?.message, { variant: 'error' })
        })
    }
  }

  const handleSharedUserOnRemove = (id: any) => {
    Swal.fire({
      title: 'Are You sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showConfirmButton: true,
      confirmButtonText: 'Yes, remove this user!',
      confirmButtonColor: '#dc2626',
      showCancelButton: true,
      cancelButtonText: 'No, cancel!'
    }).then(res => {
      if (res.isConfirmed) {
        apiRequest
          .post(`/conversations/remove-share/${conversationId}`, {
            user_id: [id]
          })
          .then(res => {
            showSnackbar('Successfully removed from shared users', { variant: 'success' })
            setDetailsData((prevState: any) => ({
              ...prevState,
              shared_user: prevState?.shared_user?.filter((sharedUserData: any) => sharedUserData?.user_id != id)
            }))
          })
          .catch(err => {
            showSnackbar(err?.message, { variant: 'error' })
          })
      }
    })
  }

  const getDetails = useCallback(() => {
    setPreload(true)
    apiRequest
      .get(`/conversations/${conversationId}`)
      .then(res => {
        setDetailsData(res?.data)
        setHasEditAccess(
          currentUser?.role == 'Admin' ||
            res?.data?.user_id == currentUser?.id ||
            res?.data?.shared_user?.some(
              (sharedUser: any) => sharedUser?.user?.id === currentUser?.id && sharedUser.access_level === 2
            )
        )
        setPreload(false)
        if (conversationDetailId && !preload) {
          console.log({ conversationDetailId })

          setTimeout(() => {
            scrollToMessageOnBookmarkClick(Number(conversationDetailId))
          }, 2000)
        } else {
          scrollToBottom()
        }
      })
      .catch(err => {
        showSnackbar(err?.message, { variant: 'error' })
        setPreload(false)
      })
  }, [conversationId, currentUser?.id, showSnackbar, conversationDetailId])

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
      onSubmitMessage()
    }
  }

  const onSubmitMessage = (isRegenerate = false) => {
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

  const onEditMessage = (data: any) => {
    setEditData(data)
    setMessageEditOpenModal(true)
  }

  const onBookmarkAdd = (message: any) => {
    // if (message?.id) {
    //   handleBookmarkDialogOpen()
    // }
    setBookmarkFormData({ ...message, title: message.message_content?.substring(0, 50) })
    if (bookmarkFormData?.title) {
      handleOnBookmarkSubmit()
    }
  }
  const onEditBookmark = (bookmark: any) => {
    if (bookmark?.id) {
      handleBookmarkDialogOpen()
    }
    setBookmarkFormData(bookmark)
    setBookmarkEditId(bookmark.id)
  }

  const handleOnBookmarkSubmit = () => {
    if (bookmarkEditId) {
      apiRequest
        .put(`/bookmarks/${bookmarkEditId}`, {
          title: bookmarkFormData?.title
        })
        .then(res => {
          showSnackbar('Bookmark Updated!', { variant: 'success' })

          setBookmarkList((prevState: any) =>
            prevState?.map((bookmark: any) => (bookmark?.id == bookmarkEditId ? res?.data : bookmark))
          )
          handleBookmarkDialogClose()
          // getBookmarkList()
        })
        .catch(err => {
          showSnackbar(err?.message, { variant: 'error' })
        })
    } else {
      apiRequest
        .post('/bookmarks/', {
          title: bookmarkFormData?.title,
          conversationId: conversationId,
          conversationDetailId: bookmarkFormData?.id
        })
        .then(res => {
          showSnackbar('Bookmark Saved!', { variant: 'success' })
          handleBookmarkDialogClose()
          setBookmarkList((prevState: any) => [res?.data, ...prevState])
          /*  getBookmarkList() */
        })
        .catch(err => {
          showSnackbar(err?.message, { variant: 'error' })
        })
    }
  }

  const getBookmarkList = useCallback(() => {
    apiRequest
      .get(`/bookmarks?conversationId=${conversationId}`)
      .then(res => {
        setBookmarkList(res?.data)
      })
      .catch(err => {
        showSnackbar(err?.message, { variant: 'error' })
      })
  }, [conversationId, showSnackbar])
  const onRemoveBookmark = (id: any) => {
    Swal.fire({
      title: 'Are You sure?',
      // text: "You won't be able to revert this!",
      icon: 'warning',
      showConfirmButton: true,
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#dc2626',
      showCancelButton: true,
      cancelButtonText: 'No, cancel!'
    })
      .then(res => {
        if (res.isConfirmed) {
          apiRequest
            .delete(`/bookmarks/${id}`)
            .then(res => {
              getBookmarkList()
              showSnackbar('Successfully Deleted!', { variant: 'success' })
            })
            .catch(err => {
              showSnackbar(err?.message, { variant: 'error' })
            })
        }
      })
      .catch(error => {
        showSnackbar(error?.response?.data?.message, { variant: 'error' })
      })
  }

  useEffect(() => {
    if (messageForInput) {
      setConversationFormData({
        ...conversationFormData,
        ...{ message_content: messageForInput }
      })
    }
  }, [messageForInput])

  useEffect(() => {
    if (conversationId && currentUser?.id) {
      getDetails()
      getBookmarkList()
    }
  }, [conversationId, currentUser?.id])

  const sowHeadingSx = {
    fontSize: '16x',
    fontWeight: '600',
    textAlign: 'center',

    color: '#6c2bd9'
  }

  const sowBodySx = { p: 2, my: 2 }

  if (preload) {
    return <Preloader />
  }

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 5 }}>
        <Box component={'h1'}>{detailsData?.name}</Box>
        <Box>
          {hasEditAccess && (
            <Tooltip placement='top' title='Share with others'>
              <IconButton
                onClick={handleShareDialogOpen}
                sx={{
                  '&:hover .share-icon': {
                    color: '#000000'
                  }
                }}
              >
                <IosShareIcon className='share-icon' sx={{ fontSize: '16px' }} />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip placement='top' title='Bookmark List'>
            <IconButton
              onClick={() => {
                setOpenBookmarkDrawer(true)
              }}
              sx={{
                '&:hover .bookmark-icon': {
                  color: '#000000'
                }
              }}
            >
              <BookmarksIcon className='bookmark-icon' sx={{ fontSize: '16px' }} />
            </IconButton>
          </Tooltip>
          <BookmarkDrawer
            open={openBookmarkDrawer}
            onClose={() => setOpenBookmarkDrawer(false)}
            bookmarkList={bookmarkList}
            onEditBookmark={onEditBookmark}
            onRemoveBookmark={onRemoveBookmark}
            onBookmarkClick={scrollToMessageOnBookmarkClick}
          />
        </Box>
      </Box>

      <Box sx={{ p: 5, py: 0, height: 'calc(100vh - 100px)' }}>
        <Box className='container px-6 mx-auto' sx={{ height: '100%', position: 'relative' }}>
          <Box
            sx={{
              height: hasEditAccess ? 'calc(100% - 205px)' : '100%',
              pr: '24px',
              overflow: 'hidden',
              overflowY: 'auto'
            }}
          >
            {detailsData?.messages?.map((message: any, index: number) => {
              const getIsWaiting = isWaiting && index == detailsData?.messages?.length - 1
              const bookmarkId = bookmarkList?.filter(bookmark => bookmark?.conversationDetailId == message?.id)?.[0]
                ?.id

              return (
                <AIAssistantMessagesComponent
                  key={index}
                  index={index}
                  message={message}
                  isWaiting={getIsWaiting}
                  onRegenerate={() => {
                    onSubmitMessage(true)
                  }}
                  onEditMessage={onEditMessage}
                  onBookmarkAdd={onBookmarkAdd}
                  bookmarkId={bookmarkId}
                  onRemoveBookmark={onRemoveBookmark}
                  ref={el => (messageRefs.current[index] = el)}
                  className={message?.id === selectedBookmarkMessageId ? 'bookmark-flush-anime' : ''}
                />
              )
            })}
            <Box ref={messagesEndRef}></Box>
          </Box>
          {hasEditAccess && (
            <Box
              sx={{
                position: 'absolute',
                width: '100%',
                bottom: '0',
                left: '0',
                right: '0',
                p: '0 20px'
              }}
              className={'bg-gray-50 dark-d:bg-gray-900'}
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
                        <span key={index} className='text-xs text-red-600 dark-d:text-red-400'>
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
                      onSubmitMessage()
                    }
                  }}
                />

                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    onClick={() => {
                      onSubmitMessage()
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
                  >
                    <NorthEastIcon sx={{ fontSize: '16px' }} />
                  </Button>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
        <Modal
          open={messageEditOpenModal}
          onClose={handlemessageEditModalClose}
          aria-labelledby='modal-modal-title'
          aria-describedby='modal-modal-description'
        >
          <Box sx={{ outline: 0 }}>
            <AIAssistantMessagesEditComponent
              editData={editData}
              modalClose={handlemessageEditModalClose}
              setDetailsData={setDetailsData}
            />
          </Box>
        </Modal>
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
                dataList={shareAccessLevel}
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
                <ListItem disableGutters sx={{ p: 0 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    sx={{ fontSize: '14px', '& .MuiTypography-body1': { fontWeight: 600 } }}
                    primary={detailsData?.user?.name}
                    secondary={detailsData?.user?.email}
                  />
                  <ListItemSecondaryAction>
                    <Box sx={{ fontSize: '14px', color: '#a6a6a6' }}>Owner</Box>
                  </ListItemSecondaryAction>
                </ListItem>

                {detailsData?.shared_user?.map((sharedUserData: any, index: number) => (
                  <ListItem disableGutters key={index} sx={{ p: 0, width: '100%' }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                        <PersonIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      sx={{ fontSize: '14px', '& .MuiTypography-body1': { fontWeight: 600 } }}
                      primary={sharedUserData?.user?.name}
                      secondary={sharedUserData?.user?.email}
                    />
                    <ListItemSecondaryAction sx={{ display: 'flex', gap: 1, right: 0 }}>
                      <Select
                        sx={{
                          p: '0',
                          fontSize: '14px',
                          '& .MuiSelect-select': { p: '10px 15px', textAlign: 'right' },
                          '& fieldset': { display: 'none' }
                        }}
                        value={sharedUserData.access_level}
                        onChange={event =>
                          handleShareAccessUpdateOnChange(sharedUserData?.user_id, event?.target?.value)
                        }
                      >
                        {shareAccessLevel?.map((access: any, index: number) => (
                          <MenuItem key={index} value={access?.id}>
                            {access?.name}
                          </MenuItem>
                        ))}
                        <Box sx={{ width: '100%', borderTop: '1px solid #a6a6a6' }}></Box>
                        <MenuItem sx={{ color: 'red' }} value='REMOVE'>
                          Remove
                        </MenuItem>
                      </Select>
                    </ListItemSecondaryAction>
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
          {selectedUserIdsForShare?.length ? (
            <Button onClick={handleShareOnSubmitMessage} variant='contained' autoFocus>
              Share
            </Button>
          ) : (
            <Button onClick={handleShareDialogClose} autoFocus>
              Done
            </Button>
          )}
        </DialogActions>
      </Dialog>
      <Dialog
        open={bookmarkDialogOpen}
        onClose={handleBookmarkDialogClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        sx={{ '& .MuiPaper-root': { maxWidth: '500px', width: '100%' } }}
      >
        <DialogTitle id='alert-dialog-title'>Save Bookmark</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              label={'Title'}
              name='title'
              value={bookmarkFormData.title}
              inputRef={bookmarkTitleInputRef}
              onChange={handleBookmarkTitleChange}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleBookmarkDialogClose} color='error'>
            {bookmarkEditId ? 'Close' : 'Remove'}
          </Button>
          <Button onClick={handleOnBookmarkSubmit} autoFocus>
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
