import { RootState } from '@core/store/reducers'
import HiveIcon from '@mui/icons-material/Hive'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { Box } from '@mui/material'
import HomeOutline from 'mdi-material-ui/HomeOutline'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { Fragment, useState } from 'react'
import { useSelector } from 'react-redux'
import navigation from 'src/navigation'

export default function AppNavbarComponent() {
  const router = useRouter()
  const user = useSelector((state: RootState) => state?.user?.user)
  const isNavbarCollapsed = useSelector((state: RootState) => state?.settings?.isNavbarCollapsed)

  const [dropdownOpen, setDropdownOpen] = useState('')

  return (
    <Fragment>
      <Box
        sx={{
          width: isNavbarCollapsed ? '90px' : '280px',
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          transition: 'width 0.3s',
          overflowY: 'auto',
          backgroundColor: 'white',
          zIndex: 20,
          '.dark-d &': {
            backgroundColor: 'gray.800'
          },
          '& .nav-item-title': {
            display: isNavbarCollapsed ? 'none' : 'block'
          },
          '&:hover': {
            width: '280px',
            backgroundColor: 'gray.50', // Light mode hover color
            '.dark-d &': {
              backgroundColor: 'gray.700' // Dark mode hover color
            },
            transition: 'background-color 0.3s, width 0.3s',
            '& .nav-item-title': {
              display: 'block'
            }
          }
        }}
      >
        <Box sx={{ py: 4, textAlign: 'center', color: 'gray.500' }}>
          <Box
            component='a'
            href='/'
            sx={{
              display: 'block',
              fontSize: '1.25rem',
              fontWeight: 'bold',
              color: 'gray.800',
              '.dark-d &': { color: 'gray.200' },
              '&:hover': {
                color: 'purple.600',
                transition: 'color 0.3s'
              }
            }}
          >
            <Box component={'span'}>
              {isNavbarCollapsed ? <HiveIcon sx={{ color: '#9333ea', fontSize: '2rem' }} /> : 'The Hive'}
            </Box>
          </Box>
        </Box>

        <Box component='ul' sx={{ mt: 6 }}>
          {navigation
            ?.filter(nav => !nav?.accessBy?.length || nav?.accessBy?.includes(user?.role))
            ?.map((nav, index) => (
              <Box component='li' key={index} sx={{ px: 6, py: 3, position: 'relative' }}>
                {nav.subMenu?.length ? (
                  <>
                    {router.pathname.split('/').includes(nav.path.replaceAll('/', '')) && (
                      <Box
                        sx={{
                          position: 'absolute',
                          insetY: 0,
                          left: 0,
                          width: '4px',
                          backgroundColor: 'purple.600',
                          borderRadius: '0 4px 4px 0'
                        }}
                      />
                    )}

                    <Box
                      component='button'
                      onClick={() => setDropdownOpen(prev => (prev === `submenu_${index}` ? '' : `submenu_${index}`))}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%',
                        alignItems: 'center',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: router.pathname.split('/').includes(nav.path.replaceAll('/', ''))
                          ? 'gray.800'
                          : 'gray.500',
                        '.dark-d &': {
                          color: router.pathname.split('/').includes(nav.path.replaceAll('/', ''))
                            ? 'gray.200'
                            : 'gray.400'
                        },
                        '&:hover': {
                          color: 'purple.600', // Hover color for buttons
                          transition: 'color 0.3s'
                        }
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center' }}>
                        {React.createElement(nav.icon || HomeOutline)}
                        <span className='nav-item-title' style={{ marginLeft: '1rem' }}>
                          {nav.title}
                        </span>
                      </span>
                      <KeyboardArrowDownIcon />
                    </Box>

                    <Box
                      component='ul'
                      sx={{
                        display: dropdownOpen === `submenu_${index}` ? 'block' : 'none',
                        p: 2,
                        mt: 2,
                        backgroundColor: 'gray.50',
                        borderRadius: '4px',
                        boxShadow: 1,
                        '.dark-d &': { backgroundColor: 'gray.900' },
                        '& li:hover': {
                          color: 'purple.600',
                          transition: 'color 0.3s'
                        }
                      }}
                    >
                      {nav.subMenu.map((subNav, subIndex) => (
                        <Box key={subIndex} component='li' sx={{ px: 2, py: 1 }}>
                          <Box
                            component='a'
                            href={subNav.path || ''}
                            target={subNav.path?.startsWith('http') ? '_blank' : '_self'}
                            sx={{
                              display: 'block',
                              width: '100%',
                              '&:hover': {
                                color: 'gray.800',
                                '.dark-d &': { color: 'gray.200' }
                              }
                            }}
                          >
                            {subNav.title}
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </>
                ) : (
                  <Box
                    component='a'
                    href={nav.path || ''}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: router.pathname === nav.path ? 'gray.800' : 'gray.500',
                      '.dark-d &': {
                        color: router.pathname === nav.path ? 'gray.200' : 'gray.400'
                      },
                      '&:hover': {
                        color: 'purple.600',
                        transition: 'color 0.3s'
                      }
                    }}
                  >
                    {React.createElement(nav.icon || HomeOutline)}
                    <span className='nav-item-title' style={{ marginLeft: '1rem' }}>
                      {nav.title}
                    </span>
                  </Box>
                )}
              </Box>
            ))}
          <Box className='px-4 my-2'>
            <Link href={'/ai-assistant'} passHref>
              <Box
                component={'span'}
                className={`inline-flex items-center  w-full px-2 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg  focus:outline-none focus:shadow-outline-purple hover:text-white hover:bg-purple-700 ${
                  isNavbarCollapsed ? 'justify-center' : ''
                }`}
              >
                <HiveIcon />

                <Box className='nav-item-title ml-4' component={'span'}>
                  Hive Assist
                </Box>
              </Box>
            </Link>
          </Box>
        </Box>
      </Box>
    </Fragment>
  )
}
