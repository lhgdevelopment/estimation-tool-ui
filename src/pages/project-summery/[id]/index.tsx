import { ReactNode } from 'react'
import AppLayout from 'src/layouts/AppLayout'
import ProjectSOWDetailsComponent from 'src/views/project-sow/details/ProjectSOW.details.component'

const ProjectSOWDetailsPage = () => {
  return <ProjectSOWDetailsComponent></ProjectSOWDetailsComponent>
}
ProjectSOWDetailsPage.getLayout = (page: ReactNode) => <AppLayout>{page}</AppLayout>
export default ProjectSOWDetailsPage
