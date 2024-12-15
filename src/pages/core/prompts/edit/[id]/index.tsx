import { ReactNode } from 'react'
import AppLayout from 'src/layouts/AppLayout'
import PromptsEditComponent from 'src/views/core/prompts/edit/PromptsEdit.component'

const PromptsEdit = () => {
  return <PromptsEditComponent></PromptsEditComponent>
}
PromptsEdit.getLayout = (page: ReactNode) => <AppLayout>{page}</AppLayout>
export default PromptsEdit
