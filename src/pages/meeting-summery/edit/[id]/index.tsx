import { ReactNode } from 'react'
import AppLayout from 'src/layouts/AppLayout'
import MeetingSummeryEditComponent from 'src/views/meeting-summery/edit/MeetingSummeryEdit.component'

const MeetingSummeryEdit = () => {
  return <MeetingSummeryEditComponent></MeetingSummeryEditComponent>
}
MeetingSummeryEdit.getLayout = (page: ReactNode) => <AppLayout>{page}</AppLayout>
export default MeetingSummeryEdit
