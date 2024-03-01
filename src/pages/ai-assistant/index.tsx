import { ReactNode } from 'react'
import AppLayout from 'src/layouts/AppLayout'
import AIAssistantComponent from 'src/views/ai-assistant/AIAssistant.component'

const AIAssistant = () => {
  return <AIAssistantComponent></AIAssistantComponent>
}
AIAssistant.getLayout = (page: ReactNode) => <AppLayout>{page}</AppLayout>
export default AIAssistant
