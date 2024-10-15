import UiSkeleton from '@core/components/ui-skeleton'
import { useToastSnackbar } from '@core/hooks/useToastSnackbar'
import apiRequest from '@core/utils/axios-config'
import { formatDateTime } from '@core/utils/utils'
import ClearIcon from '@material-ui/icons/Clear'
import EditIcon from '@material-ui/icons/Edit'
import EditNoteIcon from '@mui/icons-material/EditNote'
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer'
import { Box, Button, Modal, Table, TableBody, TableCell, TableHead, TableRow, TextField } from '@mui/material'
import Link from 'next/link'
import { Fragment, useCallback, useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { Dropdown } from '../../../@core/components/dropdown'
import useDebounce from '../../../@core/utils/debounce'
import { TAIAssistantComponent } from '../AIAssistant.decorator'

const defaultFilterData = {
  name: '',
  user_id: ''
}
export default function AIAssistantListComponent(props: TAIAssistantComponent) {
  const { listData, setListData } = props
  const { showSnackbar } = useToastSnackbar()
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [preloader, setPreloader] = useState<boolean>(false)

  const [filterData, setFilterData] = useState(defaultFilterData)
  const debounceValue = useDebounce(filterData, 800)

  const [editDataId, setEditDataId] = useState<null | string>(null)
  const [formData, setFormData] = useState({
    name: ''
  })
  const [errorMessage, setErrorMessage] = useState<any>({})
  const [hiveEditModalOpen, setHiveEditModalOpen] = useState<boolean>(false)
  const [expendendKeys, setExpandedKeys] = useState<any>([])

  const handleHiveEditModalOpen = () => {
    setHiveEditModalOpen(true)
    setErrorMessage({})
  }
  const handleHiveEditModalClose = () => {
    setHiveEditModalOpen(false)
    setErrorMessage({})
  }

  const getList = useCallback(
    (page = 1, { name = '', user_id = '' } = {}) => {
      setPreloader(true)
      apiRequest.get(`/conversations?page=${page}&name=${name}&user_id=${user_id}`).then(res => {
        const paginationData: any = res
        setListData(res?.data)
        setCurrentPage(paginationData?.['current_page'])
        setTotalPages(Math.ceil(paginationData?.['total'] / 10))
        setPreloader(false)
      })
    },
    [setListData, setCurrentPage, setTotalPages, setPreloader]
  )
  useEffect(() => {
    getList(1, { ...debounceValue })
  }, [debounceValue, getList])
  const handleFilterOnChange = (e: any) => {
    setFilterData({
      ...filterData,
      [e.target.name]: e.target.value
    })
  }

  const onEdit = (id: string) => {
    setEditDataId(id)
    const editData = listData.length ? listData?.filter((data: any) => data['id'] == id)[0] : {}
    setFormData(editData)
    handleHiveEditModalOpen()
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
          getList(1, { ...filterData })
        })
      }
    })
  }

  useEffect(() => {
    getList(1, { ...filterData })
  }, [])

  const handleFilterChange = () => {
    getList(1, { ...filterData })
  }
  const onFilterClear = () => {
    setFilterData({ ...defaultFilterData })
    getList(1, { ...defaultFilterData })
  }

  const handlePageChange = (newPage: number) => {
    getList(newPage, { ...filterData })
  }
  const handleTextChange = (e: React.ChangeEvent<any>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }
  const onSubmit = (e: React.FormEvent<any>) => {
    e.preventDefault()
    setErrorMessage({})
    if (editDataId) {
      apiRequest
        .put(`/conversations/${editDataId}`, formData)
        .then(res => {
          setListData((prevState: []) => {
            const updatedList: any = [...prevState]
            const editedServiceIndex = updatedList.findIndex((item: any) => item['id'] === editDataId)

            if (editedServiceIndex !== -1) {
              updatedList[editedServiceIndex]['name'] = res?.data?.name
            }

            return updatedList
          })

          setFormData({
            name: ''
          })
          showSnackbar('Updated Successfully!', { variant: 'success' })
          handleHiveEditModalClose()
        })
        .catch(error => {
          setErrorMessage(error?.response?.data?.errors)
          showSnackbar(error?.response?.data?.message, { variant: 'error' })
        })
    }
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
              <TableRow className='text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark-d:border-gray-700 bg-gray-50 dark-d:text-gray-400 dark-d:bg-gray-800'>
                <TableCell className='px-4 py-3'>Name</TableCell>
                <TableCell className='px-4 py-3'>Created By</TableCell>
                <TableCell className='px-4 py-3'>Created On</TableCell>
                <TableCell className='px-4 py-3'>Last User</TableCell>
                <TableCell className='px-4 py-3'>Last Updated</TableCell>
                <TableCell className='px-4 py-3 text-right'>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className='bg-white Boxide-y dark-d:Boxide-gray-700 dark-d:bg-gray-800'>
              <TableRow className='text-gray-700 dark-d:text-gray-400'>
                <TableCell sx={{ p: '10px !important' }}>
                  <TextField
                    sx={{ width: '100%', p: '0px', input: { p: '10px 10px' } }}
                    placeholder='Enter name'
                    name='name'
                    value={filterData.name}
                    onChange={handleFilterOnChange}
                  />
                </TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  <Dropdown
                    sx={{ '& .MuiInputBase-input': { p: '10px 10px !important' } }}
                    optionConfig={{
                      title: 'name',
                      id: 'id'
                    }}
                    url='users'
                    name='user_id'
                    value={filterData.user_id}
                    onChange={handleFilterOnChange}
                  />
                </TableCell>
                <TableCell sx={{ textAlign: 'center' }}>--</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>--</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>--</TableCell>
                <TableCell>
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
                </TableCell>
              </TableRow>
              {listData?.map((data: any, index: number) => {
                return (
                  <TableRow key={index} className='text-gray-700 dark-d:text-gray-400'>
                    <TableCell className='px-4 py-3 text-sm'>
                      <Box sx={{ '&:hover .edit-name-btn': { opacity: 1 } }}>
                        <Link href={`ai-assistant/${data?.id}`}>{data?.name}</Link>

                        <Button
                          sx={{
                            ml: '5px',
                            p: '3px',
                            minWidth: 0,
                            borderRadius: '5px',
                            opacity: 0,
                            transition: 'all 0.3s ease-in-out',
                            '& .MuiSvgIcon-root': {
                              color: '#7e22ce',
                              height: '16px !important',
                              width: '16px !important'
                            }
                          }}
                          className='edit-name-btn'
                          onClick={() => {
                            onEdit(data['id'])
                          }}
                        >
                          <EditIcon />
                        </Button>
                      </Box>
                    </TableCell>
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
                            className='flex items-center justify-between p-1 text-sm font-medium leading-5 text-purple-600 rounded-lg dark-d:text-gray-400 focus:outline-none focus:shadow-outline-none hover:text-white hover:bg-purple-600'
                            aria-label='Edit'
                          >
                            <QuestionAnswerIcon />
                          </a>
                        </Link>

                        <button
                          onClick={() => {
                            onDelete(data['id'])
                          }}
                          className='flex items-center justify-between p-1 text-sm font-medium leading-5 text-purple-600 rounded-lg dark-d:text-gray-400 focus:outline-none focus:shadow-outline-none hover:text-white hover:bg-purple-600'
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
        <Box className='grid px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t dark-d:border-gray-700 bg-gray-50 sm:grid-cols-9 dark-d:text-gray-400 dark-d:bg-gray-800'>
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
        open={hiveEditModalOpen}
        onClose={handleHiveEditModalClose}
        aria-labelledby='hive-modal-title'
        aria-describedby='hive-modal-description'
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Box
          className='p-5 mb-8 bg-white rounded-lg shadow-md dark-d:bg-gray-800'
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '50%',
            overflowY: 'auto',
            p: '50px',
            maxHeight: '100%',
            '& form': { width: '100%', display: 'flex', flexDirection: 'column' }
          }}
        >
          <Box sx={{ mb: '20px' }}>
            <h2 id='hive-modal-title' className='my-6 text-xl font-semibold text-gray-700 dark-d:text-gray-200'>
              Update Name
            </h2>
          </Box>
          <form onSubmit={onSubmit}>
            <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
              <Box sx={{ width: '100%' }}>
                <TextField
                  label={'Name'}
                  name='name'
                  value={formData?.name}
                  onChange={handleTextChange}
                  error={errorMessage?.['name']}
                  fullWidth
                />
                {!!errorMessage?.['name'] &&
                  errorMessage?.['name']?.map((message: any, index: number) => {
                    return (
                      <span key={index} className='text-xs text-red-600 dark-d:text-red-400'>
                        {message}
                      </span>
                    )
                  })}
              </Box>
            </Box>

            <Box className='my-4 text-right'>
              <button
                onClick={handleHiveEditModalClose}
                type='button'
                className='px-4 py-2 mr-3 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-red-600 border border-transparent rounded-lg active:bg-red-600 hover:bg-red-700 focus:outline-none focus:shadow-outline-red'
              >
                Close <ClearIcon />
              </button>
              <button
                type='submit'
                className='px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-green-600 border border-transparent rounded-lg active:bg-green-600 hover:bg-green-700 focus:outline-none focus:shadow-outline-green'
              >
                Update
                <EditNoteIcon />
              </button>
            </Box>
          </form>
        </Box>
      </Modal>
    </Fragment>
  )
}
