import AddIcon from '@material-ui/icons/Add'
import ClearIcon from '@material-ui/icons/Clear'
import EditNoteIcon from '@mui/icons-material/EditNote'
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove'
import { Box } from '@mui/material'
import { useSnackbar } from 'notistack'
import { Fragment, useEffect, useState } from 'react'
import apiRequest from 'src/@core/utils/axios-config'
import { THourlyRatesComponent } from '../HourlyRates.decorator'

export default function HourlyRatesFormComponent(props: THourlyRatesComponent) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const { editDataId, setEditDataId, listData, setListData, editData, setEditData } = props

  const defaultData = {
    name: '',
    average_hourly: ''
  }

  const [formData, setFormData] = useState(defaultData)
  const [errorMessage, setErrorMessage] = useState<any>({})

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
    if (editDataId) {
      apiRequest
        .put(`/employee-roles/${editDataId}`, formData)
        .then(res => {
          setListData((prevState: []) => {
            const updatedList: any = [...prevState]
            const editedHourlyRatesIndex = updatedList.findIndex((item: any) => item['id'] === editDataId)
            if (editedHourlyRatesIndex !== -1) {
              updatedList[editedHourlyRatesIndex] = res?.data
            }
            enqueueSnackbar('Created Successfully!', { variant: 'success' })

            onClear()

            return updatedList
          })
        })
        .catch(error => {
          setErrorMessage(error?.response?.data?.errors)
          enqueueSnackbar(error?.response?.data?.message, { variant: 'error' })
        })
    } else {
      apiRequest
        .post('/employee-roles', formData)
        .then(res => {
          setListData((prevState: []) => [...prevState, res?.data])
          enqueueSnackbar('Created Successfully!', { variant: 'success' })
          onClear()
        })
        .catch(error => {
          setErrorMessage(error?.response?.data?.errors)
          enqueueSnackbar(error?.response?.data?.message, { variant: 'error' })
        })
    }
  }

  useEffect(() => {
    setFormData({
      name: editData?.['name'],
      average_hourly: editData?.['average_hourly']
    })
  }, [editDataId, editData])

  const onClear = () => {
    setFormData(prevState => ({ ...defaultData }))
    setEditDataId(null)
    setEditData({})
    setErrorMessage({})
  }

  return (
    <Fragment>
      <Box className='p-5 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800'>
        <form onSubmit={onSubmit}>
          <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
            <Box sx={{ width: '100%' }}>
              <label className='block text-sm'>
                <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Role Name</span>
                <input
                  className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                  // placeholder='Enter role name'
                  name='name'
                  value={formData.name}
                  onChange={handleTextChange}
                />
                {!!errorMessage?.['name'] &&
                  errorMessage?.['name']?.map((message: any, index: number) => {
                    return (
                      <span key={index} className='text-xs text-red-600 dark:text-red-400'>
                        {message}
                      </span>
                    )
                  })}
              </label>
            </Box>
            <Box sx={{ width: '100%' }}>
              <label className='block text-sm'>
                <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Hourly Rate</span>
                <input
                  className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                  // placeholder='Enter hourly rate'
                  name='average_hourly'
                  value={formData.average_hourly}
                  onChange={handleTextChange}
                  type='number'
                />
                {!!errorMessage?.['average_hourly'] &&
                  errorMessage?.['average_hourly']?.map((message: any, index: number) => {
                    return (
                      <span key={index} className='text-xs text-red-600 dark:text-red-400'>
                        {message}
                      </span>
                    )
                  })}
              </label>
            </Box>
          </Box>

          <Box className='my-4 text-right'>
            <button
              onClick={onClear}
              type='button'
              className='px-4 py-2 mr-3 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-red-600 border border-transparent rounded-lg active:bg-red-600 hover:bg-red-700 focus:outline-none focus:shadow-outline-red'
            >
              {editDataId ? 'Cancel ' : 'Clear '}
              {editDataId ? <ClearIcon /> : <PlaylistRemoveIcon />}
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
