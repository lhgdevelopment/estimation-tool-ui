import { ReactNode } from 'react'
import AppLayout from 'src/layouts/AppLayout'
import WorkflowComponent from '../../../views/settings/workflow/Workflow.component'

const Workflow = () => {
  return <WorkflowComponent />
}
Workflow.getLayout = (page: ReactNode) => <AppLayout>{page}</AppLayout>
export default Workflow
