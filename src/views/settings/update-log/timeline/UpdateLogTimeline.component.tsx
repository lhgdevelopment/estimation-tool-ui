import RepeatIcon from '@mui/icons-material/Repeat'
import Timeline from '@mui/lab/Timeline'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import { Box } from '@mui/material'
import Typography from '@mui/material/Typography'
import { MdPreview } from 'md-editor-rt'
import 'md-editor-rt/lib/style.css'
import { useEffect, useState } from 'react'
import apiRequest from 'src/@core/utils/axios-config'

export default function UpdateLogTimelineComponent() {
  const [updateLogData, setUpdateLogData] = useState<any>([])

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const getList = (page = 1) => {
    apiRequest.get(`/update-logs?page=${page}`).then(res => {
      const paginationData: any = res
      setUpdateLogData(res?.data)
      setCurrentPage(paginationData?.['current_page'])
      setTotalPages(Math.ceil(paginationData?.['total'] / 10))
    })
  }

  const handlePageChange = (newPage: number) => {
    getList(newPage)
  }
  useEffect(() => {
    getList()
  }, [])

  console.log(updateLogData)

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
        <Box component={'h1'} className='mt-5 mb-4 text-xl font-semibold text-gray-600 dark:text-gray-300 text-center'>
          Hive Update Log
        </Box>
      </Box>
      <Timeline position='alternate'>
        {updateLogData?.map((updateLog: any, index: number) => {
          return (
            <TimelineItem key={index}>
              <TimelineOppositeContent
                sx={{ m: 'auto 0' }}
                align={index % 2 ? 'right' : 'left'}
                variant='body2'
                color='text.secondary'
              >
                {updateLog.date}
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineConnector />
                <TimelineConnector />
                <TimelineConnector />
                <TimelineDot>
                  <RepeatIcon />
                </TimelineDot>
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <Typography variant='h6' component='span'>
                  <MdPreview modelValue={updateLog.deployed} />
                </Typography>
                <Typography>
                  <MdPreview modelValue={updateLog.next} />
                </Typography>
              </TimelineContent>
            </TimelineItem>
          )
        })}
      </Timeline>
    </Box>
  )
}
