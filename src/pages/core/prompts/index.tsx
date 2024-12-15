import { ReactNode } from 'react'
import AppLayout from 'src/layouts/AppLayout'
import PromptsComponent from 'src/views/core/prompts/Prompts.component'

const Prompts = () => {
  return <PromptsComponent />
}
Prompts.getLayout = (page: ReactNode) => <AppLayout>{page}</AppLayout>
export default Prompts
