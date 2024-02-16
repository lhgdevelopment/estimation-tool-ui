import { ReactNode } from 'react'
import AppLayout from 'src/layouts/AppLayout'
import MeetingTypeComponent from 'src/views/settings/meeting-type/MeetingType.component'

const MeetingType = () => {
  return <MeetingTypeComponent></MeetingTypeComponent>
}
MeetingType.getLayout = (page: ReactNode) => <AppLayout>{page}</AppLayout>
export default MeetingType
