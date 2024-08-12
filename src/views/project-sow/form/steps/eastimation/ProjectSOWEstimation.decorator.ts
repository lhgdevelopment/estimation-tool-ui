import { ChangeEvent, Dispatch } from 'react'

export type TProjectSOWEstimationFormComponentProps = {
  associatedUserWithRole: any[]
  setAssociatedUserWithRole: Dispatch<any>
  transcriptId: string
  problemGoalID: string
  taskList: any[]
  setTasksList: Dispatch<any>
  teamUserList: any[]
  setSelectedDeliverableData: Dispatch<any>
  overviewText: string
  problemGoalText: string
  projectSOWFormData: any
}

export type TProjectSOWEstimationFormViewProps = {
  handleDeliverableCheckboxBySow: (deliverables: any) => void
  handleDeliverableCheckbox: (e: React.ChangeEvent<HTMLInputElement>) => void
  projectSOWFormData: any
  errorMessage: any
  problemGoalText: string
  overviewText: string
  handleUpdateTeamAssignOnChange: (employeeRoleId: number, associateId: number) => void
  employeeRoleData: any[]
  associatedUserWithRole: any[]
  teamUserList: any[]
  taskList: any[]
  handleUpdateTaskCheckUnCheckForSOWOnChange: (deliverables: any, isChecked: boolean) => void
  handleUpdateTaskCheckUnCheckForDeliverablesOnChange: (tasks: any, isChecked: boolean) => void
  handleUpdateTaskEstimateHoursOnChange: (taskId: number, estimateHours: number) => void
  handleUpdateTaskCheckUnCheckForTaskOnChange: (taskId: number, isChecked: boolean) => void
  handleUpdateTaskCheckUnCheckForParentTaskOnChange: (tasks: any, parentTaskId: number, isChecked: boolean) => void
  handleUpdateTaskAssignOnChange: (taskId: number, associateId: number) => void
  handleUpdateTaskCheckUnCheckForServiceOnChange: (scope_of_works: any, isChecked: boolean) => void
  serviceTaskModalOpen: boolean
  handleTaskInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => any
  handleAddNewTask: () => void
  handleTaskMultipleInputChange: (additionalService: any, selectedTaskData: any) => void
  handleRemoveTask: (id: any) => void
  handleTaskSaveOnClick: () => void
  handleTaskOnClear: () => void
  handleTaskOnEdit: (data: any) => void
  handleServiceTaskModalClose: () => void
  handleTaskSelectChange: (additionalService: any, selectedTaskData: any) => any
  taskEditId: string
  taskFormData: any
}

export function serviceGroupByProjectTypeId(data: any) {
  const grouped =
    data?.reduce((acc: { [key: number]: any }, item: any) => {
      const { projectTypeId, project_type } = item

      if (!acc[projectTypeId]) {
        acc[projectTypeId] = {
          projectTypeName: project_type.name,
          projectTypeId: projectTypeId,
          services: []
        }
      }

      acc[projectTypeId].services.push(item)

      return acc
    }, {}) || {}

  return Object?.values(grouped)
}

export function serviceDeliverableGroupByScopeOfWorkId(data: any) {
  const grouped =
    data?.reduce((acc: { [key: number]: any }, item: any) => {
      const { scopeOfWorkId, scope_of_work } = item

      if (!acc[scopeOfWorkId]) {
        acc[scopeOfWorkId] = {
          ...scope_of_work,
          additional_service_info: item?.additional_service_info,
          deliverables: []
        }
      }

      acc[scopeOfWorkId].deliverables.push(item)

      return acc
    }, {}) || {}

  return Object.values(grouped)
}

export function transformSubTaskTaskDeliverablesSowsData(data: any) {
  const result: any = []

  data?.forEach((item: any) => {
    const scopeOfWork = item?.deliverable?.scope_of_work
    const deliverable = item?.deliverable

    let scopeOfWorkEntry = result?.find((entry: any) => entry.id === scopeOfWork?.id)

    if (!scopeOfWorkEntry) {
      scopeOfWorkEntry = {
        ...scopeOfWork,
        deliverables: []
      }
      result.push(scopeOfWorkEntry)
    }

    let deliverableEntry = scopeOfWorkEntry?.deliverables?.find((del: any) => del?.id === deliverable?.id)

    if (!deliverableEntry) {
      deliverableEntry = {
        ...deliverable,
        tasks: []
      }
      scopeOfWorkEntry?.deliverables.push(deliverableEntry)
    }

    const task = {
      ...item,
      sub_tasks: []
    }

    if (item?.estimationTasksParentId) {
      const parentTask = deliverableEntry?.tasks?.find((task: any) => task?.id === item?.estimationTasksParentId)
      if (parentTask) {
        parentTask?.sub_tasks.push(task)
      } else {
        // If the parent task is not found, add the task directly to the list of tasks
        deliverableEntry?.tasks.push(task)
      }
    } else {
      deliverableEntry?.tasks.push(task)
    }
  })

  return result
}

export function calculateTotalHoursForScopeOfWorks(scopeOfWork: any) {
  function sumHours(tasks: any) {
    let total = 0

    tasks.forEach((task: any) => {
      if (task?.isChecked) {
        total += Number(task?.estimateHours)

        if (task?.sub_tasks && task?.sub_tasks.length > 0) {
          total += sumHours(task?.sub_tasks)
        }
      }
    })

    return total
  }

  let totalHours = 0

  scopeOfWork.deliverables.forEach((deliverable: any) => {
    deliverable.tasks?.forEach((task: any) => {
      if (task?.isChecked) {
        totalHours += task?.estimateHours

        if (task?.sub_tasks && task?.sub_tasks?.length > 0) {
          totalHours += sumHours(task?.sub_tasks)
        }
      }
    })
  })

  return totalHours.toFixed(2)
}

export function calculateTotalInternalCostForScopeOfWorks(scopeOfWork: any) {
  function sumHours(tasks: any) {
    let total = 0

    tasks.forEach((task: any) => {
      if (task?.isChecked) {
        total += Number(task?.estimateHours) * Number(task?.associate?.hourlyRate ?? 0)

        if (task?.sub_tasks && task?.sub_tasks.length > 0) {
          total += sumHours(task?.sub_tasks)
        }
      }
    })

    return total
  }

  let totalHours = 0

  scopeOfWork.deliverables.forEach((deliverable: any) => {
    deliverable.tasks?.forEach((task: any) => {
      if (task?.isChecked) {
        totalHours += task?.estimateHours * task?.associate?.hourlyRate ?? 0

        if (task?.sub_tasks && task?.sub_tasks?.length > 0) {
          totalHours += sumHours(task?.sub_tasks)
        }
      }
    })
  })

  return totalHours.toFixed(2)
}

export function calculateTotalHoursForDeliverable(deliverables: any) {
  function sumHours(tasks: any) {
    let total = 0

    tasks?.forEach((task: any) => {
      if (task?.isChecked) {
        total += task?.estimateHours

        if (task?.sub_tasks && task?.sub_tasks.length > 0) {
          total += sumHours(task?.sub_tasks)
        }
      }
    })

    return total
  }

  let totalHours = 0

  deliverables.tasks.forEach((task: any) => {
    if (task?.isChecked) {
      totalHours += task?.estimateHours

      if (task?.sub_tasks && task?.sub_tasks.length > 0) {
        totalHours += sumHours(task?.sub_tasks)
      }
    }
  })

  return totalHours.toFixed(2)
}

export function calculateTotalInternalCostForDeliverable(deliverables: any) {
  function sumHours(tasks: any) {
    let total = 0

    tasks?.forEach((task: any) => {
      if (task?.isChecked) {
        total += Number(task?.estimateHours) * Number(task?.associate?.hourlyRate ?? 0)

        if (task?.sub_tasks && task?.sub_tasks.length > 0) {
          total += sumHours(task?.sub_tasks)
        }
      }
    })

    return total
  }

  let totalHours = 0

  deliverables.tasks.forEach((task: any) => {
    if (task?.isChecked) {
      totalHours += Number(task?.estimateHours) * Number(task?.associate?.hourlyRate ?? 0)

      if (task?.sub_tasks && task?.sub_tasks.length > 0) {
        totalHours += sumHours(task?.sub_tasks)
      }
    }
  })

  return totalHours.toFixed(2)
}

export function calculateTotalHoursForAllSOWs(taskList: any) {
  console.log(taskList)
  let total = 0
  taskList?.forEach((task: any) => {
    total += Number(task?.estimateHours ?? 0)

    // if (task?.sub_tasks && task?.sub_tasks.length > 0) {
    //   let subTaskTotal = 0

    //   task?.sub_tasks?.forEach((subTask: any) => {
    //     if (subTask?.isChecked) {
    //       subTaskTotal += Number(subTask?.estimateHours ?? 0)
    //     }
    //   })

    //   total += subTaskTotal
    // }
  })

  return total.toFixed(2)
}

export function calculateTotalInternalCostForAllSOWs(taskList: any) {
  let totalHours = 0

  taskList?.forEach((task: any) => {
    totalHours += Number(task?.estimateHours ?? 0) * Number(task?.associate?.hourlyRate ?? 0)
  })

  return totalHours.toFixed(2)
}
