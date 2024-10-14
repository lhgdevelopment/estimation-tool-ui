import { Box } from '@mui/material'
import { useState } from 'react'
import MeetingSummaryFormComponent from './form/MeetingSummary.form.component'
import MeetingSummaryListComponent from './list/MeetingSummary.list.component'

export default function MeetingSummaryComponent() {
  const [listData, setListData] = useState<any>([])

  return (
    <>
      <Box className='container px-6 mx-auto'>
        <Box component={'h1'} className='mt-5 mb-4 text-xl font-semibold text-gray-600 dark-d:text-gray-300'>
          Meeting Summary
        </Box>
        <MeetingSummaryFormComponent listData={listData} setListData={setListData} />
        <MeetingSummaryListComponent listData={listData} setListData={setListData} />
      </Box>
    </>
  )
}
