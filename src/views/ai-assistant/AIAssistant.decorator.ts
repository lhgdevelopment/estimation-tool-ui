import { Dispatch, SetStateAction } from 'react'

export type TAIAssistantComponent = {
  editDataId?: string | null
  setEditDataId: Dispatch<SetStateAction<string | null>>
  editData?: any
  setEditData: Dispatch<any> // Remove the optional '?'
  listData: any[]
  setListData: Dispatch<any>
}

export const shareAccessLevel = [
  { id: 1, name: 'View Only' },
  { id: 2, name: 'Edit' }
]
