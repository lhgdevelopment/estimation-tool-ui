import Cookies from "js-cookie";
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

// Create a Context for the WebSocket
const SocketContext = createContext();

// Create a WebSocket Provider
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const token = Cookies.get('accessToken')

  useEffect(() => {

    // Fetch logged-in user data from localStorage
    const logedinUser = JSON.parse(localStorage.getItem("logedinUser"));

    // console.log({ logedinUser });

    // Connect to the server
    const newSocket = io("https://hive.lhgdev.com", {

      extraHeaders:  {
        Authorization: `Bearer ${token}`,
      },
    });

    newSocket.on("connect", ()=> {
       console.log('Socket Connected!')
    });

    setSocket(newSocket);

    // Event listener for user disconnection
    newSocket.on("user_disconnected", (data) => {
      console.log("Someone is disconnected <-", data);
      console.log("JSON", JSON.stringify(data));
    });

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, [token]); // Empty dependency array ensures it runs once after mount

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

// Custom Hook to use the socket
export const useSocket = () => {
  return useContext(SocketContext);
};
