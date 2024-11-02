import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded'
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck'
import { Box, SxProps, Tooltip } from '@mui/material'
import { useState } from 'react'

type TCopyToClipboard = {
  textToCopy: string | undefined
  sx?: SxProps
  title?: string
  tooltipTitle?: string
  tooltipPlacement?: 'top' | 'right' | 'bottom' | 'left'
}

const CopyToClipboard = (props: TCopyToClipboard) => {
  const { sx, textToCopy = '', title = 'Copy to Clipboard', tooltipTitle, tooltipPlacement = 'top' } = props
  const [isCopied, setIsCopied] = useState<boolean>(false)

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
    <Tooltip title={isCopied ? 'Copied!' : tooltipTitle ? tooltipTitle : title} placement={tooltipPlacement}>
      <Box
        component={'button'}
        onClick={handleCopyClick}
        className='flex items-center justify-between px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple'
        sx={sx}
      >
        {isCopied ? <LibraryAddCheckIcon sx={{ mr: 2 }} /> : <ContentCopyRoundedIcon sx={{ mr: 2 }} />}
        {title ? (isCopied ? 'Copied!' : title) : ''}
      </Box>
    </Tooltip>
  )
}

export default CopyToClipboard
