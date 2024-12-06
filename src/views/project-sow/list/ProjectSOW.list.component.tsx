import UiSkeleton from '@core/components/ui-skeleton'
import { useToastSnackbar } from '@core/hooks/useToastSnackbar'
import { TableSx } from '@core/theme/tableStyle'
import apiRequest from '@core/utils/axios-config'
import { formatDateTime } from '@core/utils/utils'
import VisibilityIcon from '@mui/icons-material/Visibility'
import {
  Avatar,
  Box,
  Button,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material'
import Link from 'next/link'
import { Fragment, useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { TProjectSOWListComponent } from '../ProjectSOW.decorator'

export default function ProjectSOWListComponent(props: TProjectSOWListComponent) {
  const { listData, setListData } = props
  const { showSnackbar } = useToastSnackbar()
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [expendedRow, setExpended] = useState('')
  const handleRowExpendable = (id: any) => {
    setExpended(prevState => id)
  }
  const getList = (page = 1) => {
    apiRequest
      .get(`/project-summery?page=${page}`)
      .then(res => {
        const paginationData: any = res

        setListData(res?.data)
        setCurrentPage(paginationData?.['current_page'])
        setTotalPages(Math.ceil(paginationData?.['total'] / 10))
      })
      .catch(error => {
        showSnackbar(error?.response?.data?.message, { variant: 'error' })
      })
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
          apiRequest.delete(`/project-summery/${id}`).then(res => {
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
      .catch(error => {
        showSnackbar(error?.response?.data?.message, { variant: 'error' })
      })
  }

  useEffect(() => {
    getList()
  }, [getList])

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
              <TableHead>
                <TableRow className='text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark-d:border-gray-700 bg-gray-50 dark-d:text-gray-400 dark-d:bg-gray-800'>
                  <TableCell className='px-4 py-3' sx={{ width: '40%' }}>
                    Project Name
                  </TableCell>
                  <TableCell className='px-4 py-3' sx={{ textAlign: 'center' }}>
                    Type
                  </TableCell>
                  <TableCell className='px-4 py-3' sx={{ textAlign: 'center' }}>
                    Member
                  </TableCell>
                  <TableCell className='px-4 py-3' sx={{ textAlign: 'center' }}>
                    Last Updated At
                  </TableCell>
                  <TableCell className='px-4 py-3' sx={{ textAlign: 'center' }}>
                    Created At
                  </TableCell>
                  <TableCell className='px-4 py-3' sx={{ width: '100px', textAlign: 'center' }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody className='bg-white Boxide-y dark-d:Boxide-gray-700 dark-d:bg-gray-800'>
                {listData?.map((data: any, index: number) => {
                  return (
                    <TableRow key={index} className='text-gray-700 dark-d:text-gray-400'>
                      <TableCell className='px-4 py-3 text-sm w-200 expendable-row'>
                        <Box className='expendable-row-inner'>
                          {expendedRow == `row-${index}` ? (
                            <Box className='expended-row-box'>{data?.meeting_transcript?.projectName}</Box>
                          ) : (
                            <Box className='expendable-row-box'>{data?.meeting_transcript?.projectName}</Box>
                          )}
                          {String(data?.meeting_transcript?.projectName).length > 75 ? (
                            expendedRow == `row-${index}` ? (
                              <Button
                                onClick={() => {
                                  handleRowExpendable('')
                                }}
                                className='see-more-btn'
                              >
                                Show Less
                              </Button>
                            ) : (
                              <Button
                                onClick={() => {
                                  handleRowExpendable(`row-${index}`)
                                }}
                                className='see-more-btn'
                              >
                                See More...
                              </Button>
                            )
                          ) : (
                            <></>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell className='px-4 py-3 text-sm' sx={{ textAlign: 'center' }}>
                        {data.created_by?.name}
                      </TableCell>
                      <TableCell className='px-4 py-3 text-sm' sx={{ textAlign: 'center' }}>
                        <Box sx={{ display: 'inline-block' }}>
                          <Avatar>{String(data.created_by?.name)[0]}</Avatar>
                        </Box>
                      </TableCell>
                      <TableCell className='px-4 py-3 text-sm' sx={{ textAlign: 'center' }}>
                        {formatDateTime(data?.created_at)}
                      </TableCell>
                      <TableCell className='px-4 py-3 text-sm' sx={{ textAlign: 'center' }}>
                        {formatDateTime(data?.created_at)}
                      </TableCell>

                      <TableCell className='px-4 py-3'>
                        <Box className='flex items-center justify-end space-x-1 text-sm'>
                          <Link href={`/project-summary/${data?.id}`} passHref>
                            <Box
                              sx={{ cursor: 'pointer' }}
                              component={'a'}
                              className='flex items-center justify-between p-1 text-sm font-medium leading-5 text-purple-600 rounded-lg dark-d:text-gray-400 focus:outline-none focus:shadow-outline-none hover:text-white hover:bg-purple-600'
                              aria-label='View'
                            >
                              <VisibilityIcon />
                            </Box>
                          </Link>
                          <Link href={`/project-summary/edit/${data?.id}`} passHref>
                            <Box
                              sx={{ cursor: 'pointer' }}
                              component={'a'}
                              className='flex items-center justify-between p-1 text-sm font-medium leading-5 text-purple-600 rounded-lg dark-d:text-gray-400 focus:outline-none focus:shadow-outline-none hover:text-white hover:bg-purple-600'
                              aria-label='View'
                            >
                              <svg className='w-5 h-5' aria-hidden='true' fill='currentColor' viewBox='0 0 20 20'>
                                <path d='M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z'></path>
                              </svg>
                            </Box>
                          </Link>

                          <button
                            onClick={() => {
                              onDelete(data['id'])
                            }}
                            className='flex items-center justify-between p-1 text-sm font-medium leading-5 text-red-600 rounded-lg dark-d:text-gray-400 focus:outline-none focus:shadow-outline-none hover:text-white hover:bg-red-600'
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
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
          {!listData?.length && (
            <Box
              sx={{
                padding: '27px',
                textAlign: 'center',
                color: '#dd2828',
                fontSize: '20px'
              }}
            >
              No Data Found!
            </Box>
          )}
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
