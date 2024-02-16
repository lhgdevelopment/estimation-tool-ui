import { ReactNode } from 'react'
import AppLayout from 'src/layouts/AppLayout'
import ProjectComponent from 'src/views/project/Project.component'

const Projects = () => {
  return <ProjectComponent></ProjectComponent>
}
Projects.getLayout = (page: ReactNode) => <AppLayout>{page}</AppLayout>
export default Projects
