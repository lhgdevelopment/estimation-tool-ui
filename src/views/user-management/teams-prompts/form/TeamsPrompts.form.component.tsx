import AddIcon from '@material-ui/icons/Add'
import ClearIcon from '@material-ui/icons/Clear'
import EditNoteIcon from '@mui/icons-material/EditNote'
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove'
import { Box, TextField } from '@mui/material'
import {Fragment, useCallback, useEffect, useState} from 'react'
import { Dropdown } from '@core/components/dropdown'
import { useToastSnackbar } from '@core/hooks/useToastSnackbar'
import apiRequest from '@core/utils/axios-config'
import { TUsersComponent } from '../TeamsPrompts.decorator'
import {useRouter} from "next/router";
import _default from "chart.js/dist/plugins/plugin.tooltip";
import callbacks = _default.descriptors.callbacks;

export default function TeamsPromptsFormComponent(props: TUsersComponent) {
  const { showSnackbar } = useToastSnackbar()
  const { query } = useRouter();
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [ listData, setListData] = useState<any>([])
  const { editDataId, setEditDataId, editData, setEditData } = props

  const defaultData = {
    promptIds: [],
  }

  const [formData, setUsersFormData] = useState({...defaultData})
  const [errorMessage, setErrorMessage] = useState<any>({})

  const getList = useCallback(() => {
    setIsLoading(true);
    apiRequest.get(`/teams/${query.id}/share/prompts`).then(res => {
      setListData(res?.data)
    }).finally(()=>{
      setIsLoading(false);
    })
  }, [query.id, setIsLoading, setListData])

  useEffect(() => {
    getList()
  }, [getList])

  const handleTextChange = (e: React.ChangeEvent<any>) => {
    setUsersFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSelectChange = (e: any) => {
    setUsersFormData({
      ...formData,
      [e?.target?.name]: e?.target?.value
    })
  }

  const onSubmit = (e: React.FormEvent<any>) => {
    e.preventDefault()
    apiRequest
      .post(`/teams/${query.id}/share/prompts`, formData)
      .then(res => {
        setListData((prevState: []) => [...prevState, ...res?.data])
        showSnackbar('Created Successfully!', { variant: 'success' })
        onClear()
      })
      .catch(error => {
        setErrorMessage(error?.response?.data?.errors)
        showSnackbar(error?.response?.data?.message, { variant: 'error' })
      })
  }

  useEffect(() => {
    setUsersFormData({
      promptIds: editData?.['promptIds'] || '',
    })
  }, [editDataId, editData])

  const onClear = () => {
    setUsersFormData(prevState => ({ ...defaultData }))
    setEditDataId(null)
    setEditData({})
  }

  return (
    <Fragment>
      <Box className='p-5 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800'>
        <form onSubmit={onSubmit}>
          <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
            <Box sx={{ width: '100%' }}>
              <Dropdown
                url={'prompts'}
                placeholder='Add prompt for share with'
                label={'Add prompt for share with'}
                value={formData.promptIds}
                name="promptIds"
                onChange={handleTextChange as any}
                multiple
                filter={(items)=>{
                  return items;
                }}
              />
              {!!errorMessage?.['promptIds'] &&
                errorMessage?.['promptIds']?.map((message: any, index: number) => {
                  return (
                    <span key={index} className='text-xs text-red-600 dark:text-red-400'>
                      {message}
                    </span>
                  )
                })}
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
