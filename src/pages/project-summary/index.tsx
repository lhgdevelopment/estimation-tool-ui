import { ReactNode } from 'react'
import AppLayout from 'src/layouts/AppLayout'
import ProjectSOWComponent from 'src/views/project-sow/ProjectSOW.component'

const ProjectSOW = () => {
  return <ProjectSOWComponent></ProjectSOWComponent>
}
ProjectSOW.getLayout = (page: ReactNode) => <AppLayout>{page}</AppLayout>
export default ProjectSOW
