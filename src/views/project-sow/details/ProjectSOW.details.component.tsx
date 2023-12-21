import { Box, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { Fragment, useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import apiRequest from 'src/@core/utils/axios-config'

export default function DetailsDataDetailsComponent() {
  const router = useRouter()
  const [detailsData, setDetailsData] = useState<any>({})
  const getDetails = (page = 1) => {
    apiRequest.get(`/project-summery/${router?.query['id']}`).then(res => {
      setDetailsData(res.data)
    })
  }

  useEffect(() => {
    getDetails()
  }, [])

  return (
    <Fragment>
      <Box sx={{ p: 5 }}>
        <Box sx={{ mt: 5 }}>
          <Box>
            <Typography variant='h6' component={'h2'}>
              Project Summery:
            </Typography>
            <Typography sx={{ ml: 5, mb: 10 }}>
              <ReactMarkdown>{detailsData?.['summaryText']}</ReactMarkdown>
            </Typography>
            <Typography variant='h6' component={'h2'}>
              Problems and Goals:
            </Typography>
            <Typography sx={{ ml: 5, mb: 10 }}>
              <ReactMarkdown>
                {detailsData?.['meeting_transcript']?.['problems_and_goals']?.['problemGoalText']}
              </ReactMarkdown>
            </Typography>
            <Typography variant='h6' component={'h2'}>
              Project Overview:
            </Typography>
            <Typography sx={{ ml: 5, mb: 10 }}>
              <ReactMarkdown>
                {detailsData?.['meeting_transcript']?.['problems_and_goals']?.['project_overview']?.['overviewText']}
              </ReactMarkdown>
            </Typography>
            <Typography variant='h6' component={'h2'}>
              Scope of Work:
            </Typography>
            <Typography sx={{ ml: 5, mb: 10 }}>
              <ReactMarkdown>
                {detailsData?.['meeting_transcript']?.['problems_and_goals']?.['scope_of_work']?.['scopeText']}
              </ReactMarkdown>
            </Typography>
            <Typography variant='h6' component={'h2'}>
              Deliverables:
            </Typography>
            <Typography sx={{ ml: 5, mb: 10 }}>
              <ReactMarkdown>
                {
                  detailsData?.['meeting_transcript']?.['problems_and_goals']?.['scope_of_work']?.['deliverables']?.[
                    'deliverablesText'
                  ]
                }
              </ReactMarkdown>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Fragment>
  )
}
