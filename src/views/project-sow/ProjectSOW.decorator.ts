import { Dispatch } from 'react'

export type TProjectSOWFormComponent = {
  listData?: any[]
  setListData?: Dispatch<any>
  isEdit?: boolean
}

export type TProjectSOWListComponent = {
  listData: any[]
  setListData: Dispatch<any>
}

export const projectTypeList = [
  { title: 'Logo/Branding', id: 1 },
  { title: 'Graphic Design', id: 2 },
  { title: 'Printing', id: 3 },
  { title: 'Website Design', id: 4 },
  { title: 'Website Redesign', id: 5 },
  { title: 'Research', id: 6 },
  { title: 'Custom Development', id: 7 },
  { title: 'Marketing', id: 8 }
]

export const transcriptSectionTitleSx = {
  fontSize: '20px',
  display: 'flex',
  mt: '20px',
  mb: '20px',
  color: '#31A0F6',
  fontWeight: '600'
}
