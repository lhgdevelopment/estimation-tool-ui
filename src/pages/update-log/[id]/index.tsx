import { ReactNode } from 'react'
import AppLayout from 'src/layouts/AppLayout'
import UpdateLogDetailsComponent from 'src/views/update-log/details/UpdateLog.details.component'

const UpdateLogDetails = () => {
  return <UpdateLogDetailsComponent></UpdateLogDetailsComponent>
}
UpdateLogDetails.getLayout = (page: ReactNode) => <AppLayout>{page}</AppLayout>
export default UpdateLogDetails
