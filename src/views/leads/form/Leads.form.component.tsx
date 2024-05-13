import AddIcon from '@material-ui/icons/Add'
import ClearIcon from '@material-ui/icons/Clear'
import EditNoteIcon from '@mui/icons-material/EditNote'
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove'
import { Box } from '@mui/material'
import { ExposeParam } from 'md-editor-rt'
import 'md-editor-rt/lib/style.css'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import { Fragment, useEffect, useRef, useState } from 'react'
import { Dropdown } from 'src/@core/components/dropdown'
import Preloader from 'src/@core/components/preloader'
import { RichTextEditor } from 'src/@core/components/rich-text-editor'
import apiRequest from 'src/@core/utils/axios-config'
import { TLeadsComponent } from '../Leads.decorator'

export default function LeadsFormComponent(props: TLeadsComponent) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const { listData, setListData, isEdit } = props
  const [preload, setPreload] = useState<boolean>(false)
  const router = useRouter()

  const defaultData = {
    firstName: '',
    lastName: '',
    company: '',
    phone: '',
    email: '',
    projectTypeId: null,
    description: ''
  }

  const summaryTextEditorRef = useRef<ExposeParam>()

  const [formData, setFormData] = useState(defaultData)
  const [errorMessage, setErrorMessage] = useState<any>({})
  const [summaryText, setSummeryText] = useState<any>('')

  const handleReachText = (value: string, field: string) => {
    setFormData({
      ...formData,
      [field]: value
    })
  }

  const handleTextChange = (e: React.ChangeEvent<any>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSelectChange = (e: any) => {
    setFormData({
      ...formData,
      [e?.target?.name]: e?.target?.value
    })
  }

  const onSubmit = (e: React.FormEvent<any>) => {
    e.preventDefault()
    setErrorMessage({})
    setPreload(true)
    if (router?.query['id']) {
      //formData['summaryText'] = formData['phone'] ? null : summaryText
      apiRequest
        .put(`/leads/${router?.query['id']}`, formData)
        .then(res => {
          setListData((prevState: []) => {
            const updatedList: any = [...prevState]
            const editedServiceIndex = updatedList.findIndex(
              (item: any) => item['_id'] === router?.query['id'] // Replace 'id' with the actual identifier of your item
            )
            if (editedServiceIndex !== -1) {
              updatedList[editedServiceIndex] = res?.data
            }
            enqueueSnackbar('Updated Successfully!', { variant: 'success' })
            onClear()
            setPreload(false)

            return updatedList
          })
          router.push('/leads/')
        })
        .catch(error => {
          setPreload(false)
          setErrorMessage(error?.response?.data?.errors)
          enqueueSnackbar(error?.response?.data?.message, { variant: 'error' })
        })
    } else {
      apiRequest
        .post('/leads', formData)
        .then(res => {
          apiRequest.get(`/leads`).then(res => {
            setListData(res?.data)
          })
          enqueueSnackbar('Created Successfully!', { variant: 'success' })

          onClear()
          setPreload(false)
        })
        .catch(error => {
          setPreload(false)
          setErrorMessage(error?.response?.data?.errors)
          enqueueSnackbar(error?.response?.data?.message, { variant: 'error' })
        })
    }
  }

  const getDetails = (id: string | null | undefined) => {
    if (!id) return
    setPreload(true)
    apiRequest.get(`/leads/${id}`).then((res: any) => {
      setFormData({
        firstName: res?.data?.['firstName'],
        lastName: res?.data?.['lastName'],
        company: res?.data?.['company'],
        phone: res?.data?.['phone'],
        email: res?.data?.['email'],
        projectTypeId: res?.data?.['projectTypeId'],
        description: res?.data?.['description']
      })
      setSummeryText(res?.data?.['meetingSummeryText'])
      setSummeryText('')
      setPreload(false)
    })
  }

  useEffect(() => {
    getDetails(router?.query['id'] as string)
  }, [router?.query['id']])

  const onClear = () => {
    setFormData(prevState => ({ ...defaultData }))
    setSummeryText('')
    setErrorMessage({})
  }

  return (
    <Fragment>
      {!!preload && <Preloader close={!preload} />}
      <Box className='p-5 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800'>
        <form onSubmit={onSubmit}>
          <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
            <Box sx={{ width: '50%' }}>
              <label className='block text-sm'>
                <span className='flex text-gray-700 dark:text-gray-400 mb-1'>First Name</span>
                <input
                  className={`block w-full mt-1 text-sm dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input ${
                    errorMessage?.['firstName'] ? 'border-red-600' : 'dark:border-gray-600 '
                  }`}
                  // placeholder='Enter First name'
                  name='firstName'
                  value={formData.firstName}
                  onChange={handleTextChange}
                />
                {!!errorMessage?.['firstName'] &&
                  errorMessage?.['firstName']?.map((message: any, index: number) => {
                    return (
                      <span key={index} className='text-xs text-red-600 dark:text-red-400'>
                        {message}
                      </span>
                    )
                  })}
              </label>
            </Box>
            <Box sx={{ width: '50%' }}>
              <label className='block text-sm'>
                <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Last Name</span>
                <input
                  className={`block w-full mt-1 text-sm dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input ${
                    errorMessage?.['lastName'] ? 'border-red-600' : 'dark:border-gray-600 '
                  }`}
                  // placeholder='Enter Last name'
                  name='lastName'
                  value={formData.lastName}
                  onChange={handleTextChange}
                />
                {!!errorMessage?.['lastName'] &&
                  errorMessage?.['lastName']?.map((message: any, index: number) => {
                    return (
                      <span key={index} className='text-xs text-red-600 dark:text-red-400'>
                        {message}
                      </span>
                    )
                  })}
              </label>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
            <Box sx={{ width: '50%' }}>
              <label className='block text-sm'>
                <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Company</span>
                <input
                  className={`block w-full mt-1 text-sm dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input ${
                    errorMessage?.['company'] ? 'border-red-600' : 'dark:border-gray-600 '
                  }`}
                  // placeholder='Enter company name'
                  name='company'
                  value={formData.company}
                  onChange={handleTextChange}
                />
                {!!errorMessage?.['company'] &&
                  errorMessage?.['company']?.map((message: any, index: number) => {
                    return (
                      <span key={index} className='text-xs text-red-600 dark:text-red-400'>
                        {message}
                      </span>
                    )
                  })}
              </label>
            </Box>
            <Box sx={{ width: '50%' }}>
              <label className='block text-sm'>
                <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Phone</span>
                <input
                  className={`block w-full mt-1 text-sm dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input ${
                    errorMessage?.['phone'] ? 'border-red-600' : 'dark:border-gray-600 '
                  }`}
                  // placeholder='Enter Phone'
                  name='phone'
                  value={formData.phone}
                  onChange={handleTextChange}
                />
                {!!errorMessage?.['phone'] &&
                  errorMessage?.['phone']?.map((message: any, index: number) => {
                    return (
                      <span key={index} className='text-xs text-red-600 dark:text-red-400'>
                        {message}
                      </span>
                    )
                  })}
              </label>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
            <Box sx={{ width: '50%' }}>
              <label className='block text-sm'>
                <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Email</span>
                <input
                  className={`block w-full mt-1 text-sm dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input ${
                    errorMessage?.['email'] ? 'border-red-600' : 'dark:border-gray-600 '
                  }`}
                  // placeholder='Enter Email'
                  name='email'
                  value={formData.email}
                  onChange={handleTextChange}
                />
                {!!errorMessage?.['email'] &&
                  errorMessage?.['email']?.map((message: any, index: number) => {
                    return (
                      <span key={index} className='text-xs text-red-600 dark:text-red-400'>
                        {message}
                      </span>
                    )
                  })}
              </label>
            </Box>
            <Box sx={{ width: '50%' }}>
              <label className='block text-sm'>
                <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Project Type</span>

                <Dropdown
                  url='project-type'
                  name='projectTypeId'
                  value={formData.projectTypeId}
                  onChange={handleSelectChange}
                  className={`block w-full mt-1 text-sm dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input ${
                    errorMessage?.['projectTypeId'] ? 'border-red-600' : 'dark:border-gray-600 '
                  }`}
                  placeholder=''
                />
                {!!errorMessage?.['projectTypeId'] &&
                  errorMessage?.['projectTypeId']?.map((message: any, index: number) => {
                    return (
                      <span key={index} className='text-xs text-red-600 dark:text-red-400'>
                        {message}
                      </span>
                    )
                  })}
              </label>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
            <Box sx={{ width: '100%' }}>
              <label className='block text-sm'>
                <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Description</span>
              </label>
              <RichTextEditor
                value={formData.description}
                onBlur={newContent => handleReachText(newContent, 'description')}
              />
            </Box>
          </Box>

          <Box className='my-4 text-right'>
            {router?.query['id'] ? (
              <Link href={`/leads/`} passHref>
                <Box
                  sx={{ cursor: 'pointer' }}
                  component={'a'}
                  className='px-4 py-2 mr-3 inline-block text-sm font-medium leading-5 text-white transition-colors duration-150 bg-red-600 border border-transparent rounded-lg active:bg-red-600 hover:bg-red-700 focus:outline-none focus:shadow-outline-red'
                  aria-label='View'
                >
                  Cancel
                  <ClearIcon />
                </Box>
              </Link>
            ) : (
              <button
                onClick={onClear}
                type='button'
                className='px-4 py-2 mr-3 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-red-600 border border-transparent rounded-lg active:bg-red-600 hover:bg-red-700 focus:outline-none focus:shadow-outline-red'
              >
                Clear <PlaylistRemoveIcon />
              </button>
            )}

            <button
              type='submit'
              className='px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-green-600 border border-transparent rounded-lg active:bg-green-600 hover:bg-green-700 focus:outline-none focus:shadow-outline-green'
            >
              {router?.query['id'] ? 'Update ' : 'Save '}

              {router?.query['id'] ? <EditNoteIcon /> : <AddIcon />}
            </button>
          </Box>
        </form>
      </Box>
    </Fragment>
  )
}
