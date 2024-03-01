import { Avatar, Box } from '@mui/material'
import { MdPreview } from 'md-editor-rt'
import 'md-editor-rt/lib/style.css'

type TAIAssistantMessagesComponentProps = {
  message: any
  index: number
  isWaiting?: boolean
}
export default function AIAssistantMessagesComponent(props: TAIAssistantMessagesComponentProps) {
  const { message, index, isWaiting = false } = props

  return (
    <Box
      sx={{
        display: 'flex',
        mb: '30px'
      }}
    >
      <Box
        sx={{
          mr: '10px'
        }}
      >
        <Avatar
          sx={{ width: 32, height: 32, border: '1px solid #ddd' }}
          src={message?.role === 'system' ? '/avatar/lhg-logo.png' : ''}
        >
          {message?.role === 'system' ? '' : `Y`}
        </Avatar>
      </Box>
      <Box>
        <Box sx={{ fontWeight: 600, color: '#000' }}>{index % 2 ? `Hive AI` : `You`}</Box>
        <Box sx={{ lineHeight: 'normal' }}>
          {isWaiting ? (
            <Box
              sx={{
                height: '14px',
                width: '14px',
                background: '#000',
                borderRadius: '50%',
                animation: 'pulseSize 1.25s ease-in-out infinite',
                mt: '5px'
              }}
            ></Box>
          ) : message?.role === 'system' ? (
            <MdPreview modelValue={message?.message_content}></MdPreview>
          ) : (
            message?.message_content
          )}
        </Box>
      </Box>
    </Box>
  )
}
