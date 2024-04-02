// ** React Imports
// ** MUI Imports
import { Box } from '@mui/material'

// ** Hook Import
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import { ReactNode, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { isDarkTheme, loginUser } from 'src/@core/store/actions/userActions'
import { RootState } from 'src/@core/store/reducers'
import apiRequest from 'src/@core/utils/axios-config'
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

  useEffect(() => {
    document.body.classList.toggle('theme-dark', isDark)
  }, [isDark])

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
    <Box className={`flex bg-gray-50 dark:bg-gray-900 }`} sx={{ minHeight: '100vh' }}>
      {/* <!-- Desktop sidebar --> */}
      <AppNavbarComponent />
      <Box className='flex flex-col flex-1' sx={{ marginLeft: '280px', width: 'calc(100% - 280px)calc()' }}>
        <AppHeaderComponent />
        <Box component={'main'} className='h-full'>
          {children}
        </Box>
        <AppBackToTopButton />
      </Box>
    </Box>
  )
}

export default AppLayout
