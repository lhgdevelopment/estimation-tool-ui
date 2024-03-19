import { ReactNode } from 'react'
import AppLayout from 'src/layouts/AppLayout'
import UpdateLogEditComponent from 'src/views/settings/update-log/edit/UpdateLogEdit.component'

const UpdateLogEdit = () => {
  return <UpdateLogEditComponent></UpdateLogEditComponent>
}
UpdateLogEdit.getLayout = (page: ReactNode) => <AppLayout>{page}</AppLayout>
export default UpdateLogEdit
