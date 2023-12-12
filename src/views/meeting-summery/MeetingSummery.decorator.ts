import { Dispatch, SetStateAction } from 'react'

export type TMeetingSummeryComponent = {
  editDataId?: string | null
  setEditDataId: Dispatch<SetStateAction<string | null>>
  editData?: any
  setEditData: Dispatch<any> // Remove the optional '?'
  listData: any[]
  setListData: Dispatch<any>
}

export const MeetingTypeList = [
  { title: 'Internal', id: 1 },
  { title: 'Client', id: 2 }
]
