import { ReactNode } from 'react'
import AppLayout from 'src/layouts/AppLayout'
import ProjectSOWCreateComponent from 'src/views/project-sow/create/ProjectSOWCreate.component'

const ProjectSOWCreatePage = () => {
  return <ProjectSOWCreateComponent></ProjectSOWCreateComponent>
}
ProjectSOWCreatePage.getLayout = (page: ReactNode) => <AppLayout>{page}</AppLayout>
export default ProjectSOWCreatePage
