import { ReactNode } from 'react'
import AppLayout from 'src/layouts/AppLayout'
import WorkflowEditorComponent from 'src/views/settings/workflow/editor/Workflow.editor.component'

const WorkflowEditor = () => {
  return <WorkflowEditorComponent />
}
WorkflowEditor.getLayout = (page: ReactNode) => <AppLayout>{page}</AppLayout>
export default WorkflowEditor
