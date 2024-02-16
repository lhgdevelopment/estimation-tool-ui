import { ReactNode } from 'react'
import AppLayout from 'src/layouts/AppLayout'
import MeetingSummeryDetailsComponent from 'src/views/meeting-summery/details/MeetingSummery.details.component'

const MeetingSummeryDetails = () => {
  return <MeetingSummeryDetailsComponent></MeetingSummeryDetailsComponent>
}
MeetingSummeryDetails.getLayout = (page: ReactNode) => <AppLayout>{page}</AppLayout>
export default MeetingSummeryDetails
