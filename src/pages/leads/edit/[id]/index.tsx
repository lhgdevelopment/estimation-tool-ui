import { ReactNode } from 'react'
import AppLayout from 'src/layouts/AppLayout'
import LeadsEditComponent from 'src/views/leads/edit/LeadsEdit.component'

const LeadsEdit = () => {
  return <LeadsEditComponent></LeadsEditComponent>
}
LeadsEdit.getLayout = (page: ReactNode) => <AppLayout>{page}</AppLayout>
export default LeadsEdit
