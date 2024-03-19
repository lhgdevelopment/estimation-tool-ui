import { Dispatch } from 'react'

export type TUpdateLogComponent = {
  listData: any[]
  setListData: Dispatch<any>
  isEdit?: boolean
}
