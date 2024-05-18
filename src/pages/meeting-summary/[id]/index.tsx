import { ReactNode } from 'react'
import AppLayout from 'src/layouts/AppLayout'
import MeetingSummaryDetailsComponent from 'src/views/meeting-summary/details/MeetingSummary.details.component'

const MeetingSummaryDetails = () => {
  return <MeetingSummaryDetailsComponent></MeetingSummaryDetailsComponent>
}
MeetingSummaryDetails.getLayout = (page: ReactNode) => <AppLayout>{page}</AppLayout>
export default MeetingSummaryDetails
