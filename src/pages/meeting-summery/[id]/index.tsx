import { ReactNode } from 'react'
import AppLayout from 'src/layouts/AppLayout'
import MeetingSummeryDetailsComponent from 'src/views/meeting-summery/details/MeetingSummery.details.component'

const MeetingSummeryDetailsPage = () => {
  return <MeetingSummeryDetailsComponent></MeetingSummeryDetailsComponent>
}
MeetingSummeryDetailsPage.getLayout = (page: ReactNode) => <AppLayout>{page}</AppLayout>
export default MeetingSummeryDetailsPage
