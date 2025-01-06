// ** React Imports
// ** MUI Imports
import { Box } from '@mui/material'

// ** Hook Import
import { logedinUser } from '@core/store/actions'
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
  const refreshToken = Cookies.get('refreshToken')
  const isDark = useSelector((state: RootState) => state.theme.isDark)
  const isNavbarCollapsed = useSelector((state: RootState) => state?.settings?.isNavbarCollapsed)

  // useEffect(() => {
  //   const storedTheme = Cookies.get('isDark')
  //   if (storedTheme !== undefined) {
  //     dispatch(isDarkTheme(storedTheme === 'true'))
  //   } else {
  //     dispatch(isDarkTheme(isDark))
  //   }
  // }, [dispatch, isDark])

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!token) {
          handleLogout()
        } else {
          const response = await apiRequest.get('/user')
          dispatch(logedinUser(response))
          localStorage.setItem('logedinUser', JSON.stringify(response))
        }
      } catch (err: any) {
        if (err.response?.status === 401 && refreshToken) {
          try {
            const refreshResponse = await apiRequest.post('/api/refresh', { token: refreshToken })
            Cookies.set('accessToken', refreshResponse.data.accessToken, { secure: true })
            Cookies.set('refreshToken', refreshResponse.data.refreshToken, { secure: true })
            fetchUserData()
          } catch (refresherr) {
            handleLogout()
          }
        } else {
          handleLogout()
        }
      }
    }

    const handleLogout = () => {
      Cookies.remove('accessToken')
      Cookies.remove('refreshToken')
      localStorage.removeItem('logedinUser')
      router.push('/auth/login')
    }

    fetchUserData()
  }, [dispatch, router, token, refreshToken])

  if (!token) {
    return null
  }

  return (
    <Box className={'flex'} sx={{ minHeight: '100vh' }}>
      <AppNavbarComponent></AppNavbarComponent>
      <Box
        className='flex flex-col flex-1'
        sx={{
          marginLeft: isNavbarCollapsed ? '90px' : '280px',
          width: isNavbarCollapsed ? 'calc(100% - 90px)' : 'calc(100% - 280px)'
        }}
      >
        <AppHeaderComponent></AppHeaderComponent>
        <Box sx={{ mt: '50px' }} className='h-full'>
          {children}
        </Box>
        <AppBackToTopButton></AppBackToTopButton>
      </Box>
    </Box>
  )
}

export default AppLayout
