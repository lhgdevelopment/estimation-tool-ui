import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import { Box, InputAdornment, InputLabel, ListSubheader, SxProps, TextField } from '@mui/material'
import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectProps } from '@mui/material/Select'
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import apiRequest from '../../utils/axios-config'

type TOptionConfig = { title: string; id: string }

export interface DropdownRef {
  refreshList: () => void
}
interface ISelectProps {
  label?: string
  url?: string
  isEnumField?: boolean
  searchable?: boolean
  searchPlaceholder?: string
  optionConfig?: TOptionConfig
  enumList?: { title: string; id: string | number }[]
  sx?: SxProps
  isAddNewButton?: boolean
  onAddNew?: () => void
  syncOnOpen?: boolean
}

type SelectPropsWithISelectProps = SelectProps & ISelectProps

export const Dropdown = forwardRef((props: SelectPropsWithISelectProps, ref) => {
  const {
    placeholder,
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
    isAddNewButton = false,
    onAddNew,
    syncOnOpen = false,
    sx,
    label,
    labelId = 'demo-simple-select-label',
    ...otherProps
  } = props
  const dropdownRef = useRef(null)
  const [optionItems, setOptionItems] = useState<Record<string | number, any>[]>([])
  const [initialOptionList, setInitialOptionList] = useState<Record<string | number, any>[]>([])

  const [preloader, setPreloader] = useState(true)
  const [searchText, setSearchText] = useState('')

  const getList = () => {
    setPreloader(true)
    if (!isEnumField && url) {
      apiRequest
        .get(`/${url}?per_page=1000`)
        .then(res => {
          const fetchedOptions =
            res?.data?.map((item: any) => ({
              title: item?.[optionConfig?.title],
              id: item?.[optionConfig?.id]
            })) || []
          setOptionItems(fetchedOptions)
          setInitialOptionList(fetchedOptions)
          setPreloader(false)
        })
        .catch(() => {
          getList()
        })
    } else if (enumList) {
      setOptionItems([...enumList])
      setInitialOptionList([...enumList])
      setPreloader(false)
    } else {
      setOptionItems([])
      setInitialOptionList([])
      setPreloader(false)
    }
  }
  const refreshList = () => {
    getList()
  }

  useImperativeHandle(ref, () => ({
    refreshList: () => refreshList()
  }))

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
      <InputLabel id={labelId}>{label}</InputLabel>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Select
          {...otherProps}
          ref={ref}
          value={multiple ? value || [] : value || ''}
          label={label}
          onChange={onChange}
          multiple={multiple}
          fullWidth
          onOpen={() => {
            if (!optionItems.length || syncOnOpen) {
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
              <Box component='span' dangerouslySetInnerHTML={{ __html: option.title }}></Box>
            </MenuItem>
          ))}
        </Select>
        {isAddNewButton && (
          <button
            type='button'
            className={
              'flex items-center justify-center ml-2 h-9 w-9 text-sm font-medium leading-5 rounded-lg outline-none border border-solid border-purple-400 dark:border-gray-400 text-purple-600 dark:text-gray-400 hover:bg-purple-400 hover:text-white'
            }
            onClick={() => {
              onAddNew && onAddNew()
            }}
          >
            <AddIcon />
          </button>
        )}
      </Box>
    </FormControl>
  )
})
