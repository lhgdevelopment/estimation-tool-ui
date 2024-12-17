import AddIcon from '@mui/icons-material/Add'
import { Box, Modal } from '@mui/material'
import React from 'react'
import WorkflowFormComponent from './form/Workflow.form.component'
import WorkflowListComponent from './list/Workflow.list.component'

export default function WorkflowComponent() {
  const [openCreateModal, setOpenCreateModal] = React.useState(false)
  const handleCreateModalOpen = () => setOpenCreateModal(true)
  const handleCreateModalClose = () => setOpenCreateModal(false)

  return (
    <>
      <Box className='container px-6 mx-auto'>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box component={'h1'} className='mt-5 mb-4 text-xl font-semibold text-gray-600 dark-d:text-gray-300'>
            Workflow
          </Box>
          <Box
            component={'button'}
            onClick={handleCreateModalOpen}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '40px',
              width: '40px',
              p: '0',
              ml: '20px',
              background: '#9333ea',
              minWidth: 'auto',
              color: '#fff',
              borderRadius: '50%',
              '&:hover': {
                background: '#7e22ce'
              }
            }}
          >
            <AddIcon />
          </Box>
        </Box>

        <WorkflowListComponent />

        <Modal
          open={openCreateModal}
          onClose={handleCreateModalClose}
          aria-labelledby='modal-modal-title'
          aria-describedby='modal-modal-description'
        >
          <Box
            sx={{
              position: 'absolute' as const,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100%',
              maxWidth: '500px',
              bgcolor: 'background.paper',
              boxShadow: 24,
              borderRadius: 2
            }}
          >
            <WorkflowFormComponent editId={''} onClose={handleCreateModalClose} />
          </Box>
        </Modal>
      </Box>
    </>
  )
}
