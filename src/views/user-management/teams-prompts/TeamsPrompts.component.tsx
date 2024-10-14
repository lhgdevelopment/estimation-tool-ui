import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Box } from '@mui/material'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import apiRequest from '../../../@core/utils/axios-config'
import Error404 from '../../../pages/404'
import TeamsPromptsFormComponent from './form/TeamsPrompts.form.component'
import TeamsPromptsListComponent from './list/TeamsPrompts.list.component'

export default function TeamsPromptsComponent() {
  const [editDataId, setEditDataId] = useState<null | string>(null)
  const [listData, setListData] = useState<any>([])
  const [editData, setEditData] = useState<any>({})
  const [teamInfo, setTeamInfo] = useState<any>({})
  const [notFound, setNotFound] = useState<any>(false)
  const { query } = useRouter()

  const getTeamInfo = useCallback(
    (page = 1) => {
      apiRequest
        .get(`/teams/${query.id}`)
        .then(res => {
          setTeamInfo(res?.data)
          setNotFound(false)
        })
        .catch(() => {
          setNotFound(true)
        })
    },
    [query.id, setTeamInfo]
  )
  useEffect(() => {
    getTeamInfo()
  }, [getTeamInfo])
  if (notFound) {
    return <Error404 />
  }

  return (
    <>
      <Box className='container px-6 mx-auto'>
        <Link href={`/user-management/teams`} passHref>
          <Box
            component={'h1'}
            className='mt-5 mb-4 text-xl font-semibold text-gray-600 dark-d:text-gray-300 cursor-pointer'
          >
            <ArrowBackIcon /> Back
          </Box>
        </Link>
        <Box component={'h1'} className='mt-5 mb-4 text-xl font-semibold text-gray-600 dark-d:text-gray-300'>
          Add Prompt to {teamInfo.name}
        </Box>
        <TeamsPromptsFormComponent
          setEditDataId={setEditDataId}
          editDataId={editDataId}
          listData={listData}
          setListData={setListData}
          editData={editData}
          setEditData={setEditData}
        />
        <TeamsPromptsListComponent
          setEditDataId={setEditDataId}
          editDataId={editDataId}
          listData={listData}
          setListData={setListData}
          editData={editData}
          setEditData={setEditData}
        />
      </Box>
    </>
  )
}
