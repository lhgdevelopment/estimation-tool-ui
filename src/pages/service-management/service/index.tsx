import { ReactNode } from 'react'
import AppLayout from 'src/layouts/AppLayout'
import ServiceComponent from 'src/views/service-management/service/Service.component'

const ServicePage = () => {
  return <ServiceComponent></ServiceComponent>
}
ServicePage.getLayout = (page: ReactNode) => <AppLayout>{page}</AppLayout>
export default ServicePage
