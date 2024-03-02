import ReplayIcon from '@mui/icons-material/Replay'
import { Avatar, Box, Tooltip } from '@mui/material'
import { MdPreview } from 'md-editor-rt'
import 'md-editor-rt/lib/style.css'
import CopyToClipboard from 'src/@core/components/copy-to-clipboard/CopyToClipboard'

type TAIAssistantMessagesComponentProps = {
  message: any
  index: number
  isWaiting?: boolean
  onRegenerate?: () => void
}
export default function AIAssistantMessagesComponent(props: TAIAssistantMessagesComponentProps) {
  const { message, index, isWaiting = false, onRegenerate } = props

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
          {message?.role === 'system' ? '' : message?.user?.name ? message?.user?.name[0] : 'Y'}
        </Avatar>
      </Box>
      <Box>
        <Box sx={{ fontWeight: 600, color: '#000' }}>
          {message?.role === 'system' ? `Hive AI` : message?.user?.name ? message?.user?.name : 'You'}
        </Box>
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
        {message?.role === 'system' && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px', mt: '10px' }}>
            {!!message?.message_content && (
              <CopyToClipboard
                textToCopy={message?.message_content}
                title=''
                tooltipTitle='Copy'
                sx={{
                  p: 0,
                  background: 'transparent',
                  color: '#9b9b9b',

                  '& svg': {
                    fontSize: '18px',
                    m: 0
                  },
                  ':hover': {
                    background: 'transparent',
                    color: '#000'
                  },
                  ':focus': { outline: 0, outlineOffset: 0, boxShadow: 0 }
                }}
              />
            )}

            {onRegenerate && (
              <Tooltip title='Regenerate'>
                <Box
                  component={'button'}
                  sx={{
                    color: '#9b9b9b',
                    ':hover': {
                      color: '#000'
                    }
                  }}
                  onClick={onRegenerate}
                >
                  <ReplayIcon sx={{ fontSize: '18px' }} />
                </Box>
              </Tooltip>
            )}
          </Box>
        )}
      </Box>
    </Box>
  )
}
