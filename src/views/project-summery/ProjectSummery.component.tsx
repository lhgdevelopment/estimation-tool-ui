import { Box } from '@mui/material'
import { useState } from 'react'
import ProjectSummeryFormComponent from './form/ProjectSummery.form.component'
import ProjectSummeryListComponent from './list/ProjectSummery.list.component'

export default function ProjectSummeryComponent() {
  const [listDataRefresh, setListDataRefresh] = useState<any>(null)

  return (
    <>
      <Box className='container grid px-6 mx-auto'>
        <Box component={'h1'} className='mt-5 mb-4 text-xl font-semibold text-gray-600 dark:text-gray-300'>
          Project Summery
        </Box>
        <ProjectSummeryFormComponent setListDataRefresh={setListDataRefresh} />
        <ProjectSummeryListComponent listDataRefresh={listDataRefresh} />
      </Box>
    </>
  )
}
