import { ReactNode } from 'react'
import AppLayout from 'src/layouts/AppLayout'
import MeetingSummeryComponent from 'src/views/meeting-summery/MeetingSummery.component'

const MeetingSummery = () => {
  return <MeetingSummeryComponent></MeetingSummeryComponent>
}
MeetingSummery.getLayout = (page: ReactNode) => <AppLayout>{page}</AppLayout>
export default MeetingSummery
