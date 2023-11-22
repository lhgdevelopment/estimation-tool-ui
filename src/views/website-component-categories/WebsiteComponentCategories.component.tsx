import { Box } from '@mui/material'
import { useState } from 'react'
import WebsiteComponentCategoriesFormComponent from './form/WebsiteComponentCategoriesForm.component'
import WebsiteComponentCategoriesListComponent from './list/WebsiteComponentCategoriesList.component'

export default function WebsiteComponentCategoriesComponent() {
  const [editDataId, setEditDataId] = useState<null | string>(null)
  const [listData, setListData] = useState<any>([])
  const [editData, setEditData] = useState<any>({})

  return (
    <>
      <Box className='container grid px-6 mx-auto'>
        <Box component={'h1'} className='mt-5 mb-4 text-xl font-semibold text-gray-600 dark:text-gray-300'>
          Website Component Category
        </Box>
        <WebsiteComponentCategoriesFormComponent
          setEditDataId={setEditDataId}
          editDataId={editDataId}
          listData={listData}
          setListData={setListData}
          editData={editData}
          setEditData={setEditData}
        />
        <WebsiteComponentCategoriesListComponent
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
