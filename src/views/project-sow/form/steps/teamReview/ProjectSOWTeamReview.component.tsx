import 'md-editor-rt/lib/style.css'
import { useEffect, useState } from 'react'
import { useToastSnackbar } from '@core/hooks/useToastSnackbar'
import apiRequest from '@core/utils/axios-config'
import { TProjectSOWTeamReviewFormComponentProps } from './ProjectSOWTeamReview.decorator'
import ProjectSOWTeamReviewFormView from './ProjectSOWTeamReview.view'

export default function ProjectSOWTeamReviewFormComponent(props: TProjectSOWTeamReviewFormComponentProps) {
  const {
    projectSOWFormData,
    setOverviewText,
    overviewText,
    errorMessage,
    setAssociatedUserWithRole,
    associatedUserWithRole,
    problemGoalText
  } = props
  const { showSnackbar } = useToastSnackbar()
  const [employeeRoleData, setEmployeeRole] = useState<any>([])
  const [teamUserList, setTeamUserList] = useState<any>([])
  const getAssociatedUserWithRole = (roleId: number, userId: number) => {
    setAssociatedUserWithRole((prevState: any) => {
      if (prevState.some((item: any) => item.employeeRoleId === roleId)) {
        return prevState?.map((item: any) => {
          if (item.employeeRoleId === roleId) {
            return { ...item, associateId: userId }
          }

          return item
        })
      } else {
        return [...prevState, { employeeRoleId: roleId, associateId: userId }]
      }
    })
  }
  const getEmployeeRoleList = async () => {
    await apiRequest
      .get(`/employee-roles`)
      .then(res => {
        setEmployeeRole(
          res?.data?.map((item: any) => {
            return { ...item, title: item?.name }
          })
        )
      })
      .catch(error => {
        showSnackbar(error?.message, { variant: 'error' })
      })
  }
  const getUserList = async () => {
    await apiRequest
      .get(`/associates`)
      .then(res => {
        setTeamUserList(res?.data)
      })
      .catch(error => {
        showSnackbar(error?.message, { variant: 'error' })
      })
  }
  useEffect(() => {
    getEmployeeRoleList()
    getUserList()
  }, [])

  return (
    <ProjectSOWTeamReviewFormView
      projectSOWFormData={projectSOWFormData}
      setOverviewText={setOverviewText}
      overviewText={overviewText}
      errorMessage={errorMessage}
      getAssociatedUserWithRole={getAssociatedUserWithRole}
      associatedUserWithRole={associatedUserWithRole}
      employeeRoleData={employeeRoleData}
      teamUserList={teamUserList}
      problemGoalText={problemGoalText}
    ></ProjectSOWTeamReviewFormView>
  )
}
