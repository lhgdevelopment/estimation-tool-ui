import { RichTextEditor } from '@core/components/rich-text-editor'
import { Box } from '@mui/material'
import 'md-editor-rt/lib/style.css'
import { formTitleSx } from 'src/views/project-sow/ProjectSOW.style'
import { TProjectSOWProblemAndGoalsFormViewProps } from './ProjectSOWProblemAndGoals.decorator'

export default function ProjectSOWProblemAndGoalsFormView(props: TProjectSOWProblemAndGoalsFormViewProps) {
  const { errorMessage, problemGoalText, setProblemGoalText, projectSOWFormData } = props

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
        <Box sx={{ width: '100%' }}>
          <label className='block text-sm' htmlFor={'#problemGoalText'}>
            <Box sx={{ ...formTitleSx, mt: 0 }}> {projectSOWFormData?.projectName}'s Problem & Goal</Box>
            <Box
              sx={{
                position: 'relative'
              }}
            >
              <RichTextEditor value={problemGoalText} onChange={setProblemGoalText} />
            </Box>
            {!!errorMessage?.problemGoalText &&
              errorMessage?.problemGoalText?.map((message: any, index: number) => {
                return (
                  <span key={index + Math.random()} className='text-xs text-red-600 dark-d:text-red-400'>
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
