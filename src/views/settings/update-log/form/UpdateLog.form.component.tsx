import AddIcon from '@material-ui/icons/Add'
import ClearIcon from '@material-ui/icons/Clear'
import EditNoteIcon from '@mui/icons-material/EditNote'
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove'
import { Box } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import { ExposeParam } from 'md-editor-rt'
import 'md-editor-rt/lib/style.css'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import { Fragment, useEffect, useRef, useState } from 'react'
import Preloader from 'src/@core/components/preloader'
import { RichTextEditor } from 'src/@core/components/rich-text-editor'
import apiRequest from 'src/@core/utils/axios-config'
import { TUpdateLogComponent } from '../UpdateLog.decorator'

export default function UpdateLogFormComponent(props: TUpdateLogComponent) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const { listData, setListData, isEdit } = props
  const [preload, setPreload] = useState<boolean>(false)
  const router = useRouter()

  const defaultData = {
    date: dayjs(Date.now()).format('YYYY/MM/DD'),
    deployed: '',
    next: ''
  }

  const summaryTextEditorRef = useRef<ExposeParam>()

  const [formData, setFormData] = useState(defaultData)
  const [errorMessage, setErrorMessage] = useState<any>({})
  const [summaryText, setSummaryText] = useState<any>('')

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

  const handleDateChange = (date: string | null, field: string) => {
    setFormData({
      ...formData,
      [field]: date
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
        .put(`/update-logs/${router?.query['id']}`, formData)
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
            router.push('/settings/update-log/')

            return updatedList
          })
        })
        .catch(error => {
          setPreload(false)
          setErrorMessage(error?.response?.data?.errors)
          enqueueSnackbar(error?.response?.data?.message, { variant: 'error' })
        })
    } else {
      apiRequest
        .post('/update-logs', formData)
        .then(res => {
          apiRequest.get(`/update-logs`).then(res => {
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
    apiRequest.get(`/update-logs/${id}`).then((res: any) => {
      setFormData({
        date: res?.data?.['date'],
        deployed: res?.data?.['deployed'],
        next: res?.data?.['next']
      })
      setSummaryText(res?.data?.['meetingSummaryText'])
      setSummaryText('')
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
      {!!preload && <Preloader close={!preload} />}
      <Box className='p-5 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800'>
        <form onSubmit={onSubmit}>
          <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
            <Box sx={{ width: '100%' }}>
              <label className='block text-sm'>
                <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Date</span>

                <DatePicker
                  className={`block w-full mt-1 text-sm dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input ${
                    errorMessage?.['date'] ? 'border-red-600' : 'dark:border-gray-600 '
                  }`}
                  sx={{ width: '100%' }}
                  name='date'
                  value={dayjs(formData.date)}
                  onChange={date => handleDateChange(dayjs(date).format('YYYY/MM/DD'), 'date')}
                  format='YYYY/MM/DD'
                />

                {!!errorMessage?.['date'] &&
                  errorMessage?.['date']?.map((message: any, index: number) => {
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
                <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Deployed</span>
              </label>
              <RichTextEditor
                value={formData.deployed}
                onBlur={newContent => handleReachText(newContent, 'deployed')}
              />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
            <Box sx={{ width: '100%' }}>
              <label className='block text-sm'>
                <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Next</span>
              </label>
              <RichTextEditor value={formData.next} onBlur={newContent => handleReachText(newContent, 'next')} />
            </Box>
          </Box>

          <Box className='my-4 text-right'>
            {router?.query['id'] ? (
              <Link href={`/settings/update-log/`} passHref>
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
