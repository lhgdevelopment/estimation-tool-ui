import { Dropdown } from '@core/components/dropdown'
import Preloader from '@core/components/preloader'
import { RichTextEditor } from '@core/components/rich-text-editor'
import { useToastSnackbar } from '@core/hooks/useToastSnackbar'
import apiRequest from '@core/utils/axios-config'
import AddIcon from '@material-ui/icons/Add'
import ClearIcon from '@material-ui/icons/Clear'
import EditNoteIcon from '@mui/icons-material/EditNote'
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove'
import { Box, Checkbox, TextField } from '@mui/material'
import 'md-editor-rt/lib/style.css'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Fragment, useEffect, useState } from 'react'
import { TMeetingSummaryComponent } from '../MeetingSummary.decorator'

export default function MeetingSummaryFormComponent(props: TMeetingSummaryComponent) {
  const { showSnackbar } = useToastSnackbar()
  const { listData, setListData } = props
  const [preload, setPreload] = useState<boolean>(false)
  const router = useRouter()

  const defaultData = {
    meetingName: '',
    meetingType: null,
    transcriptText: '',
    summaryText: '',
    clickupLink: '',
    tldvLink: '',
    pushToClickUp: false,
    is_private: false
  }

  const [formData, setFormData] = useState(defaultData)
  const [errorMessage, setErrorMessage] = useState<any>({})
  const [summaryText, setSummaryText] = useState<any>('')

  const handleTextChange = (e: React.ChangeEvent<any>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleReachText = (value: string, field: string) => {
    setFormData({
      ...formData,
      [field]: value
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
      formData['summaryText'] = summaryText
      apiRequest
        .put(`/meeting-summery/${router?.query['id']}`, formData)
        .then((res: any) => {
          setListData((prevState: []) => {
            const updatedList: any = [...prevState]
            const editedServiceIndex = updatedList.findIndex(
              (item: any) => item['_id'] === router?.query['id'] // Replace 'id' with the actual identifier of your item
            )
            if (editedServiceIndex !== -1) {
              updatedList[editedServiceIndex] = res?.data
            }

            return updatedList
          })
          setPreload(false)
          onClear()
          showSnackbar('Updated Successfully!', { variant: 'success' })
          router.push('/meeting-summary/')
        })
        .catch((err: any) => {
          setPreload(false)
          setErrorMessage(err?.data?.errors)
          showSnackbar(err?.data?.message, { variant: 'error' })
        })
    } else {
      apiRequest
        .post('/meeting-summery', formData)
        .then((res: any) => {
          apiRequest.get(`/meeting-summery`).then((res: any) => {
            setListData(res?.data)
          })
          showSnackbar('Created Successfully!', { variant: 'success' })
          onClear()
          setPreload(false)
        })
        .catch((err: any) => {
          setPreload(false)
          setErrorMessage(err?.data?.errors)
          showSnackbar(err?.data?.message, { variant: 'error' })
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
        pushToClickUp: false,
        is_private: res?.data?.['is_private']
      })
      setSummaryText(res?.data?.['summaryText'])
      setPreload(false)
    })
  }

  useEffect(() => {
    getDetails(router?.query['id'] as string)
  }, [router?.query['id']])

  const onClear = () => {
    setFormData(prevState => ({ ...defaultData }))
    setSummaryText('')
    setErrorMessage({})
  }

  return (
    <Fragment>
      {!!preload && <Preloader />}
      <Box className='p-5 mb-8 bg-white rounded-lg shadow-md dark-d:bg-gray-800'>
        <form onSubmit={onSubmit}>
          <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
            <Box sx={{ width: '50%' }}>
              <TextField
                label={'Meeting Name'}
                name='meetingName'
                value={formData.meetingName}
                onChange={handleTextChange}
                error={errorMessage?.['meetingName']}
                fullWidth
              />
              {!!errorMessage?.['meetingName'] &&
                errorMessage?.['meetingName']?.map((message: any, index: number) => {
                  return (
                    <span key={index} className='text-xs text-red-600 dark-d:text-red-400'>
                      {message}
                    </span>
                  )
                })}
            </Box>
            <Box sx={{ width: '50%' }}>
              <Dropdown
                label={'Meeting Type'}
                url='meeting-type'
                name='meetingType'
                value={formData.meetingType}
                onChange={handleSelectChange}
                placeholder=''
                error={!!errorMessage?.['meetingType']}
              />
              {!!errorMessage?.['meetingType'] &&
                errorMessage?.['meetingType']?.map((message: any, index: number) => {
                  return (
                    <span key={index} className='text-xs text-red-600 dark-d:text-red-400'>
                      {message}
                    </span>
                  )
                })}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
            <Box sx={{ width: '50%' }}>
              <TextField
                label={'Clickup Link'}
                name='clickupLink'
                value={formData.clickupLink}
                onChange={handleTextChange}
                error={errorMessage?.['clickupLink']}
                fullWidth
              />
              {!!errorMessage?.['clickupLink'] &&
                errorMessage?.['clickupLink']?.map((message: any, index: number) => {
                  return (
                    <span key={index} className='text-xs text-red-600 dark-d:text-red-400'>
                      {message}
                    </span>
                  )
                })}
            </Box>
            <Box sx={{ width: '50%' }}>
              <TextField
                label={'TLDV Link'}
                name='tldvLink'
                value={formData.tldvLink}
                onChange={handleTextChange}
                error={errorMessage?.['tldvLink']}
                fullWidth
              />
              {!!errorMessage?.['tldvLink'] &&
                errorMessage?.['tldvLink']?.map((message: any, index: number) => {
                  return (
                    <span key={index} className='text-xs text-red-600 dark-d:text-red-400'>
                      {message}
                    </span>
                  )
                })}
            </Box>
          </Box>

          {!!router?.query['id'] && (
            <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
              <Box sx={{ width: '50%' }}>
                <label className='block text-sm' htmlFor='pushToClickUp'>
                  <span className='text-gray-700 dark-d:text-gray-400 mr-2'>Push to clickup</span>
                  <Checkbox
                    id='pushToClickUp'
                    className='h-6 w-6 border-purple-600 text-purple-600 form-checkbox focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark-d:focus:shadow-outline-gray'
                    name='pushToClickUp'
                    checked={formData.pushToClickUp}
                    onChange={handleCheckChange}
                  />
                  {!!errorMessage?.['pushToClickUp'] &&
                    errorMessage?.['pushToClickUp']?.map((message: any, index: number) => (
                      <span key={index} className='text-xs text-red-600 dark-d:text-red-400'>
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
                  <span className='text-gray-700 dark-d:text-gray-400'>Transcript Text</span>
                  <textarea
                    className='block w-full mt-1 text-sm dark-d:border-gray-600 dark-d:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark-d:text-gray-300 dark-d:focus:shadow-outline-gray form-input'
                    /* placeholder='Examples: Transcript Text' */
                    name='transcriptText'
                    rows={10}
                    value={formData.transcriptText}
                    onChange={handleTextChange}
                  />
                  {!!errorMessage?.['transcriptText'] &&
                    errorMessage?.['transcriptText']?.map((message: any, index: number) => {
                      return (
                        <span key={index} className='text-xs text-red-600 dark-d:text-red-400'>
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
                  <span className='flex text-gray-700 dark-d:text-gray-400 mb-1'>Meeting Summary Text</span>
                  <RichTextEditor value={summaryText} onChange={setSummaryText} />

                  {!!errorMessage?.['summaryText'] &&
                    errorMessage?.['summaryText']?.map((message: any, index: number) => {
                      return (
                        <span key={index} className='text-xs text-red-600 dark-d:text-red-400'>
                          {message}
                        </span>
                      )
                    })}
                </label>
              </Box>
            </Box>
          )}

          <Box sx={{ display: 'flex', gap: 5, mt: 5 }}>
            <Box sx={{ width: '100%' }}>
              <label className='block text-sm' htmlFor='is_private'>
                <span className='text-gray-700 dark-d:text-gray-400 mr-2'>Private?</span>
                <Checkbox
                  id='is_private'
                  className='h-6 w-6 border-purple-600 text-purple-600 form-checkbox focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark-d:focus:shadow-outline-gray'
                  name='is_private'
                  checked={formData.is_private}
                  onChange={handleCheckChange}
                />
                {!!errorMessage?.['is_private'] &&
                  errorMessage?.['is_private']?.map((message: any, index: number) => (
                    <span key={index} className='text-xs text-red-600 dark-d:text-red-400'>
                      {message}
                    </span>
                  ))}
              </label>
            </Box>
          </Box>

          <Box className='my-4 text-right'>
            {router?.query['id'] ? (
              <Link href={`/meeting-summary/`} passHref>
                <Box
                  sx={{ cursor: 'pointer' }}
                  component={'span'}
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
