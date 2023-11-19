// ** React Imports
// ** MUI Imports
import { Box } from '@mui/material'
import { Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import Cookies from 'js-cookie'

// ** Hook Import
import HomeOutline from 'mdi-material-ui/HomeOutline'
import { useRouter } from 'next/router'
import React, { ReactNode, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useSettings } from 'src/@core/hooks/useSettings'
import { loginUser } from 'src/@core/store/actions/userActions'
import apiRequest from 'src/@core/utils/axios-config'
import navigation from 'src/navigation'

// ** Navigation Imports

interface Props {
  children: ReactNode
}

const AppLayout = ({ children }: Props) => {
  // ** Hooks
  const { settings, saveSettings } = useSettings()

  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'))

  const router = useRouter()
  const dispatch = useDispatch()

  useEffect(() => {
    const token = Cookies.get('accessToken')

    if (!token) {
      // If token is not present, redirect to the login page
      router.push('/auth/login')
    } else {
      //console.log(token)
      apiRequest
        .get('/users/me')
        .then(res => {
          dispatch(loginUser(res.data))
        })
        .catch(() => {
          Cookies.remove('accessToken')
          router.push('/auth/login')
        })
    }
  }, [])

  return (
    <>
      <Box className='flex h-screen bg-gray-50 dark:bg-gray-900'>
        {/* <!-- Desktop sidebar --> */}
        <Box
          component={'aside'}
          className='z-20 hidden w-64 overflow-y-auto bg-white dark:bg-gray-800 md:block flex-shrink-0'
        >
          <Box className='py-4 text-gray-500 dark:text-gray-400'>
            <Box component={'a'} className='ml-6 text-lg font-bold text-gray-800 dark:text-gray-200' href='#'>
              LHG Estimation Tool
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
              {navigation?.map((nav, index) => (
                <Box component={'li'} key={index} className='relative px-6 py-3'>
                  <Box
                    component={'span'}
                    className='absolute inset-y-0 left-0 w-1 bg-purple-600 rounded-tr-lg rounded-br-lg'
                    aria-hidden='true'
                  ></Box>
                  <a
                    className='inline-flex items-center w-full text-sm font-semibold text-gray-800 transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200 dark:text-gray-100'
                    href={nav.path}
                  >
                    {React.createElement(nav.icon ? nav.icon : HomeOutline)} {/* Render the icon component */}
                    <Box component={'span'} className='ml-4'>
                      {nav.title}
                    </Box>
                  </a>
                </Box>
              ))}
            </Box>
            <Box className='px-6 my-6'>
              <button className='flex items-center justify-between w-full px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple'>
                Create Project
                <Box component={'span'} className='ml-2' aria-hidden='true'>
                  +
                </Box>
              </button>
            </Box>
          </Box>
        </Box>
        {/* <!-- Mobile sidebar --> */}
        {/* <!-- Backdrop --> */}
        {/* <Box className='fixed inset-0 z-10 flex items-end bg-black bg-opacity-50 sm:items-center sm:justify-center'></Box> */}
        <Box
          component={'aside'}
          className='fixed inset-y-0 z-20 flex-shrink-0 w-64 mt-16 overflow-y-auto bg-white dark:bg-gray-800 md:hidden'
        >
          <Box className='py-4 text-gray-500 dark:text-gray-400'>
            <Box component={'a'} className='ml-6 text-lg font-bold text-gray-800 dark:text-gray-200' href='#'>
              LHG Estimation Tool
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
                <template>
                  <Box
                    component={'ul'}
                    className='p-2 mt-2 space-y-2 overflow-hidden text-sm font-medium text-gray-500 rounded-md shadow-inner bg-gray-50 dark:text-gray-400 dark:bg-gray-900'
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
                </template>
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
        <Box className='flex flex-col flex-1'>
          <Box component={'header'} className='z-10 py-4 bg-white shadow-md dark:bg-gray-800'>
            <Box className='container flex items-center justify-between h-full px-6 mx-auto text-purple-600 dark:text-purple-300'>
              {/* <!-- Mobile hamburger --> */}
              <button
                className='p-1 -ml-1 mr-5 rounded-md md:hidden focus:outline-none focus:shadow-outline-purple'
                aria-label='Menu'
              >
                <svg className='w-6 h-6' aria-hidden='true' fill='currentColor' viewBox='0 0 20 20'>
                  <path
                    fillRule='evenodd'
                    d='M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z'
                    clipRule='evenodd'
                  ></path>
                </svg>
              </button>
              {/* <!-- Search input --> */}
              <Box className='flex justify-center flex-1 lg:mr-32'>
                {/* <Box className='relative w-full max-w-xl mr-6 focus-within:text-purple-500'>
                  <Box className='absolute inset-y-0 flex items-center pl-2'>
                    <svg className='w-4 h-4' aria-hidden='true' fill='currentColor' viewBox='0 0 20 20'>
                      <path
                        fillRule='evenodd'
                        d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z'
                        clipRule='evenodd'
                      ></path>
                    </svg>
                  </Box>
                  <input
                    className='w-full pl-8 pr-2 text-sm text-gray-700 placeholder-gray-600 bg-gray-100 border-0 rounded-md dark:placeholder-gray-500 dark:focus:shadow-outline-gray dark:focus:placeholder-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:placeholder-gray-500 focus:bg-white focus:border-purple-300 focus:outline-none focus:shadow-outline-purple form-input'
                    type='text'
                    placeholder='Search for projects'
                    aria-label='Search'
                  />
                </Box> */}
              </Box>
              <Box component={'ul'} className='flex items-center flex-shrink-0 space-x-6'>
                {/* <!-- Theme toggler --> */}
                <Box component={'li'} className='flex'>
                  <button
                    className='rounded-md focus:outline-none focus:shadow-outline-purple'
                    aria-label='Toggle color mode'
                  >
                    <template>
                      <svg className='w-5 h-5' aria-hidden='true' fill='currentColor' viewBox='0 0 20 20'>
                        <path d='M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z'></path>
                      </svg>
                    </template>
                    <template>
                      <svg className='w-5 h-5' aria-hidden='true' fill='currentColor' viewBox='0 0 20 20'>
                        <path
                          fillRule='evenodd'
                          d='M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z'
                          clipRule='evenodd'
                        ></path>
                      </svg>
                    </template>
                  </button>
                </Box>
                {/* <!-- Notifications menu --> */}
                <Box component={'li'} className='relative'>
                  <button
                    className='relative align-middle rounded-md focus:outline-none focus:shadow-outline-purple'
                    aria-label='Notifications'
                    aria-haspopup='true'
                  >
                    <svg className='w-5 h-5' aria-hidden='true' fill='currentColor' viewBox='0 0 20 20'>
                      <path d='M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z'></path>
                    </svg>
                    {/* <!-- Notification badge --> */}
                    <Box
                      component={'span'}
                      aria-hidden='true'
                      className='absolute top-0 right-0 inline-block w-3 h-3 transform translate-x-1 -translate-y-1 bg-red-600 border-2 border-white rounded-full dark:border-gray-800'
                    ></Box>
                  </button>
                  <template>
                    <Box
                      component={'ul'}
                      className='absolute right-0 w-56 p-2 mt-2 space-y-2 text-gray-600 bg-white border border-gray-100 rounded-md shadow-md dark:text-gray-300 dark:border-gray-700 dark:bg-gray-700'
                      aria-label='submenu'
                    >
                      <Box component={'li'} className='flex'>
                        <Box
                          component={'a'}
                          className='inline-flex items-center justify-between w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-200'
                          href='#'
                        >
                          <Box component={'span'}>Messages</Box>
                          <Box
                            component={'span'}
                            className='inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-600 bg-red-100 rounded-full dark:text-red-100 dark:bg-red-600'
                          >
                            13
                          </Box>
                        </Box>
                      </Box>
                      <Box component={'li'} className='flex'>
                        <Box
                          component={'a'}
                          className='inline-flex items-center justify-between w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-200'
                          href='#'
                        >
                          <Box component={'span'}>Sales</Box>
                          <Box
                            component={'span'}
                            className='inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-600 bg-red-100 rounded-full dark:text-red-100 dark:bg-red-600'
                          >
                            2
                          </Box>
                        </Box>
                      </Box>
                      <Box component={'li'} className='flex'>
                        <Box
                          component={'a'}
                          className='inline-flex items-center justify-between w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-200'
                          href='#'
                        >
                          <Box component={'span'}>Alerts</Box>
                        </Box>
                      </Box>
                    </Box>
                  </template>
                </Box>
                {/* <!-- Profile menu --> */}
                <Box component={'li'} className='relative'>
                  <button
                    className='align-middle rounded-full focus:shadow-outline-purple focus:outline-none'
                    aria-label='Account'
                    aria-haspopup='true'
                  >
                    <img
                      className='object-cover w-8 h-8 rounded-full'
                      src='https://images.unsplash.com/photo-1502378735452-bc7d86632805?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&s=aa3a807e1bbdfd4364d1f449eaa96d82'
                      alt=''
                      aria-hidden='true'
                    />
                  </button>
                  <template>
                    <Box
                      component={'ul'}
                      className='absolute right-0 w-56 p-2 mt-2 space-y-2 text-gray-600 bg-white border border-gray-100 rounded-md shadow-md dark:border-gray-700 dark:text-gray-300 dark:bg-gray-700'
                      aria-label='submenu'
                    >
                      <Box component={'li'} className='flex'>
                        <Box
                          component={'a'}
                          className='inline-flex items-center w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-200'
                          href='#'
                        >
                          <svg
                            className='w-4 h-4 mr-3'
                            aria-hidden='true'
                            fill='none'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth='2'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                          >
                            <path d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'></path>
                          </svg>
                          <Box component={'span'}>Profile</Box>
                        </Box>
                      </Box>
                      <Box component={'li'} className='flex'>
                        <Box
                          component={'a'}
                          className='inline-flex items-center w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-200'
                          href='#'
                        >
                          <svg
                            className='w-4 h-4 mr-3'
                            aria-hidden='true'
                            fill='none'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth='2'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                          >
                            <path d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'></path>
                            <path d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'></path>
                          </svg>
                          <Box component={'span'}>Settings</Box>
                        </Box>
                      </Box>
                      <Box component={'li'} className='flex'>
                        <Box
                          component={'a'}
                          className='inline-flex items-center w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-200'
                          href='#'
                        >
                          <svg
                            className='w-4 h-4 mr-3'
                            aria-hidden='true'
                            fill='none'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth='2'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                          >
                            <path d='M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1'></path>
                          </svg>
                          <Box component={'span'}>Log out</Box>
                        </Box>
                      </Box>
                    </Box>
                  </template>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box component={'main'} className='h-full pb-16 overflow-y-auto'></Box>
        </Box>
      </Box>
    </>
  )
}

export default AppLayout
