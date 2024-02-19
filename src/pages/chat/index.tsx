import { ReactNode } from 'react'
import AppLayout from 'src/layouts/AppLayout'
import ChatComponent from 'src/views/chat/Chat.component'

const Chat = () => {
  return <ChatComponent></ChatComponent>
}
Chat.getLayout = (page: ReactNode) => <AppLayout>{page}</AppLayout>
export default Chat
