import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded'
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import { Box } from '@mui/material'
import { EditorProps, ExposeParam, MdEditor } from 'md-editor-rt'
import { useEffect, useRef, useState } from 'react'

type TMarkdownEditorProps = EditorProps

export function MarkdownEditor(props: TMarkdownEditorProps) {
  const { language = 'en-US', preview = true, modelValue, readOnly } = props

  const mdEditorRef = useRef<ExposeParam>()
  const [isPreviewOpen, setIsPreview] = useState<boolean>(preview)
  const [isCopied, setIsCopied] = useState<boolean>(false)

  useEffect(() => {
    mdEditorRef.current?.on('preview', (e: boolean) => {
      setIsPreview(e)
    })
  }, [])

  const handleCopyClick = () => {
    navigator.clipboard
      .writeText(modelValue)
      .then(() => {
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
      })
      .catch(error => console.error('Error copying to clipboard:', error))
  }

  return (
    <Box sx={{ position: 'relative' }} className={`${readOnly ? 'read-only' : ''}`}>
      {isPreviewOpen && (
        <Box
          sx={{
            position: 'absolute',
            top: '40px',
            right: '10px',
            zIndex: '9',
            display: 'flex',
            '& .preview-buttons': {
              display: 'flex',
              alignItems: 'center',
              p: '5px 8px',
              mx: 1,
              lineHeight: 'normal',
              background: '#9333ea',
              color: '#fff',
              borderRadius: '5px',
              fontSize: '12px',
              cursor: 'pointer',
              opacity: 0.5
            }
          }}
        >
          <Box
            className='preview-buttons'
            onClick={() => {
              handleCopyClick()
            }}
            component={'div'}
          >
            {isCopied ? (
              <LibraryAddCheckIcon sx={{ fontSize: '16px' }} />
            ) : (
              <ContentCopyRoundedIcon sx={{ fontSize: '16px' }} />
            )}
          </Box>
          <Box
            className='preview-buttons'
            onClick={() => {
              mdEditorRef?.current?.togglePreview()
            }}
          >
            <RemoveRedEyeIcon sx={{ fontSize: '16px', mr: 1 }} />
            Preview
          </Box>
        </Box>
      )}
      <MdEditor ref={mdEditorRef} language={language} {...props} />
    </Box>
  )
}
