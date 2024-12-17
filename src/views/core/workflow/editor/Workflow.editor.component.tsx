import { Dropdown } from '@core/components/dropdown'
import apiRequest from '@core/utils/axios-config'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
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
  Typography
} from '@mui/material'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

export default function WorkflowEditorComponent() {
  const [steps, setSteps] = useState<any[]>([])
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [currentStep, setCurrentStep] = useState<number | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editedTitle, setEditedTitle] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newStep, setNewStep] = useState({ title: '', prompt: '', service: '' })
  const [selectedPrompt, setSelectedPrompt] = useState('')
  const router = useRouter()
  const workflowId = router.query.id

  // Fetch Workflow Steps
  const getWorkflowSteps = () => {
    if (!workflowId) return
    apiRequest.get(`/workflow-steps?workflow_id=${workflowId}`).then(res => {
      setSteps(res.data) // Assuming res.data returns steps array
    })
  }

  useEffect(() => {
    getWorkflowSteps()
  }, [workflowId])

  // Add Step
  const handleAddStep = () => {
    const payload = {
      workflow_id: workflowId,
      prompt_id: selectedPrompt,
      serial: steps.length + 1
    }
    apiRequest.post('/workflow-steps', payload).then(res => {
      setSteps([...steps, res.data]) // Add new step
      handleModalClose()
    })
  }

  // Open and close the modal
  const handleOpenModal = () => setIsModalOpen(true)
  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedPrompt('')
  }

  return (
    <Box display='flex' flexDirection='column' alignItems='center' gap={2}>
      {steps.length === 0 ? (
        // Show plus icon when no steps are available
        <IconButton color='primary' onClick={handleOpenModal}>
          <AddCircleOutlineIcon fontSize='large' />
        </IconButton>
      ) : (
        steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <Card
              variant='outlined'
              sx={{
                width: 300,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 2
              }}
            >
              <CardContent>
                <Typography variant='h6'>{step.prompt}</Typography>
                <Typography variant='body2'>{step.title}</Typography>
              </CardContent>
              <IconButton onClick={e => setAnchorEl(e.currentTarget)}>
                <MoreVertIcon />
              </IconButton>
            </Card>

            {/* Plus Icon for adding steps after each card */}
            {index === steps.length - 1 && (
              <Box mt={1} mb={1}>
                <IconButton color='primary' onClick={handleOpenModal}>
                  <AddCircleOutlineIcon fontSize='large' />
                </IconButton>
              </Box>
            )}
          </React.Fragment>
        ))
      )}

      {/* Modal for Adding Steps */}
      <Dialog open={isModalOpen} onClose={handleModalClose} fullWidth>
        <DialogTitle>Add New Step</DialogTitle>
        <DialogContent>
          <Dropdown
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
          <Button onClick={handleAddStep} variant='contained' color='primary'>
            Add Step
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
