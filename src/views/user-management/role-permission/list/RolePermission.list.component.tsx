import UiSkeleton from '@core/components/ui-skeleton'
import { useToastSnackbar } from '@core/hooks/useToastSnackbar'
import apiRequest from '@core/utils/axios-config'
import AddIcon from '@mui/icons-material/Add'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import {
  Box,
  Button,
  Chip,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material'
import { Fragment, useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import RolePermissionFormComponent from '../form/RolePermission.form.component'

export default function RolePermissionListComponent() {
  const { showSnackbar } = useToastSnackbar()
  const [editDataId, setEditDataId] = useState<null | string>(null)
  const [listData, setListData] = useState<any>([])
  const [editData, setEditData] = useState<any>({})
  const [preloaderList, setPreloaderList] = useState<any>([])

  const [permissionsList, setPermissionList] = useState<any>({})
  const [permissionModalOpen, setRoleModalOpen] = useState<boolean>(false)
  const handleRoleModalOpen = () => setRoleModalOpen(true)
  const handleRoleModalClose = () => setRoleModalOpen(false)

  const getPermisionsList = () => {
    apiRequest.get(`/permissions`).then(res => {
      setPermissionList(res?.data)
    })
  }

  const getList = () => {
    apiRequest.get(`/roles?per_page=${1000}`).then(res => {
      setListData(roleSorting(res?.data))
    })
  }

  const onChangePermission = (isChecked: boolean, roleId: number, permission: string, data: any) => {
    const existingPermission = !!data?.map((permission: any) => permission.name).length
      ? data?.map((permission: any) => permission.name)
      : []
    let newPermission = []
    if (isChecked && existingPermission?.indexOf(permission)) {
      newPermission = [...new Set([...existingPermission, permission])]
    } else {
      newPermission = [...existingPermission?.filter((data: any) => data != permission)]
    }
    onUpdateRolePermission(roleId, newPermission)
  }

  const onUpdateRolePermission = (roleId: number, permissions: any) => {
    // setPreloaderList([...preloaderList, ])
    apiRequest
      .put(`/roles/${roleId}`, { permissions })
      .then(res => {
        showSnackbar('Updated Successfully!', { variant: 'success' })
        getList()
      })
      .catch(error => {
        showSnackbar(error?.response?.data?.message, { variant: 'error' })
      })
  }

  const onEdit = (id: string) => {
    setEditDataId(id)

    const editData = listData.length ? listData?.filter((data: any) => data['id'] == id)[0] : {}
    setEditData(editData)
  }

  const onDelete = (id: string) => {
    Swal.fire({
      title: 'Are You sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showConfirmButton: true,
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#dc2626',
      showCancelButton: true,
      cancelButtonText: 'No, cancel!'
    })
      .then(res => {
        if (res.isConfirmed) {
          apiRequest.delete(`/roles/${id}`).then(res => {
            showSnackbar('Deleted Successfully!', { variant: 'success' })
            getList()
          })
        }
      })
      .catch(error => {
        showSnackbar(error?.response?.data?.message, { variant: 'error' })
      })
  }

  const roleSorting = (data: any) => {
    const desiredOrder = ['System Admin', 'Admin']

    return data.sort((a: any, b: any) => {
      const indexA = desiredOrder.indexOf(a.name)
      const indexB = desiredOrder.indexOf(b.name)

      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB
      }

      if (indexA !== -1) return -1
      if (indexB !== -1) return 1

      return 0
    })
  }

  useEffect(() => {
    getPermisionsList()
  }, [getPermisionsList])

  useEffect(() => {
    getList()
  }, [])

  if (!listData?.length) {
    return <UiSkeleton />
  }

  console.log(listData)

  return (
    <Fragment>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box component={'h1'} className='mt-5 mb-4 text-xl font-semibold text-gray-600 dark-d:text-gray-300'>
          RolePermission
        </Box>
        <Box>
          <Button
            variant='outlined'
            sx={{ p: '5px 10px', minWidth: 'auto' }}
            onClick={() => {
              handleRoleModalOpen()
            }}
          >
            Add Role
            <AddIcon />
          </Button>
        </Box>
      </Box>
      <Box className='w-full overflow-hidden rounded-lg shadow-xs my-3'>
        <Paper className='w-full overflow-x-auto' sx={{ width: '100%', maxWidth: '100vw', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: '78vh' }}>
            <Table
              sx={{
                minWidth: 650,
                '& .sticky': {
                  position: 'sticky',
                  left: 0,
                  background: 'white',
                  boxShadow: '5px 2px 5px #8080803b',
                  borderRight: '2px solid #80808054',
                  zIndex: '1'
                }
              }}
              stickyHeader
              aria-label='sticky table'
            >
              <TableHead>
                <TableRow sx={{ backgroundColor: 'rgba(224, 224, 224, 1)' }}>
                  <TableCell className='sticky' sx={{ zIndex: '99' }}>
                    Module Name
                  </TableCell>

                  {listData?.map((role: any, index: number) => {
                    return (
                      <TableCell
                        sx={{ minWidth: '160px', p: '10px', textAlign: 'center' }}
                        key={index}
                        align='center'
                        colSpan={4}
                      >
                        <Box sx={{ display: 'inline-block', ml: '10px' }}>
                          {role?.name}
                          {role?.id !== 1 && (
                            <DeleteForeverIcon
                              onClick={() => {
                                onDelete(role?.id)
                              }}
                              color='error'
                              sx={{ ml: '5px', cursor: 'pointer' }}
                            />
                          )}
                        </Box>
                      </TableCell>
                    )
                  })}
                </TableRow>
              </TableHead>
              <TableBody
                sx={{
                  '& .MuiTableCell-root': {
                    p: '10px !important'
                  }
                }}
              >
                {Object.keys(permissionsList).map((key: any, index) => {
                  return (
                    <>
                      <TableRow
                        key={key}
                        sx={{
                          backgroundColor: 'rgba(224, 224, 224, 1)',
                          '&:last-child td, &:last-child th': { border: 0 }
                        }}
                      >
                        <>
                          <TableCell component='th' scope='row' sx={{ textTransform: 'capitalize' }} className='sticky'>
                            {String(key).replaceAll('_', ' ')}
                          </TableCell>
                          {listData?.map((role: any, roleIndex: number) => {
                            return <TableCell key={roleIndex} align='center' colSpan={4}></TableCell>
                          })}
                        </>
                      </TableRow>

                      <>
                        {permissionsList?.[key]?.map((permission: string, permissionIndex: number) => {
                          return (
                            <TableRow key={permissionIndex} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                              <TableCell key={permissionIndex} className='sticky' sx={{ width: '200px' }}>
                                <Box component={'label'}>{permission}</Box>
                              </TableCell>
                              {listData?.map((role: any, roleIndex2: number) => {
                                return (
                                  <TableCell key={roleIndex2} align='center' colSpan={4}>
                                    {!!role?.permissions?.filter((data: any) => data.name == permission)[0] ? (
                                      <Chip
                                        label='Yes'
                                        color='success'
                                        clickable
                                        onClick={e => {
                                          onChangePermission(false, role?.id, permission, role?.permissions)
                                        }}
                                        sx={{ borderRadius: '5px', height: '25px', p: '3px' }}
                                      />
                                    ) : (
                                      <Chip
                                        label='No'
                                        clickable
                                        onClick={e => {
                                          onChangePermission(true, role?.id, permission, role?.permissions)
                                        }}
                                        sx={{
                                          borderRadius: '5px',
                                          height: '25px',
                                          p: '3px',
                                          backgroundColor: 'rgb(58 53 65 / 30%)'
                                        }}
                                      />
                                    )}
                                  </TableCell>
                                )
                              })}
                            </TableRow>
                          )
                        })}
                      </>
                    </>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
        <Modal
          open={permissionModalOpen}
          onClose={handleRoleModalClose}
          aria-labelledby='modal-modal-title'
          aria-describedby='modal-modal-description'
          sx={{
            height: '100vh',
            width: '100%',
            maxWidth: '500px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '0 auto'
          }}
        >
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              background: '#fff',
              p: '20px',
              borderRadius: '5px'
            }}
          >
            <RolePermissionFormComponent
              setEditDataId={setEditDataId}
              editDataId={editDataId}
              listData={listData}
              setListData={setListData}
              editData={editData}
              setEditData={setEditData}
              roleModalClose={handleRoleModalClose}
              roleSorting={roleSorting}
            />
          </Box>
        </Modal>
      </Box>
    </Fragment>
  )
}
