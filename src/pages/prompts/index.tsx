import { ReactNode } from 'react'
import AppLayout from 'src/layouts/AppLayout'
import PromptsComponent from 'src/views/prompts/Prompts.component'

const PromptsPage = () => {
  return <PromptsComponent></PromptsComponent>
}
PromptsPage.getLayout = (page: ReactNode) => <AppLayout>{page}</AppLayout>
export default PromptsPage
