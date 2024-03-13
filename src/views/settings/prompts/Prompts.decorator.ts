import { Dispatch, SetStateAction } from 'react'

export type TPromptsComponent = {
  editDataId?: string | null
  setEditDataId: Dispatch<SetStateAction<string | null>>
  editData?: any
  setEditData: Dispatch<any> // Remove the optional '?'
  listData: any[]
  setListData: Dispatch<any>
}

export const promptsTypeList = [
  { title: 'Project Summary', id: 1 },
  { title: 'Problems And Goals', id: 2 },
  { title: 'Project Overview', id: 3 },
  { title: 'Scope Of Work', id: 4 },
  { title: 'Deliverables', id: 5 },
  { title: 'Meeting Summary', id: 6 },
  { title: 'Other', id: 7 }
]
