import { ReactNode } from 'react'
import AppLayout from 'src/layouts/AppLayout'
import ProjectComponent from 'src/views/project-component/ProjectComponent.component'

const ProjectComponentPage = () => {
  return <ProjectComponent></ProjectComponent>
}
ProjectComponentPage.getLayout = (page: ReactNode) => <AppLayout>{page}</AppLayout>
export default ProjectComponentPage
