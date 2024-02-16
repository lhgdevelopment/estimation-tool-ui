import { ReactNode } from 'react'
import AppLayout from 'src/layouts/AppLayout'
import ProjectTypeComponent from 'src/views/settings/project-type/ProjectType.component'

const ProjectType = () => {
  return <ProjectTypeComponent></ProjectTypeComponent>
}
ProjectType.getLayout = (page: ReactNode) => <AppLayout>{page}</AppLayout>
export default ProjectType
