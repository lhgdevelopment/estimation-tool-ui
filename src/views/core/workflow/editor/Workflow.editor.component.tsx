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
  const [details, setDetails] = useState<any>({})
  const [isWorkflowModalOpen, setIsWorkflowModalOpen] = useState(false)
  const [isWorkflowStepModalOpen, setIsWorkflowStepModalOpen] = useState(false)
  const [editStepId, setEditStepId] = useState<number | null>(null)
  const [workflowTitle, setWorkflowTitle] = useState('')
  const [workflowStepTitle, setWorkflowStepTitle] = useState('')
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

  const getWorkflowDetails = async () => {
    if (!workflowId) return
    await apiRequest
      .get(`/workflows/${workflowId}`)
      .then(res => {
        setDetails(res?.data)
        setError(null)
      })
      .catch(error => {
        console.error('Error fetching workflow:', error)
        setError('Failed to load workflow. Please try again.')
        showSnackbar(error?.response?.data?.message, { variant: 'error' })
      })
  }

  useEffect(() => {
    getWorkflowSteps()
    getWorkflowDetails()
  }, [workflowId])

  const handleWorkflowModalClose = () => {
    setIsWorkflowModalOpen(false)

    setModalError(null)
  }

  const handleWorkflowModalOpen = () => {
    setIsWorkflowModalOpen(true)
    setWorkflowTitle(details?.title)
  }

  const updateWorkflow = () => {
    const payload = { title: workflowTitle }
    apiRequest
      .put(`/workflows/${workflowId}`, payload)
      .then(() => {
        setDetails({ ...details, title: workflowTitle })
        setModalError(null)
        handleWorkflowModalClose()
        showSnackbar('Updated Successfully!', { variant: 'success' })
      })
      .catch(error => {
        console.error('Error updating workflow:', error)
        setModalError('Failed to update the workflow. Please try again.')
        showSnackbar(error?.response?.data?.message, { variant: 'error' })
      })
  }

  // Add Step
  const handleAddStep = () => {
    const serialValue = addAfterIndex !== null ? steps[addAfterIndex].serial + 1 : steps.length + 1
    const payload = {
      workflow_id: workflowId,
      prompt_id: selectedPrompt,
      serial: serialValue,
      title: workflowStepTitle
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
        handleWorkflowStepModalClose()
      })
      .catch(error => {
        console.error('Error adding step:', error)
        setModalError('Failed to add a new step. Please try again.')
        showSnackbar(error?.response?.data?.message, { variant: 'error' })
      })
  }

  // Edit Step
  const handleEditStep = () => {
    const payload = { title: workflowStepTitle, serial, prompt_id: selectedPrompt, workflow_id: workflowId }
    apiRequest
      .put(`/workflow-steps/${editStepId}`, payload)
      .then(res => {
        const updatedSteps = steps.map(step => (step.id === editStepId ? res?.data : step))
        setSteps(updatedSteps)
        setModalError(null)
        handleWorkflowStepModalClose()
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

  const handleWorkflowStepModalClose = () => {
    setIsWorkflowStepModalOpen(false)
    setAddAfterIndex(null)
    setEditStepId(null)
    setSelectedPrompt('')
    setWorkflowStepTitle('')
    setSerial(null)
    setModalError(null)
  }

  const handleWorkflowStepModalOpen = (index: number | null) => {
    setAddAfterIndex(index)
    setIsWorkflowStepModalOpen(true)
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
          zIndex: 9
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
          {details?.title}
        </Typography>
        <Button
          variant='outlined'
          color='primary'
          sx={{
            p: 1,
            minWidth: 'auto',
            border: 0,
            outline: 0,
            '&:hover': {
              border: 0,
              outline: 0
            }
          }}
          onClick={() => {
            handleWorkflowModalOpen()
          }}
        >
          <BorderColorIcon sx={{ fontSize: 16, mr: 1, color: '#9333ea' }} />
        </Button>
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
                onClick={() => handleWorkflowStepModalOpen(null)}
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
                  onClick={() => handleWorkflowStepModalOpen(index)}
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
                setWorkflowStepTitle(stepToEdit.title)
                setSerial(stepToEdit.serial) // Set serial for editing
                setSelectedPrompt(stepToEdit.prompt_id || '')
                setEditStepId(currentStep)
                setIsWorkflowStepModalOpen(true)
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
            open={isWorkflowStepModalOpen}
            onClose={handleWorkflowStepModalClose}
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
                value={workflowStepTitle}
                onChange={e => setWorkflowStepTitle(e.target.value)}
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
              <Button onClick={handleWorkflowStepModalClose} color='secondary'>
                Cancel
              </Button>
              <Button onClick={editStepId ? handleEditStep : handleAddStep} variant='contained' color='primary'>
                {editStepId ? 'Save Changes' : 'Add Step'}
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={isWorkflowModalOpen}
            onClose={handleWorkflowModalClose}
            fullWidth
            PaperProps={{
              className: 'glass-modal'
            }}
          >
            <DialogTitle>Edit Workflow</DialogTitle>
            <DialogContent>
              {modalError && (
                <Typography color='error' variant='body2' sx={{ mb: 2 }}>
                  {modalError}
                </Typography>
              )}
              <TextField
                label='Title'
                value={workflowTitle}
                onChange={e => setWorkflowTitle(e.target.value)}
                fullWidth
                margin='normal'
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleWorkflowModalClose} color='secondary'>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  updateWorkflow()
                }}
                variant='contained'
                color='primary'
              >
                Update
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </Box>
  )
}
