import VisibilityIcon from '@mui/icons-material/Visibility'
import { Box, Modal, Typography } from '@mui/material'
import { Fragment, useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import apiRequest from 'src/@core/utils/axios-config'
import { formatDateToCustomFormat } from 'src/@core/utils/utils'
import { TProjectSOWListComponent } from '../ProjectSOW.decorator'

export default function ProjectSOWListComponent(props: TProjectSOWListComponent) {
  const { listDataRefresh } = props
  const [listData, setListData] = useState<any>([])
  const [open, setOpen] = useState(false)
  const [projectSOW, setProjectSOW] = useState<any>({})
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const getList = (page = 1) => {
    apiRequest.get(`/project-summery?page=${page}`).then(res => {
      const paginationData: any = res

      setListData(res.data)
      setCurrentPage(paginationData?.['current_page'])
      setTotalPages(Math.round(paginationData?.['total'] / 10))
    })
  }

  useEffect(() => {
    getList()
  }, [listDataRefresh])

  const handlePageChange = (newPage: number) => {
    getList(newPage)
  }

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

  const openModal = (id: any) => {
    apiRequest.get(`/project-summery/${id}`).then(res => {
      handleOpen()
      setProjectSOW(res.data)
    })
  }

  return (
    <Fragment>
      <Box className='w-full overflow-hidden rounded-lg shadow-xs my-3'>
        <Box className='w-full overflow-x-auto'>
          <table className='w-full whitespace-no-wrap'>
            <thead>
              <tr className='text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800'>
                <th className='px-4 py-3'>Project</th>
                <th className='px-4 py-3'>Summary Text</th>
                <th className='px-4 py-3'>Created At</th>
                <th className='px-4 py-3 text-right'>Actions</th>
              </tr>
            </thead>
            <tbody className='bg-white Boxide-y dark:Boxide-gray-700 dark:bg-gray-800'>
              {listData?.map((data: any, index: number) => {
                return (
                  <Box component={'tr'} key={index} className='text-gray-700 dark:text-gray-400'>
                    <td className='px-4 py-3 text-sm'>{data?.meeting_transcript?.projectName}</td>
                    <td className='px-4 py-3 text-sm'>{data?.summaryText.substring(0, 100)}</td>
                    <td className='px-4 py-3 text-sm'>{formatDateToCustomFormat(data?.created_at)}</td>

                    <td className='px-4 py-3'>
                      <Box className='flex items-center justify-end space-x-4 text-sm'>
                        <button
                          onClick={() => {
                            openModal(data?.id)
                          }}
                          className='flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-purple-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray'
                          aria-label='Edit'
                        >
                          <VisibilityIcon />
                        </button>
                      </Box>
                    </td>
                  </Box>
                )
              })}
            </tbody>
          </table>
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
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style}>
          <Box>
            <Typography variant='h6' component={'h2'}>
              Project Summery:
            </Typography>
            <Typography sx={{ ml: 5, mb: 10 }}>
              <ReactMarkdown>{projectSOW?.['summaryText']}</ReactMarkdown>
            </Typography>
            <Typography variant='h6' component={'h2'}>
              Problems and Goals:
            </Typography>
            <Typography sx={{ ml: 5, mb: 10 }}>
              <ReactMarkdown>
                {projectSOW?.['meeting_transcript']?.['problems_and_goals']?.['problemGoalText']}
              </ReactMarkdown>
            </Typography>
            <Typography variant='h6' component={'h2'}>
              Project Overview:
            </Typography>
            <Typography sx={{ ml: 5, mb: 10 }}>
              <ReactMarkdown>
                {projectSOW?.['meeting_transcript']?.['problems_and_goals']?.['project_overview']?.['overviewText']}
              </ReactMarkdown>
            </Typography>
            <Typography variant='h6' component={'h2'}>
              Scope of Work:
            </Typography>
            <Typography sx={{ ml: 5, mb: 10 }}>
              <ReactMarkdown>
                {projectSOW?.['meeting_transcript']?.['problems_and_goals']?.['scope_of_work']?.['scopeText']}
              </ReactMarkdown>
            </Typography>
            <Typography variant='h6' component={'h2'}>
              Deliverables:
            </Typography>
            <Typography sx={{ ml: 5, mb: 10 }}>
              <ReactMarkdown>
                {
                  projectSOW?.['meeting_transcript']?.['problems_and_goals']?.['scope_of_work']?.['deliverables']?.[
                    'deliverablesText'
                  ]
                }
              </ReactMarkdown>
            </Typography>
          </Box>
        </Box>
      </Modal>
    </Fragment>
  )
}