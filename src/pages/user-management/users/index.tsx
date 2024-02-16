import { ReactNode } from 'react'
import AppLayout from 'src/layouts/AppLayout'
import UsersComponent from 'src/views/user-management/users/Users.component'

const Users = () => {
  return <UsersComponent></UsersComponent>
}
Users.getLayout = (page: ReactNode) => <AppLayout>{page}</AppLayout>
export default Users
