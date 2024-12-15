import { Box } from '@mui/material'
import WorkflowListComponent from './list/Workflow.list.component'

export default function WorkflowComponent() {
  return (
    <>
      <Box className='container px-6 mx-auto'>
        <Box component={'h1'} className='mt-5 mb-4 text-xl font-semibold text-gray-600 dark-d:text-gray-300'>
          Workflow
        </Box>
        <WorkflowListComponent />
      </Box>
    </>
  )
}
