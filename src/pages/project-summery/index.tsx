import { ReactNode } from 'react'
import AppLayout from 'src/layouts/AppLayout'
import ProjectSOWComponent from 'src/views/project-sow/ProjectSOW.component'

const ProjectSOWPage = () => {
  return <ProjectSOWComponent></ProjectSOWComponent>
}
ProjectSOWPage.getLayout = (page: ReactNode) => <AppLayout>{page}</AppLayout>
export default ProjectSOWPage
