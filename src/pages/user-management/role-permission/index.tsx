import { ReactNode } from 'react'
import AppLayout from 'src/layouts/AppLayout'
import RolePermissionComponent from 'src/views/user-management/role-permission/RolePermission.component'

const RolePermission = () => {
  return <RolePermissionComponent></RolePermissionComponent>
}
RolePermission.getLayout = (page: ReactNode) => <AppLayout>{page}</AppLayout>
export default RolePermission
