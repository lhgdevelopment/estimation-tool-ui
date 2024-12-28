import { ReactNode } from 'react'
import AppLayout from 'src/layouts/AppLayout'
import MemoryComponent from '../../../views/core/memory/Memory.component'

const Memory = () => {
  return <MemoryComponent />
}
Memory.getLayout = (page: ReactNode) => <AppLayout>{page}</AppLayout>
export default Memory
