import { Dispatch, SetStateAction } from 'react'

export type TProjectSOWTeamReviewFormComponentProps = {
  projectSOWFormData: any
  setOverviewText: Dispatch<SetStateAction<string>>
  overviewText: string
  errorMessage: any
  setAssociatedUserWithRole: Dispatch<SetStateAction<{ employeeRoleId: string; associateId: string }[]>>
  associatedUserWithRole: any[]
  problemGoalText: string
}

export type TProjectSOWTeamReviewFormViewProps = {
  getAssociatedUserWithRole: (roleId: number, userId: number) => void
  projectSOWFormData: any
  errorMessage: any
  problemGoalText: string
  overviewText: string
  setOverviewText: Dispatch<SetStateAction<string>>
  employeeRoleData: any[]
  associatedUserWithRole: any[]
  teamUserList: any[]
}
