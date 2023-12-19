import AddIcon from '@material-ui/icons/Add'
import ClearIcon from '@material-ui/icons/Clear'
import EditNoteIcon from '@mui/icons-material/EditNote'
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove'
import { Box } from '@mui/material'
import '@uiw/react-md-editor/markdown-editor.css'
import { ExposeParam, MdEditor } from 'md-editor-rt'
import 'md-editor-rt/lib/style.css'
import { Fragment, useEffect, useRef, useState } from 'react'
import { Dropdown } from 'src/@core/components/dropdown'
import apiRequest from 'src/@core/utils/axios-config'
import Swal from 'sweetalert2'
import { MeetingTypeList, TMeetingSummeryComponent } from '../MeetingSummery.decorator'

export default function MeetingSummeryFormComponent(props: TMeetingSummeryComponent) {
  const { editDataId, setEditDataId, listData, setListData, editData, setEditData } = props

  const defaultData = {
    meetingName: '',
    meetingType: null,
    transcriptText: '',
    summaryText: '',
    clickupLink: '',
    tldvLink: ''
  }

  const summaryTextEditorRef = useRef<ExposeParam>()

  const [formData, setFormData] = useState(defaultData)
  const [errorMessage, setSrrorMessage] = useState<any>({})
  const [meetingSummeryText, setMeetingSummeryText] = useState<any>('')

  const handleChange = (e: React.ChangeEvent<any>) => {
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
    if (editDataId) {
      apiRequest
        .put(`/meeting-summery/${editDataId}`, formData)
        .then(res => {
          setListData((prevState: []) => {
            const updatedList: any = [...prevState]
            const editedServiceIndex = updatedList.findIndex(
              (item: any) => item['_id'] === editDataId // Replace 'id' with the actual identifier of your item
            )
            if (editedServiceIndex !== -1) {
              updatedList[editedServiceIndex] = res.data
            }
            Swal.fire({
              title: 'Data Updated Successfully!',
              icon: 'success',
              timer: 1000,
              timerProgressBar: true,
              showConfirmButton: false
            })
            onClear()

            return updatedList
          })
        })
        .catch(error => {
          setSrrorMessage(error?.response?.data?.errors)
        })
    } else {
      apiRequest
        .post('/meeting-summery', formData)
        .then(res => {
          setListData((prevState: []) => [...prevState, res.data])
          Swal.fire({
            title: 'Data Created Successfully!',
            icon: 'success',
            timer: 1000,
            timerProgressBar: true,
            showConfirmButton: false
          })
          onClear()
        })
        .catch(error => {
          setSrrorMessage(error?.response?.data?.errors)
        })
    }
  }

  useEffect(() => {
    setFormData({
      meetingName: editData?.['meetingName'],
      meetingType: editData?.['meetingType'],
      transcriptText: editData?.['transcriptText'],
      summaryText: editData?.['meetingSummeryText'],
      clickupLink: editData?.['clickupLink'],
      tldvLink: editData?.['tldvLink'],
    })
    setMeetingSummeryText(editData?.['meetingSummeryText'])
  }, [editDataId, editData])

  const onClear = () => {
    setFormData(prevState => ({ ...defaultData }))
    setEditDataId(null)
    setEditData({})
  }

  return (
    <Fragment>
      <Box className='p-5 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800'>
        <form onSubmit={onSubmit}>
          <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
            <Box sx={{ width: '50%' }}>
              <label className='block text-sm'>
                <span className='text-gray-700 dark:text-gray-400'>Meeting Name</span>
                <input
                  className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
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
                  isEnumField
                  enumList={MeetingTypeList}
                  name='meetingType'
                  value={formData.meetingType}
                  onChange={handleSelectChange}
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
                  className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
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
                  className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
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
          <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
            <Box sx={{ width: '100%' }}>
              <label className='block text-sm'>
                <span className='text-gray-700 dark:text-gray-400'>Transcript Text</span>
                <textarea
                  className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
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
          {!!meetingSummeryText && (
            <Box sx={{ display: 'flex', gap: 5 }}>
              <Box sx={{ width: '100%' }}>
                <label className='block text-sm' htmlFor={'#summaryText'}>
                  <span className='text-gray-700 dark:text-gray-400'>Meeting Summery Text</span>

                  <MdEditor
                    ref={summaryTextEditorRef}
                    modelValue={meetingSummeryText}
                    onChange={setMeetingSummeryText}
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
            <button
              onClick={onClear}
              type='button'
              className='px-4 py-2 mr-3 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-red-600 border border-transparent rounded-lg active:bg-red-600 hover:bg-red-700 focus:outline-none focus:shadow-outline-red'
            >
              {editDataId ? 'Cancel ' : 'Clear '}
              {editDataId ? <PlaylistRemoveIcon /> : <ClearIcon />}
            </button>
            <button
              type='submit'
              className='px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-green-600 border border-transparent rounded-lg active:bg-green-600 hover:bg-green-700 focus:outline-none focus:shadow-outline-green'
            >
              {editDataId ? 'Update ' : 'Save '}

              {editDataId ? <EditNoteIcon /> : <AddIcon />}
            </button>
          </Box>
        </form>
      </Box>
    </Fragment>
  )
}
