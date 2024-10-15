import { Box, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import {Fragment, useCallback, useEffect, useState} from 'react'
import NoDataComponent from '@core/components/no-data-component'
import UiSkeleton from '@core/components/ui-skeleton'
import { TableSx } from '@core/theme/tableStyle'
import apiRequest from '@core/utils/axios-config'
import { formatDateTime } from '@core/utils/utils'
import Swal from 'sweetalert2'
import Link from 'next/link'
import { TUsersComponent } from '../TeamsPrompts.decorator'
import {useRouter} from "next/router";

export default function TeamsPromptsListComponent(props: TUsersComponent) {
  const { setEditDataId, listData, setListData, setEditData, listRef, editDataId } = props
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { query } = useRouter();

  const getList = useCallback((page= 0) => {
    setIsLoading(true);
    apiRequest.get(`/teams/${query.id}/share/prompts?page=${page || currentPage}`).then(res => {
      const paginationData: any = res
      setListData(res?.data)
      setCurrentPage(paginationData?.['current_page'])
      setTotalPages(Math.ceil(paginationData?.['total'] / 10))
    }).finally(()=>{
      setIsLoading(false);
    })
  }, [query.id, setIsLoading, setListData, setCurrentPage, setTotalPages, currentPage])

  useEffect(() => {
    if(listRef){
      listRef.current = { getList }
    }
  }, [getList, listRef]);

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
        apiRequest.delete(`/teams/${query.id}/share/prompts/${id}`).then(res => {
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
  }, [getList])

  if (isLoading) {
    return <UiSkeleton />
  }else if( listData.length === 0 ) {
    return <NoDataComponent preload />
  }

  return (
    <Fragment>
      <Box className='w-full overflow-hidden rounded-lg shadow-xs my-3'>
        <Box className='w-full overflow-x-auto'>
          {listData?.length > 0 && <TableContainer component={Paper}>
            <Table className='w-full whitespace-no-wrap' sx={TableSx}>
              <TableHead>
                <TableRow
                  className='text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800'>
                  <TableCell className='px-4 py-3'>
                    Name
                  </TableCell>
                  <TableCell className='px-4 py-3' sx={{textAlign: 'center', width: '190px'}}>
                    Created At
                  </TableCell>
                  <TableCell className='px-4 py-3' sx={{textAlign: 'right'}}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody className='bg-white Boxide-y dark:Boxide-gray-700 dark:bg-gray-800'>
                {listData?.map((data: any, index: number) => {
                  return (
                    <Box component={'tr'} key={index} className='text-gray-700 dark:text-gray-400'>
                      <TableCell className='px-4 py-3 text-sm'>
                        {data?.prompt?.name}
                      </TableCell>
                      <TableCell className='px-4 py-3 text-sm' sx={{textAlign: 'center'}}>
                        {formatDateTime(data?.created_at)}
                      </TableCell>

                      <TableCell className='px-4 py-3'>
                        <Box className='flex items-center justify-end space-x-1 text-sm'>
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
                      </TableCell>
                    </Box>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>}
          {listData?.length === 0 && <NoDataComponent />}
        </Box>
        {listData?.length > 0 && <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', my: 4}}>
          <Pagination
            count={totalPages}
            color='primary'
            shape='rounded'
            onChange={(e, value) => {
              getList(value)
            }}
            defaultPage={currentPage}
          />
        </Box>}
      </Box>
    </Fragment>
  )
}
