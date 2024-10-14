import AccountTreeIcon from '@mui/icons-material/AccountTree'
import CategoryIcon from '@mui/icons-material/Category'
import DashboardIcon from '@mui/icons-material/Dashboard'
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize'
import { Box } from '@mui/material'
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip
} from 'chart.js'
import { Fragment } from 'react'
import { Line, Pie } from 'react-chartjs-2'

const Dashboard = () => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    LineController
  )
  const revenueData = {
    labels: ['Red', 'Blue', 'Yellow'],
    datasets: [
      {
        label: 'Revenue',
        data: [300, 50, 100, 150, 200, 250, 120, 180, 220, 300],
        backgroundColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(255, 205, 86)'],
        hoverOffset: 4
      }
    ]
  }

  const trafficData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Organic',
        backgroundColor: '#0694a2',
        borderColor: '#0694a2',
        data: [43, 48, 40, 54, 67, 73, 70],
        fill: false
      },
      {
        label: 'Paid',
        fill: false,
        backgroundColor: '#7e3af2',
        borderColor: '#7e3af2',
        data: [24, 50, 64, 74, 52, 51, 65]
      },
      {
        label: 'Organic',
        backgroundColor: '#0694a2',
        borderColor: '#0694a2',
        data: [43, 48, 40, 54, 67, 73, 70, 60, 75, 80],
        fill: false
      },
      {
        label: 'Paid',
        fill: false,
        backgroundColor: '#7e3af2',
        borderColor: '#7e3af2',
        data: [24, 50, 64, 74, 52, 51, 65, 70, 55, 45]
      }
    ]
  }

  return (
    <Fragment>
      <Box className='container px-6 mx-auto grid'>
        <h2 className='my-6 text-2xl font-semibold text-gray-700 dark-d:text-gray-200'>Dashboard</h2>

        {/* <!-- Cards --> */}
        <Box className='grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4'>
          {/* <!-- Card --> */}
          <Box className='flex items-center p-4 bg-white rounded-lg shadow-xs dark-d:bg-gray-800'>
            <Box className='p-3 mr-4 text-orange-500 bg-orange-100 rounded-full dark-d:text-orange-100 dark-d:bg-orange-500'>
              <AccountTreeIcon />
            </Box>
            <Box>
              <p className='mb-2 text-sm font-medium text-gray-600 dark-d:text-gray-400'>Total Projects</p>
              <p className='text-lg font-semibold text-gray-700 dark-d:text-gray-200'>6389</p>
            </Box>
          </Box>
          {/* <!-- Card --> */}
          <Box className='flex items-center p-4 bg-white rounded-lg shadow-xs dark-d:bg-gray-800'>
            <Box className='p-3 mr-4 text-green-500 bg-green-100 rounded-full dark-d:text-green-100 dark-d:bg-green-500'>
              <DashboardCustomizeIcon />
            </Box>
            <Box>
              <p className='mb-2 text-sm font-medium text-gray-600 dark-d:text-gray-400'>Total Projects Components</p>
              <p className='text-lg font-semibold text-gray-700 dark-d:text-gray-200'>700</p>
            </Box>
          </Box>
          {/* <!-- Card --> */}
          <Box className='flex items-center p-4 bg-white rounded-lg shadow-xs dark-d:bg-gray-800'>
            <Box className='p-3 mr-4 text-blue-500 bg-blue-100 rounded-full dark-d:text-blue-100 dark-d:bg-blue-500'>
              <DashboardIcon />
            </Box>
            <Box>
              <p className='mb-2 text-sm font-medium text-gray-600 dark-d:text-gray-400'>Total Website Components</p>
              <p className='text-lg font-semibold text-gray-700 dark-d:text-gray-200'>376</p>
            </Box>
          </Box>
          {/* <!-- Card --> */}
          <Box className='flex items-center p-4 bg-white rounded-lg shadow-xs dark-d:bg-gray-800'>
            <Box className='p-3 mr-4 text-teal-500 bg-teal-100 rounded-full dark-d:text-teal-100 dark-d:bg-teal-500'>
              <CategoryIcon />
            </Box>
            <Box>
              <p className='mb-2 text-sm font-medium text-gray-600 dark-d:text-gray-400'>
                Total Website Components Category
              </p>
              <p className='text-lg font-semibold text-gray-700 dark-d:text-gray-200'>35</p>
            </Box>
          </Box>
        </Box>

        {/* <!-- Charts --> */}
        <Box className='grid gap-6 mb-8 md:grid-cols-3'>
          <Box className='min-w-0 p-4 bg-white rounded-lg shadow-xs dark-d:bg-gray-800'>
            <h4 className='mb-4 font-semibold text-gray-800 dark-d:text-gray-300'>Revenue</h4>
            <Pie data={revenueData} />
            <Box className='flex justify-center mt-4 space-x-3 text-sm text-gray-600 dark-d:text-gray-400'>
              {/* <!-- Chart legend --> */}
              <Box className='flex items-center'>
                <span className='inline-block w-3 h-3 mr-1 bg-blue-500 rounded-full'></span>
                <span>Shirts</span>
              </Box>
              <Box className='flex items-center'>
                <span className='inline-block w-3 h-3 mr-1 bg-teal-600 rounded-full'></span>
                <span>Shoes</span>
              </Box>
              <Box className='flex items-center'>
                <span className='inline-block w-3 h-3 mr-1 bg-purple-600 rounded-full'></span>
                <span>Bags</span>
              </Box>
            </Box>
          </Box>
          <Box className='min-w-0 p-4 bg-white rounded-lg shadow-xs dark-d:bg-gray-800'>
            <h4 className='mb-4 font-semibold text-gray-800 dark-d:text-gray-300'>Traffic</h4>
            <Line data={trafficData} />
            <Box className='flex justify-center mt-4 space-x-3 text-sm text-gray-600 dark-d:text-gray-400'>
              {/* <!-- Chart legend --> */}
              <Box className='flex items-center'>
                <span className='inline-block w-3 h-3 mr-1 bg-teal-600 rounded-full'></span>
                <span>Organic</span>
              </Box>
              <Box className='flex items-center'>
                <span className='inline-block w-3 h-3 mr-1 bg-purple-600 rounded-full'></span>
                <span>Paid</span>
              </Box>
            </Box>
          </Box>
          <Box className='min-w-0 p-4 bg-white rounded-lg shadow-xs dark-d:bg-gray-800'>
            <h4 className='mb-4 font-semibold text-gray-800 dark-d:text-gray-300'>Traffic</h4>
            <Line data={trafficData} />
            <Box className='flex justify-center mt-4 space-x-3 text-sm text-gray-600 dark-d:text-gray-400'>
              {/* <!-- Chart legend --> */}
              <Box className='flex items-center'>
                <span className='inline-block w-3 h-3 mr-1 bg-teal-600 rounded-full'></span>
                <span>Organic</span>
              </Box>
              <Box className='flex items-center'>
                <span className='inline-block w-3 h-3 mr-1 bg-purple-600 rounded-full'></span>
                <span>Paid</span>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Fragment>
  )
}

export default Dashboard
