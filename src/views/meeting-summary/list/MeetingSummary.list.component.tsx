import LockIcon from '@mui/icons-material/Lock'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import VisibilityIcon from '@mui/icons-material/Visibility'
import {
  Box,
  Button,
  CircularProgress,
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
import NoDataComponent from 'src/@core/components/no-data-component'
import UiSkeleton from 'src/@core/components/ui-skeleton'
import { useToastSnackbar } from 'src/@core/hooks/useToastSnackbar'
import { TableSx } from 'src/@core/theme/tableStyle'
import apiRequest from 'src/@core/utils/axios-config'
import { formatDateTime } from 'src/@core/utils/utils'
import Swal from 'sweetalert2'
import { TMeetingSummaryComponent } from '../MeetingSummary.decorator'

export default function MeetingSummaryListComponent(props: TMeetingSummaryComponent) {
  const { listData, setListData } = props

  const { showSnackbar } = useToastSnackbar()
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [expendedRow, setExpended] = useState('')
  const [statusPreload, setStatusPreload] = useState(null)
  const [preload, setPreload] = useState(false)
  const handleRowExpendable = (id: any) => {
    setExpended(prevState => id)
  }

  const defaultFilterData = {
    meetingName: ''
  }

  const [filterData, setFilterData] = useState(defaultFilterData)

  const handleFilterChange = () => {
    getList()
  }
  const setFilterValues = (e: React.ChangeEvent<any>) => {
    setFilterData({
      ...filterData,
      [e.target.name]: e.target.value
    })
  }

  const onFilterClear = () => {
    filterData.meetingName = ''
    getList()
  }

  const getList = (page = 1) => {
    setPreload(true)
    apiRequest
      .get(`/meeting-summery?page=${page}&meetingName=${filterData?.meetingName}`)
      .then(res => {
        const paginationData: any = res
        setListData(res?.data)
        setCurrentPage(paginationData?.['current_page'])
        setTotalPages(Math.ceil(paginationData?.['total'] / 10))
        setPreload(false)
      })
      .catch(error => {
        showSnackbar(error?.response?.data?.message, { variant: 'error' })
        setPreload(false)
      })
  }

  const onStatusChange = (data: any) => {
    setStatusPreload(data?.['id'])
    data.is_private = !data.is_private
    data.pushToClickUp = false
    data.summaryText = data?.['meetingSummeryText']
    apiRequest
      .put(`/meeting-summery/${data?.['id']}`, data)
      .then(res => {
        setListData((prevState: []) => {
          const updatedList: any = [...prevState]
          const editedServiceIndex = updatedList.findIndex((item: any) => item['_id'] === data?.['id'])
          if (editedServiceIndex !== -1) {
            updatedList[editedServiceIndex] = res?.data
          }

          return updatedList
        })
        showSnackbar('Updated Successfully!', { variant: 'success' })
      })
      .catch(error => {
        showSnackbar(error?.response?.data?.message, { variant: 'error' })
      })
      .finally(() => {
        setStatusPreload(null)
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
          apiRequest.delete(`/meeting-summery/${id}`).then(res => {
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
  }, [])

  const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    height: '90vh',
    overflowY: 'auto',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4
  }
  if (preload) {
    return <UiSkeleton />
  }

  return (
    <Fragment>
      <Box className='w-full overflow-hidden rounded-lg shadow-xs my-3'>
        <Box className='w-full overflow-x-auto'>
          <TableContainer component={Paper}>
            <Table className='w-full whitespace-no-wrap' sx={TableSx}>
              <TableHead>
                <TableRow className='text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800'>
                  <TableCell className='px-4 py-3' sx={{ width: '50%' }}>
                    Meeting Name
                  </TableCell>
                  <TableCell className='px-4 py-3' sx={{ textAlign: 'center', width: '140px' }}>
                    Meeting Type
                  </TableCell>
                  <TableCell className='px-4 py-3' sx={{ textAlign: 'center', width: '140px' }}>
                    Created By
                  </TableCell>
                  <TableCell className='px-4 py-3' sx={{ textAlign: 'center', width: '190px' }}>
                    Created At
                  </TableCell>

                  <TableCell className='px-4 py-3 ' sx={{ textAlign: 'center', width: '140px' }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody className='bg-white Boxide-y dark:Boxide-gray-700 dark:bg-gray-800'>
                <Box component={'tr'} className='text-gray-700 dark:text-gray-400' sx={{ '& td': { p: '5px 5px' } }}>
                  <Box component={'td'}>
                    <input
                      className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                      placeholder='Enter meeting name'
                      name='meetingName'
                      value={filterData.meetingName}
                      onChange={setFilterValues}
                    />
                  </Box>
                  <Box component={'td'}>--</Box>

                  <Box component={'td'}>--</Box>

                  <Box component={'td'} sx={{ textAlign: 'center' }}>
                    --
                  </Box>
                  <Box component={'td'}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Button
                        onClick={handleFilterChange}
                        sx={{
                          border: '1px solid #9333ea',
                          padding: '3px 10px',
                          mr: 1,
                          fontSize: '14px',
                          borderRadius: '5px',
                          color: '#9333ea',
                          '&:hover': {
                            background: '#9333ea',
                            color: '#fff'
                          }
                        }}
                      >
                        Filter
                      </Button>
                      <Button
                        onClick={onFilterClear}
                        sx={{
                          border: '1px solid #9333ea',
                          padding: '3px 10px',
                          fontSize: '14px',
                          borderRadius: '5px',
                          color: '#9333ea',
                          '&:hover': {
                            background: '#9333ea',
                            color: '#fff'
                          }
                        }}
                      >
                        Clear
                      </Button>
                    </Box>
                  </Box>
                </Box>

                {listData?.map((data: any, index: number) => {
                  return (
                    <TableRow key={index} className='text-gray-700 dark:text-gray-400'>
                      <TableCell className='px-4 py-3 text-sm  expendable-row'>
                        <Box className='expendable-row-inner'>
                          {expendedRow == `row-${index}` ? (
                            <Box className='expended-row-box'>{data?.meetingName}</Box>
                          ) : (
                            <Box className='expendable-row-box'>{data?.meetingName}</Box>
                          )}
                          {String(data?.meetingName).length > 100 ? (
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
                        {data?.meeting_type?.name}
                      </TableCell>
                      <TableCell className='px-4 py-3 text-sm' sx={{ textAlign: 'center' }}>
                        {data.created_by?.name}
                      </TableCell>
                      <TableCell className='px-4 py-3 text-sm' sx={{ textAlign: 'center' }}>
                        {formatDateTime(data?.created_at)}
                      </TableCell>

                      <TableCell className='px-4 py-3'>
                        <Box className='flex items-center justify-end space-x-1 text-sm'>
                          <Link href={`/meeting-summary/${data?.id}`} passHref>
                            <Box
                              sx={{ cursor: 'pointer' }}
                              component={'a'}
                              className='flex items-center justify-between p-1 text-sm font-medium leading-5 text-purple-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-none hover:text-white hover:bg-purple-600'
                              aria-label='View'
                            >
                              <VisibilityIcon />
                            </Box>
                          </Link>

                          <Link href={`/meeting-summary/edit/${data?.id}`} passHref>
                            <Box
                              sx={{ cursor: 'pointer' }}
                              component={'a'}
                              className='flex items-center justify-between p-1 text-sm font-medium leading-5 text-purple-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-none hover:text-white hover:bg-purple-600'
                              aria-label='View'
                            >
                              <svg className='w-5 h-5' aria-hidden='true' fill='currentColor' viewBox='0 0 20 20'>
                                <path d='M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z'></path>
                              </svg>
                            </Box>
                          </Link>
                          <button
                            className='flex items-center justify-between p-1 text-sm font-medium leading-5 text-purple-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-none hover:text-white hover:bg-purple-600'
                            onClick={() => {
                              onStatusChange(data)
                            }}
                          >
                            {statusPreload == data?.id ? (
                              <CircularProgress size={'18px'} />
                            ) : data.is_private ? (
                              <LockIcon color='error' />
                            ) : (
                              <LockOpenIcon color='success' />
                            )}
                          </button>
                          <button
                            onClick={() => {
                              onDelete(data['id'])
                            }}
                            className='flex items-center justify-between p-1 text-sm font-medium leading-5 text-red-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-none hover:text-white hover:bg-red-600'
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
