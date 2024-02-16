import { ReactNode } from 'react'
import AppLayout from 'src/layouts/AppLayout'
import ServiceDeliverablesComponent from 'src/views/service-management/service-deliverables/ServiceDeliverables.component'

const ServiceDeliverables = () => {
  return <ServiceDeliverablesComponent></ServiceDeliverablesComponent>
}
ServiceDeliverables.getLayout = (page: ReactNode) => <AppLayout>{page}</AppLayout>
export default ServiceDeliverables
