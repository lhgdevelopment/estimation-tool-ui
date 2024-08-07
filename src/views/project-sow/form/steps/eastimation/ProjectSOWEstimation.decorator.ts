import { Dispatch } from 'react'

export type TProjectSOWEstimationFormComponentProps = {
  associatedUserWithRole: any[]
  setAssociatedUserWithRole: Dispatch<any>
  transcriptId: string
  problemGoalID: string
  tasksList: any[]
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
  tasksList: any[]
  handleUpdateTaskCheckUnCheckForSOWOnChange: (deliverables: any, isChecked: boolean) => void
  handleUpdateTaskCheckUnCheckForDeliverablesOnChange: (tasks: any, isChecked: boolean) => void
  handleUpdateTaskEstimateHoursOnChange: (taskId: number, estimateHours: number) => void
  handleUpdateTaskCheckUnCheckForTaskOnChange: (taskId: number, isChecked: boolean) => void
  handleUpdateTaskCheckUnCheckForParentTaskOnChange: (tasks: any, parentTaskId: number, isChecked: boolean) => void
  handleUpdateTaskAssignOnChange: (taskId: number, associateId: number) => void
  handleUpdateTaskCheckUnCheckForServiceOnChange: (scope_of_works: any, isChecked: boolean) => void
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

  data.forEach((item: any) => {
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
        total += task?.estimateHours

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
        total += task?.estimateHours * task?.associate?.hourlyRate

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
        totalHours += task?.estimateHours * task?.associate?.hourlyRate

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
        total += task?.estimateHours * task?.associate?.hourlyRate

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
      totalHours += task?.estimateHours * task?.associate?.hourlyRate

      if (task?.sub_tasks && task?.sub_tasks.length > 0) {
        totalHours += sumHours(task?.sub_tasks)
      }
    }
  })

  return totalHours.toFixed(2)
}

export function calculateTotalHoursForAllSOWs(scope_of_works: any) {
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

  scope_of_works?.forEach((sow: any) => {
    sow?.deliverables?.forEach((deliverable: any) => {
      deliverable?.tasks?.forEach((task: any) => {
        if (task?.isChecked) {
          totalHours += task?.estimateHours

          if (task?.sub_tasks && task?.sub_tasks.length > 0) {
            totalHours += sumHours(task?.sub_tasks)
          }
        }
      })
    })
  })

  return totalHours.toFixed(2)
}

export function calculateTotalInternalCostForAllSOWs(scope_of_works: any) {
  function sumHours(tasks: any) {
    let total = 0

    tasks?.forEach((task: any) => {
      if (task?.isChecked) {
        total += task?.estimateHours * task?.associate?.hourlyRate

        if (task?.sub_tasks && task?.sub_tasks.length > 0) {
          total += sumHours(task?.sub_tasks)
        }
      }
    })

    return total
  }

  let totalHours = 0

  scope_of_works?.forEach((sow: any) => {
    sow?.deliverables?.forEach((deliverable: any) => {
      deliverable?.tasks?.forEach((task: any) => {
        if (task?.isChecked) {
          totalHours += task?.estimateHours * task?.associate?.hourlyRate

          if (task?.sub_tasks && task?.sub_tasks.length > 0) {
            totalHours += sumHours(task?.sub_tasks)
          }
        }
      })
    })
  })

  return totalHours.toFixed(2)
}
