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
        <Box className='container px-6 mx-auto' sx={{ height: 'calc(100vh - 126px)', position: 'relative' }}>
          <Box></Box>
          <Box
            sx={{
              position: 'absolute',
              width: '100%',
              bottom: '0',
              left: '0',
              right: '0'
            }}
          >
            <Box
              component={'textarea'}
              id='prompt-textarea'
              placeholder='Chat Prompt...'
              rows={1}
              className='block w-full mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 form-select focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray'
              sx={{ height: '40px', overflowY: 'hidden' }}
            ></Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
