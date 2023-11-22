import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectProps } from '@mui/material/Select'
import { useEffect, useState } from 'react'
import apiRequest from '../../utils/axios-config'

type TOptionConfig = { title: string; id: string }

interface ISelectProps extends SelectProps {
  label?: string
  url?: string
  isEnumField?: boolean
  optionConfig?: TOptionConfig
  enumList?: { title: string; id: string }[]
}

export function Dropdown(props: ISelectProps) {
  const { label, url, isEnumField = false, enumList, optionConfig = { title: 'name', id: '_id' } } = props

  const [menuItems, setMenuItems] = useState<{ title: string; id: string }[]>([])

  const getList = () => {
    if (!isEnumField) {
      apiRequest.get(`/${url}`).then(res => {
        setMenuItems(
          res.data?.map((item: any) => {
            return { title: item?.[optionConfig?.title], id: item?.[optionConfig?.id] }
          })
        )
      })
    } else {
      setMenuItems([...(enumList as any)])
    }
  }
  useEffect(() => {
    getList()
  }, [])

  return (
    <FormControl fullWidth>
      {!!label && <InputLabel id='demo-simple-select-label'>{label}</InputLabel>}
      <Select {...props} sx={{ mt: 1, height: 38 }}>
        {menuItems?.map((menuItem: any, index: number) => (
          <MenuItem value={menuItem.id} key={index}>
            {menuItem.title}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
