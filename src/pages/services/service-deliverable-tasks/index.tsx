import { ReactNode } from 'react'
import AppLayout from 'src/layouts/AppLayout'
import ServiceDeliverableTasks from 'src/views/services/service-deliverable-tasks/ServiceDeliverableTasks.component'

const ServiceDeliverableTasksPage = () => {
  return <ServiceDeliverableTasks></ServiceDeliverableTasks>
}
ServiceDeliverableTasksPage.getLayout = (page: ReactNode) => <AppLayout>{page}</AppLayout>
export default ServiceDeliverableTasksPage
