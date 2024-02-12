import SearchIcon from '@mui/icons-material/Search'
import { InputAdornment, ListSubheader, SxProps, TextField } from '@mui/material'
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
  sx?: SxProps
}

export function Dropdown(props: ISelectProps) {
  const {
    placeholder = 'Please Select',
    url,
    isEnumField = false,
    enumList,
    optionConfig = { title: 'name', id: 'id' },
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

  const [preloader, setPreloader] = useState(true)
  const [searchText, setSearchText] = useState('')

  const getList = () => {
    setPreloader(true)
    if (!isEnumField && url !== '') {
      apiRequest.get(`/${url}?per_page=1000`).then(res => {
        const fetchedOptions =
          res.data?.map((item: any) => ({
            title: item?.[optionConfig?.title],
            id: item?.[optionConfig?.id]
          })) || []
        setOptionItems(fetchedOptions)
        setInitialOptionList(fetchedOptions)
        setPreloader(false)
      })
    } else if (enumList) {
      setOptionItems([...enumList])
      setInitialOptionList([...enumList])
      setPreloader(false)
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
        onOpen={() => {
          if (!optionItems.length) {
            getList()
          }
        }}
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
        {preloader && <MenuItem disabled>Loading...</MenuItem>}
        {optionItems?.map((option: any, index: number) => (
          <MenuItem value={option.id} key={index}>
            {option.title}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
