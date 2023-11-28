// ** React Imports
// ** MUI Imports
import { Box } from '@mui/material'
import { Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

// ** Hook Import
import { useRouter } from 'next/router'
import { ReactNode } from 'react'
import { useDispatch } from 'react-redux'
import { useSettings } from 'src/@core/hooks/useSettings'
import AppHeaderComponent from './components/AppHeader.component'
import AppNavbarComponent from './components/AppNavbar.component'

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

  // useEffect(() => {
  //   const token = Cookies.get('accessToken')

  //   if (!token) {
  //     // If token is not present, redirect to the login page
  //     router.push('/auth/login')
  //   } else {
  //     //console.log(token)
  //     apiRequest
  //       .get('/user')
  //       .then(res => {
  //         console.log(res)
  //         dispatch(loginUser(res))
  //       })
  //       .catch(() => {
  //         Cookies.remove('accessToken')
  //         router.push('/auth/login')
  //       })
  //   }
  // }, [])

  return (
    <>
      <Box className='flex h-screen bg-gray-50 dark:bg-gray-900'>
        {/* <!-- Desktop sidebar --> */}
        <AppNavbarComponent />
        <Box className='flex flex-col flex-1'>
          <AppHeaderComponent />
          <Box component={'main'} className='h-full pb-16 overflow-y-auto'>
            {children}
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default AppLayout
