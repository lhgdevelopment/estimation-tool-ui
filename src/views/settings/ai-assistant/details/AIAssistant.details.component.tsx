import { Box } from '@mui/material'
import 'md-editor-rt/lib/style.css'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Preloader from 'src/@core/components/preloader'
import apiRequest from 'src/@core/utils/axios-config'

export default function AIAssistantDetailsComponent() {
  const meetingId = useRouter()?.query['id']

  const [preload, setPreload] = useState<boolean>(false)
  const [detailsData, setDetailsData] = useState<any>({})
  const getDetails = () => {
    setPreload(true)
    apiRequest.get(`/conversations/${meetingId}`).then(res => {
      setDetailsData(res.data)
      setPreload(false)
    })
  }

  useEffect(() => {
    if (meetingId) {
      getDetails()
    }
  }, [meetingId])

  const sowHeadingSx = {
    fontSize: '16x',
    fontWeight: '600',
    textAlign: 'center',

    color: '#6c2bd9'
  }

  const sowBodySx = { p: 2, my: 2 }

  if (preload) {
    return <Preloader close={preload} />
  }

  return (
    <Box sx={{ p: 5 }}>
      <Box>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}></Box>
      </Box>
    </Box>
  )
}
