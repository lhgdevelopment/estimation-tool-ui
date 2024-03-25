import { ReactNode } from 'react'
import AppLayout from 'src/layouts/AppLayout'
import UpdateLogTimelineComponent from 'src/views/settings/update-log/timeline/UpdateLogTimeline.component'

const UpdateLogTimeline = () => {
  return <UpdateLogTimelineComponent></UpdateLogTimelineComponent>
}
UpdateLogTimeline.getLayout = (page: ReactNode) => <AppLayout>{page}</AppLayout>
export default UpdateLogTimeline
