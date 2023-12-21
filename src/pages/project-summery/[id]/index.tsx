import { ReactNode } from 'react'
import AppLayout from 'src/layouts/AppLayout'
import DetailsDataDetailsComponent from 'src/views/project-sow/details/ProjectSOW.details.component'

const ProjectSOWDetailsPage = () => {
  return <DetailsDataDetailsComponent></DetailsDataDetailsComponent>
}
ProjectSOWDetailsPage.getLayout = (page: ReactNode) => <AppLayout>{page}</AppLayout>
export default ProjectSOWDetailsPage
