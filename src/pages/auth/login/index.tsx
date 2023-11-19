import Cookies from 'js-cookie'
import React, { MouseEvent, ReactNode, useEffect, useState } from 'react'

import MuiCard, { CardProps } from '@mui/material/Card'
import MuiFormControlLabel, { FormControlLabelProps } from '@mui/material/FormControlLabel'
import { styled } from '@mui/material/styles'

import { Box } from '@mui/material'
import axios from 'axios'
import BlankLayout from 'src/layouts/BlankLayout'

// ** Styled Components
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
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    showPassword: false
  })

  const handleChange = (e: React.ChangeEvent<any>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent<any>) => {
    e.preventDefault()

    await axios
      .post(`${process.env['API_BASE_URL']}/login`, formData)
      .then(response => {
        console.log(response)

        const { token } = response.data

        // Set the token in a cookie
        Cookies.set('accessToken', token)

        // Redirect to the desired page (e.g., /dashboard)
        window.location.href = '/'
      })
      .catch(error => {
        console.error('Login failed:', error)
      })
  }

  const handleClickShowPassword = () => {
    setFormData(prevFormData => ({
      ...prevFormData,
      showPassword: !prevFormData.showPassword
    }))
  }

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  useEffect(() => {
    const token = Cookies.get('accessToken')

    if (token) {
      window.location.href = '/'
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
                <span className='text-gray-700 dark:text-gray-400'>Email</span>
                <input
                  className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                  placeholder='Jane Doe'
                  onChange={e => handleChange(e)}
                />
              </label>
              <label className='block mt-4 text-sm'>
                <span className='text-gray-700 dark:text-gray-400'>Password</span>
                <input
                  className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                  placeholder='***************'
                  type='password'
                  onChange={e => handleChange(e)}
                />
              </label>

              <button
                type='submit'
                onClick={handleSubmit}
                className='block w-full px-4 py-2 mt-4 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple'
              >
                Log in
              </button>

              <hr className='my-8' />

              <p className='mt-4'>
                <Box
                  component={'a'}
                  className='text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline'
                  href='/auth/forgot-password'
                >
                  Forgot your password?
                </Box>
              </p>
              <p className='mt-1'>
                <Box
                  component={'a'}
                  className='text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline'
                  href='/auth/create-account'
                >
                  Create account
                </Box>
              </p>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

LoginPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default LoginPage
