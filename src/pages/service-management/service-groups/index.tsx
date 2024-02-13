import { ReactNode } from 'react'
import AppLayout from 'src/layouts/AppLayout'
import ServiceGroupsComponent from 'src/views/service-management/service-groups/ServiceGroups.component'

const ServiceGroupsPage = () => {
  return <ServiceGroupsComponent></ServiceGroupsComponent>
}
ServiceGroupsPage.getLayout = (page: ReactNode) => <AppLayout>{page}</AppLayout>
export default ServiceGroupsPage
