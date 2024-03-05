let keyCounter = 0
export const transformServiceTree = (data: any) => {
  return data.map((item: any) => {
    const newItem = {
      ...item,
      title: item.name,
      key: item.label ? item.label : `${item.name}_${keyCounter++}`
    }
    if (item.groups) {
      newItem.children = transformServiceTree(item.groups)
    }
    if (item.sows) {
      newItem.children = transformServiceTree(item.sows)
    }
    if (item.deliverables) {
      newItem.children = transformServiceTree(item.deliverables)
    }
    if (item.tasks) {
      newItem.children = item.tasks.map((task: any) => ({
        ...task,
        title: task.name,
        key: task.label ? task.label : `${task.name}_${keyCounter++}`
      }))
    }

    return newItem
  })
}
