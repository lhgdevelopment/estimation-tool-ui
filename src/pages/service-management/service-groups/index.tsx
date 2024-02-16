import { ReactNode } from 'react'
import AppLayout from 'src/layouts/AppLayout'
import ServiceGroupsComponent from 'src/views/service-management/service-groups/ServiceGroups.component'

const ServiceGroups = () => {
  return <ServiceGroupsComponent></ServiceGroupsComponent>
}
ServiceGroups.getLayout = (page: ReactNode) => <AppLayout>{page}</AppLayout>
export default ServiceGroups
