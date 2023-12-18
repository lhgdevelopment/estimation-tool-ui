import { Dispatch } from 'react'

export type TProjectSOWComponent = { listData: any[]; setListData: Dispatch<any> }
export type TProjectSOWFormComponent = { setListDataRefresh: Dispatch<any> }
export type TProjectSOWListComponent = { listDataRefresh: any[] }

export const projectTypeList = [
  { title: 'Logo/Branding', id: 1 },
  { title: 'Graphic Design', id: 2 },
  { title: 'Printing', id: 3 },
  { title: 'Website Design', id: 4 },
  { title: 'Website Redesign', id: 5 },
  { title: 'Research', id: 6 },
  { title: 'Custom Development', id: 7 }
]
