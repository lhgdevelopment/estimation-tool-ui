import { Box } from '@mui/material'
import RolePermissionListComponent from './list/RolePermission.list.component'

export default function RolePermissionComponent() {
  return (
    <>
      <Box className='container px-6 mx-auto'>
        {/* <RolePermissionFormComponent
          setEditDataId={setEditDataId}
          editDataId={editDataId}
          listData={listData}
          setListData={setListData}
          editData={editData}
          setEditData={setEditData}
        /> */}
        <RolePermissionListComponent />
      </Box>
    </>
  )
}
