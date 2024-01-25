import { SxProps } from '@mui/material'

export const TableSx: SxProps = {
  '& .expendable-row': {
    width: '40%',
    maxWidth: '500px',
    '& .expendable-row-inner': {
      display: 'flex',
      position: 'relative',
      width: '100%',
      pb: '25px',
      '& .expendable-row-box': {
        display: 'flex',
        position: 'relative',
        width: '100%',
        height: '20px',
        overflow: 'hidden',
        lineHeight: '20px',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      },
      '& .expended-row-box': {
        textWrap: 'wrap'
      }
    },

    '& .see-more-btn': {
      position: 'absolute',
      bottom: '0',
      right: '0',
      background: '#9333ea',
      padding: '1px 5px',
      fontSize: '10px',
      textTransform: 'capitalize',
      color: '#fff !important',
      outline: '0',
      border: '1px solid transparent',
      '&:hover': {
        background: '#fff',
        borderColor: '#9333ea',
        color: '#9333ea !important'
      }
    }
  }
}
