import { Box } from '@mui/material'
import { useState } from 'react'
import LeadsFormComponent from './form/Leads.form.component'
import LeadsListComponent from './list/Leads.list.component'

export default function LeadsComponent() {
  const [listData, setListData] = useState<any>([])

  return (
    <>
      <Box className='container px-6 mx-auto'>
        <Box component={'h1'} className='mt-5 mb-4 text-xl font-semibold text-gray-600 dark:text-gray-300'>
          Leads
        </Box>
        <LeadsFormComponent listData={listData} setListData={setListData} />
        <LeadsListComponent listData={listData} setListData={setListData} />
      </Box>
    </>
  )
}
