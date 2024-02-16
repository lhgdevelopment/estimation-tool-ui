import { ReactNode } from 'react'
import AppLayout from 'src/layouts/AppLayout'
import ServiceComponent from 'src/views/service-management/service/Service.component'

const Service = () => {
  return <ServiceComponent></ServiceComponent>
}
Service.getLayout = (page: ReactNode) => <AppLayout>{page}</AppLayout>
export default Service
