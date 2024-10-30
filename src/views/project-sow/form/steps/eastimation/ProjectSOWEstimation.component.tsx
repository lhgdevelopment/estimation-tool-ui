import Preloader from '@core/components/preloader'
import { useToastSnackbar } from '@core/hooks/useToastSnackbar'
import apiRequest from '@core/utils/axios-config'
import { SelectChangeEvent } from '@mui/material'
import 'md-editor-rt/lib/style.css'
import { useEffect, useState } from 'react'
import { TProjectSOWEstimationFormComponentProps } from './ProjectSOWEstimation.decorator'
import ProjectSOWEstimationFormView from './ProjectSOWEstimation.view'

export default function ProjectSOWEstimationFormComponent(props: TProjectSOWEstimationFormComponentProps) {
  const {
    associatedUserWithRole,
    setAssociatedUserWithRole,
    transcriptId,
    problemGoalID,
    taskList,
    setTasksList,
    teamUserList,
    setSelectedDeliverableData,
    overviewText,
    problemGoalText,
    projectSOWFormData,
    setDeliverableData
  } = props

  const { showSnackbar } = useToastSnackbar()
  const [preload, setPreload] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<any>({})
  const [employeeRoleData, setEmployeeRole] = useState<any>([])
  const [taskListState, setTaskListState] = useState<any>([])

  const taskDefaultData = {
    // taskId: '',
    title: '',
    tasks: [
      {
        title: '',
        serial: ''
      }
    ]
  }
  const [taskFormData, setTaskFormData] = useState<any>(taskDefaultData)
  const [taskEditId, setTaskEditId] = useState<any>(null)
  const [serviceTaskModalOpen, setServiceTaskModalOpen] = useState<boolean>(false)

  const handleServiceTaskModalOpen = () => {
    setServiceTaskModalOpen(true)
  }
  const handleServiceTaskModalClose = () => {
    setServiceTaskModalOpen(false)
    handleTaskOnClear()
  }

  const handleTaskSelectChange = (e: SelectChangeEvent<any>) => {
    setTaskFormData({
      ...taskFormData,
      [e?.target?.name]: e?.target?.value
    })
  }

  const handleAddNewTask = () => {
    const tasks = [...taskFormData.tasks]
    tasks.push({
      title: '',
      order: ''
    })
    setTaskFormData(() => ({ ...taskFormData, tasks }))
  }

  const handleRemoveTask = (index: number) => {
    const tasks = [...taskFormData.tasks]
    tasks.splice(index, 1)
    setTaskFormData(() => ({ ...taskFormData, tasks }))
  }

  const handleTaskMultipleInputChange = (event: any, index: number) => {
    const { name, value } = event.target
    const tasks = [...taskFormData.tasks]
    tasks[index][name] = value
    setTaskFormData(() => ({ ...taskFormData, tasks }))
  }

  const handleTaskInputChange = (event: any) => {
    const { name, value } = event.target
    const tasks = taskFormData
    tasks[name] = value
    setTaskFormData(() => ({ ...taskFormData, ...tasks }))
  }

  const handleTaskOnClear = () => {
    setTaskFormData(taskDefaultData)
    setTaskEditId(null)
  }

  const handleTaskOnEdit = (data: any) => {
    const { id, title, serial } = data
    setTaskEditId(id)
    setTaskFormData({
      title
    })
    handleServiceTaskModalOpen()
  }

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
        showSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
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
          showSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
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
          showSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
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
          showSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
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
          showSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
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
          showSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
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
          showSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
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
          showSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
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
          showSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
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
          showSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
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
          showSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
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
        showSnackbar('Task assigned successfully', { variant: 'success' })
      })
      .catch(error => {
        setPreload(false)
        setErrorMessage(error?.response?.data?.errors)
        showSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
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
        showSnackbar('Task estimate hours updated successfully', { variant: 'success' })
      })
      .catch(error => {
        setPreload(false)
        setErrorMessage(error?.response?.data?.errors)
        showSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
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

  const handleTaskSaveOnClick = () => {
    setPreload(true)
    if (taskEditId) {
      apiRequest
        .post(`/estimation-tasks/${taskEditId}`, { ...taskFormData })
        .then(res => {
          setTaskListState((prevState: any[]) => [
            ...prevState.map((task: any) => {
              if (task?.id === taskEditId) return { ...task, title: res.data?.title }

              return task
            })
          ])

          setPreload(false)
          showSnackbar('Updatedf Successfully!', { variant: 'success' })
          handleServiceTaskModalClose()
        })
        .catch(error => {
          setPreload(false)
          setErrorMessage(error?.response?.data?.errors)
          showSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
        })
    } else {
      apiRequest
        .post('/estimation-tasks/add-multi', { ...taskFormData, problemGoalId: problemGoalID })
        .then(res => {
          // setScopeOfWorkData((prevState: any[]) => [...res?.data, ...prevState])
          // setSelectedScopeOfWorkData((prevState: any[]) => [...res?.data.map((sow: any) => sow?.id), ...prevState])

          setPreload(false)
          showSnackbar('Created Successfully!', { variant: 'success' })
          handleServiceTaskModalClose()
        })
        .catch(error => {
          setPreload(false)
          setErrorMessage(error?.response?.data?.errors)
          showSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
        })
    }
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

  const handleGenerateTaskWithAI = (deliverableId: number) => {
    setDeliverableData((prevList: any) =>
      prevList.map((deliverable: any) =>
        deliverable?.id === deliverableId ? { ...deliverable, isPreloading: true } : deliverable
      )
    )
    apiRequest
      .post(`/estimation-tasks/`, {
        problemGoalId: problemGoalID,
        deliverableId
      })
      .then(res => {
        setTasksList((prevState: any[]) => res?.data)
        showSnackbar('Generated Successfully!', { variant: 'success' })
      })
      .catch(error => {
        showSnackbar(error?.response?.data?.message ?? 'Something went wrong!', { variant: 'error' })
      })
      .finally(() => {
        setDeliverableData((prevList: any) =>
          prevList.map((deliverable: any) =>
            deliverable?.id === deliverableId ? { ...deliverable, isPreloading: false } : deliverable
          )
        )
      })
  }

  useEffect(() => {
    getEmployeeRoleList()
    setTaskListState(taskList)
  }, [taskList])

  return (
    <>
      {!!preload && <Preloader />}
      <ProjectSOWEstimationFormView
        {...props}
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
        taskList={taskListState}
        teamUserList={teamUserList}
        taskEditId={taskEditId}
        taskFormData={taskFormData}
        handleAddNewTask={handleAddNewTask}
        handleRemoveTask={handleRemoveTask}
        handleServiceTaskModalClose={handleServiceTaskModalClose}
        handleTaskInputChange={handleTaskInputChange}
        handleTaskMultipleInputChange={handleTaskMultipleInputChange}
        handleTaskOnClear={handleTaskOnClear}
        handleTaskOnEdit={handleTaskOnEdit}
        handleTaskSaveOnClick={handleTaskSaveOnClick}
        handleTaskSelectChange={handleTaskSelectChange}
        serviceTaskModalOpen={serviceTaskModalOpen}
        handleGenerateTaskWithAI={handleGenerateTaskWithAI}
      ></ProjectSOWEstimationFormView>
    </>
  )
}
