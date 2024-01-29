import { Box } from '@mui/material'
import { useState } from 'react'
import ProjectSOWFormComponent from './form/ProjectSOW.form.component'
import ProjectSOWListComponent from './list/ProjectSOW.list.component'

export default function ProjectSOWComponent() {
  const [listData, setListData] = useState<any>([])

  return (
    <>
      <Box className='container px-6 mx-auto'>
        <Box component={'h1'} className='mt-5 mb-4 text-xl font-semibold text-gray-600 dark:text-gray-300'>
          Project Scope Of Work
        </Box>
        <ProjectSOWFormComponent listData={listData} setListData={setListData} />
        <ProjectSOWListComponent listData={listData} setListData={setListData} />
      </Box>
    </>
  )
}
