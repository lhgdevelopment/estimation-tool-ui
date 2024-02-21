import { ReactNode } from 'react'
import AppLayout from 'src/layouts/AppLayout'
import AIAssistantDetailsComponent from 'src/views/settings/ai-assistant/details/AIAssistant.details.component'

const AIAssistantDetails = () => {
  return <AIAssistantDetailsComponent></AIAssistantDetailsComponent>
}
AIAssistantDetails.getLayout = (page: ReactNode) => <AppLayout>{page}</AppLayout>
export default AIAssistantDetails
