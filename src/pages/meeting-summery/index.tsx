import { ReactNode } from 'react'
import AppLayout from 'src/layouts/AppLayout'
import MeetingSummeryComponent from 'src/views/meeting-summery/MeetingSummery.component'

const MeetingSummeryPage = () => {
  return <MeetingSummeryComponent></MeetingSummeryComponent>
}
MeetingSummeryPage.getLayout = (page: ReactNode) => <AppLayout>{page}</AppLayout>
export default MeetingSummeryPage
