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

export const transcriptMeetingLinkAddButtonSx = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '30px',
  width: '30px',
  p: '0',
  ml: '15px',
  background: '#9333ea',
  minWidth: 'auto',
  color: '#fff',
  borderRadius: '50%',
  cursor: 'pointer',
  '&:hover': {
    background: '#7e22ce'
  }
}

export const scopeOfWorkListSx = {
  '& .sow-list-item': {
    display: 'flex',
    alignItems: 'center',
    fontSize: '12px',
    fontWeight: 600,
    color: '#777778',
    '& .sow-list-item-type': {
      '& .item-type-common': {
        padding: '5px 20px',
        borderRadius: '15px',

        '&.item-type-hive': {
          background: '#903fe8',
          color: '#fff'
        },
        '&.item-type-sow': {
          background: '#215a6c',
          color: '#fff'
        }
      }
    },
    '& .sow-list-item-check': { mx: 2 },
    '& .sow-list-item-title': { lineHeight: 'normal' }
  }
}
