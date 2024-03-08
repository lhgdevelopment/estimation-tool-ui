import { ReactNode } from 'react'
import AppLayout from 'src/layouts/AppLayout'
import LeadsDetailsComponent from 'src/views/leads/details/Leads.details.component'

const LeadsDetails = () => {
  return <LeadsDetailsComponent></LeadsDetailsComponent>
}
LeadsDetails.getLayout = (page: ReactNode) => <AppLayout>{page}</AppLayout>
export default LeadsDetails
