import AddIcon from '@material-ui/icons/Add'
import ClearIcon from '@material-ui/icons/Clear'
import EditNoteIcon from '@mui/icons-material/EditNote'
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove'
import { Box } from '@mui/material'
import { ExposeParam, MdEditor } from 'md-editor-rt'
import 'md-editor-rt/lib/style.css'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import { Fragment, useEffect, useRef, useState } from 'react'
import { Dropdown } from 'src/@core/components/dropdown'
import Preloader from 'src/@core/components/preloader'
import apiRequest from 'src/@core/utils/axios-config'
import Swal from 'sweetalert2'
import { TMeetingSummeryComponent } from '../MeetingSummery.decorator'

export default function MeetingSummeryFormComponent(props: TMeetingSummeryComponent) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const { listData, setListData, isEdit } = props
  const [preload, setPreload] = useState<boolean>(false)
  const router = useRouter()

  const defaultData = {
    meetingName: '',
    meetingType: null,
    transcriptText: '',
    summaryText: '',
    clickupLink: '',
    tldvLink: '',
    pushToClickUp: false
  }

  const summaryTextEditorRef = useRef<ExposeParam>()

  const [formData, setFormData] = useState(defaultData)
  const [errorMessage, setErrorMessage] = useState<any>({})
  const [summaryText, setSummeryText] = useState<any>('')

  const handleChange = (e: React.ChangeEvent<any>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleCheckChange = (e: React.ChangeEvent<any>) => {
    const { name, checked } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: checked
    }))
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
      // formData['summaryText'] = formData['tldvLink'] ? null : summaryText
      apiRequest
        .put(`/meeting-summery/${router?.query['id']}`, formData)
        .then(res => {
          setListData((prevState: []) => {
            const updatedList: any = [...prevState]
            const editedServiceIndex = updatedList.findIndex(
              (item: any) => item['_id'] === router?.query['id'] // Replace 'id' with the actual identifier of your item
            )
            if (editedServiceIndex !== -1) {
              updatedList[editedServiceIndex] = res?.data
            }
            Swal.fire({
              title: 'Data Updated Successfully!',
              icon: 'success',
              timer: 1000,
              timerProgressBar: true,
              showConfirmButton: false
            })
            onClear()
            setPreload(false)

            return updatedList
          })
          router.push('/meeting-summery/')
        })
        .catch(error => {
          setPreload(false)
          setErrorMessage(error?.response?.data?.errors)
          enqueueSnackbar(error?.response?.data?.message, { variant: 'error' })
        })
    } else {
      apiRequest
        .post('/meeting-summery', formData)
        .then(res => {
          apiRequest.get(`/meeting-summery`).then(res => {
            setListData(res?.data)
          })
          Swal.fire({
            title: 'Data Created Successfully!',
            icon: 'success',
            timer: 1000,
            timerProgressBar: true,
            showConfirmButton: false
          })
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
    apiRequest.get(`/meeting-summery/${id}`).then((res: any) => {
      setFormData({
        meetingName: res?.data?.['meetingName'],
        meetingType: res?.data?.['meetingType'],
        transcriptText: res?.data?.['transcriptText'],
        summaryText: res?.data?.['meetingSummeryText'],
        clickupLink: res?.data?.['clickupLink'],
        tldvLink: res?.data?.['tldvLink'],
        pushToClickUp: false
      })
      setSummeryText(res?.data?.['summaryText'])
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
                <span className='text-gray-700 dark:text-gray-400'>Meeting Name</span>
                <input
                  className={`block w-full mt-1 text-sm dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input ${
                    errorMessage?.['meetingName'] ? 'border-red-600' : 'dark:border-gray-600 '
                  }`}
                  placeholder='Enter meeting name'
                  name='meetingName'
                  value={formData.meetingName}
                  onChange={handleChange}
                />
                {!!errorMessage?.['meetingName'] &&
                  errorMessage?.['meetingName']?.map((message: any, index: number) => {
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
                <span className='text-gray-700 dark:text-gray-400'>Meeting Type</span>

                <Dropdown
                  url='meeting-type'
                  name='meetingType'
                  value={formData.meetingType}
                  onChange={handleSelectChange}
                  className={`block w-full mt-1 text-sm dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input ${
                    errorMessage?.['meetingType'] ? 'border-red-600' : 'dark:border-gray-600 '
                  }`}
                />
                {!!errorMessage?.['meetingType'] &&
                  errorMessage?.['meetingType']?.map((message: any, index: number) => {
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
                <span className='text-gray-700 dark:text-gray-400'>Clickup Link</span>
                <input
                  className={`block w-full mt-1 text-sm dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input ${
                    errorMessage?.['clickupLink'] ? 'border-red-600' : 'dark:border-gray-600 '
                  }`}
                  placeholder='Enter clickup task link'
                  name='clickupLink'
                  value={formData.clickupLink}
                  onChange={handleChange}
                />
                {!!errorMessage?.['clickupLink'] &&
                  errorMessage?.['clickupLink']?.map((message: any, index: number) => {
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
                <span className='text-gray-700 dark:text-gray-400'>TLDV Link</span>
                <input
                  className={`block w-full mt-1 text-sm dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input ${
                    errorMessage?.['tldvLink'] ? 'border-red-600' : 'dark:border-gray-600 '
                  }`}
                  placeholder='Enter tldv link'
                  name='tldvLink'
                  value={formData.tldvLink}
                  onChange={handleChange}
                />
                {!!errorMessage?.['tldvLink'] &&
                  errorMessage?.['tldvLink']?.map((message: any, index: number) => {
                    return (
                      <span key={index} className='text-xs text-red-600 dark:text-red-400'>
                        {message}
                      </span>
                    )
                  })}
              </label>
            </Box>
          </Box>

          {!!router?.query['id'] && (
            <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
              <Box sx={{ width: '50%' }}>
                <label className='block text-sm' htmlFor='pushToClickUp'>
                  <span className='text-gray-700 dark:text-gray-400 mr-2'>Push to clickup</span>
                  <input
                    id='pushToClickUp'
                    type='checkbox'
                    className='h-6 w-6 border-purple-600 text-purple-600 form-checkbox focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray'
                    name='pushToClickUp'
                    checked={formData.pushToClickUp}
                    onChange={handleCheckChange}
                  />
                  {!!errorMessage?.['pushToClickUp'] &&
                    errorMessage?.['pushToClickUp']?.map((message: any, index: number) => (
                      <span key={index} className='text-xs text-red-600 dark:text-red-400'>
                        {message}
                      </span>
                    ))}
                </label>
              </Box>
            </Box>
          )}

          {!formData.tldvLink && (
            <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
              <Box sx={{ width: '100%' }}>
                <label className='block text-sm'>
                  <span className='text-gray-700 dark:text-gray-400'>Transcript Text</span>
                  <textarea
                    className={`block w-full mt-1 text-sm dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input ${
                      errorMessage?.['transcriptText'] ? 'border-red-600' : 'dark:border-gray-600 '
                    }`}
                    placeholder='Examples: Transcript Text'
                    name='transcriptText'
                    rows={10}
                    value={formData.transcriptText}
                    onChange={handleChange}
                  />
                  {!!errorMessage?.['transcriptText'] &&
                    errorMessage?.['transcriptText']?.map((message: any, index: number) => {
                      return (
                        <span key={index} className='text-xs text-red-600 dark:text-red-400'>
                          {message}
                        </span>
                      )
                    })}
                </label>
              </Box>
            </Box>
          )}

          {!!router?.query['id'] && (
            <Box sx={{ display: 'flex', gap: 5 }}>
              <Box sx={{ width: '100%' }}>
                <label className='block text-sm' htmlFor={'#summaryText'}>
                  <span className='text-gray-700 dark:text-gray-400'>Meeting Summery Text</span>

                  <MdEditor
                    ref={summaryTextEditorRef}
                    modelValue={summaryText}
                    onChange={setSummeryText}
                    language='en-US'
                  />
                  {!!errorMessage?.['summaryText'] &&
                    errorMessage?.['summaryText']?.map((message: any, index: number) => {
                      return (
                        <span key={index} className='text-xs text-red-600 dark:text-red-400'>
                          {message}
                        </span>
                      )
                    })}
                </label>
              </Box>
            </Box>
          )}

          <Box className='my-4 text-right'>
            {router?.query['id'] ? (
              <Link href={`/meeting-summery/`} passHref>
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
