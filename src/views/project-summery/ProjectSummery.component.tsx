import { Box } from '@mui/material'
import ProjectSummeryFormComponent from './form/ProjectSummeryForm.component'
import ProjectSummeryListComponent from './list/ProjectSummeryList.component'

export default function ProjectSummeryComponent() {
  return (
    <>
      <Box className='container grid px-6 mx-auto'>
        <Box component={'h1'} className='mt-5 mb-4 text-xl font-semibold text-gray-600 dark:text-gray-300'>
          Project Component
        </Box>
        <ProjectSummeryFormComponent />
        <ProjectSummeryListComponent />
      </Box>
    </>
  )
}
