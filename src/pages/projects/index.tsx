import { ReactNode } from 'react'
import AppLayout from 'src/layouts/AppLayout'
import ProjectsComponentsComponent from 'src/views/projects-components/ProjectsComponents.component'

const ProjectsPage = () => {
  return <ProjectsComponentsComponent></ProjectsComponentsComponent>
}
ProjectsPage.getLayout = (page: ReactNode) => <AppLayout>{page}</AppLayout>
export default ProjectsPage
