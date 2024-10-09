import { ReactNode } from 'react'
import AppLayout from 'src/layouts/AppLayout'
import MemoryComponent from "../../../views/settings/memory/Memory.component";

const ServiceQuestion = () => {
  return <MemoryComponent />
}
ServiceQuestion.getLayout = (page: ReactNode) => <AppLayout>{page}</AppLayout>
export default ServiceQuestion
