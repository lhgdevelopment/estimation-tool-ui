import { SxProps } from '@mui/material'

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
      key: item.label ? item.label : `${type}_${item?.id}`
    }
    if (item.groups) {
      newItem.children = transformServiceTree(item.groups, 'group')
    } else if (item.sows) {
      newItem.children = transformServiceTree(item.sows, 'sow')
    } else if (item.deliverables) {
      newItem.children = transformServiceTree(item.deliverables, 'deliverable')
    } else if (item.tasks) {
      //console.log(item)
      newItem.children = transformServiceTree(item.tasks, 'task')
    } else {
      //console.log(item)

      newItem.children = item.sub_tasks?.map((task: any) => ({
        ...task,
        title: task.name,
        type: 'sub_task',
        deliverableId: item.deliverableId,
        key: task.label ? task.label : `${task.name}_${keyCounter++}`
      }))
    }

    return newItem
  })
}

export const treeTitleSx: SxProps = {
  display: 'flex',
  alignItems: 'center',
  '&:hover': {
    '& button': {
      opacity: 1
    }
  }
}
export const treeButtonContainerSx: SxProps = { ml: 2 }
export const editButtonSx: SxProps = {
  minWidth: 'auto',
  fontSize: '12px',
  textTransform: 'none',
  p: '1px',
  border: '1px solid #9333ea',
  lineHeight: 'normal',
  color: '#9333ea',
  mx: '5px',
  opacity: 0,
  '&:hover': {
    background: '#9333ea',
    color: '#fff'
  }
}

export const deleteButtonSx: SxProps = {
  minWidth: 'auto',
  fontSize: '12px',
  textTransform: 'none',
  p: '1px',
  border: '1px solid #dc2626',
  lineHeight: 'normal',
  color: '#dc2626',
  mx: '5px',
  opacity: 0,
  '&:hover': {
    background: '#dc2626',
    color: '#fff'
  }
}

export const addButtonSx: SxProps = {
  minWidth: 'auto',
  fontSize: '12px',
  textTransform: 'none',
  py: '1px',
  px: '5px',
  border: '1px solid #9333ea',
  lineHeight: 'normal',
  color: '#9333ea',
  opacity: 0,
  mx: '5px',
  '&:hover': {
    background: '#9333ea',
    color: '#fff'
  }
}
