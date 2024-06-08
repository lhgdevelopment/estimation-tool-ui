import { Dispatch, SetStateAction } from 'react'

export type TProjectSOWTranscriptFormComponentProps = {
  projectSOWFormData: any
  setProjectSOWFormData: Dispatch<SetStateAction<any>>
  setTranscriptMeetingLinks: Dispatch<SetStateAction<any>>
  transcriptMeetingLinks: string[]
  errorMessage: any
}

export type TProjectSOWTranscriptFormViewProps = {
  projectSOWFormData: any
  setProjectSOWFormData: Dispatch<SetStateAction<any>>
  setTranscriptMeetingLinks: Dispatch<SetStateAction<any>>
  transcriptMeetingLinks: string[]
  errorMessage: any
}

export const transcriptMeetingLinkAddButtonSx = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '30px',
  width: '30px',
  p: '0',
  ml: '15px',
  background: '#9333ea',
  minWidth: 'auto',
  color: '#fff',
  borderRadius: '50%',
  cursor: 'pointer',
  '&:hover': {
    background: '#7e22ce'
  }
}
