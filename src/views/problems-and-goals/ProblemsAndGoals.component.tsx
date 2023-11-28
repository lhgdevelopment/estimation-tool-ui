import { Box } from '@mui/material'
import { useState } from 'react'
import ProblemsAndGoalsFormComponent from './form/ProblemsAndGoalsForm.component'
import ProblemsAndGoalsListComponent from './list/ProblemsAndGoalsList.component'

export default function ProblemsAndGoalsComponent() {
  const [editDataId, setEditDataId] = useState<null | string>(null)
  const [listData, setListData] = useState<any>([])
  const [editData, setEditData] = useState<any>({})

  return (
    <>
      <Box className='container grid px-6 mx-auto'>
        <Box component={'h1'} className='mt-5 mb-4 text-xl font-semibold text-gray-600 dark:text-gray-300'>
          Project Component
        </Box>
        <ProblemsAndGoalsFormComponent
          setEditDataId={setEditDataId}
          editDataId={editDataId}
          listData={listData}
          setListData={setListData}
          editData={editData}
          setEditData={setEditData}
        />
        <ProblemsAndGoalsListComponent
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
