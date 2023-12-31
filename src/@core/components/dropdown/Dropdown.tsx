import FormControl from '@mui/material/FormControl'
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
  enumList?: { title: string; id: string | number }[]
}

export function Dropdown(props: ISelectProps) {
  const {
    placeholder = 'Please Select',
    url,
    isEnumField = false,
    enumList,
    optionConfig = { title: 'name', id: '_id' },
    multiple = false,
    value,
    onChange,
    id = 'demo-simple-select-label',
    ...otherProps
  } = props

  const [menuItems, setMenuItems] = useState<{ title: string; id: string | number }[]>([])

  const getList = () => {
    if (!isEnumField && url !='') {
      apiRequest.get(`/${url}`).then(res => {
        setMenuItems(
          res.data?.map((item: any) => ({
            title: item?.[optionConfig?.title],
            id: item?.[optionConfig?.id]
          })) || []
        )
      })
    } else if (enumList) {
      setMenuItems([...enumList])
    }
  }

  useEffect(() => {
    getList()
  }, [])

  useEffect(() => {
    if (url) {
      getList();
    }
  }, [url]);

  return (
    <FormControl fullWidth>
      <Select
        {...otherProps}
        value={multiple ? value || [] : value || ''}
        onChange={onChange}
        multiple={multiple}
        sx={{ mt: 1, height: 38 }}
        displayEmpty
      >
        {placeholder && (
          <MenuItem value='' disabled>
            {placeholder}
          </MenuItem>
        )}
        {menuItems?.map((menuItem: any, index: number) => (
          <MenuItem value={menuItem.id} key={index}>
            {menuItem.title}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
