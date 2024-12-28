import AddIcon from '@mui/icons-material/Add'
import { Box, Dialog, DialogContent } from '@mui/material'
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

        <Dialog
          open={openCreateModal}
          onClose={handleCreateModalClose}
          className='glass-modal'
          aria-labelledby='modal-modal-title'
          aria-describedby='modal-modal-description'
          fullWidth
          PaperProps={{
            className: 'glass-modal'
          }}
        >
          <DialogContent>
            <WorkflowFormComponent editId={''} onClose={handleCreateModalClose} />
          </DialogContent>
        </Dialog>
      </Box>
    </>
  )
}
