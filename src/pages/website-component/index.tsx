import { ReactNode } from 'react'
import AppLayout from 'src/layouts/AppLayout'
import WebsiteComponentComponent from 'src/views/website-component/WebsiteComponent.component'

const WebsiteComponentPage = () => {
  return <WebsiteComponentComponent></WebsiteComponentComponent>
}
WebsiteComponentPage.getLayout = (page: ReactNode) => <AppLayout>{page}</AppLayout>
export default WebsiteComponentPage
