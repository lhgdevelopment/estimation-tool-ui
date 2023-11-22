import CancelIcon from '@mui/icons-material/Cancel'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import * as React from 'react'

type TRemoveButtonComponentProps = {
  arrayIndex: number
  remove: (e: any) => void
  title?: string
}

export const RemoveButtonComponent = ({ remove, arrayIndex, title = '' }: TRemoveButtonComponentProps) => {
  const modifiedTitle = (arrayIndex + 1).toString() + '. ' + title

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', mb: 2 }}>
      <Box sx={{ justifyContent: 'start' }}>{title ? modifiedTitle : arrayIndex + 1}</Box>
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/*@ts-ignore*/}
      <Button
        type='button'
        onClick={() => remove(arrayIndex)}
        startIcon={<CancelIcon sx={{ ml: '7px', fontSize: '20px' }} />}
        color='error'
        sx={{
          justifyContent: 'center',
          border: '1px solid',
          borderRadius: '5px',
          mx: 0.6,
          minWidth: '35px !important',
          padding: '4px 6px'
        }}
      />
    </Box>
  )
}
