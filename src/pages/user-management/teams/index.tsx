import { ReactNode } from 'react'
import AppLayout from 'src/layouts/AppLayout'
import TeamsComponent from '../../../views/user-management/teams/Teams.component'

const Teams = () => {
  return <TeamsComponent />
}
Teams.getLayout = (page: ReactNode) => <AppLayout>{page}</AppLayout>
export default Teams
