import Cookies from 'js-cookie'
import { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'

// Create a Context for the WebSocket
const SocketContext = createContext(null)

// Create a WebSocket Provider
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const token = Cookies.get('accessToken')

  useEffect(() => {
    if (!token) {
      console.error('Access token is missing. Socket connection aborted.')

      return
    }

    // Safely fetch logged-in user data from localStorage
    let logedinUser = null
    try {
      const storedUser = localStorage.getItem('logedinUser')
      logedinUser = storedUser ? JSON.parse(storedUser) : null
    } catch (error) {
      console.error('Failed to parse logged-in user from localStorage:', error)
    }

    // Connect to the server
    const newSocket = io('https://hive.lhgdev.com', {
      extraHeaders: {
        Authorization: `Bearer ${token}`
      }
    })

    newSocket.on('connect', () => {
      console.log('Socket Connected!')
    })

    newSocket.on('user_disconnected', data => {
      console.log('User disconnected:', data)
    })

    newSocket.on('connect_error', error => {
      console.error('Socket connection error:', error.message)
    })

    setSocket(newSocket)

    // Cleanup on unmount
    return () => {
      if (newSocket) {
        console.log('Socket disconnected.')
        newSocket.disconnect()
      }
    }
  }, [token])

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
}

// Custom Hook to use the socket
export const useSocket = () => {
  return useContext(SocketContext)
}
