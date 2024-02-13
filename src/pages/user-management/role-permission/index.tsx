import { ReactNode } from 'react'
import AppLayout from 'src/layouts/AppLayout'
import RolePermissionComponent from 'src/views/user-management/role-permission/RolePermission.component'

const PromptsPage = () => {
  return <RolePermissionComponent></RolePermissionComponent>
}
PromptsPage.getLayout = (page: ReactNode) => <AppLayout>{page}</AppLayout>
export default PromptsPage
