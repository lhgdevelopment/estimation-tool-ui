import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

// Create a Context for the WebSocket
const SocketContext = createContext();

// Create a WebSocket Provider
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Connect to the server
    const newSocket = io("https://hive.lhgdev.com", {
      transports: ["websocket"],
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

// Custom Hook to use the socket
export const useSocket = () => {
  return useContext(SocketContext);
};
