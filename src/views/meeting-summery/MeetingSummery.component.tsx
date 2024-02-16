import { Box } from '@mui/material'
import { useState } from 'react'
import MeetingSummeryFormComponent from './form/MeetingSummery.form.component'
import MeetingSummeryListComponent from './list/MeetingSummery.list.component'

export default function MeetingSummeryComponent() {
  const [listData, setListData] = useState<any>([])

  return (
    <>
      <Box className='container px-6 mx-auto'>
        <Box component={'h1'} className='mt-5 mb-4 text-xl font-semibold text-gray-600 dark:text-gray-300'>
          Meeting Summery
        </Box>
        <MeetingSummeryFormComponent listData={listData} setListData={setListData} />
        <MeetingSummeryListComponent listData={listData} setListData={setListData} />
      </Box>
    </>
  )
}
