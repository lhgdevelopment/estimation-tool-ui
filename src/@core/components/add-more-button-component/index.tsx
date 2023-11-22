import { Add } from '@mui/icons-material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import * as React from 'react'
import { _actionButtonCommonStyle } from '../../styles/libs/action-button-common-style'

type TAddMoreButtonComponentProps = {
  title?: string
  defaultValue: Record<string, any>
  append: Record<string, any>[]
  setAppend: React.Dispatch<React.SetStateAction<any>>
  copyNumber?: number
}

export const AddMoreButtonComponent = ({
  defaultValue,
  title = 'ADD MORE',
  setAppend,
  append = [],
  copyNumber = 1
}: TAddMoreButtonComponentProps) => {
  console.log('append', append)
  const doAppend = () => {
    for (let i = 0; i < copyNumber; i++) {
      setAppend([...append, defaultValue])
    }
  }

  return (
    <Box sx={_actionButtonCommonStyle}>
      <Button
        type='button'
        variant='outlined'
        title={'Add More'}
        onClick={() => doAppend()}
        startIcon={<Add />}
        size='small'
      />
    </Box>
  )
}
