import { Box } from '@mui/material'
import { useState } from 'react'
import UpdateLogFormComponent from '../form/UpdateLog.form.component'

export default function UpdateLogEditComponent() {
  const [listData, setListData] = useState<any>([])

  return (
    <>
      <Box className='container px-6 mx-auto'>
        <Box component={'h1'} className='mt-5 mb-4 text-xl font-semibold text-gray-600 dark-d:text-gray-300'>
          Edit Meeting Summary
        </Box>
        <UpdateLogFormComponent listData={listData} setListData={setListData} isEdit={true} />
      </Box>
    </>
  )
}
