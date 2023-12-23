import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import { Box } from '@mui/material'

export default function MdPreviewTitle() {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: '50px',
        right: '25px',
        zIndex: '9',
        padding: '8px 15px',
        lineHeight: 'normal',
        background: '#31a0f6',
        color: '#fff',
        borderRadius: '10px',
        fontSize: '14px'
      }}
    >
      <RemoveRedEyeIcon sx={{ mr: 1 }} />
      Preview
    </Box>
  )
}
