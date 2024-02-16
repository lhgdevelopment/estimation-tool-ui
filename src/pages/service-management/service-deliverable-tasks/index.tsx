import { ReactNode } from 'react'
import AppLayout from 'src/layouts/AppLayout'
import ServiceDeliverableTasksComponent from 'src/views/service-management/service-deliverable-tasks/ServiceDeliverableTasks.component'

const ServiceDeliverableTasks = () => {
  return <ServiceDeliverableTasksComponent></ServiceDeliverableTasksComponent>
}
ServiceDeliverableTasks.getLayout = (page: ReactNode) => <AppLayout>{page}</AppLayout>
export default ServiceDeliverableTasks
