import { ReactNode } from 'react'
import AppLayout from 'src/layouts/AppLayout'
import UsersComponent from 'src/views/users/Users.component'

const PromptsPage = () => {
  return <UsersComponent></UsersComponent>
}
PromptsPage.getLayout = (page: ReactNode) => <AppLayout>{page}</AppLayout>
export default PromptsPage
