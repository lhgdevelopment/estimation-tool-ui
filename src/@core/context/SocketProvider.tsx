import Cookies from 'js-cookie'
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

// Define the type for the context
interface SocketContextType {
  socket: Socket | null
}

// Create a Context for the WebSocket
const SocketContext = createContext<SocketContextType | undefined>(undefined)

// Define props for the provider
interface SocketProviderProps {
  children: ReactNode
}

// Create a WebSocket Provider
export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    const token = Cookies.get('accessToken')

    if (!token) {
      console.error('Access token is missing. Socket connection aborted.')
      return
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

    newSocket.on('disconnect', () => {
      console.log('Socket Disconnected.')
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
      newSocket.disconnect()
      setSocket(null)
    }
  }, [])

  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>
}

// Custom Hook to use the socket
export const useSocket = (): Socket => {
  const context = useContext(SocketContext)

  if (!context || !context.socket) {
    throw new Error('useSocket must be used within a SocketProvider')
  }

  return context.socket
}
