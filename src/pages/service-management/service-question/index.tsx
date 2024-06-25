import { ReactNode } from 'react'
import AppLayout from 'src/layouts/AppLayout'
import ServiceQuestionComponent from 'src/views/service-management/service-question/ServiceQuestion.component'

const ServiceQuestion = () => {
  return <ServiceQuestionComponent></ServiceQuestionComponent>
}
ServiceQuestion.getLayout = (page: ReactNode) => <AppLayout>{page}</AppLayout>
export default ServiceQuestion
