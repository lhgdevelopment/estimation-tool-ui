import { ReactNode } from 'react'
import AppLayout from 'src/layouts/AppLayout'
import ServiceScopesComponent from 'src/views/service-management/service-scopes/ServiceScopes.component'

const ServiceScopes = () => {
  return <ServiceScopesComponent></ServiceScopesComponent>
}
ServiceScopes.getLayout = (page: ReactNode) => <AppLayout>{page}</AppLayout>
export default ServiceScopes
