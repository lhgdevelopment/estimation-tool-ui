import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Box, Card, CardContent, IconButton, Menu, MenuItem, Typography } from '@mui/material'
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

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, stepId: number) => {
    setAnchorEl(event.currentTarget)
    setCurrentStep(stepId)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setCurrentStep(null)
  }

  const handleAddAfter = () => {
    if (currentStep !== null) {
      const newStep = {
        id: steps.length + 1,
        title: 'New Step',
        service: 'Looping by Zapier'
      }
      const index = steps.findIndex(step => step.id === currentStep)
      const updatedSteps = [...steps]
      updatedSteps.splice(index + 1, 0, newStep) // Insert the new step after the current one
      setSteps(updatedSteps)
    }
    handleMenuClose()
  }

  return (
    <Box display='flex' flexDirection='column' alignItems='center' gap={2}>
      {steps.map((step, index) => (
        <Box key={step.id} display='flex' flexDirection='column' alignItems='center'>
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
              <Typography variant='h6'>{step.service}</Typography>
              <Typography variant='body2'>{step.title}</Typography>
            </CardContent>
            {/* Menu Trigger */}
            <IconButton onClick={e => handleMenuOpen(e, step.id)}>
              <MoreVertIcon />
            </IconButton>
          </Card>

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
        <MenuItem onClick={handleAddAfter}>Add After</MenuItem>
        <MenuItem>Duplicate</MenuItem>
        <MenuItem>Rename</MenuItem>
        <MenuItem>Add Note</MenuItem>
      </Menu>
    </Box>
  )
}
