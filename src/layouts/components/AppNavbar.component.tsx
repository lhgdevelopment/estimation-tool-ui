import AccountTreeIcon from '@mui/icons-material/AccountTree'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { Box } from '@mui/material'
import HomeOutline from 'mdi-material-ui/HomeOutline'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { Fragment, useState } from 'react'
import navigation from 'src/navigation'

export default function AppNavbarComponent() {
  const router = useRouter()
  const [dropdownOpen, setDropdownOpen] = useState('')

  return (
    <Fragment>
      <Box
        sx={{ width: '250px', height: '100vh', position: 'fixed', top: '0', left: '0' }}
        className='z-20 hidden w-64 overflow-y-auto bg-white dark:bg-gray-800 md:block flex-shrink-0'
      >
        <Box className='py-4 text-gray-500 dark:text-gray-400 '>
          <Box className={'text-center'}>
            <Box component={'a'} className='text-lg font-bold text-gray-800 dark:text-gray-200 leading-3' href='#'>
              The Hive
            </Box>
          </Box>
          <Box component={'ul'} className='mt-6'>
            <Box component={'li'} className='relative px-6 py-3'>
              <Box
                component={'a'}
                href={'/'}
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
            </Box>
          </Box>
          <Box component={'ul'}>
            {navigation?.map((nav, index) =>
              nav.subMenu?.length ? (
                <Box component={'li'} key={index} className='relative px-6 py-3'>
                  {router.pathname.split('/')?.[1] == (nav?.subMenu?.[0]?.path || '').split('/')?.[1] && (
                    <Box
                      component={'span'}
                      className='absolute inset-y-0 left-0 w-1 bg-purple-600 rounded-tr-lg rounded-br-lg'
                      aria-hidden='true'
                    ></Box>
                  )}

                  <Box
                    component={'button'}
                    className='inline-flex items-center justify-between w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200'
                    aria-haspopup='true'
                    onClick={() => {
                      setDropdownOpen(prevState => (prevState == `submenu_${index}` ? '' : `submenu_${index}`))
                    }}
                  >
                    <span className='inline-flex items-center'>
                      {React.createElement(nav.icon ? nav.icon : HomeOutline)}
                      <span className='ml-4'>{nav.title}</span>
                    </span>
                    <KeyboardArrowDownIcon />
                  </Box>
                  <>
                    <Box
                      component={'ul'}
                      className={`p-2 mt-2 space-y-2 overflow-hidden text-sm font-medium text-gray-500 rounded-md shadow-inner bg-gray-50 dark:text-gray-400 dark:bg-gray-900 ${
                        dropdownOpen === 'submenu_' + index
                          ? ''
                          : nav.subMenu?.filter(subMenu => subMenu.path === router.pathname).length
                          ? ''
                          : 'hidden'
                      }`}
                      aria-label='submenu'
                    >
                      {nav?.subMenu?.map((subNav, subIndex) => (
                        <Box
                          key={subIndex}
                          component={'li'}
                          className={`px-2 py-1 transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200 ${
                            router.pathname == subNav.path ? 'text-gray-800' : ''
                          }`}
                        >
                          <Box
                            component={'a'}
                            className='w-full'
                            href={subNav.path ? subNav.path : ''}
                            target={subNav.path?.indexOf('http') !== -1 ? '_blank' : ''}
                          >
                            {subNav.title}
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </>
                </Box>
              ) : (
                <Box component={'li'} key={index} className='relative px-6 py-3'>
                  {router.pathname == nav.path && (
                    <Box
                      component={'span'}
                      className='absolute inset-y-0 left-0 w-1 bg-purple-600 rounded-tr-lg rounded-br-lg'
                      aria-hidden='true'
                    ></Box>
                  )}

                  <Box
                    component={'a'}
                    href={nav.path ? nav.path : ''}
                    className={`inline-flex items-center w-full text-sm font-semibold  transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200 dark:text-gray-100 ${
                      router.pathname == nav.path ? 'text-gray-800' : ''
                    }`}
                  >
                    {React.createElement(nav.icon ? nav.icon : HomeOutline)}
                    <Box component={'span'} className='ml-4'>
                      {nav.title}
                    </Box>
                  </Box>
                </Box>
              )
            )}
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
            The Hive
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
