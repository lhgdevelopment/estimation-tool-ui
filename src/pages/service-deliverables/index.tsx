import { ReactNode } from 'react'
import AppLayout from 'src/layouts/AppLayout'
import ServiceDeliverables from 'src/views/service-deliverables/ServiceDeliverables.component'

const ServiceDeliverablesPage = () => {
  return <ServiceDeliverables></ServiceDeliverables>
}
ServiceDeliverablesPage.getLayout = (page: ReactNode) => <AppLayout>{page}</AppLayout>
export default ServiceDeliverablesPage
