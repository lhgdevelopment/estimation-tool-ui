import { Box } from '@mui/material'
import { useState } from 'react'
import PromptsFormComponent from './form/Prompts.form.component'
import PromptsListComponent from './list/Prompts.list.component'

export default function PromptsComponent() {
  const [editDataId, setEditDataId] = useState<null | string>(null)
  const [listData, setListData] = useState<any>([])
  const [editData, setEditData] = useState<any>({})

  return (
    <>
      <Box className='container px-6 mx-auto'>
        <Box component={'h1'} className='mt-5 mb-4 text-xl font-semibold text-gray-600 dark-d:text-gray-300'>
          AI Prompts
        </Box>
        <PromptsFormComponent listData={listData} setListData={setListData} />
        <PromptsListComponent listData={listData} setListData={setListData} />
      </Box>
    </>
  )
}
