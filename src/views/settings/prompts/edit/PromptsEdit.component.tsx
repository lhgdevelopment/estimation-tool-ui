import { Box } from '@mui/material'
import { useState } from 'react'
import PromptsFormComponent from '../form/Prompts.form.component'

export default function PromptsEditComponent() {
  const [listData, setListData] = useState<any>([])

  return (
    <>
      <Box className='container px-6 mx-auto'>
        <Box component={'h1'} className='mt-5 mb-4 text-xl font-semibold text-gray-600 dark-d:text-gray-300'>
          Edit Prompts
        </Box>
        <PromptsFormComponent listData={listData} setListData={setListData} isEdit={true} />
      </Box>
    </>
  )
}
