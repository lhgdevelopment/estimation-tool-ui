import { Dropdown } from '@core/components/dropdown'
import { useToastSnackbar } from '@core/hooks/useToastSnackbar'
import apiRequest from '@core/utils/axios-config'
import AddIcon from '@mui/icons-material/Add'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import DeleteIcon from '@mui/icons-material/Delete'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Typography
} from '@mui/material'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'

export default function WorkflowEditorComponent() {
  const [steps, setSteps] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editStepId, setEditStepId] = useState<number | null>(null)
  const [title, setTitle] = useState('')
  const [serial, setSerial] = useState<number | null>(null) // Serial state
  const [selectedPrompt, setSelectedPrompt] = useState('')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [currentStep, setCurrentStep] = useState<number | null>(null)
  const [addAfterIndex, setAddAfterIndex] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [modalError, setModalError] = useState<string | null>(null)
  const router = useRouter()
  const workflowId = router.query.id
  const { showSnackbar } = useToastSnackbar()

  // Fetch Workflow Steps
  const getWorkflowSteps = async () => {
    if (!workflowId) return
    await apiRequest
      .get(`/workflow-steps?workflow_id=${workflowId}`)
      .then(res => {
        setSteps(res?.data)
        setError(null)
      })
      .catch(error => {
        console.error('Error fetching workflow steps:', error)
        setError('Failed to load workflow steps. Please try again.')
        showSnackbar(error?.response?.data?.message, { variant: 'error' })
      })
  }

  useEffect(() => {
    getWorkflowSteps()
  }, [workflowId])

  // Add Step
  const handleAddStep = () => {
    const serialValue = addAfterIndex !== null ? steps[addAfterIndex].serial + 1 : steps.length + 1
    const payload = {
      workflow_id: workflowId,
      prompt_id: selectedPrompt,
      serial: serialValue,
      title
    }
    apiRequest
      .post('/workflow-steps', payload)
      .then(res => {
        const updatedSteps = [...steps]
        if (addAfterIndex !== null) {
          updatedSteps.splice(addAfterIndex + 1, 0, res.data)
        } else {
          updatedSteps.push(res.data)
        }
        setSteps(updatedSteps)
        setModalError(null)
        showSnackbar('Created Successfully!', { variant: 'success' })
        handleModalClose()
      })
      .catch(error => {
        console.error('Error adding step:', error)
        setModalError('Failed to add a new step. Please try again.')
        showSnackbar(error?.response?.data?.message, { variant: 'error' })
      })
  }

  // Edit Step
  const handleEditStep = () => {
    const payload = { title, serial, prompt_id: selectedPrompt, workflow_id: workflowId }
    apiRequest
      .put(`/workflow-steps/${editStepId}`, payload)
      .then(res => {
        const updatedSteps = steps.map(step => (step.id === editStepId ? res?.data : step))
        setSteps(updatedSteps)
        setModalError(null)
        handleModalClose()
        showSnackbar('Updated Successfully!', { variant: 'success' })
      })
      .catch(error => {
        console.error('Error editing step:', error)
        setModalError('Failed to edit the step. Please try again.')
        showSnackbar(error?.response?.data?.message, { variant: 'error' })
      })
  }

  // Delete Step
  const handleDeleteStep = (stepId: number) => {
    handleMenuClose()
    Swal.fire({
      title: 'Are You sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showConfirmButton: true,
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#dc2626',
      showCancelButton: true,
      cancelButtonText: 'No, cancel!'
    }).then(res => {
      if (res.isConfirmed) {
        apiRequest
          .delete(`/workflow-steps/${stepId}`)
          .then(() => {
            const updatedSteps = steps.filter(step => step.id !== stepId)
            setSteps(updatedSteps)
            setError(null)
            showSnackbar('Deleted Successfully!', { variant: 'success' })
          })
          .catch(error => {
            console.error('Error deleting step:', error)
            setError('Failed to delete the step. Please try again.')
            showSnackbar(error?.response?.data?.message, { variant: 'error' })
          })
      }
    })
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, stepId: number) => {
    setAnchorEl(event.currentTarget)
    setCurrentStep(stepId)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setCurrentStep(null)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setAddAfterIndex(null)
    setEditStepId(null)
    setSelectedPrompt('')
    setTitle('')
    setSerial(null) // Reset serial
    setModalError(null)
  }

  const handleOpenModal = (index: number | null) => {
    setAddAfterIndex(index)
    setIsModalOpen(true)
  }

  return (
    <Box sx={{ position: 'relative' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          p: 1,
          backgroundColor: '#fff',
          boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          top: '-1px',
          position: 'relative',
          zIndex: 999
        }}
      >
        <Typography
          variant='h6'
          component='div'
          sx={{
            flexGrow: 1,
            fontSize: '16px',
            fontWeight: '600'
          }}
        >
          Workflow Editor
        </Typography>
      </Box>
      <Box sx={{ height: 'calc(100vh - 90px)', overflow: 'hidden', overflowY: 'auto', pt: 3 }}>
        <Box display='flex' flexDirection='column' alignItems='center' gap={2}>
          {error && (
            <Typography color='error' variant='body2'>
              {error}
            </Typography>
          )}

          {/* Show Plus Icon When No Steps Exist */}
          {steps.length === 0 && (
            <Box mt={2} mb={2} display='flex' flexDirection='column' alignItems='center'>
              {/* Add Button */}
              <IconButton
                color='primary'
                aria-label='add'
                onClick={() => handleOpenModal(null)}
                sx={{
                  backgroundColor: '#f9f8ff',
                  border: '2px solid #9333ea',
                  borderRadius: '50%',
                  width: '48px',
                  height: '48px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  ':hover': {
                    backgroundColor: '#f3e8ff'
                  },
                  zIndex: 1
                }}
              >
                <AddCircleOutlineIcon sx={{ color: '#9333ea', fontSize: '24px' }} />
              </IconButton>

              {/* Text */}
              <Typography
                variant='caption'
                sx={{
                  color: '#9333ea',
                  fontWeight: 500,
                  textAlign: 'center',
                  marginTop: '8px'
                }}
              >
                Add First Step
              </Typography>
            </Box>
          )}

          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <Card
                variant='outlined'
                sx={{
                  width: 400,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 2
                }}
              >
                <CardContent>
                  <Typography sx={{ fontSize: '14px' }}>{step.prompt?.name}</Typography>
                  <Typography sx={{ fontSize: '12px' }}>{step.title}</Typography>
                </CardContent>
                <IconButton onClick={e => handleMenuOpen(e, step.id)}>
                  <MoreVertIcon />
                </IconButton>
              </Card>

              {/* Add Plus Icon After Each Step */}
              <Box display='flex' flexDirection='column' alignItems='center'>
                {/* Top Line */}
                <Box
                  sx={{
                    height: '20px',
                    width: '2px',
                    backgroundColor: '#e0e0e0',
                    marginBottom: '-4px'
                  }}
                />

                {/* Plus Button */}
                <IconButton
                  color='primary'
                  onClick={() => handleOpenModal(index)}
                  sx={{
                    zIndex: 1
                  }}
                >
                  <AddIcon sx={{ color: '#9333ea' }} fontSize='medium' />
                </IconButton>

                {/* Bottom Line */}
                <Box
                  sx={{
                    height: '20px',
                    width: '2px',
                    backgroundColor: '#e0e0e0',
                    marginTop: '-4px'
                  }}
                />
              </Box>
            </React.Fragment>
          ))}

          {/* Menu for Step Actions */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            sx={{
              '& li': { fontSize: '14px' },
              '& .MuiSvgIcon-root': { fontSize: '16px' }
            }}
          >
            <MenuItem
              onClick={() => {
                const stepToEdit = steps.find(step => step.id === currentStep)
                if (!stepToEdit) return
                setTitle(stepToEdit.title)
                setSerial(stepToEdit.serial) // Set serial for editing
                setSelectedPrompt(stepToEdit.prompt_id || '')
                setEditStepId(currentStep)
                setIsModalOpen(true)
                handleMenuClose()
              }}
            >
              <BorderColorIcon sx={{ fontSize: 16, mr: 1 }} />
              Edit
            </MenuItem>
            <MenuItem onClick={() => handleDeleteStep(currentStep!)}>
              <DeleteIcon sx={{ fontSize: 16, mr: 1 }} />
              Delete
            </MenuItem>
          </Menu>

          {/* Modal for Adding/Editing Steps */}
          <Dialog
            open={isModalOpen}
            onClose={handleModalClose}
            fullWidth
            PaperProps={{
              className: 'glass-modal'
            }}
          >
            <DialogTitle>{editStepId ? 'Edit Step' : 'Add New Step'}</DialogTitle>
            <DialogContent>
              {modalError && (
                <Typography color='error' variant='body2' sx={{ mb: 2 }}>
                  {modalError}
                </Typography>
              )}
              <TextField
                label='Title'
                value={title}
                onChange={e => setTitle(e.target.value)}
                fullWidth
                margin='normal'
              />

              <Dropdown
                sx={{ mt: 2 }}
                label='Prompt'
                url='prompts'
                name='promptId'
                value={selectedPrompt}
                onChange={(e: any) => setSelectedPrompt(e.target.value)}
                placeholder='Select a prompt'
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleModalClose} color='secondary'>
                Cancel
              </Button>
              <Button onClick={editStepId ? handleEditStep : handleAddStep} variant='contained' color='primary'>
                {editStepId ? 'Save Changes' : 'Add Step'}
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </Box>
  )
}
