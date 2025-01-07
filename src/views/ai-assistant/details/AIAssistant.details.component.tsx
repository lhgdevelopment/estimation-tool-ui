import { Dropdown } from '@core/components/dropdown'
import Preloader from '@core/components/preloader'
import { useSocket } from '@core/context/SocketProvider'
import { useToastSnackbar } from '@core/hooks/useToastSnackbar'
import { RootState } from '@core/store/reducers'
import apiRequest from '@core/utils/axios-config'
import BookmarksIcon from '@mui/icons-material/Bookmarks'
import IosShareIcon from '@mui/icons-material/IosShare'
import NorthEastIcon from '@mui/icons-material/North'
import PersonIcon from '@mui/icons-material/Person'
import {
  AvatarGroup,
  Badge,
  Box,
  DialogActions,
  DialogContent,
  IconButton,
  ListItemSecondaryAction,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  styled,
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
import { v4 as uuidv4 } from 'uuid'
import { shareAccessLevel } from '../AIAssistant.decorator'
import AIAssistantMessagesEditComponent from './AIAssistantMessageEdit.component'
import AIAssistantMessagesComponent from './AIAssistantMessages.component'
import BookmarkDrawer from './bookmark/BookmarkDrawer'

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""'
    }
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0
    }
  }
}))
export default function AIAssistantDetailsComponent() {
  const { showSnackbar } = useToastSnackbar()
  const currentUser = useSelector((state: any) => state.user)?.user
  const router = useRouter()
  const socket = useSocket()

  const conversationId = router.query['id']
  const conversationDetailId = router.query['conversationDetailId']

  const [preload, setPreload] = useState<boolean>(false)
  const [isWaiting, setIsWaiting] = useState<boolean>(false)
  const [messagePreload, setMessagePreload] = useState<boolean>(false)
  const [detailsData, setDetailsData] = useState<any>()
  const [threadStatusIsActive, setThreadStatusIsActive] = useState<boolean>(true)

  const messageRefs = useRef<any[]>([])
  const messagesContainerRef = useRef<HTMLDivElement | null>(null)
  const [selectedBookmarkMessageId, setSelectedBookmarkMessageId] = useState<number | null>(null)

  const [messageEditOpenModal, setMessageEditOpenModal] = useState<boolean>(false)
  const handlemessageEditModalClose = () => setMessageEditOpenModal(false)
  const [editData, setEditData] = useState<boolean>(false)
  const [hasEditAccess, setHasEditAccess] = useState<boolean>(false)

  const defaultData = {
    conversation_id: conversationId,
    prompt_id: '',
    workflow_id: '',
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

  const [isFetching, setIsFetching] = useState(false)
  const [page, setPage] = useState(1) // Start with the first page
  const [hasMore, setHasMore] = useState(true)
  const [fetchedPages, setFetchedPages] = useState<Set<number>>(new Set())

  const [isTyping, setIsTyping] = useState(false) // State to track if other users are typing
  const [typingUser, setTypingUser] = useState<any[]>([]) // Name of the user typing
  const [activeUsers, setActiveUsers] = useState<any[]>([])

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
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
      }
    }, 100)
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

  // const getDetails = useCallback(() => {
  //   setPreload(true)
  //   if (!conversationId) return
  //   apiRequest
  //     .get(`/conversations/${conversationId}?page=1&per_page=10`)
  //     .then(res => {
  //       setDetailsData(res?.data)
  //       setHasEditAccess(
  //         currentUser?.role == 'Admin' ||
  //           res?.data?.user_id == currentUser?.id ||
  //           res?.data?.shared_user?.some(
  //             (sharedUser: any) => sharedUser?.user?.id === currentUser?.id && sharedUser.access_level === 2
  //           )
  //       )

  //       setPreload(false)
  //       if (conversationDetailId && !preload) {
  //         setTimeout(() => {
  //           scrollToMessageOnBookmarkClick(Number(conversationDetailId))
  //         }, 2000)
  //       } else {
  //         scrollToBottom()
  //       }

  //       apiRequest
  //         .get(`/chatgpt-thread-using/${res?.data?.threadId}`)
  //         .then(res => {
  //           console.log(res)
  //         })
  //         .catch(err => {
  //           console.log(err)
  //         })
  //     })
  //     .catch(err => {
  //       showSnackbar(err?.message, { variant: 'error' })
  //       setPreload(false)
  //     })
  // }, [conversationId, currentUser?.id, showSnackbar, conversationDetailId])

  const handleMessageTextChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setConversationFormData({
      ...conversationFormData,
      [e?.target?.name]: e.target.value
    })
    if (!socket || !detailsData?.threadId || !currentUser?.id) return

    socket.emit('thread_typing', {
      thread_id: detailsData?.threadId,
      text: e.target.value,
      user: {
        id: currentUser?.id,
        name: currentUser?.name
      }
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

  const onSubmitMessage = async (isRegenerate = false) => {
    try {
      setIsWaiting(true)
      scrollToBottom()
      setErrorMessage({})

      const formData = {
        ...(isRegenerate ? prevConversationFormData : conversationFormData),
        conversation_id: conversationId
      }

      if (!formData.message_content && !formData.prompt_id && !formData.workflow_id) {
        return
      }

      // Reset form and add temporary user/system messages
      setConversationFormData(defaultData)
      setDetailsData((prevState: any) => ({
        ...prevState,
        messages: [
          ...prevState.messages,
          {
            ...formData,
            user: { name: currentUser.name },
            id: 'initialization_user'
          },
          {
            id: 'initialization',
            message_content: '',
            role: 'system'
          }
        ]
      }))

      // API Request
      const response = await apiRequest.post(`/conversations/continue`, formData)

      // Update messages with response and remove temporary messages
      setDetailsData((prevState: any) => ({
        ...prevState,
        messages: [
          ...prevState.messages.filter(
            (message: any) => message.id !== 'initialization' && message.id !== 'initialization_user'
          ),
          ...response.data.messages
        ]
      }))

      // Save the previous conversation data
      setPrevConversationFormData(response.data.messages[0])

      // console.log(detailsData)
    } catch (error: any) {
      // Handle errors
      setErrorMessage(error?.response?.data?.errors || {})
      showSnackbar(error?.response?.data?.message || 'An error occurred', { variant: 'error' })

      // Remove temporary messages in case of failure
      setDetailsData((prevState: any) => ({
        ...prevState,
        messages: prevState.messages.filter(
          (message: any) => message.id !== 'initialization' && message.id !== 'initialization_user'
        )
      }))
    } finally {
      // Always reset waiting state
      setIsWaiting(false)
    }
  }

  const handleMessageTextKeyDown = (e: any) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault() // Prevent the default behavior of Enter key
      if (!threadStatusIsActive && conversationFormData.message_content.trim()) {
        onSubmitMessage() // Call the submit function
      } else {
        showSnackbar('Message content is required or thread is inactive.', { variant: 'warning' })
      }
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
      // getDetails()
      getBookmarkList()
    }
  }, [conversationId, currentUser?.id])

  const [userInteracted, setUserInteracted] = useState(false)

  // Detect user interaction with the page
  useEffect(() => {
    const handleUserInteraction = () => {
      setUserInteracted(true)
      window.removeEventListener('click', handleUserInteraction)
      window.removeEventListener('keydown', handleUserInteraction)
    }

    window.addEventListener('click', handleUserInteraction)
    window.addEventListener('keydown', handleUserInteraction)

    return () => {
      window.removeEventListener('click', handleUserInteraction)
      window.removeEventListener('keydown', handleUserInteraction)
    }
  }, [])

  useEffect(() => {
    if (!socket || !detailsData?.threadId) return

    const tabId = uuidv4()
    const responseEvent = `thread_response_${detailsData.threadId}`
    const statusEvent = `thread_status_${detailsData.threadId}`
    const typingEvent = `thread_typing_${detailsData.threadId}`
    const loginEvent = `thread_login_${detailsData.threadId}`
    const logoutEvent = `thread_logout_${detailsData.threadId}`
    const workflowUpdateEvent = `workflow_update_${detailsData.threadId}`
    const disconnectEvent = 'user_disconnected'

    // Listen for real-time responses
    socket.on(responseEvent, (message: any) => {
      setDetailsData((prevState: any) => {
        const systemMessageIndex = prevState?.messages?.findIndex((msg: any) => msg?.id === 'initialization')

        setIsWaiting(false)
        if (systemMessageIndex !== -1) {
          // Update the existing message content with the streamed message
          const updatedMessages = prevState.messages.map((msg: any, idx: number) =>
            idx === systemMessageIndex ? { ...msg, message_content: (msg.message_content || '') + message?.text } : msg
          )

          return { ...prevState, messages: updatedMessages }
        } else {
          // Add a new system message for the initialization phase
          return {
            ...prevState,
            messages: [
              ...prevState.messages,
              {
                id: 'initialization',
                role: 'system',
                message_content: message?.text
              }
            ]
          }
        }
      })
    })

    socket.on(statusEvent, (message: any) => {
      console.log(message)

      setThreadStatusIsActive(message?.payload?.status === 'active' ? true : false)
      if (message?.payload?.threadInfo?.user_info?.id !== currentUser?.id) {
        if (message?.payload?.status === 'active') {
          showSnackbar(`This thread is busy now for ${message?.payload?.threadInfo?.user_info?.name}`, {
            variant: 'warning'
          })
        } else {
          showSnackbar(`This thread is available now`, {
            variant: 'success'
          })
        }
      }
      if (message?.payload?.userMessage) {
        setDetailsData((prevState: any) => {
          return {
            ...prevState,
            messages: [...prevState.messages, message?.payload?.userMessage]
          }
        })
        scrollToBottom()
      }
    })

    socket.on(typingEvent, (data: any) => {
      const userId = data?.user?.id
      if (data && userId && userId !== currentUser?.id) {
        if (userInteracted) {
          const typingSound = new Audio('/audio/typing-sound.mp3')
          typingSound.play().catch(error => {
            console.error('Error playing typing sound:', error)
          })
        }

        const newUser = { ...data, startTyping: Date.now(), showAvatar: false }

        setTypingUser(prevState => {
          const updatedState = prevState.filter(data => data.user.id !== userId)

          return [...updatedState, newUser]
        })

        setTimeout(() => {
          setTypingUser(prevState =>
            prevState.map(data => (data.user.id !== userId ? data : { ...data, showAvatar: true }))
          )
        }, 2000)

        setTimeout(() => {
          setTypingUser(prevState => prevState.filter(data => Date.now() - data.startTyping <= 3000))
        }, 3000)
      }
    })

    socket.emit('thread_login', {
      thread_id: detailsData?.threadId,
      tab_id: tabId
    })

    socket.on(loginEvent, (data: any) => {
      setActiveUsers(prevUsers => {
        const updatedUsers = prevUsers.filter(user => user.user.id !== data.user.id && user.user.id !== currentUser?.id)

        if (data.user.id !== currentUser?.id) {
          updatedUsers.push(data)
        }

        return updatedUsers
      })
    })

    socket.on(workflowUpdateEvent, (data: any) => {
      console.log(data)
    })

    socket.on(loginEvent, (data: any) => {
      setActiveUsers(prevUsers => {
        const updatedUsers = prevUsers.filter(user => user.user.id !== data.user.id && user.user.id !== currentUser?.id)

        if (data.user.id !== currentUser?.id) {
          updatedUsers.push(data)
        }

        return updatedUsers
      })
    })

    const removeUserFromActiveUsers = (userId: number) => {
      setActiveUsers(prevUsers => prevUsers.filter(user => user.user.id !== userId))
    }

    socket.on(logoutEvent, (data: any) => {
      removeUserFromActiveUsers(data.user.id)
    })

    socket.on(disconnectEvent, (data: any) => {
      removeUserFromActiveUsers(data.user.id)
    })

    return () => {
      socket.emit('thread_logout', {
        thread_id: detailsData?.threadId,
        tab_id: tabId
      })

      socket.off(responseEvent)
      socket.off(statusEvent)
      socket.off(typingEvent)
      socket.off(loginEvent)
      socket.off(logoutEvent)
      socket.off(disconnectEvent)
    }
  }, [socket, detailsData?.threadId])

  const checkEditAccess = (data: any, user: any): boolean => {
    if (!data || !user) return false

    const isAdmin = user?.role === 'Admin'
    const isOwner = data?.user_id === user?.id
    const isSharedUserWithEditAccess = data?.shared_user?.some(
      (sharedUser: any) => sharedUser?.user?.id === user?.id && sharedUser?.access_level === 2
    )

    // console.log('Access Check:', { isAdmin, isOwner, isSharedUserWithEditAccess })

    return isAdmin || isOwner || isSharedUserWithEditAccess
  }

  // Use the function to set access

  const fetchMessages = async (page: number, initial = false) => {
    if (!conversationId || fetchedPages.has(page) || isFetching) return // Prevent duplicate or overlapping fetches

    try {
      setIsFetching(true)

      const container = messagesContainerRef.current
      const previousScrollHeight = container?.scrollHeight || 0
      const previousScrollTop = container?.scrollTop || 0

      const response = await apiRequest.get(`/conversations/${conversationId}?page=${page}&per_page=10`)
      const newMessages = response?.data?.messages || []

      if (newMessages.length === 0) {
        setHasMore(false)
      } else {
        if (initial) {
          setDetailsData(() => response?.data)
          setTimeout(() => {
            scrollToBottom()
          }, 100)
        } else {
          setDetailsData((prevState: any) => ({
            ...prevState,
            messages: [...newMessages, ...(prevState?.messages || [])]
          }))

          // Adjust scroll position to maintain the user's current view
          if (container) {
            setTimeout(() => {
              const currentScrollHeight = container.scrollHeight
              container.scrollTop = currentScrollHeight - previousScrollHeight + previousScrollTop
            }, 100) // Slight delay ensures DOM updates are applied
          }
        }

        // Fetch thread status if threadId exists
        if (response?.data?.threadId) {
          try {
            const threadResponse = await apiRequest.get(`/chatgpt-thread-using/${response.data.threadId}`)
            setThreadStatusIsActive(true) // Mark thread as active
            console.log(threadResponse)
          } catch (error) {
            console.error('Error fetching thread status:', error)
            setThreadStatusIsActive(false) // Mark thread as inactive if there's an error
          }
        }

        // Mark the page as fetched
        setFetchedPages(prevSet => new Set(prevSet).add(page))

        setHasEditAccess(checkEditAccess(response?.data, currentUser))
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
      showSnackbar('Failed to load messages.', { variant: 'error' })
    } finally {
      setTimeout(() => {
        setIsFetching(false)
      }, 1000)
    }
  }

  const previousScrollTopRef = useRef<number>(0)

  useEffect(() => {
    const container = messagesContainerRef.current

    const SCROLL_THRESHOLD = 500 // Minimum distance from the top to trigger page change

    const handleScroll = () => {
      if (isFetching || !hasMore || !conversationId) return

      if (container) {
        const currentScrollTop = container.scrollTop
        const scrollDirection = currentScrollTop < previousScrollTopRef.current ? 'up' : 'down' // Determine scroll direction
        previousScrollTopRef.current = currentScrollTop // Update the previous scroll position

        // Only execute if scrolling up and within the threshold distance
        if (scrollDirection === 'up' && currentScrollTop <= SCROLL_THRESHOLD) {
          const nextPage = page + 1
          if (!fetchedPages.has(nextPage)) {
            setPage(nextPage) // Update page state
            fetchMessages(nextPage) // Fetch the next page
          }
        }
      }
    }

    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true })
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll)
      }
    }
  }, [isFetching, hasMore, fetchedPages, conversationId, page, currentUser])

  useEffect(() => {
    if (currentUser && detailsData) {
      setHasEditAccess(checkEditAccess(detailsData, currentUser))
    }
  }, [currentUser?.role, detailsData?.user_id, fetchedPages, isFetching])
  useEffect(() => {
    if (conversationId && page === 1) {
      fetchMessages(1, true) // Fetch the first page on load
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
    return <Preloader />
  }

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 5 }}>
        <Box
          sx={{
            display: 'flex'
          }}
        >
          <Box component={'h1'}>{detailsData?.name}</Box>
        </Box>

        <Box sx={{ display: 'flex' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <AvatarGroup
              sx={{
                '& .MuiAvatar-root': {
                  width: 24,
                  height: 24,
                  fontSize: '12px'
                },
                '& .MuiAvatarGroup-avatar': {
                  border: '2px solid #fff',
                  borderRadius: '50%'
                },
                '& .MuiAvatarGroup-extraAvatar': {
                  backgroundColor: '#f50057',
                  color: '#fff',
                  fontSize: '10px'
                }
              }}
              renderSurplus={surplus => <span style={{ fontSize: '14px' }}>+{surplus.toString()[0]}k</span>}
              total={activeUsers?.length}
            >
              {activeUsers?.slice(0, 5).map((activeUser, index) => (
                <Tooltip key={index} title={activeUser?.user?.name}>
                  <StyledBadge
                    overlap='circular'
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    variant='dot'
                  >
                    <Avatar alt={activeUser?.user?.name} src={activeUser?.user?.name}></Avatar>
                  </StyledBadge>
                </Tooltip>
              ))}
            </AvatarGroup>
          </Box>
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
            ref={messagesContainerRef}
            sx={{
              position: 'relative',
              height: hasEditAccess ? 'calc(100% - 205px)' : '100%',
              pr: '24px',
              overflow: 'hidden',
              overflowY: 'auto'
            }}
          >
            {isFetching && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  mt: 2,
                  zIndex: 9
                }}
              >
                <Box sx={{ color: '#9333ea', fontSize: '12px', fontWeight: '600' }}>Loading more messages...</Box>
                <Box
                  className='message-box-animation'
                  sx={{ height: '36px', width: '36px', borderRadius: '50%', mt: '5px' }}
                >
                  <Box sx={{ height: '100%', width: '100%' }} component={'img'} src='/gif/hive-assist-loader.gif'></Box>
                </Box>
              </Box>
            )}

            {!hasMore && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '50px',
                  color: '#888',
                  fontSize: '14px',
                  background: '#f5f5f5',
                  borderRadius: '8px',
                  margin: '10px 0',
                  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)'
                }}
              >
                No more messages available
              </Box>
            )}

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
              <Box sx={{ display: 'flex', mb: 2, gap: 2 }}>
                <Box sx={{ width: '50%' }}>
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

                <Box sx={{ width: '50%' }}>
                  <label className='block text-sm'>
                    <Dropdown
                      label={'Workflow'}
                      url={'workflows'}
                      name='workflow_id'
                      value={conversationFormData.workflow_id}
                      onChange={handleSelectChange}
                      error={errorMessage?.['workflow_id']}
                      optionConfig={{
                        id: 'id',
                        title: 'title'
                      }}
                    />
                    {!!errorMessage?.['workflow_id'] &&
                      errorMessage?.['workflow_id']?.map((message: any, index: number) => {
                        return (
                          <span key={index} className='text-xs text-red-600 dark-d:text-red-400'>
                            {message}
                          </span>
                        )
                      })}
                  </label>
                </Box>
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
                  onChange={handleMessageTextChange}
                  error={errorMessage?.['message_content']}
                  fullWidth
                  multiline
                  rows={4}
                  onKeyDown={handleMessageTextKeyDown}
                />

                <Box sx={{ display: 'flex', position: 'relative' }}>
                  {typingUser.length > 0 && (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '12px',
                        position: 'absolute',
                        left: 0,
                        top: '2px'
                      }}
                    >
                      <Box
                        sx={{
                          fontWeight: 'bold',
                          color: '#000'
                        }}
                      >
                        {typingUser.map(data => data.user.name).join(', ')}{' '}
                      </Box>
                      <Box sx={{ ml: 1 }}>{typingUser.length === 1 ? 'is typing...' : 'are typing...'}</Box>
                    </Box>
                  )}
                  <Button
                    onClick={() => {
                      onSubmitMessage()
                    }}
                    disabled={!!threadStatusIsActive}
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
