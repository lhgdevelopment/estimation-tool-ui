import UiSkeleton from '@core/components/ui-skeleton'
import { useToastSnackbar } from '@core/hooks/useToastSnackbar'
import apiRequest from '@core/utils/axios-config'
import { formatDateTime } from '@core/utils/utils'
import ClearIcon from '@material-ui/icons/Clear'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import EditNoteIcon from '@mui/icons-material/EditNote'
import FilterListIcon from '@mui/icons-material/FilterList'
import FilterListOffIcon from '@mui/icons-material/FilterListOff'
import PublicOffIcon from '@mui/icons-material/PublicOff'

import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer'
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Modal,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip
} from '@mui/material'
import IconButton from '@mui/material/IconButton'
import { formatDistanceToNow } from 'date-fns'
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
  }, [debounceValue])
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

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value)
    getList(value, { ...filterData })
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
          <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
            <Table
              className='w-full whitespace-no-wrap'
              sx={{
                '& .MuiTableCell-root': {
                  p: '5px !important'
                },
                '& .MuiTableCell-head': {
                  textTransform: 'capitalize'
                }
              }}
            >
              <TableHead>
                <TableRow className='dark-d:border-gray-700 bg-gray-50 dark-d:text-gray-400 dark-d:bg-gray-800'>
                  <TableCell>Name</TableCell>
                  <TableCell sx={{ textAlign: 'center', width: '50px' }}>Owner</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>Last Accessed</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>Shared With</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>Last Modified</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>Created On</TableCell>
                  <TableCell
                    sx={{
                      position: 'sticky',
                      right: 0,
                      backgroundColor: 'white',
                      zIndex: 1,
                      textAlign: 'right'
                    }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody className='bg-white Boxide-y dark-d:Boxide-gray-700 dark-d:bg-gray-800'>
                <TableRow className='text-gray-700 dark-d:text-gray-400'>
                  <TableCell>
                    <TextField
                      sx={{ width: '100%', p: '0px', input: { p: '5px' } }}
                      placeholder='Enter name'
                      name='name'
                      value={filterData.name}
                      onChange={handleFilterOnChange}
                    />
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center', width: '50px' }}>
                    <Dropdown
                      sx={{ '& .MuiInputBase-input': { p: '5px !important' } }}
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
                  <TableCell sx={{ textAlign: 'center' }}>--</TableCell>
                  <TableCell
                    sx={{
                      position: 'sticky',
                      right: 0,
                      backgroundColor: 'white',
                      zIndex: 1,
                      textAlign: 'right'
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                      <Tooltip title='Filter'>
                        <IconButton
                          onClick={handleFilterChange}
                          sx={{
                            border: '1px solid #9333ea',
                            backgroundColor: '#fff',
                            color: '#9333ea',
                            borderRadius: '5px',
                            p: '2px',
                            '&:hover': {
                              backgroundColor: '#9333ea',
                              color: '#fff'
                            }
                          }}
                        >
                          <FilterListIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title='Clear'>
                        <IconButton
                          onClick={onFilterClear}
                          sx={{
                            border: '1px solid #9333ea',
                            backgroundColor: '#fff',
                            borderRadius: '5px',
                            p: '2px',
                            color: '#9333ea',
                            '&:hover': {
                              backgroundColor: '#9333ea',
                              color: '#fff'
                            }
                          }}
                        >
                          <FilterListOffIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
                {listData?.map((data: any, index: number) => {
                  return (
                    <TableRow key={index} sx={{ pl: '5px !important' }} className='text-gray-700 dark-d:text-gray-400'>
                      <TableCell className='px-4 py-3 text-sm'>
                        <Box
                          sx={{
                            width: '200px',
                            textWrap: 'auto',
                            overflow: 'hidden',
                            '&:hover .edit-name-btn': { opacity: 1 }
                          }}
                        >
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
                      <TableCell className='px-4 py-3 text-sm' sx={{ textAlign: 'center' }}>
                        <Tooltip title={data?.user?.name}>
                          <Avatar
                            alt={data?.user?.name}
                            src={data?.user?.name}
                            sx={{ display: 'inline-flex', width: 36, height: 36 }}
                          />
                        </Tooltip>
                      </TableCell>

                      <TableCell className='px-4 py-3 text-sm' sx={{ textAlign: 'center' }}>
                        <Tooltip title={data?.messages[0]?.user?.name}>
                          <Avatar
                            alt={data?.messages[0]?.user?.name}
                            src={data?.messages[0]?.user?.name}
                            sx={{ display: 'inline-flex', width: 36, height: 36 }}
                          />
                        </Tooltip>
                      </TableCell>
                      <TableCell className='px-4 py-3 text-sm' sx={{ textAlign: 'center' }}>
                        {!!data?.shared_user?.length ? (
                          <AvatarGroup
                            max={3}
                            total={data?.shared_user?.length}
                            spacing={'small'}
                            sx={{ display: 'inline-flex' }}
                          >
                            {data?.shared_user?.map((shared: any, index: number) => {
                              return (
                                <Tooltip key={index} title={shared?.user?.name}>
                                  <Avatar
                                    alt={shared?.user?.name}
                                    src={shared?.user?.name}
                                    sx={{ display: 'inline-flex', width: 36, height: 36 }}
                                  />
                                </Tooltip>
                              )
                            })}
                          </AvatarGroup>
                        ) : (
                          <Tooltip title={'Not Yet Shared with Anyone'}>
                            <PublicOffIcon />
                          </Tooltip>
                        )}
                      </TableCell>
                      <TableCell className='px-4 py-3 text-sm' sx={{ textAlign: 'center' }}>
                        {formatDistanceToNow(new Date(data?.messages[0]?.created_at ?? new Date()), {
                          addSuffix: true,
                          includeSeconds: true
                        })}
                      </TableCell>
                      <TableCell className='px-4 py-3 text-sm' sx={{ textAlign: 'center' }}>
                        {formatDateTime(data?.created_at)}
                      </TableCell>
                      <TableCell
                        className='px-4 py-3 text-right'
                        sx={{
                          position: 'sticky',
                          right: 0,
                          backgroundColor: 'white',
                          zIndex: 1,
                          textAlign: 'right'
                        }}
                      >
                        <Box className='flex items-center justify-end space-x-1 text-sm'>
                          <Link href={`ai-assistant/${data?.id}`}>
                            <Tooltip title='Continue this conversation'>
                              <IconButton aria-label='Edit' sx={{ p: 1 }}>
                                <QuestionAnswerIcon className='text-purple-600' />
                              </IconButton>
                            </Tooltip>
                          </Link>
                          <Tooltip title='Delete'>
                            <IconButton
                              onClick={() => {
                                onDelete(data['id'])
                              }}
                              aria-label='Delete'
                              sx={{ p: 1 }}
                            >
                              <DeleteIcon className='text-red-600' />
                            </IconButton>
                          </Tooltip>
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
        {!listData.length && <Box>No Data Found</Box>}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color='primary'
            shape='rounded'
          />
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
