import EditNoteIcon from '@mui/icons-material/EditNote'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Box } from '@mui/material'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import { MdPreview } from 'md-editor-rt'
import 'md-editor-rt/lib/style.css'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import CopyToClipboard from 'src/@core/components/copy-to-clipboard/CopyToClipboard'
import Preloader from 'src/@core/components/preloader'
import apiRequest from 'src/@core/utils/axios-config'

export default function ProjectSOWDetailsComponent() {
  const router = useRouter()
  const allTextRef = useRef<HTMLDivElement>(null)
  const summaryTextRef = useRef<HTMLDivElement>(null)
  const problemGoalTextRef = useRef<HTMLDivElement>(null)
  const overviewTextRef = useRef<HTMLDivElement>(null)
  const scopeTextRef = useRef<HTMLDivElement>(null)
  const deliverablesRef = useRef<HTMLDivElement>(null)

  const [preload, setPreload] = useState<boolean>(true)
  const [detailsData, setDetailsData] = useState<any>({})
  const getDetails = () => {
    setPreload(true)
    apiRequest.get(`/project-summery/${router?.query['id']}`).then(res => {
      setDetailsData(res.data)
      setPreload(false)
    })
  }
  console.log(detailsData)

  useEffect(() => {
    if (router?.query['id']) {
      getDetails()
    }
  }, [router?.query['id']])

  const sowHeadingSx = {
    fontSize: '16x',
    fontWeight: '600',
    textAlign: 'center',

    color: '#6c2bd9'
  }

  const sowBodySx = { p: 2, my: 2 }

  if (preload) {
    return <Preloader close={!preload} />
  }
  console.log(summaryTextRef?.current?.innerText)

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
              color: '#6c2bd9',
              padding: '15px'
            }}
          >
            {detailsData?.['meeting_transcript']?.['projectName']}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 5 }}>
            <CopyToClipboard textToCopy={allTextRef?.current?.innerText} title='Copy All' />
            <Link href={`/project-summery/edit/${detailsData?.id}`} passHref>
              <Box
                sx={{ cursor: 'pointer' }}
                component={'a'}
                className='flex items-center justify-between ml-2 px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple'
                aria-label='View'
              >
                <EditNoteIcon sx={{ mr: 2 }} /> Edit
              </Box>
            </Link>
          </Box>
          <Box ref={allTextRef}>
            <Accordion defaultExpanded={true}>
              <AccordionSummary
                sx={{ borderBottom: '2px solid #f9fafb' }}
                expandIcon={<ExpandMoreIcon />}
                aria-controls='sow1-content'
                id='sow1-header'
              >
                <Box sx={sowHeadingSx}>Project Summery</Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={sowBodySx}>
                  <Box ref={summaryTextRef}>
                    <MdPreview modelValue={detailsData?.['summaryText']} />
                  </Box>
                  <Box className='flex' sx={{ mt: 5 }}>
                    <CopyToClipboard textToCopy={summaryTextRef?.current?.innerText} />

                    <Link
                      href={`/project-summery/edit/${detailsData?.id}?step=${detailsData?.['summaryText'] ? 1 : 0}`}
                      passHref
                    >
                      <Box
                        sx={{ cursor: 'pointer' }}
                        component={'a'}
                        className='flex items-center justify-between ml-2 px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple'
                        aria-label='View'
                      >
                        <EditNoteIcon sx={{ mr: 2 }} /> Edit Project Summery
                      </Box>
                    </Link>
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>
            <Accordion expanded={!!detailsData?.['meeting_transcript']?.['problems_and_goals']?.['problemGoalText']}>
              <AccordionSummary
                sx={{ borderBottom: '2px solid #f9fafb' }}
                expandIcon={<ExpandMoreIcon />}
                aria-controls='sow2-content'
                id='sow2-header'
              >
                <Box sx={sowHeadingSx}>Problems and Goals</Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={sowBodySx}>
                  <Box ref={problemGoalTextRef}>
                    <MdPreview
                      modelValue={detailsData?.['meeting_transcript']?.['problems_and_goals']?.['problemGoalText']}
                    />
                  </Box>
                  <Box className='flex' sx={{ mt: 5 }}>
                    <CopyToClipboard textToCopy={problemGoalTextRef?.current?.innerText} />
                    <Link href={`/project-summery/edit/${detailsData?.id}?step=2`} passHref>
                      <Box
                        sx={{ cursor: 'pointer' }}
                        component={'a'}
                        className='flex items-center justify-between ml-2 px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple'
                        aria-label='View'
                      >
                        <EditNoteIcon sx={{ mr: 2 }} /> Edit Problems and Goals
                      </Box>
                    </Link>
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={
                !!detailsData?.['meeting_transcript']?.['problems_and_goals']?.['project_overview']?.['overviewText']
              }
            >
              <AccordionSummary
                sx={{ borderBottom: '2px solid #f9fafb' }}
                expandIcon={<ExpandMoreIcon />}
                aria-controls='sow3-content'
                id='sow3-header'
              >
                <Box sx={sowHeadingSx}>Project Overview</Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={sowBodySx}>
                  <Box ref={overviewTextRef}>
                    <MdPreview
                      modelValue={
                        detailsData?.['meeting_transcript']?.['problems_and_goals']?.['project_overview']?.[
                          'overviewText'
                        ]
                      }
                    />
                  </Box>
                  <Box className='flex' sx={{ mt: 5 }}>
                    <CopyToClipboard textToCopy={overviewTextRef?.current?.innerText} />
                    <Link href={`/project-summery/edit/${detailsData?.id}?step=3`} passHref>
                      <Box
                        sx={{ cursor: 'pointer' }}
                        component={'a'}
                        className='flex items-center justify-between ml-2 px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple'
                        aria-label='View'
                      >
                        <EditNoteIcon sx={{ mr: 2 }} /> Edit Project Overview
                      </Box>
                    </Link>
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={!!detailsData?.['meeting_transcript']?.['problems_and_goals']?.['scope_of_work']?.['scopeText']}
            >
              <AccordionSummary
                sx={{ borderBottom: '2px solid #f9fafb' }}
                expandIcon={<ExpandMoreIcon />}
                aria-controls='sow4-content'
                id='sow4-header'
              >
                <Box sx={sowHeadingSx}>Scope of Work</Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={sowBodySx}>
                  <Box ref={scopeTextRef}>
                    <MdPreview
                      modelValue={
                        detailsData?.['meeting_transcript']?.['problems_and_goals']?.['scope_of_work']?.['scopeText']
                      }
                    />
                  </Box>
                  <Box className='flex' sx={{ mt: 5 }}>
                    <CopyToClipboard textToCopy={scopeTextRef?.current?.innerText} />
                    <Link href={`/project-summery/edit/${detailsData?.id}?step=4`} passHref>
                      <Box
                        sx={{ cursor: 'pointer' }}
                        component={'a'}
                        className='flex items-center justify-between ml-2 px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple'
                        aria-label='View'
                      >
                        <EditNoteIcon sx={{ mr: 2 }} /> Edit Scope of Work
                      </Box>
                    </Link>
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={
                !!detailsData?.['meeting_transcript']?.['problems_and_goals']?.['scope_of_work']?.['deliverables']?.[
                  'deliverablesText'
                ]
              }
            >
              <AccordionSummary
                sx={{ borderBottom: '2px solid #f9fafb' }}
                expandIcon={<ExpandMoreIcon />}
                aria-controls='sow5-content'
                id='sow5-header'
              >
                <Box sx={sowHeadingSx}>Deliverables</Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={sowBodySx}>
                  <Box ref={deliverablesRef}>
                    <MdPreview
                      modelValue={
                        detailsData?.['meeting_transcript']?.['problems_and_goals']?.['scope_of_work']?.[
                          'deliverables'
                        ]?.['deliverablesText']
                      }
                    />
                  </Box>
                  <Box className='flex' sx={{ mt: 5 }}>
                    <CopyToClipboard textToCopy={deliverablesRef?.current?.innerText} />
                    <Link href={`/project-summery/edit/${detailsData?.id}?step=5`} passHref>
                      <Box
                        sx={{ cursor: 'pointer' }}
                        component={'a'}
                        className='flex items-center justify-between ml-2 px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple'
                        aria-label='View'
                      >
                        <EditNoteIcon sx={{ mr: 2 }} /> Edit Deliverables
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
