import CheckIcon from '@mui/icons-material/Check'
import ContentPasteIcon from '@mui/icons-material/ContentPaste'
import { Box, SxProps, Tooltip } from '@mui/material'
import { useState } from 'react'

type TCopyToClipboard = { textToCopy: string | undefined; sx?: SxProps; title?: string; tooltipTitle?: string }

const CopyToClipboard = (props: TCopyToClipboard) => {
  const { sx, textToCopy = '', title = 'Copy to Clipboard', tooltipTitle } = props
  const [isCopied, setIsCopied] = useState(false)

  const handleCopyClick = () => {
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000) // Reset copied state after 2 seconds
      })
      .catch(error => console.error('Error copying to clipboard:', error))
  }

  // if (!textToCopy) {
  //   return <></>
  // }

  return (
    <Tooltip title={tooltipTitle ? tooltipTitle : title}>
      <Box
        component={'button'}
        onClick={handleCopyClick}
        className='flex items-center justify-between px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple'
        sx={sx}
      >
        {isCopied ? <CheckIcon sx={{ mr: 2 }} /> : <ContentPasteIcon sx={{ mr: 2 }} />}
        {title ? (isCopied ? 'Copied!' : title) : ''}
      </Box>
    </Tooltip>
  )
}

export default CopyToClipboard
