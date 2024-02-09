import SearchIcon from '@mui/icons-material/Search'
import { InputAdornment, ListSubheader, TextField } from '@mui/material'
import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectProps } from '@mui/material/Select'
import { useEffect, useState } from 'react'
import apiRequest from '../../utils/axios-config'

interface ISelectProps extends SelectProps {
  label?: string
  searchable?: boolean
  searchPlaceholder?: string
  type?: 'services' | 'groups' | 'sows' | 'deliverables' | 'tasks'
}

export function ServiceDropdownTree(props: ISelectProps) {
  const {
    placeholder = 'Please Select',
    multiple = false,
    searchable = true,
    searchPlaceholder = 'Type to search...',
    value,
    onChange,
    id = 'service-dropdown-tree-select-label',
    type = 'tasks',
    ...otherProps
  } = props

  const [optionItems, setOptionItems] = useState<Record<string | number, any>[]>([])
  const [initialOptionList, setInitialOptionList] = useState<Record<string | number, any>[]>([])

  const [searchText, setSearchText] = useState('')

  const getList = () => {
    apiRequest.get(`/service-tree?per_page=1000`).then(res => {
      setOptionItems(res.data.services)
      setInitialOptionList(res.data.services)
    })
  }

  useEffect(() => {
    getList()
  }, [])

  const containsText = (text: string, searchText: string) =>
    text?.toString().toLowerCase().indexOf(searchText?.toString().toLowerCase()) > -1

  const filterOptionsByText = (options, searchText) => {
    return options.filter(option => {
      if (containsText(option.name, searchText)) {
        return true
      }
      if (option.groups && option.groups.length > 0) {
        const filteredGroups = filterOptionsByText(option.groups, searchText)
        if (filteredGroups.length > 0) {
          option.groups = filteredGroups

          return true
        }
      }
      if (option.sows && option.sows.length > 0) {
        const filteredSows = filterOptionsByText(option.sows, searchText)
        if (filteredSows.length > 0) {
          option.sows = filteredSows

          return true
        }
      }
      if (option.deliverables && option.deliverables.length > 0) {
        const filteredDeliverables = filterOptionsByText(option.deliverables, searchText)
        if (filteredDeliverables.length > 0) {
          option.deliverables = filteredDeliverables

          return true
        }
      }
      if (option.tasks && option.tasks.length > 0) {
        const filteredTasks = filterOptionsByText(option.tasks, searchText)
        if (filteredTasks.length > 0) {
          option.tasks = filteredTasks

          return true
        }
      }

      return false
    })
  }

  useEffect(() => {
    const filteredOptions = filterOptionsByText(initialOptionList, searchText)
    setOptionItems(filteredOptions)
  }, [searchText])

  const selectOnOpen = () => {
    setOptionItems(initialOptionList)
    setSearchText('')
  }

  const listSubHeaderSx = { color: 'rgba(0, 0, 0, 0.5)', textTransform: 'none', lineHeight: '32px' }
  const menuItemSx = {
    color: '#000',
    '&:hover, && .Mui-selected': { background: '#7e3af2 !important', color: '#fff' }
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
        {optionItems?.map((serviceOption: any, index: number) => {
          if (type === 'services') {
            return (
              <MenuItem sx={{ ...listSubHeaderSx, ...{ pl: '32px' } }} value={serviceOption.id} key={index}>
                {serviceOption.name}
              </MenuItem>
            )
          } else if (type === 'groups') {
            return [
              <ListSubheader sx={{ ...listSubHeaderSx, ...{ pl: '16px' } }} key={serviceOption.id}>
                {serviceOption.name}
              </ListSubheader>,
              serviceOption?.groups?.map((groupsOption: any, groupsOptionIndex: number) => (
                <MenuItem
                  sx={{ ...listSubHeaderSx, ...{ pl: '32px' } }}
                  value={groupsOption.id}
                  key={groupsOptionIndex}
                >
                  {groupsOption.name}
                </MenuItem>
              ))
            ]
          } else if (type === 'sows') {
            return [
              <ListSubheader sx={{ ...listSubHeaderSx, ...{ pl: '16px' } }} key={serviceOption.id}>
                {serviceOption.name}
              </ListSubheader>,
              serviceOption?.groups?.map((groupsOption: any, groupsOptionIndex: number) => {
                return [
                  <ListSubheader sx={{ ...listSubHeaderSx, ...{ pl: '32px' } }} key={groupsOptionIndex}>
                    {groupsOption.name}
                  </ListSubheader>,
                  groupsOption?.sows?.map((sowsOption: any, sowsOptionIndex: number) => (
                    <MenuItem
                      sx={{ ...listSubHeaderSx, ...{ pl: '48px' } }}
                      value={sowsOption.id}
                      key={sowsOptionIndex}
                    >
                      {sowsOption.name}
                    </MenuItem>
                  ))
                ]
              })
            ]
          } else if (type === 'deliverables') {
            return [
              <ListSubheader sx={{ ...listSubHeaderSx, ...{ pl: '16px' } }} key={serviceOption.id}>
                {serviceOption.name}
              </ListSubheader>,
              serviceOption?.groups?.map((groupsOption: any, groupsOptionIndex: number) => {
                return [
                  <ListSubheader sx={{ ...listSubHeaderSx, ...{ pl: '32px' } }} key={groupsOptionIndex}>
                    {groupsOption.name}
                  </ListSubheader>,
                  groupsOption?.sows?.map((sowsOption: any, sowsOptionIndex: number) => {
                    return [
                      <ListSubheader sx={{ ...listSubHeaderSx, ...{ pl: '48px' } }} key={sowsOptionIndex}>
                        {sowsOption.name}
                      </ListSubheader>,
                      sowsOption?.deliverables?.map((deliverablesOption: any, deliverablesOptionIndex: number) => (
                        <MenuItem
                          sx={{ ...listSubHeaderSx, ...{ pl: '64px' } }}
                          value={deliverablesOption.id}
                          key={deliverablesOptionIndex}
                        >
                          {deliverablesOption.name}
                        </MenuItem>
                      ))
                    ]
                  })
                ]
              })
            ]
          } else if (type === 'tasks') {
            return [
              <ListSubheader sx={{ ...listSubHeaderSx, ...{ pl: '16px' } }} key={serviceOption.id}>
                {serviceOption.name}
              </ListSubheader>,
              serviceOption?.groups?.map((groupsOption: any, groupsOptionIndex: number) => {
                return [
                  <ListSubheader sx={{ ...listSubHeaderSx, ...{ pl: '32px' } }} key={groupsOptionIndex}>
                    {groupsOption.name}
                  </ListSubheader>,
                  groupsOption?.sows?.map((sowsOption: any, sowsOptionIndex: number) => {
                    return [
                      <ListSubheader sx={{ ...listSubHeaderSx, ...{ pl: '48px' } }} key={sowsOptionIndex}>
                        {sowsOption.name}
                      </ListSubheader>,
                      sowsOption?.deliverables?.map((deliverablesOption: any, deliverablesOptionIndex: number) => {
                        return [
                          <ListSubheader sx={{ ...listSubHeaderSx, ...{ pl: '64px' } }} key={deliverablesOptionIndex}>
                            {deliverablesOption.name}
                          </ListSubheader>,
                          deliverablesOption?.tasks?.map((tasksOption: any, tasksOptionIndex: number) => (
                            <MenuItem
                              sx={{ ...menuItemSx, ...{ pl: '80px' } }}
                              value={tasksOption.id}
                              key={tasksOptionIndex}
                            >
                              {tasksOption.name}
                            </MenuItem>
                          ))
                        ]
                      })
                    ]
                  })
                ]
              })
            ]
          }
        })}
      </Select>
    </FormControl>
  )
}
