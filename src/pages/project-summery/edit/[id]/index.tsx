import { ReactNode } from 'react'
import AppLayout from 'src/layouts/AppLayout'
import ProjectSOWEditComponent from 'src/views/project-sow/edit/ProjectSOWEdit.component'

const ProjectSOWEditPage = () => {
  return <ProjectSOWEditComponent></ProjectSOWEditComponent>
}
ProjectSOWEditPage.getLayout = (page: ReactNode) => <AppLayout>{page}</AppLayout>
export default ProjectSOWEditPage
