// ** React Imports
// ** MUI Imports
import { Box } from '@mui/material'

// ** Hook Import
import { isDarkTheme, loginUser } from '@core/store/actions'
import { RootState } from '@core/store/reducers'
import apiRequest from '@core/utils/axios-config'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import { ReactNode, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AppBackToTopButton from './components/AppBackToTopButton.component'
import AppHeaderComponent from './components/AppHeader.component'
import AppNavbarComponent from './components/AppNavbar.component'

// ** Navigation Imports

interface Props {
  children: ReactNode
}

const AppLayout = ({ children }: Props) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const token = Cookies.get('accessToken')
  const isDark = useSelector((state: RootState) => state.theme.isDark)
  const isNavbarCollapsed = useSelector((state: RootState) => state?.settings?.isNavbarCollapsed)
  // useEffect(() => {
  //   document.body.classList.toggle('theme-dark', isDark)
  // }, [isDark])

  useEffect(() => {
    const storedTheme = Cookies.get('isDark')
    const isDarkFromRedux = isDark
    if (storedTheme !== undefined) {
      dispatch(isDarkTheme(storedTheme === 'true'))
    } else {
      dispatch(isDarkTheme(isDarkFromRedux))
    }
  }, [dispatch, isDark, token])
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) {
          router.push('/auth/login')
        } else {
          const res = await apiRequest.get('/user')
          dispatch(loginUser(res))
        }
      } catch (error) {
        Cookies.remove('accessToken')
        router.push('/auth/login')
      }
    }

    fetchData()
  }, [router])

  if (!token) {
    return <></>
  }

  return (
    <Box className={`flex bg-gray-50 dark-d:bg-gray-900`} sx={{ minHeight: '100vh' }}>
      {/* <!-- Desktop sidebar --> */}
      <AppNavbarComponent />
      <Box
        className='flex flex-col flex-1'
        sx={{
          marginLeft: isNavbarCollapsed ? '90px' : '280px',
          width: isNavbarCollapsed ? 'calc(100% - 90px)' : 'calc(100% - 280px)'
        }}
      >
        <AppHeaderComponent />
        <Box sx={{ mt: '50px' }} component={'main'} className='h-full'>
          {children}
        </Box>
        <AppBackToTopButton />
      </Box>
    </Box>
  )
}

export default AppLayout
