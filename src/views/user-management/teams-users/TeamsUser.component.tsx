import { Box } from '@mui/material'
import {useCallback, useEffect, useState} from 'react'
import TeamsUserFormComponent from './form/TeamsUser.form.component'
import TeamsUserListComponent from './list/TeamsUser.list.component'
import apiRequest from "../../../@core/utils/axios-config";
import {useRouter} from "next/router";
import Error404 from "../../../pages/404";


export default function TeamsUserComponent() {
  const [ editDataId, setEditDataId] = useState<null | string>(null)
  const [ listData, setListData] = useState<any>([])
  const [ editData, setEditData] = useState<any>({})
  const [ teamInfo, setTeamInfo] = useState<any>({})
  const [ notFound, setNotFound] = useState<any>(false)
  const { query } = useRouter();


  const getTeamInfo = useCallback((page = 1) => {
    apiRequest.get(`/teams/${query.id}`).then(res => {
      setTeamInfo(res?.data)
      setNotFound(false);
    }).catch(()=> {
      setNotFound(true);
    })
  },[query.id, setTeamInfo])
  useEffect(() => {
    getTeamInfo()
  }, [getTeamInfo]);
  if(notFound){
    return <Error404 />
  }

return (
    <>
      <Box className='container px-6 mx-auto'>
        <Box component={'h1'} className='mt-5 mb-4 text-xl font-semibold text-gray-600 dark:text-gray-300'>
          Add User to {teamInfo.name}
        </Box>
        <TeamsUserFormComponent
          setEditDataId={setEditDataId}
          editDataId={editDataId}
          listData={listData}
          setListData={setListData}
          editData={editData}
          setEditData={setEditData}
        />
        <TeamsUserListComponent
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
