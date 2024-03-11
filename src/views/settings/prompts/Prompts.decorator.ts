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
  { name: 'Project Summary', id: 1 },
  { name: 'Problems And Goals', id: 2 },
  { name: 'Project Overview', id: 3 },
  { name: 'Scope Of Work', id: 4 },
  { name: 'Deliverables', id: 5 },
  { name: 'Meeting Summary', id: 6 },
  { name: 'Other', id: 7 }
]
