import { Box } from '@mui/material'
import { useState } from 'react'
import UpdateLogFormComponent from './form/UpdateLog.form.component'
import UpdateLogListComponent from './list/UpdateLog.list.component'

export default function UpdateLogComponent() {
  const [listData, setListData] = useState<any>([])

  return (
    <>
      <Box className='container px-6 mx-auto'>
        <Box component={'h1'} className='mt-5 mb-4 text-xl font-semibold text-gray-600 dark:text-gray-300'>
          UpdateLog
        </Box>
        <UpdateLogFormComponent listData={listData} setListData={setListData} />
        <UpdateLogListComponent listData={listData} setListData={setListData} />
      </Box>
    </>
  )
}
