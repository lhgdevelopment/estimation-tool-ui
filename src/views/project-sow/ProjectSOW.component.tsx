import AddIcon from '@mui/icons-material/Add'
import CalculateIcon from '@mui/icons-material/Calculate'
import GradingIcon from '@mui/icons-material/Grading'
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd'
import PriceCheckIcon from '@mui/icons-material/PriceCheck'
import { Box } from '@mui/material'
import { useState } from 'react'
import ProjectSOWListComponent from './list/ProjectSOW.list.component'

export default function ProjectSOWComponent() {
  const [listData, setListData] = useState<any>([])

  return (
    <>
      <Box className='container px-6 mx-auto'>
        <Box
          component={'h1'}
          className='mt-5 mb-4 text-xl font-semibold text-gray-600 dark-d:text-gray-300'
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          New Project
          <Box
            component={'a'}
            href='/project-summary/create'
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '40px',
              width: '40px',
              p: '0',
              ml: '20px',
              background: '#9333ea',
              minWidth: 'auto',
              color: '#fff',
              borderRadius: '50%',
              '&:hover': {
                background: '#7e22ce'
              }
            }}
          >
            <AddIcon />
          </Box>
        </Box>
        <Box className='grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4'>
          {/* <!-- Card --> */}
          <Box className='flex items-center p-4 bg-white rounded-lg shadow-xs dark-d:bg-gray-800'>
            <Box className='p-3 mr-4 text-orange-500 bg-orange-100 rounded-full dark-d:text-orange-100 dark-d:bg-orange-500'>
              <PlaylistAddIcon />
            </Box>
            <Box>
              <Box component={'p'} className='mb-2 text-sm font-medium text-gray-600 dark-d:text-gray-400'>
                New Entries this Week
              </Box>
              <Box component={'p'} className='text-lg font-semibold text-gray-700 dark-d:text-gray-200'>
                3
              </Box>
            </Box>
          </Box>
          {/* <!-- Card --> */}
          <Box className='flex items-center p-4 bg-white rounded-lg shadow-xs dark-d:bg-gray-800'>
            <Box className='p-3 mr-4 text-green-500 bg-green-100 rounded-full dark-d:text-green-100 dark-d:bg-green-500'>
              <GradingIcon />
            </Box>
            <Box>
              <Box component={'p'} className='mb-2 text-sm font-medium text-gray-600 dark-d:text-gray-400'>
                Team Review Needed
              </Box>
              <Box component={'p'} className='text-lg font-semibold text-gray-700 dark-d:text-gray-200'>
                1
              </Box>
            </Box>
          </Box>
          {/* <!-- Card --> */}
          <Box className='flex items-center p-4 bg-white rounded-lg shadow-xs dark-d:bg-gray-800'>
            <Box className='p-3 mr-4 text-blue-500 bg-blue-100 rounded-full dark-d:text-blue-100 dark-d:bg-blue-500'>
              <CalculateIcon />
            </Box>
            <Box>
              <Box component={'p'} className='mb-2 text-sm font-medium text-gray-600 dark-d:text-gray-400'>
                Estimation
              </Box>
              <Box component={'p'} className='text-lg font-semibold text-gray-700 dark-d:text-gray-200'>
                0
              </Box>
            </Box>
          </Box>
          {/* <!-- Card --> */}
          <Box className='flex items-center p-4 bg-white rounded-lg shadow-xs dark-d:bg-gray-800'>
            <Box className='p-3 mr-4 text-teal-500 bg-teal-100 rounded-full dark-d:text-teal-100 dark-d:bg-teal-500'>
              <PriceCheckIcon />
            </Box>
            <Box>
              <Box component={'p'} className='mb-2 text-sm font-medium text-gray-600 dark-d:text-gray-400'>
                Finance to Approve
              </Box>
              <Box component={'p'} className='text-lg font-semibold text-gray-700 dark-d:text-gray-200'>
                15
              </Box>
            </Box>
          </Box>
        </Box>
        {/* <ProjectSOWFormComponent listData={listData} setListData={setListData} /> */}
        <ProjectSOWListComponent listData={listData} setListData={setListData} />
      </Box>
    </>
  )
}
