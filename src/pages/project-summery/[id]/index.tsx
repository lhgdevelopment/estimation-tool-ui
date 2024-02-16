import { ReactNode } from 'react'
import AppLayout from 'src/layouts/AppLayout'
import ProjectSOWDetailsComponent from 'src/views/project-sow/details/ProjectSOW.details.component'

const ProjectSOWDetails = () => {
  return <ProjectSOWDetailsComponent></ProjectSOWDetailsComponent>
}
ProjectSOWDetails.getLayout = (page: ReactNode) => <AppLayout>{page}</AppLayout>
export default ProjectSOWDetails
