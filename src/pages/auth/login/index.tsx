import Cookies from 'js-cookie'
import React, { MouseEvent, ReactNode, useEffect, useState } from 'react'

import LoadingButton from '@mui/lab/LoadingButton'
import { Box, CircularProgress } from '@mui/material'
import MuiCard, { CardProps } from '@mui/material/Card'
import MuiFormControlLabel, { FormControlLabelProps } from '@mui/material/FormControlLabel'
import { styled } from '@mui/material/styles'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useToastSnackbar } from 'src/@core/hooks/useToastSnackbar'
import BlankLayout from 'src/layouts/BlankLayout'

// Styled Components
const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' }
}))

const LinkStyled = styled('a')(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const FormControlLabel = styled(MuiFormControlLabel)<FormControlLabelProps>(({ theme }) => ({
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}))

const LoginPage = () => {
  const { showSnackbar } = useToastSnackbar()
  const [preload, setPreload] = useState<boolean>(false)
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const [errorMessage, setErrorMessage] = useState('')

  const handleTextChange = (e: React.ChangeEvent<any>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent<any>) => {
    e.preventDefault()
    setErrorMessage('')
    setPreload(true)
    axios
      .post(`${process.env['API_BASE_URL']}/login`, formData)
      .then(response => {
        const { token } = response.data
        Cookies.set('accessToken', token)
        router.back() // Redirect to previous page or another route upon successful login
      })
      .catch(error => {
        setPreload(false)
        const errorMessage = error?.response?.data?.errors || 'Login failed'
        setErrorMessage(errorMessage)
        showSnackbar(errorMessage, { variant: 'error' })
      })
  }

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  useEffect(() => {
    const token = Cookies.get('accessToken')
    if (token) {
      router.push('/') // Redirect to homepage if already logged in
    }
  }, [])

  return (
    <Box className='flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900'>
      <Box className='flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800'>
        <Box className='flex flex-col overflow-y-auto md:flex-row'>
          <Box className='h-32 md:h-auto md:w-1/2'>
            <img
              aria-hidden='true'
              className='object-cover w-full h-full dark:hidden'
              src='/img/login-office.jpeg'
              alt='Office'
            />
            <img
              aria-hidden='true'
              className='hidden object-cover w-full h-full dark:block'
              src='/img/login-office-dark.jpeg'
              alt='Office'
            />
          </Box>
          <Box className='flex items-center justify-center p-6 sm:p-12 md:w-1/2'>
            <Box className='w-full'>
              <h1 className='mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200'>Login</h1>
              <label className='block text-sm'>
                <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Email</span>
                <input
                  className={`block w-full mt-1 text-sm dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input ${
                    errorMessage ? 'border-red-600' : 'dark:border-gray-600 '
                  }`}
                  placeholder='Jane Doe'
                  type='text'
                  name='email'
                  onChange={handleTextChange}
                  disabled={preload}
                />
              </label>
              <label className='block mt-4 text-sm'>
                <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Password</span>
                <input
                  className={`block w-full mt-1 text-sm dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input ${
                    errorMessage ? 'border-red-600' : 'dark:border-gray-600 '
                  }`}
                  placeholder='***************'
                  type='password'
                  name='password'
                  onChange={handleTextChange}
                  disabled={preload}
                />
              </label>

              {!!errorMessage && <p className='text-sm text-red-600 dark:text-red-400 mt-5'>{errorMessage}</p>}

              <LoadingButton
                type='submit'
                onClick={handleSubmit}
                className='block w-full px-4 py-2 mt-4 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple'
                loading={preload}
                startIcon={preload ? <CircularProgress size={20} color='inherit' /> : null}
                variant='contained'
                sx={{ mt: '15px' }}
              >
                Log in
              </LoadingButton>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

LoginPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default LoginPage
