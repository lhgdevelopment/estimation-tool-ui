import { ReactNode } from 'react'
import AppLayout from 'src/layouts/AppLayout'
import ServiceTreeComponent from 'src/views/service-management/service-tree/ServiceTree.component'

const ServiceTree = () => {
  return <ServiceTreeComponent></ServiceTreeComponent>
}
ServiceTree.getLayout = (page: ReactNode) => <AppLayout>{page}</AppLayout>
export default ServiceTree
