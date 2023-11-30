import { Box } from '@mui/material'
import { Fragment, useEffect } from 'react'
import apiRequest from 'src/@core/utils/axios-config'
import Swal from 'sweetalert2'
import { TProjectSummeryComponent } from '../ProjectSummery.decorator'

export default function ProjectSummeryListComponent(props: TProjectSummeryComponent) {
  const { setEditDataId, listData, setListData, setEditData, editDataId } = props

  const getList = () => {
    apiRequest.get('/project-summery').then(res => {
      setListData(res.data)
    })
  }
  const onEdit = (i: string) => {
    setEditDataId(i)

    const editData = listData.length ? listData?.filter((data: any) => data['component_id'] == i)[0] : {}
    setEditData(editData)
  }

  const onDelete = (i: string) => {
    Swal.fire({
      title: 'Are You sure?',
      icon: 'error',
      showConfirmButton: true,
      confirmButtonText: 'Yes',
      showCancelButton: true,
      cancelButtonText: 'No'
    }).then(res => {
      if (res.isConfirmed) {
        apiRequest.delete(`/project-summery/${i}`).then(res => {
          Swal.fire({
            title: 'Data Deleted Successfully!',
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
  }, [editDataId])

  return (
    <Fragment>
      <Box className='w-full overflow-hidden rounded-lg shadow-xs my-3'>
        <Box className='w-full overflow-x-auto'>
          <table className='w-full whitespace-no-wrap'>
            <thead>
              <tr className='text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800'>
                <th className='px-4 py-3'>Project</th>
                <th className='px-4 py-3'>Summary Text</th>
                <th className='px-4 py-3 text-right'>Actions</th>
              </tr>
            </thead>
            <tbody className='bg-white Boxide-y dark:Boxide-gray-700 dark:bg-gray-800'>
              {listData?.map((data: any, index: number) => {
                return (
                  <Box component={'tr'} key={index} className='text-gray-700 dark:text-gray-400'>
                    <td className='px-4 py-3 text-sm'>{data?.meeting_transcript?.projectName}</td>
                    <td className='px-4 py-3 text-sm'>{data?.summaryText.substring(0, 100)}</td>

                    <td className='px-4 py-3'>
                      <Box className='flex items-center justify-end space-x-4 text-sm'>
                        {/* <button
                          onClick={() => {
                            onEdit(data['component_id'])
                          }}
                          className='flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-purple-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray'
                          aria-label='Edit'
                        >
                          <svg className='w-5 h-5' aria-hidden='true' fill='currentColor' viewBox='0 0 20 20'>
                            <path d='M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z'></path>
                          </svg>
                        </button> */}
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
          <span className='flex items-center col-span-3'>Showing 21-30 of 100</span>
          <span className='col-span-2'></span>
          {/* <!-- Pagination --> */}
          <span className='flex col-span-4 mt-2 sm:mt-auto sm:justify-end'>
            <nav aria-label='Table navigation'>
              <ul className='inline-flex items-center'>
                <li>
                  <button
                    className='px-3 py-1 rounded-md rounded-l-lg focus:outline-none focus:shadow-outline-purple'
                    aria-label='Previous'
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
                <li>
                  <button className='px-3 py-1 rounded-md focus:outline-none focus:shadow-outline-purple'>1</button>
                </li>
                <li>
                  <button className='px-3 py-1 rounded-md focus:outline-none focus:shadow-outline-purple'>2</button>
                </li>
                <li>
                  <button className='px-3 py-1 text-white transition-colors duration-150 bg-purple-600 border border-r-0 border-purple-600 rounded-md focus:outline-none focus:shadow-outline-purple'>
                    3
                  </button>
                </li>
                <li>
                  <button className='px-3 py-1 rounded-md focus:outline-none focus:shadow-outline-purple'>4</button>
                </li>
                <li>
                  <span className='px-3 py-1'>...</span>
                </li>
                <li>
                  <button className='px-3 py-1 rounded-md focus:outline-none focus:shadow-outline-purple'>8</button>
                </li>
                <li>
                  <button className='px-3 py-1 rounded-md focus:outline-none focus:shadow-outline-purple'>9</button>
                </li>
                <li>
                  <button
                    className='px-3 py-1 rounded-md rounded-r-lg focus:outline-none focus:shadow-outline-purple'
                    aria-label='Next'
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
