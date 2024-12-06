import BorderColorIcon from '@mui/icons-material/BorderColor'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd'
import { Box, Button, Card, CardContent, IconButton, Menu, MenuItem, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'

const initialSteps = [
  { id: 1, title: 'New Task in Project (Legacy)', service: 'Asana' },
  { id: 2, title: 'Select the event', service: 'Zapier Chatbots' },
  { id: 3, title: 'Send Channel Message', service: 'Slack (Legacy)' }
]

export default function WorkflowEditorComponent() {
  const [steps, setSteps] = useState(initialSteps)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [currentStep, setCurrentStep] = useState<number | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editedTitle, setEditedTitle] = useState('')

  // Open the menu for the selected step
  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, stepId: number) => {
    setAnchorEl(event.currentTarget)
    setCurrentStep(stepId)
  }

  // Close the menu
  const handleMenuClose = () => {
    setAnchorEl(null)
    setCurrentStep(null)
  }

  // Add a new step after the selected step
  const handleAddAfter = () => {
    if (currentStep !== null) {
      const newStep = {
        id: steps.length + 1,
        title: 'New Step',
        service: 'Looping by Zapier'
      }
      const index = steps.findIndex(step => step.id === currentStep)
      const updatedSteps = [...steps]
      updatedSteps.splice(index + 1, 0, newStep) // Insert the new step
      setSteps(updatedSteps)
    }
    handleMenuClose()
  }

  // Start renaming a step
  const handleRenameStart = (stepId: number, currentTitle: string) => {
    setEditingId(stepId)
    setEditedTitle(currentTitle)
    handleMenuClose()
  }

  // Save the renamed step
  const handleRenameSave = () => {
    const updatedSteps = steps.map(step => (step.id === editingId ? { ...step, title: editedTitle } : step))
    setSteps(updatedSteps)
    setEditingId(null)
    setEditedTitle('')
  }

  // Cancel renaming
  const handleRenameCancel = () => {
    setEditingId(null)
    setEditedTitle('')
  }

  return (
    <Box display='flex' flexDirection='column' alignItems='center' gap={2}>
      {steps.map((step, index) => (
        <Box key={step.id} display='flex' flexDirection='column' alignItems='center' width='100%'>
          {editingId === step.id ? (
            <Box
              sx={{
                border: '2px solid #1976d2',
                padding: 2,
                width: 400,
                borderRadius: '8px',
                backgroundColor: '#f0f8ff'
              }}
            >
              <TextField
                value={editedTitle}
                onChange={e => setEditedTitle(e.target.value)}
                fullWidth
                variant='outlined'
                size='small'
                sx={{ marginBottom: 2 }}
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
          ) : (
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
                <Typography variant='h6'>{step.service}</Typography>
                <Typography variant='body2'>{step.title}</Typography>
              </CardContent>
              <IconButton onClick={e => handleMenuOpen(e, step.id)}>
                <MoreVertIcon />
              </IconButton>
            </Card>
          )}

          {/* Connector Line */}
          {index < steps.length - 1 && (
            <Box
              sx={{
                width: 2,
                height: 40,
                backgroundColor: '#ccc',
                marginTop: 1,
                marginBottom: 1
              }}
            ></Box>
          )}
        </Box>
      ))}

      {/* Menu for Actions */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleAddAfter}>
          <PlaylistAddIcon sx={{ fontSize: 16, mr: 1 }} /> Add After
        </MenuItem>
        <MenuItem
          onClick={() => handleRenameStart(currentStep!, steps.find(step => step.id === currentStep)?.title || '')}
        >
          <BorderColorIcon sx={{ fontSize: 16, mr: 1 }} />
          Rename
        </MenuItem>
        <MenuItem>
          <ContentCopyIcon sx={{ fontSize: 16, mr: 1 }} />
          Duplicate
        </MenuItem>
        <MenuItem>
          <NoteAddIcon sx={{ fontSize: 16, mr: 1 }} /> Add Note
        </MenuItem>
      </Menu>
    </Box>
  )
}
