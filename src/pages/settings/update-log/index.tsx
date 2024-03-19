import { ReactNode } from 'react'
import AppLayout from 'src/layouts/AppLayout'
import UpdateLogComponent from 'src/views/settings/update-log/UpdateLog.component'

const UpdateLog = () => {
  return <UpdateLogComponent></UpdateLogComponent>
}
UpdateLog.getLayout = (page: ReactNode) => <AppLayout>{page}</AppLayout>
export default UpdateLog
