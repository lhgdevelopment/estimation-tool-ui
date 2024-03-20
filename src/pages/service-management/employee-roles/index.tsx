import { ReactNode } from 'react'
import AppLayout from 'src/layouts/AppLayout'
import EmployeeRolesComponent from 'src/views/service-management/employee-roles/EmployeeRoles.component'

const EmployeeRoles = () => {
  return <EmployeeRolesComponent></EmployeeRolesComponent>
}
EmployeeRoles.getLayout = (page: ReactNode) => <AppLayout>{page}</AppLayout>
export default EmployeeRoles
