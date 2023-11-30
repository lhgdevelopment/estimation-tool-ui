import { ReactNode } from 'react'
import AppLayout from 'src/layouts/AppLayout'
import ProjectSummeryComponent from 'src/views/project-summery/ProjectSummery.component'

const ProjectSummeryPage = () => {
  return <ProjectSummeryComponent></ProjectSummeryComponent>
}
ProjectSummeryPage.getLayout = (page: ReactNode) => <AppLayout>{page}</AppLayout>
export default ProjectSummeryPage
