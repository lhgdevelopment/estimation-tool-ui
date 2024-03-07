export enum EServiceFormType {
  'SERVICE' = 'SERVICE',
  'GROUP' = 'GROUP',
  'SOW' = 'SOW',
  'DELIVARABLE' = 'DELIVARABLE',
  'TASK' = 'TASK'
}
let keyCounter = 0
export const transformServiceTree = (data: any, type: string) => {
  return data.map((item: any) => {
    const newItem = {
      ...item,
      title: item.name,
      type: type,
      key: item.label ? item.label : `${item.name}_${keyCounter++}`
    }
    if (item.groups) {
      newItem.children = transformServiceTree(item.groups, 'group')
    }
    if (item.sows) {
      newItem.children = transformServiceTree(item.sows, 'sow')
    }
    if (item.deliverables) {
      newItem.children = transformServiceTree(item.deliverables, 'deliverable')
    }
    if (item.tasks) {
      newItem.children = item.tasks.map((task: any) => ({
        ...task,
        title: task.name,
        type: 'task',
        key: task.label ? task.label : `${task.name}_${keyCounter++}`
      }))
    }

    return newItem
  })
}
