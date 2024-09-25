import EditNoteIcon from '@mui/icons-material/EditNote'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Accordion, AccordionDetails, AccordionSummary, Box } from '@mui/material'
import 'md-editor-rt/lib/style.css'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import CopyToClipboard from 'src/@core/components/copy-to-clipboard'
import Preloader from 'src/@core/components/preloader'
import apiRequest from 'src/@core/utils/axios-config'

export default function MeetingSummaryDetailsComponent() {
  const meetingId = useRouter()?.query['id']

  const [preload, setPreload] = useState<boolean>(false)
  const [detailsData, setDetailsData] = useState<any>({})
  const getDetails = () => {
    setPreload(true)
    apiRequest.get(`/meeting-summery/${meetingId}`).then(res => {
      setDetailsData(res?.data)
      setPreload(false)
    })
  }

  useEffect(() => {
    if (meetingId) {
      getDetails()
    }
  }, [meetingId])

  const sowBodySx = { p: 2, my: 2 }

  if (preload) {
    return <Preloader close={preload} />
  }

  return (
    <Box sx={{ p: 5 }}>
      <Box>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box
            sx={{
              fontSize: '26px',
              fontWeight: '600',
              textAlign: 'center',
              margin: '8px',
              lineHeight: 'normal',
              padding: '15px'
            }}
            className={'details-page-title'}
          >
            Meeting Name: {detailsData?.['meetingName']}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 5 }}>
            {!!meetingId && (
              <Link href={`/meeting-summary/edit/${meetingId}`} passHref>
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
          <Box className='flex flex-col gap-4' sx={sowBodySx}>
            <Box className='flex flex-col gap-4 p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800'>
              <Box className='flex gap-4  '>
                <Box className='text-md font-semibold text-gray-700 dark:text-gray-200'>Clickup Link: </Box>
                <Box>
                  {!!detailsData?.['clickupLink'] && (
                    <Box
                      component={'a'}
                      href={detailsData?.['clickupLink']}
                      target='_blank'
                      className='text-gray-700 dark:text-gray-400'
                    >
                      {detailsData?.['clickupLink']}
                    </Box>
                  )}
                </Box>
              </Box>
              <Box className='flex gap-4 '>
                <Box className='text-md font-semibold text-gray-700 dark:text-gray-200'>TLDV Link: </Box>
                <Box>
                  {!!detailsData?.['tldvLink'] && (
                    <Box
                      component={'a'}
                      href={detailsData?.['tldvLink']}
                      target='_blank'
                      className='text-gray-700 dark:text-gray-400'
                    >
                      {detailsData?.['tldvLink']}
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
            <Accordion defaultExpanded={true}>
              <AccordionSummary
                sx={{ borderBottom: '2px solid #f9fafb' }}
                expandIcon={<ExpandMoreIcon />}
                aria-controls='sow1-content'
                id='sow1-header'
              >
                <Box className='text-md font-semibold text-gray-700 dark:text-gray-200'>Summary Text</Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={sowBodySx}>
                  <Box
                    className='md-editor-preview'
                    dangerouslySetInnerHTML={{ __html: detailsData?.['meetingSummeryText'] }}
                  ></Box>
                  <Box className='flex' sx={{ mt: 5 }}>
                    <CopyToClipboard textToCopy={detailsData?.['meetingSummeryText']} />
                    <Link href={`/meeting-summary/edit/${meetingId}`} passHref>
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
            <Accordion
              defaultExpanded={false}
              TransitionProps={{
                timeout: 0
              }}
            >
              <AccordionSummary
                sx={{ borderBottom: '2px solid #f9fafb' }}
                expandIcon={<ExpandMoreIcon />}
                aria-controls='sow1-content'
                id='sow1-header'
              >
                <Box className='text-md font-semibold text-gray-700 dark:text-gray-200'>Transcript Text</Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={sowBodySx}>
                  <Box
                    className='md-editor-preview'
                    dangerouslySetInnerHTML={{ __html: detailsData?.['transcriptText'] }}
                  ></Box>
                </Box>
              </AccordionDetails>
            </Accordion>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
