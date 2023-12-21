import AccountTreeIcon from '@mui/icons-material/AccountTree'
import { Box } from '@mui/material'
import HomeOutline from 'mdi-material-ui/HomeOutline'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { Fragment } from 'react'
import navigation from 'src/navigation'

export default function AppNavbarComponent() {
  const router = useRouter()

  return (
    <Fragment>
      <Box className='z-20 hidden w-64 overflow-y-auto bg-white dark:bg-gray-800 md:block flex-shrink-0'>
        <Box className='py-4 text-gray-500 dark:text-gray-400 '>
          <Box className={'text-center'}>
            {/* <Box component={'a'} className='text-lg font-bold text-gray-800 dark:text-gray-200 leading-3' href='#'>
              LHG <br />
              Sales/Proposal Tools
            </Box> */}

            <Box component={'a'} className='text-lg font-bold text-gray-800 dark:text-gray-200 leading-3' href='#'>
              Test Socket
            </Box>
          </Box>
          <Box component={'ul'} className='mt-6'>
            <Box component={'li'} className='relative px-6 py-3'>
              <Link href={'/'} passHref>
                <Box
                  component={'a'}
                  className='inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200'
                >
                  <svg
                    className='w-5 h-5'
                    aria-hidden='true'
                    fill='none'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'></path>
                  </svg>
                  <Box component={'span'} className='ml-4'>
                    Dashboard
                  </Box>
                </Box>
              </Link>
            </Box>
          </Box>
          <Box component={'ul'}>
            {navigation?.map((nav, index) => (
              <Box component={'li'} key={index} className='relative px-6 py-3'>
                {router.pathname == nav.path && (
                  <Box
                    component={'span'}
                    className='absolute inset-y-0 left-0 w-1 bg-purple-600 rounded-tr-lg rounded-br-lg'
                    aria-hidden='true'
                  ></Box>
                )}
                <Link href={nav.path} passHref>
                  <Box
                    component={'a'}
                    className={`inline-flex items-center w-full text-sm font-semibold  transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200 dark:text-gray-100 ${
                      router.pathname == nav.path ? 'text-gray-800' : ''
                    }`}
                  >
                    {React.createElement(nav.icon ? nav.icon : HomeOutline)}
                    <Box component={'span'} className='ml-4'>
                      {nav.title}
                    </Box>
                  </Box>
                </Link>
              </Box>
            ))}
          </Box>
          <Box className='px-4 my-2'>
            <Link href={'/project'} passHref>
              <Box
                component={'a'}
                className='flex items-center justify-between w-full px-2 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple'
              >
                <AccountTreeIcon />
                Create Project
                <Box component={'span'} className='ml-2' aria-hidden='true'>
                  +
                </Box>
              </Box>
            </Link>
          </Box>
        </Box>
      </Box>
      {/* <!-- Mobile sidebar --> */}
      {/* <!-- Backdrop --> */}
      {/* <Box className='fixed inset-0 z-10 flex items-end bg-black bg-opacity-50 sm:items-center sm:justify-center'></Box> */}
      <Box className='fixed inset-y-0 z-20 flex-shrink-0 w-64 mt-16 overflow-y-auto bg-white dark:bg-gray-800 md:hidden'>
        <Box className='py-4 text-gray-500 dark:text-gray-400'>
          <Box component={'a'} className='text-lg font-bold text-gray-800 dark:text-gray-200 display-block' href='#'>
            LHG Sales/Proposal Tools
          </Box>
          <Box component={'ul'} className='mt-6'>
            <Box component={'li'} className='relative px-6 py-3'>
              <Box
                component={'a'}
                className='inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200'
                href='index.html'
              >
                <svg
                  className='w-5 h-5'
                  aria-hidden='true'
                  fill='none'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'></path>
                </svg>
                <Box component={'span'} className='ml-4'>
                  Dashboard
                </Box>
              </Box>
            </Box>
          </Box>
          <Box component={'ul'}>
            <Box component={'li'} className='relative px-6 py-3'>
              <Box
                component={'span'}
                className='absolute inset-y-0 left-0 w-1 bg-purple-600 rounded-tr-lg rounded-br-lg'
                aria-hidden='true'
              ></Box>
              <Box
                component={'a'}
                className='inline-flex items-center w-full text-sm font-semibold text-gray-800 transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200 dark:text-gray-100'
                href='forms.html'
              >
                <svg
                  className='w-5 h-5'
                  aria-hidden='true'
                  fill='none'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01'></path>
                </svg>
                <Box component={'span'} className='ml-4'>
                  Forms
                </Box>
              </Box>
            </Box>
            <Box component={'li'} className='relative px-6 py-3'>
              <Box
                component={'a'}
                className='inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200'
                href='cards.html'
              >
                <svg
                  className='w-5 h-5'
                  aria-hidden='true'
                  fill='none'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'></path>
                </svg>
                <Box component={'span'} className='ml-4'>
                  Cards
                </Box>
              </Box>
            </Box>
            <Box component={'li'} className='relative px-6 py-3'>
              <Box
                component={'a'}
                className='inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200'
                href='charts.html'
              >
                <svg
                  className='w-5 h-5'
                  aria-hidden='true'
                  fill='none'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path d='M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z'></path>
                  <path d='M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z'></path>
                </svg>
                <Box component={'span'} className='ml-4'>
                  Charts
                </Box>
              </Box>
            </Box>
            <Box component={'li'} className='relative px-6 py-3'>
              <Box
                component={'a'}
                className='inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200'
                href='buttons.html'
              >
                <svg
                  className='w-5 h-5'
                  aria-hidden='true'
                  fill='none'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path d='M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122'></path>
                </svg>
                <Box component={'span'} className='ml-4'>
                  Buttons
                </Box>
              </Box>
            </Box>
            <Box component={'li'} className='relative px-6 py-3'>
              <Box
                component={'a'}
                className='inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200'
                href='modals.html'
              >
                <svg
                  className='w-5 h-5'
                  aria-hidden='true'
                  fill='none'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path d='M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z'></path>
                </svg>
                <Box component={'span'} className='ml-4'>
                  Modals
                </Box>
              </Box>
            </Box>
            <Box component={'li'} className='relative px-6 py-3'>
              <Box
                component={'a'}
                className='inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200'
                href='tables.html'
              >
                <svg
                  className='w-5 h-5'
                  aria-hidden='true'
                  fill='none'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path d='M4 6h16M4 10h16M4 14h16M4 18h16'></path>
                </svg>
                <Box component={'span'} className='ml-4'>
                  Tables
                </Box>
              </Box>
            </Box>
            <Box component={'li'} className='relative px-6 py-3'>
              <button
                className='inline-flex items-center justify-between w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200'
                aria-haspopup='true'
              >
                <Box component={'span'} className='inline-flex items-center'>
                  <svg
                    className='w-5 h-5'
                    aria-hidden='true'
                    fill='none'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path d='M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z'></path>
                  </svg>
                  <Box component={'span'} className='ml-4'>
                    Pages
                  </Box>
                </Box>
                <svg className='w-4 h-4' aria-hidden='true' fill='currentColor' viewBox='0 0 20 20'>
                  <path
                    fillRule='evenodd'
                    d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                    clipRule='evenodd'
                  ></path>
                </svg>
              </button>
              <Box>
                <Box
                  component={'ul'}
                  className='p-2 mt-2 space-y-2 overflow-hidden text-sm font-medium text-gray-500 rounded-md shadow-inner bg-gray-50 dark:text-gray-400 dark:bg-gray-900 hidden'
                  aria-label='submenu'
                >
                  <Box
                    component={'li'}
                    className='px-2 py-1 transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200'
                  >
                    <Box component={'a'} className='w-full' href='pages/login.html'>
                      Login
                    </Box>
                  </Box>
                  <Box
                    component={'li'}
                    className='px-2 py-1 transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200'
                  >
                    <Box component={'a'} className='w-full' href='pages/create-account.html'>
                      Create account
                    </Box>
                  </Box>
                  <Box
                    component={'li'}
                    className='px-2 py-1 transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200'
                  >
                    <Box component={'a'} className='w-full' href='pages/forgot-password.html'>
                      Forgot password
                    </Box>
                  </Box>
                  <Box
                    component={'li'}
                    className='px-2 py-1 transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200'
                  >
                    <Box component={'a'} className='w-full' href='pages/404.html'>
                      404
                    </Box>
                  </Box>
                  <Box
                    component={'li'}
                    className='px-2 py-1 transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200'
                  >
                    <Box component={'a'} className='w-full' href='pages/blank.html'>
                      Blank
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box className='px-6 my-6'>
            <button className='flex items-center justify-between px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple'>
              Create account
              <Box component={'span'} className='ml-2' aria-hidden='true'>
                +
              </Box>
            </button>
          </Box>
        </Box>
      </Box>
    </Fragment>
  )
}
