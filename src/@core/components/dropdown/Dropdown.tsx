// ** MUI Icons
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'

// ** React Imports
import { forwardRef, SyntheticEvent, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'

// ** Custom Utilities
import {
  Box,
  FormControl,
  InputAdornment,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,
  SelectProps,
  SxProps,
  TextField
} from '@mui/material'
import apiRequest from '../../utils/axios-config'

type TOptionConfig = { title: string; id: string }

export interface DropdownRef {
  refreshList: () => void
}
interface ISelectProps {
  label?: string
  url?: string
  queryParam?: string[]
  searchable?: boolean
  searchPlaceholder?: string
  optionConfig?: TOptionConfig
  dataList?: any[]
  sx?: SxProps
  isAddNewButton?: boolean
  onAddNew?: () => void
  syncOnOpen?: boolean
  clearable?: boolean
  placeholder?: string // Add placeholder here
}

type SelectPropsWithISelectProps = SelectProps & ISelectProps

export const Dropdown = forwardRef((props: SelectPropsWithISelectProps, ref) => {
  const {
    placeholder,
    url,
    dataList = [],
    optionConfig = { title: 'name', id: 'id' },
    queryParam = [],
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
    onClose,
    clearable = true,
    ...otherProps
  } = props
  const dropdownRef = useRef(null)
  const [optionItems, setOptionItems] = useState<Record<string | number, any>[]>([])
  const [initialOptionList, setInitialOptionList] = useState<Record<string | number, any>[]>([])
  const [preloader, setPreloader] = useState(true)
  const [searchText, setSearchText] = useState('')

  const getList = useCallback(() => {
    setPreloader(true)
    if (!dataList.length && url) {
      apiRequest
        .get(`/${url}?${queryParam.join('&')}&per_page=1000`)
        .then((res: any) => {
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
          // handle error
        })
    } else if (dataList.length) {
      const fetchedOptions =
        dataList?.map((item: any) => ({
          title: item?.[optionConfig?.title],
          id: item?.[optionConfig?.id]
        })) || []
      setOptionItems(fetchedOptions)
      setInitialOptionList(fetchedOptions)
      setPreloader(false)
    } else {
      setOptionItems([])
      setInitialOptionList([])
      setPreloader(false)
    }
  }, [setPreloader, setOptionItems, setInitialOptionList, setPreloader])

  const handleOnClose = (event: SyntheticEvent) => {
    onClose && onClose(event)
    setOptionItems(initialOptionList)
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
  }, [initialOptionList, searchText])

  const selectOnOpen = () => {
    setOptionItems(initialOptionList)
    setSearchText('')
  }

  const handleSelectAll = () => {
    const allIds = optionItems.map(item => item.id)
    onChange && onChange({ target: { value: allIds, name: otherProps.name } } as any, { action: 'select' } as any)
  }

  const handleClearAll = () => {
    onChange && onChange({ target: { value: [], name: otherProps.name } } as any, { action: 'clear' } as any)
  }

  return (
    <FormControl fullWidth sx={sx}>
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
          onClose={handleOnClose}
          onOpen={() => {
            if (!optionItems.length || syncOnOpen) {
              getList()
            }
          }}
        >
          {searchable && (
            <ListSubheader sx={{ pt: 1 }}>
              <TextField
                size='small'
                placeholder={searchPlaceholder}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <SearchIcon />
                    </InputAdornment>
                  )
                }}
                onChange={(e: any) => setSearchText(() => e.target.value)}
                onKeyDown={(e: any) => {
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
          {clearable && !multiple && (
            <MenuItem value=''>
              <em>Clear selection</em>
            </MenuItem>
          )}

          {preloader && <MenuItem disabled>Loading...</MenuItem>}
          {optionItems?.map((option: any, index: number) => (
            <MenuItem value={option.id} key={index}>
              <Box
                component='span'
                className='md-editor-preview'
                dangerouslySetInnerHTML={{ __html: option.title }}
              ></Box>
            </MenuItem>
          ))}

          {multiple && (
            <ListSubheader>
              <Box display='flex' justifyContent='space-between' p={1}>
                <button onClick={handleSelectAll}>Select All</button>
                <button onClick={handleClearAll}>Clear All</button>
              </Box>
            </ListSubheader>
          )}
        </Select>
        {isAddNewButton && (
          <button
            type='button'
            className={
              'flex items-center justify-center ml-2 h-9 w-9 text-sm font-medium leading-5 rounded-lg outline-none border border-solid border-purple-400 dark-d:border-gray-400 text-purple-600 dark-d:text-gray-400 hover:bg-purple-400 hover:text-white'
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
