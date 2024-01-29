import { Box } from '@mui/material'
import { useState } from 'react'
import ProjectSOWFormComponent from '../form/ProjectSOW.form.component'

export default function ProjectSOWEditComponent() {
  const [listData, setListData] = useState<any>([])

  return (
    <>
      <Box className='container px-6 mx-auto'>
        <Box component={'h1'} className='mt-5 mb-4 text-xl font-semibold text-gray-600 dark:text-gray-300'>
          Edit Project Scope Of Work
        </Box>
        <ProjectSOWFormComponent listData={listData} setListData={setListData} isEdit={true} />
      </Box>
    </>
  )
}
