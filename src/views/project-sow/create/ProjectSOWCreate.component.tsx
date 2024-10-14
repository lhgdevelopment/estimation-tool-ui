import { Box } from '@mui/material'
import { useState } from 'react'
import ProjectSOWFormComponent from '../form/ProjectSOWForm.component'

export default function ProjectSOWCreateComponent() {
  const [listData, setListData] = useState<any>([])

  return (
    <>
      <Box className='container px-6 mx-auto'>
        <Box component={'h1'} className='mt-5 mb-4 text-xl font-semibold text-gray-600 dark-d:text-gray-300'>
          Project SOW
        </Box>
        <ProjectSOWFormComponent listData={listData} setListData={setListData} />
      </Box>
    </>
  )
}
