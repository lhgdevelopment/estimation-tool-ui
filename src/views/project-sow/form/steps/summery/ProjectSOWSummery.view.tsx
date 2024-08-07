import { Box } from '@mui/material'
import 'md-editor-rt/lib/style.css'
import { MarkdownEditor } from 'src/@core/components/markdown-editor'
import { formTitleSx } from 'src/views/project-sow/ProjectSOW.style'
import { TProjectSOWSummeryFormViewProps } from './ProjectSOWSummery.decorator'

export default function ProjectSOWSummeryFormView(props: TProjectSOWSummeryFormViewProps) {
  const { errorMessage, summaryText, setSummaryText, projectSOWFormData } = props

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
        <Box sx={{ width: '100%' }}>
          <label className='block text-sm' htmlFor={'#summaryText'}>
            <Box sx={{ ...formTitleSx, mt: 0 }}>{projectSOWFormData?.projectName} - Qualifying Meeting Summary</Box>
            <Box
              sx={{
                position: 'relative'
              }}
            >
              <MarkdownEditor modelValue={summaryText} onChange={setSummaryText} />
            </Box>

            {!!errorMessage?.['summaryText'] &&
              errorMessage?.['summaryText']?.map((message: any, index: number) => {
                return (
                  <span key={index + Math.random()} className='text-xs text-red-600 dark:text-red-400'>
                    {message}
                  </span>
                )
              })}
          </label>
        </Box>
      </Box>
    </Box>
  )
}
