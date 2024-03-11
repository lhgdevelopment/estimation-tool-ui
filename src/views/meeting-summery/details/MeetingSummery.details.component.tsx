import EditNoteIcon from '@mui/icons-material/EditNote'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Accordion, AccordionDetails, AccordionSummary, Box } from '@mui/material'
import { MdPreview } from 'md-editor-rt'
import 'md-editor-rt/lib/style.css'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import CopyToClipboard from 'src/@core/components/copy-to-clipboard/CopyToClipboard'
import Preloader from 'src/@core/components/preloader'
import apiRequest from 'src/@core/utils/axios-config'

export default function MeetingSummeryDetailsComponent() {
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
              <Link href={`/meeting-summery/edit/${meetingId}`} passHref>
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
                <Box sx={{ fontWeight: '600' }}>Clickup Link: </Box>
                <Box>
                  {!!detailsData?.['clickupLink'] && (
                    <Box component={'a'} href={detailsData?.['clickupLink']} target='_blank'>
                      {detailsData?.['clickupLink']}
                    </Box>
                  )}
                </Box>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  gap: '5px'
                }}
              >
                <Box sx={{ fontWeight: '600' }}>TLDV Link: </Box>
                <Box>
                  {!!detailsData?.['tldvLink'] && (
                    <Box component={'a'} href={detailsData?.['tldvLink']} target='_blank'>
                      {detailsData?.['tldvLink']}
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
            {!detailsData?.['tldvLink'] && (
              <Accordion defaultExpanded={true}>
                <AccordionSummary
                  sx={{ borderBottom: '2px solid #f9fafb' }}
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls='sow1-content'
                  id='sow1-header'
                >
                  <Box sx={sowHeadingSx}>Transcript Text</Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={sowBodySx}>
                    <MdPreview modelValue={detailsData?.['transcriptText']} />
                  </Box>
                </AccordionDetails>
              </Accordion>
            )}

            <Accordion defaultExpanded={true}>
              <AccordionSummary
                sx={{ borderBottom: '2px solid #f9fafb' }}
                expandIcon={<ExpandMoreIcon />}
                aria-controls='sow1-content'
                id='sow1-header'
              >
                <Box sx={sowHeadingSx}>Summery Text</Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={sowBodySx}>
                  <MdPreview modelValue={detailsData?.['meetingSummeryText']} />
                  <Box className='flex' sx={{ mt: 5 }}>
                    <CopyToClipboard textToCopy={detailsData?.['meetingSummeryText']} />
                    <Link href={`/meeting-summery/edit/${meetingId}`} passHref>
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
  )
}
