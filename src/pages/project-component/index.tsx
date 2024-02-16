import { ReactNode } from 'react'
import AppLayout from 'src/layouts/AppLayout'
import ProjectComponentComponent from 'src/views/project-component/ProjectComponent.component'

const ProjectComponent = () => {
  return <ProjectComponentComponent></ProjectComponentComponent>
}
ProjectComponent.getLayout = (page: ReactNode) => <AppLayout>{page}</AppLayout>
export default ProjectComponent
