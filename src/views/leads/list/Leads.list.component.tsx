import UiSkeleton from '@core/components/ui-skeleton'
import { useToastSnackbar } from '@core/hooks/useToastSnackbar'
import { TableSx } from '@core/theme/tableStyle'
import apiRequest from '@core/utils/axios-config'
import { formatDateTime } from '@core/utils/utils'
import VisibilityIcon from '@mui/icons-material/Visibility'
import {
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
import { TLeadsComponent } from '../Leads.decorator'

export default function LeadsListComponent(props: TLeadsComponent) {
  const { listData, setListData } = props

  const { showSnackbar } = useToastSnackbar()

  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [preload, setPreload] = useState<boolean>(false)

  const defaultData = {
    firstName: '',
    lastName: '',
    company: '',
    phone: '',
    email: ''
  }

  const [filterData, setFilterData] = useState(defaultData)

  const handleFilterChange = (e: React.ChangeEvent<any>) => {
    setFilterData({
      ...filterData,
      [e.target.name]: e.target.value
    })
  }

  const onFilterClear = () => {
    setFilterData(prevState => ({ ...defaultData }))
  }

  const handlePageChange = (newPage: number) => {
    getList(newPage)
  }

  const getList = (page = 1) => {
    setPreload(true)
    apiRequest
      .get(
        `/leads?page=${page}&firstName=${filterData?.firstName}&lastName=${filterData?.lastName}&company=${filterData?.company}&phone=${filterData?.phone}&email=${filterData?.email}`
      )
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
        apiRequest.delete(`/leads/${id}`).then(res => {
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
  }, [filterData])

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
                <TableRow className='text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b d:border-gray-700 bg-gray-5k-d:text-gray-ark-d:bg-gray-800'>
                  <TableCell className='px-4 py-3'>First Name</TableCell>
                  <TableCell className='px-4 py-3' sx={{ textAlign: 'center' }}>
                    Last Name
                  </TableCell>
                  <TableCell className='px-4 py-3' sx={{ textAlign: 'center' }}>
                    Company
                  </TableCell>
                  <TableCell className='px-4 py-3' sx={{ textAlign: 'center' }}>
                    Phone
                  </TableCell>
                  <TableCell className='px-4 py-3' sx={{ textAlign: 'center' }}>
                    Email
                  </TableCell>
                  <TableCell className='px-4 py-3' sx={{ textAlign: 'center' }}>
                    Project Type
                  </TableCell>
                  {/* <TableCell className='px-4 py-3'>Description</TableCell> */}
                  <TableCell className='px-4 py-3'>Created At</TableCell>
                  <TableCell className='px-4 py-3 text-right' sx={{ width: '100px', textAlign: 'center' }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody className='bg-white Boxide-y d:Boxide-gray-70k-d:bg-gray-800'>
                <Box component={'tr'} className='text-gray-700 d:text-gray-400' sx={{ '& td': { p: '5px 5px' } }}>
                  <Box component={'td'}>
                    <input
                      className='block w-full mt-1 text-sm d:border-gray-60k-d:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purark-d:text-gra dark-d:focus:shadow-outline-gray form-input'
                      placeholder='Enter first Name'
                      name='firstName'
                      value={filterData.firstName}
                      onChange={handleFilterChange}
                    />
                  </Box>
                  <Box component={'td'}>
                    <input
                      className='block w-full mt-1 text-sm d:border-gray-60k-d:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purark-d:text-gra dark-d:focus:shadow-outline-gray form-input'
                      placeholder='Enter last name'
                      name='lastName'
                      value={filterData.lastName}
                      onChange={handleFilterChange}
                    />
                  </Box>
                  <Box component={'td'}>
                    <input
                      className='block w-full mt-1 text-sm d:border-gray-60k-d:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purark-d:text-gra dark-d:focus:shadow-outline-gray form-input'
                      placeholder='Enter company'
                      name='company'
                      value={filterData.company}
                      onChange={handleFilterChange}
                    />
                  </Box>
                  <Box component={'td'}>
                    <input
                      className='block w-full mt-1 text-sm d:border-gray-60k-d:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purark-d:text-gra dark-d:focus:shadow-outline-gray form-input'
                      placeholder='Enter phone'
                      name='phone'
                      value={filterData.phone}
                      onChange={handleFilterChange}
                    />
                  </Box>
                  <Box component={'td'}>
                    <input
                      className='block w-full mt-1 text-sm d:border-gray-60k-d:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purark-d:text-gra dark-d:focus:shadow-outline-gray form-input'
                      placeholder='Enter email'
                      name='email'
                      value={filterData.email}
                      onChange={handleFilterChange}
                    />
                  </Box>

                  <Box component={'td'} sx={{ textAlign: 'center' }}>
                    --
                  </Box>
                  <Box component={'td'} sx={{ textAlign: 'center' }}>
                    --
                  </Box>
                  <Box component={'td'}>
                    <Box sx={{ textAlign: 'center' }}>
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
                    <TableRow key={index} className='text-gray-700 d:text-gray-400'>
                      <TableCell className='px-4 py-3 text-sm'>{data?.firstName}</TableCell>
                      <TableCell className='px-4 py-3 text-sm'>{data?.lastName}</TableCell>
                      <TableCell className='px-4 py-3 text-sm'>{data?.company}</TableCell>
                      <TableCell className='px-4 py-3 text-sm'>{data?.phone}</TableCell>
                      <TableCell className='px-4 py-3 text-sm'>{data?.email}</TableCell>
                      <TableCell className='px-4 py-3 text-sm'>{data?.project_type?.name}</TableCell>

                      <TableCell className='px-4 py-3 text-sm'>{formatDateTime(data?.created_at)}</TableCell>

                      <TableCell className='px-4 py-3'>
                        <Box className='flex items-center justify-end space-x-1 text-sm'>
                          <Link href={`/leads/${data?.id}`} passHref>
                            <Box
                              sx={{ cursor: 'pointer' }}
                              component={'a'}
                              className='flex items-center justify-between p-1 text-sm font-medium leading-5 text-purple-600 rounded-lg d:text-gray-400 focus:outline-none focus:shadow-outline-none hover:text-white hover:bg-purple-600'
                              aria-label='View'
                            >
                              <VisibilityIcon />
                            </Box>
                          </Link>

                          <Link href={`/leads/edit/${data?.id}`} passHref>
                            <Box
                              sx={{ cursor: 'pointer' }}
                              component={'a'}
                              className='flex items-center justify-between p-1 text-sm font-medium leading-5 text-purple-600 rounded-lg d:text-gray-400 focus:outline-none focus:shadow-outline-none hover:text-white hover:bg-purple-600'
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
                            className='flex items-center justify-between p-1 text-sm font-medium leading-5 text-red-600 rounded-lg d:text-gray-400 focus:outline-none focus:shadow-outline-none hover:text-white hover:bg-red-600'
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
