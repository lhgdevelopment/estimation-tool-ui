import { ReactNode } from 'react'
import AppLayout from 'src/layouts/AppLayout'
import MeetingSummaryComponent from 'src/views/meeting-summary/MeetingSummary.component'

const MeetingSummary = () => {
  return <MeetingSummaryComponent></MeetingSummaryComponent>
}
MeetingSummary.getLayout = (page: ReactNode) => <AppLayout>{page}</AppLayout>
export default MeetingSummary
