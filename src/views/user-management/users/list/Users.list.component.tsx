import { Box, Pagination, Paper, Table, TableContainer } from '@mui/material'
import { Fragment, useEffect, useState } from 'react'
import NoDataComponent from 'src/@core/components/no-data-component'
import UiSkeleton from 'src/@core/components/ui-skeleton'
import { TableSx } from 'src/@core/theme/tableStyle'
import apiRequest from 'src/@core/utils/axios-config'
import Swal from 'sweetalert2'
import { TUsersComponent } from '../Users.decorator'

export default function UsersListComponent(props: TUsersComponent) {
  const { setEditDataId, listData, setListData, setEditData, editDataId } = props
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)

  const getList = (page = 1) => {
    apiRequest.get(`/users?page=${page}`).then(res => {
      const paginationData: any = res

      setListData(res?.data)
      setCurrentPage(paginationData?.['current_page'])
      setTotalPages(Math.ceil(paginationData?.['total'] / 10))
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
    }).then(res => {
      if (res.isConfirmed) {
        apiRequest.delete(`/users/${id}`).then(res => {
          Swal.fire({
            title: 'Deleted Successfully!',
            icon: 'success',
            timer: 1000,
            timerProgressBar: true,
            showConfirmButton: false
          })
          getList()
        })
      }
    })
  }

  useEffect(() => {
    getList()
  }, [])

  const handlePageChange = (newPage: number) => {
    getList(newPage)
  }

  if (!listData?.length) {
    return <UiSkeleton />
  }

  return (
    <Fragment>
      <Box className='w-full overflow-hidden rounded-lg shadow-xs my-3'>
        <Box className='w-full overflow-x-auto'>
          <TableContainer component={Paper}>
            <Table className='w-full whitespace-no-wrap' sx={TableSx}>
              <thead>
                <tr className='text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800'>
                  <th className='px-4 py-3'>Name</th>
                  <th className='px-4 py-3'>Email</th>
                  <th className='px-4 py-3 text-right'>Actions</th>
                </tr>
              </thead>
              <tbody className='bg-white Boxide-y dark:Boxide-gray-700 dark:bg-gray-800'>
                {listData?.map((data: any, index: number) => {
                  return (
                    <Box component={'tr'} key={index} className='text-gray-700 dark:text-gray-400'>
                      <td className='px-4 py-3 text-sm'>{data?.name}</td>
                      <td className='px-4 py-3 text-sm'>{data?.email}</td>

                      <td className='px-4 py-3'>
                        <Box className='flex items-center justify-end space-x-1 text-sm'>
                          <button
                            onClick={() => {
                              onEdit(data['id'])
                            }}
                            className='flex items-center justify-between p-1 text-sm font-medium leading-5 text-purple-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-none hover:text-white hover:bg-purple-600'
                            aria-label='Edit'
                          >
                            <svg className='w-5 h-5' aria-hidden='true' fill='currentColor' viewBox='0 0 20 20'>
                              <path d='M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z'></path>
                            </svg>
                          </button>
                          <button
                            onClick={() => {
                              onDelete(data['id'])
                            }}
                            className='flex items-center justify-between p-1 text-sm font-medium leading-5 text-purple-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-none hover:text-white hover:bg-purple-600'
                            aria-label='Delete'
                          >
                            <svg className='w-5 h-5' aria-hidden='true' fill='currentColor' viewBox='0 0 20 20'>
                              <path
                                fillRule='evenodd'
                                d='M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z'
                                clipRule='evenodd'
                              ></path>
                            </svg>
                          </button>
                        </Box>
                      </td>
                    </Box>
                  )
                })}
              </tbody>
            </Table>
          </TableContainer>
          {!listData?.length && <NoDataComponent />}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 4 }}>
          <Pagination
            count={totalPages}
            color='primary'
            shape='rounded'
            onChange={(e, value) => {
              getList(value)
            }}
            defaultPage={currentPage}
          />
        </Box>
      </Box>
    </Fragment>
  )
}
