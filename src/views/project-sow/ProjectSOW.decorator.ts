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

export const scopeOfWorkListContainer = {
  display: 'flex',
  gap: 5,
  mb: 5,
  overflow: 'hidden',
  overflowY: 'auto',
  height: '300px',
  border: '1px solid #ecedee',
  borderRadius: '5px',
  p: 3
}
export const scopeOfWorkListSx = {
  '& .sow-list-item': {
    display: 'flex',
    alignItems: 'center',
    fontSize: '12px',
    fontWeight: 600,
    color: '#777778',
    cursor: 'pointer',
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
        },
        '&.item-type-deliverable': {
          background: '#c6dbe1',
          color: '#215a6c'
        }
      }
    },
    '& .sow-list-item-check': { mx: 2 },
    '& .sow-list-item-title': { lineHeight: 'normal' }
  }
}

export const deliverableNoteAddButtonSx = {
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

export const deliverableNoteItemSx = {
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  padding: '25px',
  border: '1px solid #ecedee',
  borderRadius: '5px',
  gap: 5,
  mb: '30px'
}

export const deliverableNoteRemoveButtonSx = {
  position: 'absolute',
  top: '-20px',
  right: '20px',
  background: '#FF4C51',
  color: '#fff',
  '&:hover': { background: '#FF4C51' }
}
export const sectionTitleSx = { fontSize: '20px', fontWeight: '600', color: '#158ddf', mb: 2 }
export const sectionSubTitleSx = {
  display: 'flex',
  alignItems: 'center',
  fontSize: '14px',
  fontWeight: '600',
  color: '#777',
  mb: 4
}
