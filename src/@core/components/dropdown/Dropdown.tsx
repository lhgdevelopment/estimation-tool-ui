import SearchIcon from '@mui/icons-material/Search'
import { InputAdornment, ListSubheader, TextField } from '@mui/material'
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
  searchable?: boolean
  searchPlaceholder?: string
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
    searchable = true,
    searchPlaceholder = 'Type to search...',
    value,
    onChange,
    id = 'demo-simple-select-label',
    ...otherProps
  } = props

  const [optionItems, setOptionItems] = useState<Record<string | number, any>[]>([])
  const [initialOptionList, setInitialOptionList] = useState<Record<string | number, any>[]>([])

  const [searchText, setSearchText] = useState('')

  const getList = () => {
    if (!isEnumField && url !== '') {
      apiRequest.get(`/${url}`).then(res => {
        const fetchedOptions =
          res.data?.map((item: any) => ({
            title: item?.[optionConfig?.title],
            id: item?.[optionConfig?.id]
          })) || []
        setOptionItems(fetchedOptions)
        setInitialOptionList(fetchedOptions)
      })
    } else if (enumList) {
      setOptionItems([...enumList])
      setInitialOptionList([...enumList])
    }
  }

  useEffect(() => {
    getList()
  }, [])

  useEffect(() => {
    if (url) {
      getList()
    }
  }, [url])

  const containsText = (text: string, searchText: string) =>
    text?.toString().toLowerCase().indexOf(searchText?.toString().toLowerCase()) > -1

  useEffect(() => {
    setOptionItems(initialOptionList.filter(item => containsText(item['title'], searchText)))
  }, [searchText])

  const selectOnOpen = () => {
    setOptionItems(initialOptionList)
    setSearchText('')
  }

  return (
    <FormControl fullWidth>
      <Select
        {...otherProps}
        value={multiple ? value || [] : value || ''}
        onChange={onChange}
        multiple={multiple}
        sx={{ mt: 1, height: 38 }}
        displayEmpty
        fullWidth
      >
        {searchable && (
          <ListSubheader
            sx={{
              pt: 1
            }}
          >
            <TextField
              size='small'
              autoFocus
              placeholder={searchPlaceholder}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
              onChange={e => setSearchText(() => e.target.value)}
              onKeyDown={e => {
                if (e.key !== 'Escape') {
                  e.stopPropagation()
                }
              }}
            />
          </ListSubheader>
        )}
        {placeholder && (
          <MenuItem value='' disabled>
            {placeholder}
          </MenuItem>
        )}
        {optionItems?.map((option: any, index: number) => (
          <MenuItem value={option.id} key={index}>
            {option.title}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
