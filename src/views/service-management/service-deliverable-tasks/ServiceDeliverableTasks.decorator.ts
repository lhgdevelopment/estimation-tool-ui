import { Dispatch, SetStateAction } from 'react'

export type TServiceDeliverableTasksComponent = {
  editDataId?: string | null
  setEditDataId: Dispatch<SetStateAction<string | null>>
  editData?: any
  setEditData: Dispatch<any> // Remove the optional '?'
  listData: any[]
  setListData: Dispatch<any>
}

export interface Task {
  name: string
  cost: string
  description: string
}
