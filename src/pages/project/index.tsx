import { ReactNode } from 'react'
import AppLayout from 'src/layouts/AppLayout'
import ProjectComponent from 'src/views/project/Project.component'

const ProjectsPage = () => {
  return <ProjectComponent></ProjectComponent>
}
ProjectsPage.getLayout = (page: ReactNode) => <AppLayout>{page}</AppLayout>
export default ProjectsPage
