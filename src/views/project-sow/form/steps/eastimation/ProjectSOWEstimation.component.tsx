import 'md-editor-rt/lib/style.css'
import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import Preloader from 'src/@core/components/preloader'
import apiRequest from 'src/@core/utils/axios-config'
import { TProjectSOWEstimationFormComponentProps } from './ProjectSOWEstimation.decorator'
import ProjectSOWEstimationFormView from './ProjectSOWEstimation.view'

export default function ProjectSOWEstimationFormComponent(props: TProjectSOWEstimationFormComponentProps) {
  const {
    associatedUserWithRole,
    setAssociatedUserWithRole,
    transcriptId,
    problemGoalID,
    tasksList,
    setTasksList,
    teamUserList,
    setSelectedDeliverableData,
    overviewText,
    problemGoalText,
    projectSOWFormData
  } = props

  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const [preload, setPreload] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<any>({})
  const [employeeRoleData, setEmployeeRole] = useState<any>([])
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

  const handleUpdateTeamAssignOnChange = (employeeRoleId: number, associateId: number) => {
    setPreload(true)
    apiRequest
      .post('/team-review/update', { transcriptId, employeeRoleId, associateId })
      .then(res => {
        setPreload(false)
        getAssociatedUserWithRole(employeeRoleId, associateId)
      })
      .catch(error => {
        setPreload(false)
        setErrorMessage(error?.response?.data?.errors)
        enqueueSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
      })
  }

  const handleUpdateTaskCheckUnCheckForTaskOnChange = (taskId: number, isChecked: boolean) => {
    setTasksList((prevState: any) => [
      ...prevState?.map((task: any) => (task?.id === taskId ? { ...task, isChecked } : task))
    ])
    setPreload(true)
    if (isChecked) {
      apiRequest
        .post(`/estimation-tasks/checked`, {
          problemGoalId: problemGoalID,
          taskIds: [taskId]
        })
        .then(res => {
          // setTasksList((prevState: any) => [...prevState?.map((task: any) => (task?.id === taskId ? res.data : task))])
          setPreload(false)
        })
        .catch(error => {
          setTasksList((prevState: any) => [
            ...prevState?.map((task: any) => (task?.id === taskId ? { ...task, isChecked: !isChecked } : task))
          ])
          setPreload(false)
          setErrorMessage(error?.response?.data?.errors)
          enqueueSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
        })
    } else {
      apiRequest
        .post(`/estimation-tasks/un-checked`, {
          problemGoalId: problemGoalID,
          taskIds: [taskId]
        })
        .then(res => {
          // setTasksList((prevState: any) => [...prevState?.map((task: any) => (task?.id === taskId ? res.data : task))])
          setPreload(false)
        })
        .catch(error => {
          setTasksList((prevState: any) => [
            ...prevState?.map((task: any) => (task?.id === taskId ? { ...task, isChecked: !isChecked } : task))
          ])
          setPreload(false)
          setErrorMessage(error?.response?.data?.errors)
          enqueueSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
        })
    }
  }

  const handleUpdateTaskCheckUnCheckForParentTaskOnChange = (tasks: any, parentTaskId: number, isChecked: boolean) => {
    const taskIds = [...tasks?.map((task: any) => task?.id), parentTaskId]

    setTasksList((prevState: any) => [
      ...prevState?.map((task: any) => (taskIds.includes(task?.id) ? { ...task, isChecked } : task))
    ])
    setPreload(true)
    if (isChecked) {
      apiRequest
        .post(`/estimation-tasks/checked`, {
          problemGoalId: problemGoalID,
          taskIds: taskIds
        })
        .then(res => {
          // setTasksList((prevState: any) => [...prevState?.map((task: any) => (taskIds.includes(task?.id) ? res.data : task))])
          setPreload(false)
        })
        .catch(error => {
          setTasksList((prevState: any) => [
            ...prevState?.map((task: any) => (taskIds.includes(task?.id) ? { ...task, isChecked: !isChecked } : task))
          ])
          setPreload(false)
          setErrorMessage(error?.response?.data?.errors)
          enqueueSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
        })
    } else {
      apiRequest
        .post(`/estimation-tasks/un-checked`, {
          problemGoalId: problemGoalID,
          taskIds: taskIds
        })
        .then(res => {
          // setTasksList((prevState: any) => [...prevState?.map((task: any) => (taskIds.includes(task?.id) ? res.data : task))])
          setPreload(false)
        })
        .catch(error => {
          setTasksList((prevState: any) => [
            ...prevState?.map((task: any) => (taskIds.includes(task?.id) ? { ...task, isChecked: !isChecked } : task))
          ])
          setPreload(false)
          setErrorMessage(error?.response?.data?.errors)
          enqueueSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
        })
    }
  }

  const handleUpdateTaskCheckUnCheckForDeliverablesOnChange = (tasks: any, isChecked: boolean) => {
    const taskIds = getTaskIdsFromTaskSubTask(tasks)

    setTasksList((prevState: any) => [
      ...prevState?.map((task: any) => (taskIds.includes(task?.id) ? { ...task, isChecked } : task))
    ])
    setPreload(true)
    if (isChecked) {
      apiRequest
        .post(`/estimation-tasks/checked`, {
          problemGoalId: problemGoalID,
          taskIds: taskIds
        })
        .then(res => {
          // setTasksList((prevState: any) => [...prevState?.map((task: any) => (taskIds.includes(task?.id) ? res.data : task))])
          setPreload(false)
        })
        .catch(error => {
          setTasksList((prevState: any) => [
            ...prevState?.map((task: any) => (taskIds.includes(task?.id) ? { ...task, isChecked: !isChecked } : task))
          ])
          setPreload(false)
          setErrorMessage(error?.response?.data?.errors)
          enqueueSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
        })
    } else {
      apiRequest
        .post(`/estimation-tasks/un-checked`, {
          problemGoalId: problemGoalID,
          taskIds: taskIds
        })
        .then(res => {
          // setTasksList((prevState: any) => [...prevState?.map((task: any) => (taskIds.includes(task?.id) ? res.data : task))])
          setPreload(false)
        })
        .catch(error => {
          setTasksList((prevState: any) => [
            ...prevState?.map((task: any) => (taskIds.includes(task?.id) ? { ...task, isChecked: !isChecked } : task))
          ])
          setPreload(false)
          setErrorMessage(error?.response?.data?.errors)
          enqueueSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
        })
    }
  }

  const handleUpdateTaskCheckUnCheckForSOWOnChange = (deliverables: any, isChecked: boolean) => {
    const taskIds = deliverables?.flatMap((deliverable: any) => getTaskIdsFromTaskSubTask(deliverable?.tasks))

    setTasksList((prevState: any) => [
      ...prevState?.map((task: any) => (taskIds.includes(task?.id) ? { ...task, isChecked } : task))
    ])
    setPreload(true)
    if (isChecked) {
      apiRequest
        .post(`/estimation-tasks/checked`, {
          problemGoalId: problemGoalID,
          taskIds: taskIds
        })
        .then(res => {
          // setTasksList((prevState: any) => [...prevState?.map((task: any) => (taskIds.includes(task?.id) ? res.data : task))])
          setPreload(false)
        })
        .catch(error => {
          setTasksList((prevState: any) => [
            ...prevState?.map((task: any) => (taskIds.includes(task?.id) ? { ...task, isChecked: !isChecked } : task))
          ])
          setPreload(false)
          setErrorMessage(error?.response?.data?.errors)
          enqueueSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
        })
    } else {
      apiRequest
        .post(`/estimation-tasks/un-checked`, {
          problemGoalId: problemGoalID,
          taskIds: taskIds
        })
        .then(res => {
          // setTasksList((prevState: any) => [...prevState?.map((task: any) => (taskIds.includes(task?.id) ? res.data : task))])
          setPreload(false)
        })
        .catch(error => {
          setTasksList((prevState: any) => [
            ...prevState?.map((task: any) => (taskIds.includes(task?.id) ? { ...task, isChecked: !isChecked } : task))
          ])
          setPreload(false)
          setErrorMessage(error?.response?.data?.errors)
          enqueueSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
        })
    }
  }

  const getTaskIdsFromTaskSubTask = (tasks: any[]) => {
    const taskIds: number[] = []

    const collectIds = (taskList: any[]) => {
      taskList.forEach((task: any) => {
        taskIds.push(task?.id)
        if (task?.sub_tasks && task?.sub_tasks.length > 0) {
          collectIds(task?.sub_tasks)
        }
      })
    }

    collectIds(tasks)

    return taskIds
  }

  const handleUpdateTaskCheckUnCheckForServiceOnChange = (scope_of_works: any, isChecked: boolean) => {
    const taskIds = scope_of_works.flatMap((scope_of_work: any) =>
      scope_of_work?.deliverables?.flatMap((deliverable: any) => getTaskIdsFromTaskSubTask(deliverable?.tasks))
    )
    // console.log({ taskIds })

    setTasksList((prevState: any) => [
      ...prevState?.map((task: any) => (taskIds.includes(task?.id) ? { ...task, isChecked } : task))
    ])
    setPreload(true)
    if (isChecked) {
      apiRequest
        .post(`/estimation-tasks/checked`, {
          problemGoalId: problemGoalID,
          taskIds: taskIds
        })
        .then(res => {
          // setTasksList((prevState: any) => [...prevState?.map((task: any) => (taskIds.includes(task?.id) ? res.data : task))])
          setPreload(false)
        })
        .catch(error => {
          setTasksList((prevState: any) => [
            ...prevState?.map((task: any) => (taskIds.includes(task?.id) ? { ...task, isChecked: !isChecked } : task))
          ])
          setPreload(false)
          setErrorMessage(error?.response?.data?.errors)
          enqueueSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
        })
    } else {
      apiRequest
        .post(`/estimation-tasks/un-checked`, {
          problemGoalId: problemGoalID,
          taskIds: taskIds
        })
        .then(res => {
          // setTasksList((prevState: any) => [...prevState?.map((task: any) => (taskIds.includes(task?.id) ? res.data : task))])
          setPreload(false)
        })
        .catch(error => {
          setTasksList((prevState: any) => [
            ...prevState?.map((task: any) => (taskIds.includes(task?.id) ? { ...task, isChecked: !isChecked } : task))
          ])
          setPreload(false)
          setErrorMessage(error?.response?.data?.errors)
          enqueueSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
        })
    }
  }
  const handleUpdateTaskAssignOnChange = (taskId: number, associateId: number) => {
    setTasksList((prevState: any) => [
      ...prevState?.map((task: any) => (task?.id === taskId ? { ...task, associateId } : task))
    ])
    setPreload(true)
    apiRequest
      .post(`/estimation-tasks/${taskId}/add-associate`, { associateId })
      .then(res => {
        setTasksList((prevState: any) => [...prevState?.map((task: any) => (task?.id === taskId ? res.data : task))])
        setPreload(false)
        enqueueSnackbar('Task assigned successfully', { variant: 'success' })
      })
      .catch(error => {
        setPreload(false)
        setErrorMessage(error?.response?.data?.errors)
        enqueueSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
      })
  }

  const handleUpdateTaskEstimateHoursOnChange = (taskId: number, estimateHours: number) => {
    setTasksList((prevState: any) => [
      ...prevState?.map((task: any) => (task?.id === taskId ? { ...task, estimateHours } : task))
    ])
    setPreload(true)
    apiRequest
      .post(`/estimation-tasks/${taskId}/add-estimate-hours`, { estimateHours })
      .then(res => {
        setTasksList((prevState: any) => [...prevState?.map((task: any) => (task?.id === taskId ? res.data : task))])
        setPreload(false)
        enqueueSnackbar('Task estimate hours updated successfully', { variant: 'success' })
      })
      .catch(error => {
        setPreload(false)
        setErrorMessage(error?.response?.data?.errors)
        enqueueSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
      })
  }

  const handleDeliverableCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked, value } = e.target
    setSelectedDeliverableData((prevState: any) => {
      if (checked) {
        return [...prevState, Number(value)]
      } else {
        return prevState.filter((item: any) => item !== Number(value))
      }
    })
  }

  const handleDeliverableCheckboxBySow = (deliverables: any) => {
    setSelectedDeliverableData((prevState: any) => {
      const deliverableIds = deliverables?.map((deliverable: any) => Number(deliverable?.id))
      const hasSelectedDeliverables = deliverableIds.some((id: number) => prevState.includes(id))

      if (hasSelectedDeliverables) {
        return prevState.filter((id: number) => !deliverableIds.includes(id))
      } else {
        return [...prevState, ...deliverableIds]
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
        enqueueSnackbar(error?.message, { variant: 'error' })
      })
  }

  useEffect(() => {
    getEmployeeRoleList()
  }, [])

  return (
    <>
      {!!preload && <Preloader close={!preload} />}
      <ProjectSOWEstimationFormView
        associatedUserWithRole={associatedUserWithRole}
        handleUpdateTeamAssignOnChange={handleUpdateTeamAssignOnChange}
        handleUpdateTaskAssignOnChange={handleUpdateTaskAssignOnChange}
        handleUpdateTaskCheckUnCheckForDeliverablesOnChange={handleUpdateTaskCheckUnCheckForDeliverablesOnChange}
        handleUpdateTaskCheckUnCheckForSOWOnChange={handleUpdateTaskCheckUnCheckForSOWOnChange}
        handleUpdateTaskCheckUnCheckForTaskOnChange={handleUpdateTaskCheckUnCheckForTaskOnChange}
        handleUpdateTaskCheckUnCheckForParentTaskOnChange={handleUpdateTaskCheckUnCheckForParentTaskOnChange}
        handleUpdateTaskEstimateHoursOnChange={handleUpdateTaskEstimateHoursOnChange}
        handleUpdateTaskCheckUnCheckForServiceOnChange={handleUpdateTaskCheckUnCheckForServiceOnChange}
        employeeRoleData={employeeRoleData}
        errorMessage={errorMessage}
        handleDeliverableCheckbox={handleDeliverableCheckbox}
        handleDeliverableCheckboxBySow={handleDeliverableCheckboxBySow}
        overviewText={overviewText}
        problemGoalText={problemGoalText}
        projectSOWFormData={projectSOWFormData}
        tasksList={tasksList}
        teamUserList={teamUserList}
      ></ProjectSOWEstimationFormView>
    </>
  )
}
