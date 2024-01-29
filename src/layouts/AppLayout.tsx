// ** React Imports
// ** MUI Imports
import { Box } from '@mui/material'
import { Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

// ** Hook Import
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import { ReactNode, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser } from 'src/@core/store/actions/userActions'
import { RootState } from 'src/@core/store/reducers'
import apiRequest from 'src/@core/utils/axios-config'
import AppHeaderComponent from './components/AppHeader.component'
import AppNavbarComponent from './components/AppNavbar.component'

// ** Navigation Imports

interface Props {
  children: ReactNode
}

const AppLayout = ({ children }: Props) => {
  // ** Hooks
  const isDarkTheme = useSelector((state: RootState) => state.theme.isDark)
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'))
  const [token, setToken] = useState(Cookies.get('accessToken'))

  const router = useRouter()
  const dispatch = useDispatch()

  useEffect(() => {
    if (!token) {
      // If token is not present, redirect to the login page
      router.push('/auth/login')
    } else {
      //console.log(token)
      apiRequest
        .get('/user')
        .then(res => {
          dispatch(loginUser(res))
        })
        .catch(() => {
          Cookies.remove('accessToken')
          router.push('/auth/login')
        })
    }
  }, [])

  if (!token) {
    return <></>
  }

  return (
    <Box className={`flex h-screen bg-gray-50 dark:bg-gray-900 ${isDarkTheme ? 'theme-dark' : ''}`}>
      {/* <!-- Desktop sidebar --> */}
      <AppNavbarComponent />
      <Box className='flex flex-col flex-1' sx={{ marginLeft: '250px', width: '100%' }}>
        <AppHeaderComponent />
        <Box component={'main'} className='h-full pb-16 overflow-y-auto'>
          {children}
        </Box>
      </Box>
    </Box>
  )
}

export default AppLayout
