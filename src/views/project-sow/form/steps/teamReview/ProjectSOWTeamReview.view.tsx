import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from '@mui/material'
import { MdPreview } from 'md-editor-rt'
import 'md-editor-rt/lib/style.css'
import { Dropdown } from 'src/@core/components/dropdown'
import { MarkdownEditor } from 'src/@core/components/markdown-editor'
import { formTitleSx, teamReviewBoxSx } from 'src/views/project-sow/ProjectSOW.style'
import { TProjectSOWTeamReviewFormViewProps } from './ProjectSOWTeamReview.decorator'

export default function ProjectSOWTeamReviewFormView(props: TProjectSOWTeamReviewFormViewProps) {
  const {
    getAssociatedUserWithRole,
    projectSOWFormData,
    errorMessage,
    problemGoalText,
    overviewText,
    setOverviewText,
    employeeRoleData,
    associatedUserWithRole,
    teamUserList
  } = props

  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ ...formTitleSx, mt: 0 }}>Team Review - {projectSOWFormData?.projectName}</Box>

        <Accordion sx={teamReviewBoxSx} defaultExpanded={true}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls='client-information-content'
            id='client-information-header'
          >
            Client Information
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
              <Box sx={{ width: '30%' }}>
                <TextField
                  id='outlined-multiline-flexible'
                  label='Company Name'
                  className={`block w-full text-sm dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input ${
                    errorMessage?.['projectName'] ? 'border-red-600' : 'dark:border-gray-600'
                  }`}
                  name='company'
                  value={projectSOWFormData.company}
                  disabled
                />
                {!!errorMessage?.['company'] &&
                  errorMessage?.['company']?.map((message: any, index: number) => {
                    return (
                      <span key={index + 'msg'} className='text-xs text-red-600 dark:text-red-400'>
                        {message}
                      </span>
                    )
                  })}
              </Box>
              <Box sx={{ width: '70%' }}>
                <TextField
                  id='outlined-multiline-flexible'
                  label='Website'
                  className={`block w-full text-sm dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input ${
                    errorMessage?.['projectName'] ? 'border-red-600' : 'dark:border-gray-600 '
                  }`}
                  name='clientWebsite'
                  value={projectSOWFormData.clientWebsite}
                  disabled
                />
              </Box>
            </Box>
            <Box className='team-review-box-title'>Project Details</Box>
            <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
              <Box sx={{ width: '30%' }}>
                <Dropdown
                  label={'Services'}
                  url={'services'}
                  name='serviceId'
                  value={projectSOWFormData.serviceId}
                  disabled
                />
              </Box>
              <Box sx={{ width: '70%' }}>
                <TextField
                  id='outlined-multiline-flexible'
                  label='Project Name'
                  className={`block w-full text-sm dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input ${
                    errorMessage?.['projectName'] ? 'border-red-600' : 'dark:border-gray-600 '
                  }`}
                  name='projectName'
                  value={projectSOWFormData.projectName}
                  disabled
                />
              </Box>
            </Box>
            <Box className='team-review-box-title'>Qualifying Meeting Transcripts</Box>
            <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
              <Box sx={{ width: '50%' }}>
                <TextField
                  id='outlined-multiline-flexible'
                  label='Meeting Transcripts'
                  className={`block w-full text-sm dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input ${
                    errorMessage?.['projectName'] ? 'border-red-600' : 'dark:border-gray-600 '
                  }`}
                  name='projectName'
                  value={''}
                  disabled
                />
              </Box>
              <Box sx={{ width: '50%' }}>
                <TextField
                  id='outlined-multiline-flexible'
                  label='Meeting Transcripts'
                  className={`block w-full text-sm dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input ${
                    errorMessage?.['projectName'] ? 'border-red-600' : 'dark:border-gray-600 '
                  }`}
                  name='projectName'
                  value={''}
                  disabled
                />
              </Box>
            </Box>
            <Box className='team-review-box-title'>Account Manager Notes</Box>
            <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
              <Box sx={{ width: '50%' }}>
                <TextField
                  id='outlined-multiline-flexible'
                  label='Account Manager Notes'
                  className={`block w-full text-sm dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input ${
                    errorMessage?.['projectName'] ? 'border-red-600' : 'dark:border-gray-600 '
                  }`}
                  name='projectName'
                  value={''}
                  disabled
                />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
              <Box sx={{ width: '100%' }}>
                <Box
                  component={'textarea'}
                  id='outlined-multiline-flexible'
                  className={`block w-full text-sm dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input ${
                    errorMessage?.['projectName'] ? 'border-red-600' : 'dark:border-gray-600 '
                  }`}
                  name='projectName'
                  rows={5}
                />
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>

        <Accordion sx={teamReviewBoxSx} defaultExpanded={true}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls='problemAndGoal-content'
            id='problemAndGoal-header'
          >
            Problem & Goals
          </AccordionSummary>
          <AccordionDetails>
            <MdPreview modelValue={problemGoalText} />
          </AccordionDetails>
        </Accordion>

        <Accordion sx={teamReviewBoxSx} defaultExpanded={true}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls='problemAndGoal-content'
            id='problemAndGoal-header'
          >
            Project Overview
          </AccordionSummary>
          <AccordionDetails>
            <MarkdownEditor modelValue={overviewText} onChange={setOverviewText} />
          </AccordionDetails>
        </Accordion>

        <Box sx={{ ...teamReviewBoxSx, p: '15px' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ width: '100%' }}>
              <Box className='team-review-box-title'>Project Team Needed</Box>
            </Box>
            <Box className='team-review-team-need-box'>
              {employeeRoleData?.map((employeeRole: any, index: number) => {
                return (
                  <Box className='team-review-team-need-item' key={index + 'team'}>
                    <Box className='team-review-team-need-item-input'>
                      <FormControl fullWidth>
                        <InputLabel id='associateId-label'>{employeeRole?.name}</InputLabel>
                        <Select
                          labelId='associateId-label'
                          id='associateId'
                          onChange={event => {
                            getAssociatedUserWithRole(employeeRole?.id, Number(event?.target?.value))
                          }}
                          value={
                            associatedUserWithRole?.find((item: any) => item?.employeeRoleId === employeeRole?.id)
                              ?.associateId || ''
                          }
                          name={`associateId_${employeeRole?.id}`}
                          label={employeeRole?.name}
                        >
                          {teamUserList?.map((item: any) => (
                            <MenuItem value={item?.id} key={item?.id}>
                              {item?.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  </Box>
                )
              })}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
