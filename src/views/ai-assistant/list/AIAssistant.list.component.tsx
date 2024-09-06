import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer'
import { Box, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import Link from 'next/link'
import { Fragment, useEffect, useState } from 'react'
import UiSkeleton from 'src/@core/components/ui-skeleton'
import apiRequest from 'src/@core/utils/axios-config'
import { formatDateTime } from 'src/@core/utils/utils'
import Swal from 'sweetalert2'
import { TAIAssistantComponent } from '../AIAssistant.decorator'

export default function AIAssistantListComponent(props: TAIAssistantComponent) {
  const { setEditDataId, listData, setListData, setEditData, editDataId } = props

  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [preloader, setPreloader] = useState<boolean>(false)

  const getList = (page = 1) => {
    setPreloader(true)
    apiRequest.get(`/conversations?page=${page}`).then(res => {
      const paginationData: any = res
      setListData(res?.data)
      setCurrentPage(paginationData?.['current_page'])
      setTotalPages(Math.ceil(paginationData?.['total'] / 10))
      setPreloader(false)
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
        apiRequest.delete(`/conversations/${id}`).then(res => {
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

  if (!!preloader) {
    return <UiSkeleton />
  }

  return (
    <Fragment>
      <Box className='w-full overflow-hidden rounded-lg shadow-xs my-3'>
        <Box className='w-full overflow-x-auto'>
          <Table className='w-full whitespace-no-wrap'>
            <TableHead>
              <TableRow className='text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800'>
                <TableCell className='px-4 py-3'>Name</TableCell>
                <TableCell className='px-4 py-3'>Created By</TableCell>
                <TableCell className='px-4 py-3'>Created On</TableCell>
                <TableCell className='px-4 py-3'>Last User</TableCell>
                <TableCell className='px-4 py-3'>Last Updated</TableCell>
                <TableCell className='px-4 py-3 text-right'>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className='bg-white Boxide-y dark:Boxide-gray-700 dark:bg-gray-800'>
              {listData?.map((data: any, index: number) => {
                return (
                  <TableRow key={index} className='text-gray-700 dark:text-gray-400'>
                    <TableCell className='px-4 py-3 text-sm'>{data?.name}</TableCell>
                    <TableCell className='px-4 py-3 text-sm'>
                      <Box sx={{ width: '100px', textOverflow: 'ellipsis', textWrap: 'nowrap', overflow: 'hidden' }}>
                        {data?.user?.name}
                      </Box>
                    </TableCell>
                    <TableCell className='px-4 py-3 text-sm'>{formatDateTime(data?.created_at)}</TableCell>
                    <TableCell className='px-4 py-3 text-sm'>
                      <Box sx={{ width: '100px', textOverflow: 'ellipsis', textWrap: 'nowrap', overflow: 'hidden' }}>
                        {data?.user?.name}
                      </Box>
                    </TableCell>
                    <TableCell className='px-4 py-3 text-sm'>{formatDateTime(data?.updated_at)}</TableCell>

                    <TableCell className='px-4 py-3'>
                      <Box className='flex items-center justify-end space-x-1 text-sm'>
                        <Link href={`ai-assistant/${data?.id}`}>
                          <a
                            className='flex items-center justify-between p-1 text-sm font-medium leading-5 text-purple-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-none hover:text-white hover:bg-purple-600'
                            aria-label='Edit'
                          >
                            <QuestionAnswerIcon />
                          </a>
                        </Link>

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
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
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
        <Box className='grid px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t dark:border-gray-700 bg-gray-50 sm:grid-cols-9 dark:text-gray-400 dark:bg-gray-800'>
          <span className='flex items-center col-span-3'>
            Showing {listData?.length > 0 ? currentPage * 10 - 9 : 0}-
            {currentPage * 10 < totalPages ? currentPage * 10 : totalPages} of {totalPages}
          </span>
          <span className='col-span-2'></span>
          {/* <!-- Pagination --> */}
          <span className='flex col-span-4 mt-2 sm:mt-auto sm:justify-end'>
            <nav aria-label='Table navigation'>
              <ul className='inline-flex items-center'>
                <li>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={`px-3 py-1 rounded-md rounded-l-lg focus:outline-none focus:shadow-outline-purple ${
                      currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    aria-label='Previous'
                    disabled={currentPage === 1}
                  >
                    <svg className='w-4 h-4 fill-current' aria-hidden='true' viewBox='0 0 20 20'>
                      <path
                        d='M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z'
                        clipRule='evenodd'
                        fillRule='evenodd'
                      ></path>
                    </svg>
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, index) => (
                  <li key={index}>
                    <button
                      onClick={() => handlePageChange(index + 1)}
                      className={`px-3 py-1 rounded-md focus:outline-none focus:shadow-outline-purple ${
                        currentPage === index + 1 ? 'bg-purple-600 text-white' : ''
                      }`}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={`px-3 py-1 rounded-md rounded-r-lg focus:outline-none focus:shadow-outline-purple ${
                      currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    aria-label='Next'
                    disabled={currentPage === totalPages}
                  >
                    <svg className='w-4 h-4 fill-current' aria-hidden='true' viewBox='0 0 20 20'>
                      <path
                        d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
                        clipRule='evenodd'
                        fillRule='evenodd'
                      ></path>
                    </svg>
                  </button>
                </li>
              </ul>
            </nav>
          </span>
        </Box>
      </Box>
    </Fragment>
  )
}
