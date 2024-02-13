import { ReactNode } from 'react'
import AppLayout from 'src/layouts/AppLayout'
import ServiceScopes from 'src/views/service-management/service-scopes/ServiceScopes.component'

const ServiceScopesPage = () => {
  return <ServiceScopes></ServiceScopes>
}
ServiceScopesPage.getLayout = (page: ReactNode) => <AppLayout>{page}</AppLayout>
export default ServiceScopesPage
