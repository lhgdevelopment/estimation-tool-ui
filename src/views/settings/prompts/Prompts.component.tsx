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
        <Box component={'h1'} className='mt-5 mb-4 text-xl font-semibold text-gray-600 dark:text-gray-300'>
          Prompts
        </Box>
        <PromptsFormComponent
          setEditDataId={setEditDataId}
          editDataId={editDataId}
          listData={listData}
          setListData={setListData}
          editData={editData}
          setEditData={setEditData}
        />
        <PromptsListComponent
          setEditDataId={setEditDataId}
          editDataId={editDataId}
          listData={listData}
          setListData={setListData}
          editData={editData}
          setEditData={setEditData}
        />
      </Box>
    </>
  )
}
