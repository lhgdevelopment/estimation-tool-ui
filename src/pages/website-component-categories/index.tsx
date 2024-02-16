import { ReactNode } from 'react'
import AppLayout from 'src/layouts/AppLayout'
import WebsiteComponentCategoriesComponent from 'src/views/website-component-categories/WebsiteComponentCategories.component'

const WebsiteComponentCategories = () => {
  return <WebsiteComponentCategoriesComponent></WebsiteComponentCategoriesComponent>
}
WebsiteComponentCategories.getLayout = (page: ReactNode) => <AppLayout>{page}</AppLayout>
export default WebsiteComponentCategories
