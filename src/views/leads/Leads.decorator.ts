import { Dispatch } from 'react'

export type TLeadsComponent = {
  listData: any[]
  setListData: Dispatch<any>
  isEdit?: boolean
}

export const MeetingTypeList = [
  { title: 'Internal', id: 1 },
  { title: 'Client', id: 2 }
]
