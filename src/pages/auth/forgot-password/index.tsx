import { Box } from '@mui/material'
import { ReactNode } from 'react'

import BlankLayout from 'src/layouts/BlankLayout'

const LoginPage = () => {
  return (
    <Box className='flex items-center min-h-screen p-6 bg-gray-50 dark-d:bg-gray-900'>
      <Box className='flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark-d:bg-gray-800'>
        <Box className='flex flex-col overflow-y-auto md:flex-row'>
          <Box className='h-32 md:h-auto md:w-1/2'>
            <img
              aria-hidden='true'
              className='object-cover w-full h-full dark-d:hidden'
              src='/img/forgot-password-office.jpeg'
              alt='Office'
            />
            <img
              aria-hidden='true'
              className='hidden object-cover w-full h-full dark-d:block'
              src='/img/forgot-password-office-dark.jpeg'
              alt='Office'
            />
          </Box>
          <Box className='flex items-center justify-center p-6 sm:p-12 md:w-1/2'>
            <Box className='w-full'>
              <h1 className='mb-4 text-xl font-semibold text-gray-700 dark-d:text-gray-200'>Forgot password</h1>
              <label className='block text-sm'>
                <span className='flex text-gray-700 dark-d:text-gray-400 mb-1'>Email</span>
                <input
                  className='block w-full mt-1 text-sm dark-d:border-gray-600 dark-d:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark-d:text-gray-300 dark-d:focus:shadow-outline-gray form-input'
                  placeholder='Jane Doe'
                />
              </label>

              <button className='block w-full px-4 py-2 mt-4 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple'>
                Recover password
              </button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

LoginPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default LoginPage
