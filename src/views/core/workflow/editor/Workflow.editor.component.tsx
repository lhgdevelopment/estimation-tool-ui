import { Dropdown } from '@core/components/dropdown'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
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
import React, { useState } from 'react'

const initialSteps = [
  { id: 1, title: 'New Task in Project (Legacy)', prompt: 'Task Creation', service: 'Asana' },
  { id: 2, title: 'Select the event', prompt: 'Event Selection', service: 'Zapier Chatbots' },
  { id: 3, title: 'Send Channel Message', prompt: 'Channel Notification', service: 'Slack (Legacy)' }
]

export default function WorkflowEditorComponent() {
  const [steps, setSteps] = useState(initialSteps)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [currentStep, setCurrentStep] = useState<number | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editedTitle, setEditedTitle] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newStep, setNewStep] = useState({ title: '', prompt: '', service: '' })
  const [selectedPrompt, setSelectedPrompt] = useState('')
  const [addAfterIndex, setAddAfterIndex] = useState<number | null>(null)

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, stepId: number) => {
    setAnchorEl(event.currentTarget)
    setCurrentStep(stepId)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setCurrentStep(null)
  }

  const handleAddAfter = (index: number) => {
    const newStep = { id: steps.length + 1, title: 'New Step', prompt: 'New Prompt', service: 'Looping by Zapier' }
    const updatedSteps = [...steps]
    updatedSteps.splice(index + 1, 0, newStep)
    setSteps(updatedSteps)
    handleMenuClose()
  }

  const handleRenameStart = (stepId: number, currentTitle: string) => {
    setEditingId(stepId)
    setEditedTitle(currentTitle)
    handleMenuClose()
  }

  const handleRenameSave = () => {
    const updatedSteps = steps.map(step => (step.id === editingId ? { ...step, title: editedTitle } : step))
    setSteps(updatedSteps)
    setEditingId(null)
    setEditedTitle('')
  }

  const handleRenameCancel = () => {
    setEditingId(null)
    setEditedTitle('')
  }

  const handleOpenModal = (index: number) => {
    setAddAfterIndex(index)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setNewStep({ title: '', prompt: '', service: '' })
    setSelectedPrompt('')
  }

  const handleAddStep = () => {
    const newStepData = {
      id: steps.length + 1,
      title: newStep.title || 'New Step',
      prompt: selectedPrompt || 'New Prompt',
      service: 'Custom Service'
    }
    const updatedSteps = [...steps]
    if (addAfterIndex !== null) updatedSteps.splice(addAfterIndex + 1, 0, newStepData)
    setSteps(updatedSteps)
    handleModalClose()
  }

  return (
    <Box display='flex' flexDirection='column' alignItems='center' gap={2}>
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <Box display='flex' flexDirection='column' alignItems='center' width='100%'>
            {/* Edit Input Above the Card */}
            {editingId === step.id && (
              <Box
                sx={{
                  position: 'relative',
                  width: 400,
                  marginBottom: 1,
                  border: '2px solid #673ab7',
                  padding: 2,
                  borderRadius: '8px',
                  backgroundColor: '#f3e5f5'
                }}
              >
                <TextField
                  value={editedTitle}
                  onChange={e => setEditedTitle(e.target.value)}
                  fullWidth
                  variant='outlined'
                  size='small'
                  sx={{ marginBottom: 1 }}
                />
                <Box display='flex' justifyContent='flex-end' gap={1}>
                  <Button variant='text' size='small' onClick={handleRenameCancel} color='secondary'>
                    Cancel
                  </Button>
                  <Button variant='contained' size='small' onClick={handleRenameSave} color='primary'>
                    Rename
                  </Button>
                </Box>
              </Box>
            )}

            {/* Step Card */}
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
              <IconButton onClick={e => handleMenuOpen(e, step.id)}>
                <MoreVertIcon />
              </IconButton>
            </Card>

            {/* Plus Icon */}
            {index < steps.length - 1 && (
              <Box mt={1} mb={1}>
                <IconButton color='primary' onClick={() => handleOpenModal(index)}>
                  <AddCircleOutlineIcon fontSize='large' />
                </IconButton>
              </Box>
            )}
          </Box>
        </React.Fragment>
      ))}

      {/* Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        {/* <MenuItem onClick={() => handleAddAfter(steps.findIndex(step => step.id === currentStep))}>
          <PlaylistAddIcon sx={{ fontSize: 16, mr: 1 }} /> Add After
        </MenuItem> */}
        <MenuItem
          onClick={() => handleRenameStart(currentStep!, steps.find(step => step.id === currentStep)?.title || '')}
        >
          <BorderColorIcon sx={{ fontSize: 16, mr: 1 }} />
          Rename
        </MenuItem>
        <MenuItem>
          <ContentCopyIcon sx={{ fontSize: 16, mr: 1 }} /> Duplicate
        </MenuItem>
        <MenuItem>
          <NoteAddIcon sx={{ fontSize: 16, mr: 1 }} /> Add Note
        </MenuItem>
      </Menu>

      {/* Modal */}
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
