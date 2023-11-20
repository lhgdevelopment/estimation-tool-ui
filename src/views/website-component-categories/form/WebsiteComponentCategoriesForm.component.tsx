import AddIcon from '@material-ui/icons/Add'
import ClearIcon from '@material-ui/icons/Clear'
import { Box } from '@mui/material'
import { Fragment } from 'react'

export default function WebsiteComponentCategoriesFormComponent() {
  return (
    <Fragment>
      <Box className='p-5 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800'>
        <Box>
          <label className='block text-sm'>
            <span className='text-gray-700 dark:text-gray-400'>Name</span>
            <input
              className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
              placeholder='Examples: Header, Footer, etc'
            />
          </label>
        </Box>
        <Box className='my-4 text-right'>
          <button className='px-4 py-2 mr-3 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-red-600 border border-transparent rounded-lg active:bg-red-600 hover:bg-red-700 focus:outline-none focus:shadow-outline-red'>
            Clear <ClearIcon />
          </button>
          <button className='px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-green-600 border border-transparent rounded-lg active:bg-green-600 hover:bg-green-700 focus:outline-none focus:shadow-outline-green'>
            Add <AddIcon />
          </button>
        </Box>
      </Box>
    </Fragment>
  )
}
