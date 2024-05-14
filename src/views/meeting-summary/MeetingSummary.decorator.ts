import { Dispatch } from 'react'

export type TMeetingSummaryComponent = {
  listData: any[]
  setListData: Dispatch<any>
  isEdit?: boolean
}

export const MeetingTypeList = [
  { title: 'Internal', id: 1 },
  { title: 'Client', id: 2 },
  { title: 'Sales', id: 3 }
]
