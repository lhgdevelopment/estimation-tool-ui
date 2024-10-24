import { Box } from '@mui/material'

export default function AIAssistantComponent() {
  return (
    <>
      <Box className='container px-6 mx-auto' sx={{ height: 'calc(100vh - 126px)', position: 'relative' }}>
        <Box></Box>
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            bottom: '0',
            left: '0',
            right: '0'
          }}
        >
          <Box
            component={'textarea'}
            id='prompt-textarea'
            placeholder='Chat Prompt...'
            rows={1}
            className='block w-full mt-1 text-sm dark-d:text-gray-300 dark-d:border-gray-600 dark-d:bg-gray-700 form-select focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark-d:focus:shadow-outline-gray'
            sx={{ height: '40px', overflowY: 'hidden' }}
          ></Box>
        </Box>
      </Box>
    </>
  )
}
