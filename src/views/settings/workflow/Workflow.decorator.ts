import { Dispatch, SetStateAction } from 'react'

export type TWorkflowComponent = {
  editDataId?: string | null
  setEditDataId: Dispatch<SetStateAction<string | null>>
  editData?: any
  setEditData: Dispatch<any> // Remove the optional '?'
  listData: any[]
  setListData: Dispatch<any>
}
