import { ReactNode } from 'react'
import AppLayout from 'src/layouts/AppLayout'
import LeadsComponent from 'src/views/leads/Leads.component'

const Leads = () => {
  return <LeadsComponent></LeadsComponent>
}
Leads.getLayout = (page: ReactNode) => <AppLayout>{page}</AppLayout>
export default Leads
