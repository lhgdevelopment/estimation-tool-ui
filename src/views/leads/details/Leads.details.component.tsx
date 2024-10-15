import CopyToClipboard from '@core/components/copy-to-clipboard'
import Preloader from '@core/components/preloader'
import apiRequest from '@core/utils/axios-config'
import EditNoteIcon from '@mui/icons-material/EditNote'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Accordion, AccordionDetails, AccordionSummary, Box } from '@mui/material'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function LeadsDetailsComponent() {
  const leadsId = useRouter()?.query['id']

  const [preload, setPreload] = useState<boolean>(false)
  const [detailsData, setDetailsData] = useState<any>({})
  const getDetails = () => {
    setPreload(true)
    apiRequest.get(`/leads/${leadsId}`).then(res => {
      setDetailsData(res?.data)
      setPreload(false)
    })
  }

  useEffect(() => {
    if (leadsId) {
      getDetails()
    }
  }, [leadsId])

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
            <Box component={'h1'} className='mt-5 mb-4 text-xl font-semibold text-gray-600 d:text-gray-300'>
              Leads
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              {!!leadsId && (
                <Link href={`/leads/edit/${leadsId}`} passHref>
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
                <Box sx={{ fontWeight: '600' }}>First Name: </Box>
                <Box>{detailsData?.['firstName']}</Box>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  gap: '5px'
                }}
              >
                <Box sx={{ fontWeight: '600' }}>Last Name: </Box>
                <Box>{detailsData?.['lastName']}</Box>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  gap: '5px'
                }}
              >
                <Box sx={{ fontWeight: '600' }}>Company: </Box>
                <Box>{detailsData?.['company']}</Box>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  gap: '5px'
                }}
              >
                <Box sx={{ fontWeight: '600' }}>Phone: </Box>
                <Box>{detailsData?.['phone']}</Box>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  gap: '5px'
                }}
              >
                <Box sx={{ fontWeight: '600' }}>Email: </Box>
                <Box>{detailsData?.['email']}</Box>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  gap: '5px'
                }}
              >
                <Box sx={{ fontWeight: '600' }}>Project Type: </Box>
                <Box>{detailsData?.['project_type']?.['name']}</Box>
              </Box>
            </Box>

            <Accordion defaultExpanded={true}>
              <AccordionSummary
                sx={{ borderBottom: '2px solid #f9fafb' }}
                expandIcon={<ExpandMoreIcon />}
                aria-controls='sow1-content'
                id='sow1-header'
              >
                <Box sx={sowHeadingSx}>Description</Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={sowBodySx}>
                  <Box
                    className='md-editor-preview'
                    dangerouslySetInnerHTML={{ __html: detailsData?.['description'] }}
                  ></Box>

                  <Box className='flex' sx={{ mt: 5 }}>
                    <CopyToClipboard textToCopy={detailsData?.['description']} />
                    <Link href={`/leads/edit/${leadsId}`} passHref>
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
