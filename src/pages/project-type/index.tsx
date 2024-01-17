import { ReactNode } from 'react'
import AppLayout from 'src/layouts/AppLayout'
import ProjectTypeComponent from 'src/views/project-type/ProjectType.component'

const ProjectTypePage = () => {
  return <ProjectTypeComponent></ProjectTypeComponent>
}
ProjectTypePage.getLayout = (page: ReactNode) => <AppLayout>{page}</AppLayout>
export default ProjectTypePage
