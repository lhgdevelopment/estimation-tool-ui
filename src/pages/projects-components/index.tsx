import { ReactNode } from 'react'
import AppLayout from 'src/layouts/AppLayout'
import ProjectsComponentsComponent from 'src/views/projects-components/ProjectsComponentsComponent'

const ProjectsComponentsPage = () => {
  return <ProjectsComponentsComponent></ProjectsComponentsComponent>
}
ProjectsComponentsPage.getLayout = (page: ReactNode) => <AppLayout>{page}</AppLayout>
export default ProjectsComponentsPage
