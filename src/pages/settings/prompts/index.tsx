import { ReactNode } from 'react'
import AppLayout from 'src/layouts/AppLayout'
import PromptsComponent from 'src/views/settings/prompts/Prompts.component'

const Prompts = () => {
  return <PromptsComponent></PromptsComponent>
}
Prompts.getLayout = (page: ReactNode) => <AppLayout>{page}</AppLayout>
export default Prompts
