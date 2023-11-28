import { ReactNode } from 'react'
import AppLayout from 'src/layouts/AppLayout'
import ProblemsAndGoalsComponent from 'src/views/problems-and-goals/ProblemsAndGoals.component'

const ProblemsAndGoalsPage = () => {
  return <ProblemsAndGoalsComponent></ProblemsAndGoalsComponent>
}
ProblemsAndGoalsPage.getLayout = (page: ReactNode) => <AppLayout>{page}</AppLayout>
export default ProblemsAndGoalsPage
