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

  boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.1)',
  mb: '25px',
  borderRadius: '10px',
  '&::before': { display: 'none' },
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
      alignItems: 'center',
      width: '50%',
      paddingRight: '10px',
      mb: '10px',
      ':last-child': {
        paddingRight: 0,
        paddingLeft: '10px'
      },
      '& .team-review-team-need-item-title': {
        display: 'flex',
        width: '140px'
      },
      '& .team-review-team-need-item-input': {
        width: 'calc(100% - 140px)',
        '& .MuiSelect-select': {
          p: '10px'
        }
      }
    }
  }
}

export const sowEstimationAccordionSectionSx = {
  mb: 5,
  boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.1)',
  borderRadius: '10px',
  '&.Mui-expanded': { boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.1)' },
  '&::before': { display: 'none' },
  '& .section-title': {
    fontSize: '16px',
    fontWeight: '600',
    textAlign: 'center',
    color: '#777'
  }
}
