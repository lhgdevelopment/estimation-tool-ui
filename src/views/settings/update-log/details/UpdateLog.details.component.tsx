import CopyToClipboard from '@core/components/copy-to-clipboard'
import Preloader from '@core/components/preloader'
import apiRequest from '@core/utils/axios-config'
import EditNoteIcon from '@mui/icons-material/EditNote'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Accordion, AccordionDetails, AccordionSummary, Box } from '@mui/material'
import 'md-editor-rt/lib/style.css'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function UpdateLogDetailsComponent() {
  const UpdateLogId = useRouter()?.query['id']

  const [preload, setPreload] = useState<boolean>(false)
  const [detailsData, setDetailsData] = useState<any>({})
  const getDetails = () => {
    setPreload(true)
    apiRequest.get(`/update-logs/${UpdateLogId}`).then(res => {
      setDetailsData(res?.data)
      setPreload(false)
    })
  }

  useEffect(() => {
    if (UpdateLogId) {
      getDetails()
    }
  }, [UpdateLogId])

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
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 15px' }}>
            <Box component={'h1'} className='mt-5 mb-4 text-xl font-semibold text-gray-600 dark-d:text-gray-300'>
              UpdateLog
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              {!!UpdateLogId && (
                <Link href={`/settings/update-log/edit/${UpdateLogId}`} passHref>
                  <Box
                    sx={{ cursor: 'pointer' }}
                    component={'a'}
                    className='flex items-center justify-between ml-2 px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple'
                    aria-label='View'
                  >
                    <EditNoteIcon sx={{ mr: 2 }} /> Edit
                  </Box>
                </Link>
              )}
            </Box>
          </Box>
          <Box sx={sowBodySx}>
            <Box
              sx={{
                padding: '15px',
                background: '#fff',
                gap: '5px',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  gap: '5px'
                }}
              >
                <Box sx={{ fontWeight: '600' }}>Date: </Box>
                <Box>{detailsData?.['date']}</Box>
              </Box>

              <Accordion defaultExpanded={true}>
                <AccordionSummary
                  sx={{ borderBottom: '2px solid #f9fafb' }}
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls='sow1-content'
                  id='sow1-header'
                >
                  <Box sx={sowHeadingSx}>Deployed</Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={sowBodySx}>
                    <Box
                      className='md-editor-preview'
                      dangerouslySetInnerHTML={{ __html: detailsData?.['deployed'] }}
                    ></Box>
                    <Box className='flex' sx={{ mt: 5 }}>
                      <CopyToClipboard textToCopy={detailsData?.['deployed']} />
                      <Link href={`/settings/update-log/edit/${UpdateLogId}`} passHref>
                        <Box
                          sx={{ cursor: 'pointer' }}
                          component={'a'}
                          className='flex items-center inline-block justify-between ml-2 px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple'
                          aria-label='View'
                        >
                          <EditNoteIcon sx={{ mr: 2 }} /> Edit
                        </Box>
                      </Link>
                    </Box>
                  </Box>
                </AccordionDetails>
              </Accordion>
              <Accordion defaultExpanded={true}>
                <AccordionSummary
                  sx={{ borderBottom: '2px solid #f9fafb' }}
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls='sow1-content'
                  id='sow1-header'
                >
                  <Box sx={sowHeadingSx}>Next</Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={sowBodySx}>
                    <Box
                      className='md-editor-preview'
                      dangerouslySetInnerHTML={{ __html: detailsData?.['next'] }}
                    ></Box>
                    <Box className='flex' sx={{ mt: 5 }}>
                      <CopyToClipboard textToCopy={detailsData?.['next']} />
                      <Link href={`/settings/update-log/edit/${UpdateLogId}`} passHref>
                        <Box
                          sx={{ cursor: 'pointer' }}
                          component={'a'}
                          className='flex items-center inline-block justify-between ml-2 px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple'
                          aria-label='View'
                        >
                          <EditNoteIcon sx={{ mr: 2 }} /> Edit
                        </Box>
                      </Link>
                    </Box>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
