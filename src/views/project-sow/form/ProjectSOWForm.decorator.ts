export type TProjectSOwFormComponentProps = {}
export type TProjectSOwFormViewProps = {
  activeStep: number
  enabledStep: number
  steps: any[]
  completed: number[]
  handleStep: () => void
  errorMessage: any[]
  projectSOWFormData: any
  handleProjectSOWChange: () => void
  setTranscriptMeetingLinks: () => void
  transcriptMeetingLinks: any
  summaryText: any
  setSummaryText: any
  problemGoalText: any
  setProblemGoalText: any
  overviewText: any
  setOverviewText: any
  scopeOfWorkData: any
  handleScopeOfWorkCheckbox: any
  selectedScopeOfWorkData: any
  serviceGroupByProjectTypeId: any
  selectedAdditionalServiceData: any
  handleAdditionalServiceSelection: any

  handleDeliverableCheckboxBySow: any
  handleDeliverableCheckbox: any
  selectedDeliverableData: any
  handleDeliverableNoteAdd: any
  deliverableNotesData: any
  handleNotesInputChange: any
  handleDeliverableNoteRemove: any
}

export const teamReviewBoxSx = {
  display: 'flex',
  flexDirection: 'column',
  p: '15px',
  boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.1)',
  mb: '25px',
  borderRadius: '15px',
  '& .team-review-box-title': {
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',
    fontWeight: '600',
    color: '#777',
    mb: '10px'
  },

  '& .team-review-content-box': {
    height: '300px',
    overflow: 'hidden',
    overflowY: 'scroll'
  },
  '& .team-review-team-need-box': {
    display: 'flex',
    '& .team-review-team-need-inner': {
      display: 'flex',
      width: '50%',
      '& .team-review-team-need-item': {
        display: 'flex',
        width: '50%'
      }
    }
  }
}
