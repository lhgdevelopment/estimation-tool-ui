import { Dropdown } from '@core/components/dropdown'
import { handleFormInputChange, handleFormSelectChange } from '@core/utils/form'
import { formatPhoneNumber, getShortStringNumber } from '@core/utils/utils'
import AddIcon from '@material-ui/icons/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import { Box, IconButton, TextField } from '@mui/material'
import 'md-editor-rt/lib/style.css'
import { formTitleSx } from '../../../ProjectSOW.style'
import { TProjectSOWTranscriptFormViewProps, transcriptMeetingLinkAddButtonSx } from './ProjectSOWTranscript.decorator'

export default function ProjectSOWTranscriptFormView(props: TProjectSOWTranscriptFormViewProps) {
  const { errorMessage, projectSOWFormData, setProjectSOWFormData, setTranscriptMeetingLinks, transcriptMeetingLinks } =
    props

  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ ...formTitleSx, mt: 0 }}>Client Information</Box>
        <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
          <Box sx={{ width: '50%' }}>
            <TextField
              id='outlined-multiline-flexible'
              label='Company Name'
              className={`block w-full text-sm dark-d:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark-d:text-gray-300 dark-d:focus:shadow-outline-gray form-input ${
                errorMessage?.['company'] ? 'border-red-600' : 'dark-d:border-gray-600'
              }`}
              placeholder='Company Name'
              name='company'
              value={projectSOWFormData.company}
              onChange={e => {
                handleFormInputChange(e, projectSOWFormData, setProjectSOWFormData)
              }}
            />
            {!!errorMessage?.['company'] &&
              errorMessage?.['company']?.map((message: any, index: number) => {
                return (
                  <span key={index} className='text-xs text-red-600 dark-d:text-red-400'>
                    {message}
                  </span>
                )
              })}
          </Box>
          <Box sx={{ width: '50%' }}>
            <TextField
              id='outlined-multiline-flexible'
              label='Phone'
              className={`block w-full text-sm dark-d:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark-d:text-gray-300 dark-d:focus:shadow-outline-gray form-input ${
                errorMessage?.['clientPhone'] ? 'border-red-600' : 'dark-d:border-gray-600 '
              }`}
              placeholder='(999) 555-1234'
              name='clientPhone'
              value={projectSOWFormData.clientPhone}
              onChange={e => {
                // Update the raw phone number value
                handleFormInputChange(e, projectSOWFormData, setProjectSOWFormData)
              }}
              onBlur={e => {
                const phone = e.target.value
                const formattedPhone = formatPhoneNumber(phone)
                setProjectSOWFormData((prevState: any) => ({
                  ...prevState,
                  clientPhone: formattedPhone
                }))
              }}
              type='tel'
            />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
          <Box sx={{ width: '50%' }}>
            <TextField
              id='outlined-multiline-flexible'
              label='Email'
              className={`block w-full text-sm dark-d:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark-d:text-gray-300 dark-d:focus:shadow-outline-gray form-input ${
                errorMessage?.['clientEmail'] ? 'border-red-600' : 'dark-d:border-gray-600 '
              }`}
              placeholder='name@company-name.com'
              name='clientEmail'
              value={projectSOWFormData.clientEmail}
              onChange={e => {
                const { value } = e.target
                handleFormInputChange(e, projectSOWFormData, setProjectSOWFormData)
                const emailDomain = value.split('@')[1]
                if (emailDomain) {
                  const website = `https://${emailDomain}`
                  setProjectSOWFormData((prevState: any) => ({
                    ...prevState,
                    clientWebsite: website
                  }))
                }
              }}
            />
          </Box>
          <Box sx={{ width: '50%' }}>
            <TextField
              id='outlined-multiline-flexible'
              label='Website'
              className={`block w-full text-sm dark-d:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark-d:text-gray-300 dark-d:focus:shadow-outline-gray form-input ${
                errorMessage?.['clientWebsite'] ? 'border-red-600' : 'dark-d:border-gray-600 '
              }`}
              placeholder='https://www.company-website.com'
              name='clientWebsite'
              value={projectSOWFormData.clientWebsite}
              onChange={e => {
                handleFormInputChange(e, projectSOWFormData, setProjectSOWFormData)
              }}
            />
          </Box>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box sx={formTitleSx}>Project Details</Box>
        <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
          <Box sx={{ width: '50%' }}>
            <Dropdown
              label={'Services'}
              url={'services'}
              name='serviceId'
              value={projectSOWFormData.serviceId}
              onChange={e => {
                handleFormSelectChange(e, projectSOWFormData, setProjectSOWFormData)
              }}
            />
          </Box>
          <Box sx={{ width: '50%' }}>
            <TextField
              label='Project Name'
              id='outlined-multiline-flexible'
              className={`block w-full mt-1 text-sm dark-d:bg-gray-700 dark-d:text-gray-300 dark-d:focus:shadow-outline-gray form-input`}
              placeholder='Project Name'
              name='projectName'
              value={projectSOWFormData.projectName}
              onChange={e => {
                handleFormInputChange(e, projectSOWFormData, setProjectSOWFormData)
              }}
              sx={{ borderColor: '#e2e8f0' }}
            />
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={formTitleSx}>Qualifying Meeting Transcript</Box>
          <Box
            sx={transcriptMeetingLinkAddButtonSx}
            onClick={() => {
              setTranscriptMeetingLinks((prevState: any) => {
                const updatedLinks = [...prevState]
                updatedLinks.push('')

                return updatedLinks
              })
            }}
          >
            <AddIcon fontSize='small' />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 5, mb: 5, flexDirection: 'column' }}>
          {transcriptMeetingLinks?.map((transcriptMeetingLink: any, index: number) => {
            return (
              <Box sx={{ width: '100%', position: 'relative' }} key={index}>
                <TextField
                  id='outlined-multiline-flexible'
                  label={`${getShortStringNumber(index + 1)} Meeting Link`}
                  className={`block w-full mt-1 text-sm dark-d:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark-d:text-gray-300 dark-d:focus:shadow-outline-gray form-input`}
                  placeholder={`${getShortStringNumber(
                    index + 1
                  )} Meeting Link: https://tldv.io/app/meetings/unique-meeting-id/`}
                  name='clientEmail'
                  value={transcriptMeetingLink}
                  onChange={e => {
                    const { value } = e.target
                    setTranscriptMeetingLinks((prevState: any) => {
                      const updatedLinks = [...prevState]
                      updatedLinks[index] = value

                      return updatedLinks
                    })
                  }}
                />
                <IconButton
                  onClick={() => {
                    setTranscriptMeetingLinks((prevState: any) => {
                      const updatedLinks = [...prevState]
                      updatedLinks.splice(index, 1)

                      return updatedLinks
                    })
                  }}
                  sx={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px'
                  }}
                  color='error'
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            )
          })}
        </Box>
      </Box>
    </Box>
  )
}
