import { Dispatch } from 'react'

export type TPromptsComponent = {
  listData: any[]
  setListData: Dispatch<any>
}

export const promptsTypeList = [
  { title: 'Project Summary', id: 1 },
  { title: 'Problems And Goals', id: 2 },
  { title: 'Phase', id: 9 },
  { title: 'Sales', id: 10 },
  { title: 'Project Overview', id: 3 },
  { title: 'Scope Of Work', id: 4 },
  { title: 'Deliverables', id: 5 },
  { title: 'Tasks', id: 8 },
  { title: 'Meeting Summary', id: 6 },
  { title: 'Other', id: 7 }
  { title: 'Yelp API Chat Bot', id: 11 }
]
