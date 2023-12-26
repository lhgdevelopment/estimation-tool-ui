import { Box } from '@mui/material'
import { useRouter } from 'next/router'
import { Fragment, useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import CopyToClipboard from 'src/@core/components/copy-to-clipboard/CopyToClipboard'
import Preloader from 'src/@core/components/preloader'
import apiRequest from 'src/@core/utils/axios-config'

export default function ProjectSOWDetailsComponent() {
  const router = useRouter()
  console.log(router?.query['id'])

  const [preload, setPreload] = useState<boolean>(false)
  const [detailsData, setDetailsData] = useState<any>({})
  const getDetails = () => {
    setPreload(true)
    apiRequest.get(`/project-summery/${router?.query['id']}`).then(res => {
      setDetailsData(res.data)
      setPreload(false)
    })
  }

  useEffect(() => {
    if (router?.query['id']) {
      getDetails()
    }
  }, [router?.query['id']])

  const sowHeadingSx = {
    fontSize: '20px',
    fontWeight: '600',
    textAlign: 'center',
    py: 2,
    my: 3,
    borderTop: '2px solid #6c2bd9',
    borderBottom: '2px solid #6c2bd9',
    color: '#6c2bd9'
  }

  const sowBodySx = { p: 2, my: 2 }

  return (
    <Fragment>
      {!!preload && <Preloader close={!preload} />}
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
              Project Name: {detailsData?.['meeting_transcript']?.['projectName']}
            </Box>
            <Box sx={sowHeadingSx}>Project Summery: </Box>
            <Box sx={sowBodySx}>
              <ReactMarkdown>{detailsData?.['summaryText']}</ReactMarkdown>
              <CopyToClipboard sx={{ mt: 5 }} textToCopy={detailsData?.['summaryText']} />
            </Box>
            <Box sx={sowHeadingSx}>Problems and Goals:</Box>
            <Box sx={sowBodySx}>
              <ReactMarkdown>
                {detailsData?.['meeting_transcript']?.['problems_and_goals']?.['problemGoalText']}
              </ReactMarkdown>
              <CopyToClipboard
                sx={{ mt: 5 }}
                textToCopy={detailsData?.['meeting_transcript']?.['problems_and_goals']?.['problemGoalText']}
              />
            </Box>
            <Box sx={sowHeadingSx}>Project Overview:</Box>
            <Box sx={sowBodySx}>
              <ReactMarkdown>
                {detailsData?.['meeting_transcript']?.['problems_and_goals']?.['project_overview']?.['overviewText']}
              </ReactMarkdown>
              <CopyToClipboard
                sx={{ mt: 5 }}
                textToCopy={
                  detailsData?.['meeting_transcript']?.['problems_and_goals']?.['project_overview']?.['overviewText']
                }
              />
            </Box>
            <Box sx={sowHeadingSx}>Scope of Work:</Box>
            <Box sx={sowBodySx}>
              <ReactMarkdown>
                {detailsData?.['meeting_transcript']?.['problems_and_goals']?.['scope_of_work']?.['scopeText']}
              </ReactMarkdown>
              <CopyToClipboard
                sx={{ mt: 5 }}
                textToCopy={
                  detailsData?.['meeting_transcript']?.['problems_and_goals']?.['scope_of_work']?.['scopeText']
                }
              />
            </Box>
            <Box sx={sowHeadingSx}>Deliverables:</Box>
            <Box sx={sowBodySx}>
              <ReactMarkdown>
                {
                  detailsData?.['meeting_transcript']?.['problems_and_goals']?.['scope_of_work']?.['deliverables']?.[
                    'deliverablesText'
                  ]
                }
              </ReactMarkdown>
              <CopyToClipboard
                sx={{ mt: 5 }}
                textToCopy={
                  detailsData?.['meeting_transcript']?.['problems_and_goals']?.['scope_of_work']?.['deliverables']?.[
                    'deliverablesText'
                  ]
                }
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Fragment>
  )
}
