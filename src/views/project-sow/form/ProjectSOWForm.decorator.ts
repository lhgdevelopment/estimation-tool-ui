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
