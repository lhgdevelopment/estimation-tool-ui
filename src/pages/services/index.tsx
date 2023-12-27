import { ReactNode } from 'react'
import AppLayout from 'src/layouts/AppLayout'
import Services from 'src/views/services/Services.component'

const ServicesPage = () => {
  return <Services></Services>
}
ServicesPage.getLayout = (page: ReactNode) => <AppLayout>{page}</AppLayout>
export default ServicesPage
