import { ReactNode } from 'react'
import AppLayout from 'src/layouts/AppLayout'
import MeetingTypeComponent from 'src/views/settings/meeting-type/MeetingType.component'

const MeetingTypePage = () => {
  return <MeetingTypeComponent></MeetingTypeComponent>
}
MeetingTypePage.getLayout = (page: ReactNode) => <AppLayout>{page}</AppLayout>
export default MeetingTypePage
