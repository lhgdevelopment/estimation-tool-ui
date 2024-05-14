import { ReactNode } from 'react'
import AppLayout from 'src/layouts/AppLayout'
import MeetingSummaryEditComponent from 'src/views/meeting-summary/edit/MeetingSummaryEdit.component'

const MeetingSummaryEdit = () => {
  return <MeetingSummaryEditComponent></MeetingSummaryEditComponent>
}
MeetingSummaryEdit.getLayout = (page: ReactNode) => <AppLayout>{page}</AppLayout>
export default MeetingSummaryEdit
