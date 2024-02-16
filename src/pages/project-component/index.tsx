import { ReactNode } from 'react'
import AppLayout from 'src/layouts/AppLayout'
import ProjectComponent from 'src/views/project-component/ProjectComponent.component'

const ProjectComponent = () => {
  return <ProjectComponent></ProjectComponent>
}
ProjectComponent.getLayout = (page: ReactNode) => <AppLayout>{page}</AppLayout>
export default ProjectComponent
