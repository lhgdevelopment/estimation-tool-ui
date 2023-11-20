import { Box } from '@mui/material'
import WebsiteComponentCategoriesFormComponent from './form/WebsiteComponentCategoriesForm.component'
import WebsiteComponentCategoriesListComponent from './list/WebsiteComponentCategoriesList.component'

export default function WebsiteComponentCategoriesComponent() {
  return (
    <>
      <Box className='container grid px-6 mx-auto'>
        <Box component={'h1'} className='mt-5 mb-4 text-xl font-semibold text-gray-600 dark:text-gray-300'>
          Website Component Category
        </Box>
        <WebsiteComponentCategoriesFormComponent />
        <WebsiteComponentCategoriesListComponent />
      </Box>
    </>
  )
}
