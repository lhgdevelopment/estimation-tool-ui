import { isDarkTheme, isNavbarCollapsed } from '@core/store/actions'
import { RootState } from '@core/store/reducers'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { Box } from '@mui/material'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import { Fragment, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

export default function AppHeaderComponent() {
  const dispatch = useDispatch()
  const router = useRouter()
  const isDark = useSelector((state: RootState) => state.theme.isDark)
  const settings = useSelector((state: RootState) => state.settings)
  const [isOpenProfileDropdown, setIsOpenProfileDropdown] = useState<boolean>(false)
  const [isOpenNotificationDropdown, setIsOpenNotificationDropdown] = useState<boolean>(false)

  const toggleTheme = () => {
    Cookies.set('isDark', (!isDark).toString())
    dispatch(isDarkTheme(!isDark))
  }

  const toggleNavbar = () => {
    console.log(settings)
    Cookies.set('isNavbarCollapsed', (!settings?.isNavbarCollapsed).toString())
    dispatch(isNavbarCollapsed(!settings?.isNavbarCollapsed))
  }

  const handleLogout = () => {
    Cookies.remove('accessToken')
    router.push('/auth/login')
  }

  return (
    <Fragment>
      <Box
        component={'header'}
        className='z-10 py-2 bg-white shadow-md dark-d:bg-gray-800'
        sx={{
          width: settings?.isNavbarCollapsed ? 'calc(100% - 90px)' : 'calc(100% - 280px)',
          position: 'fixed',
          top: 0,
          left: settings?.isNavbarCollapsed ? '90px' : '280px',
          right: 0
        }}
      >
        <Box className='container flex items-center justify-between h-full px-6 mx-auto text-purple-600 dark-d:text-purple-300'>
          {/* <!-- Mobile hamburger --> */}
          <Box component={'button'} onClick={toggleNavbar} className='p-1 -ml-1 mr-5 rounded-md' aria-label='Menu'>
            {settings?.isNavbarCollapsed ? (
              <svg className='w-6 h-6' aria-hidden='true' fill='currentColor' viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                  clipRule='evenodd'
                ></path>
              </svg>
            ) : (
              // Hamburger Icon when expanded
              <svg className='w-6 h-6' aria-hidden='true' fill='currentColor' viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z'
                  clipRule='evenodd'
                ></path>
              </svg>
            )}
          </Box>
          <Box component={'button'} className='p-1 -ml-1 mr-5 rounded-md md:hidden' aria-label='Menu'>
            <svg className='w-6 h-6' aria-hidden='true' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z'
                clipRule='evenodd'
              ></path>
            </svg>
          </Box>
          {/* <!-- Search input --> */}
          <Box className='flex justify-center flex-1 lg:mr-32'></Box>
          <Box component={'ul'} className='flex items-center flex-shrink-0 space-x-6'>
            {/* <!-- Theme toggler --> */}
            <Box component={'li'} className='flex'>
              <Box
                component={'button'}
                className='rounded-md focus:outline-none focus:shadow-outline-purple'
                aria-label='Toggle color mode'
                onClick={toggleTheme}
              >
                {!isDark && (
                  <Box>
                    <svg className='w-5 h-5' aria-hidden='true' fill='currentColor' viewBox='0 0 20 20'>
                      <path d='M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z'></path>
                    </svg>
                  </Box>
                )}
                {isDark && (
                  <Box>
                    <svg className='w-5 h-5' aria-hidden='true' fill='currentColor' viewBox='0 0 20 20'>
                      <path
                        fillRule='evenodd'
                        d='M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z'
                        clipRule='evenodd'
                      ></path>
                    </svg>
                  </Box>
                )}
              </Box>
            </Box>
            {/* <!-- Notifications menu --> */}
            <Box component={'li'} className='relative'>
              <Box
                component={'button'}
                className='relative align-middle rounded-md focus:outline-none focus:shadow-outline-purple'
                aria-label='Notifications'
                aria-haspopup='true'
                onClick={() => {
                  setIsOpenNotificationDropdown(prevState => !prevState)
                }}
              >
                <svg className='w-5 h-5' aria-hidden='true' fill='currentColor' viewBox='0 0 20 20'>
                  <path d='M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z'></path>
                </svg>
                {/* <!-- Notification badge --> */}
                <Box
                  component={'span'}
                  aria-hidden='true'
                  className='absolute top-0 right-0 inline-block w-3 h-3 transform translate-x-1 -translate-y-1 bg-red-600 border-2 border-white rounded-full dark-d:border-gray-800'
                ></Box>
              </Box>
              {!!isOpenNotificationDropdown && (
                <Box>
                  <Box
                    component={'ul'}
                    className='absolute right-0 w-56 p-2 mt-2 space-y-2 text-gray-600 bg-white border border-gray-100 rounded-md shadow-md dark-d:text-gray-300 dark-d:border-gray-700 dark-d:bg-gray-700'
                    aria-label='submenu'
                  >
                    <Box component={'li'} className='flex'>
                      <Box
                        component={'a'}
                        className='inline-flex items-center justify-between w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800 dark-d:hover:bg-gray-800 dark-d:hover:text-gray-200'
                        href='#'
                      >
                        <Box component={'span'}>Messages</Box>
                        <Box
                          component={'span'}
                          className='inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-600 bg-red-100 rounded-full dark-d:text-red-100 dark-d:bg-red-600'
                        >
                          13
                        </Box>
                      </Box>
                    </Box>
                    <Box component={'li'} className='flex'>
                      <Box
                        component={'a'}
                        className='inline-flex items-center justify-between w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800 dark-d:hover:bg-gray-800 dark-d:hover:text-gray-200'
                        href='#'
                      >
                        <Box component={'span'}>Sales</Box>
                        <Box
                          component={'span'}
                          className='inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-600 bg-red-100 rounded-full dark-d:text-red-100 dark-d:bg-red-600'
                        >
                          2
                        </Box>
                      </Box>
                    </Box>
                    <Box component={'li'} className='flex'>
                      <Box
                        component={'a'}
                        className='inline-flex items-center justify-between w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800 dark-d:hover:bg-gray-800 dark-d:hover:text-gray-200'
                        href='#'
                      >
                        <Box component={'span'}>Alerts</Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
            {/* <!-- Profile menu --> */}
            <Box component={'li'} className='relative'>
              <Box
                component={'button'}
                className='align-middle rounded-full focus:shadow-outline-purple focus:outline-none'
                aria-label='Account'
                aria-haspopup='true'
                onClick={() => {
                  setIsOpenProfileDropdown(prevState => !prevState)
                }}
              >
                <AccountCircleIcon />
              </Box>
              {!!isOpenProfileDropdown && (
                <Box>
                  <Box
                    component={'ul'}
                    className='absolute right-0 w-56 p-2 mt-2 space-y-2 text-gray-600 bg-white border border-gray-100 rounded-md shadow-md dark-d:border-gray-700 dark-d:text-gray-300 dark-d:bg-gray-700'
                    aria-label='submenu'
                  >
                    <Box component={'li'} className='flex'>
                      <Box
                        component={'a'}
                        className='inline-flex items-center w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800 dark-d:hover:bg-gray-800 dark-d:hover:text-gray-200'
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
                        className='inline-flex items-center w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800 dark-d:hover:bg-gray-800 dark-d:hover:text-gray-200'
                        href='/settings/update-log/timeline/'
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
                        <Box component={'span'}>Update Log</Box>
                      </Box>
                    </Box>
                    <Box component={'li'} className='flex'>
                      <Box
                        component={'button'}
                        className='inline-flex items-center w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800 dark-d:hover:bg-gray-800 dark-d:hover:text-gray-200'
                        onClick={() => {
                          handleLogout()
                        }}
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
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Fragment>
  )
}
