import { ReactNode } from 'react'
import AppLayout from 'src/layouts/AppLayout'
import WebsiteComponentComponent from 'src/views/website-component/WebsiteComponent.component'

const WebsiteComponent = () => {
  return <WebsiteComponentComponent></WebsiteComponentComponent>
}
WebsiteComponent.getLayout = (page: ReactNode) => <AppLayout>{page}</AppLayout>
export default WebsiteComponent
