import { ReactNode } from 'react'
import AppLayout from 'src/layouts/AppLayout'
import TeamsUserComponent from '../../../../../views/user-management/teams-users/TeamsUser.component'

const Teams = () => {
  return <TeamsUserComponent />
}
Teams.getLayout = (page: ReactNode) => <AppLayout>{page}</AppLayout>
export default Teams
