import { SxProps } from '@mui/material'

export const formTitleSx: SxProps = {
  fontSize: '20px',
  display: 'flex',
  mt: '20px',
  mb: '20px',
  color: '#31A0F6',
  fontWeight: '600'
}

export const scopeOfWorkListContainer = {
  display: 'flex',
  gap: 5,
  mb: 5,
  overflow: 'hidden',
  overflowY: 'auto',
  height: '300px',
  border: '1px solid #ecedee',
  borderRadius: '5px',
  p: 3
}
export const scopeOfWorkListSx: SxProps = {
  '& .sow-list-item': {
    display: 'flex',
    alignItems: 'center',
    fontSize: '12px',
    fontWeight: 600,
    color: '#777778',
    cursor: 'pointer',
    mb: '10px',
    flexWrap: 'wrap',
    '& .sow-list-item-sl': {
      width: '50px',
      border: '1px solid #777778',
      borderRadius: '15px',
      textAlign: 'center',
      padding: '5px 0',
      lineHeight: 'normal',
      marginRight: '10px'
    },
    '& .sow-list-item-type': {
      '& .item-type-common': {
        padding: '5px 20px',
        borderRadius: '15px',
        width: '130px',
        textAlign: 'center',
        border: '1px solid transparent',
        '&.item-type-hive': {
          border: '3px solid #9333ea'
        },
        '&.item-type-sow': {
          background: '#215a6c',
          color: '#fff'
        },
        '&.item-type-deliverable': {
          background: '#c6dbe1',
          color: '#215a6c'
        },
        '&.item-type-task': {
          background: '#ffc8a9',
          color: '#215a6c'
        },
        '&.item-type-subtask': {
          background: '#ffe5a0',
          color: '#215a6c'
        }
      }
    },
    '& .sow-list-item-check': { mx: 2 },
    '& .sow-list-item-title': { lineHeight: 'normal', maxWidth: '500px' },
    '& .sow-list-item-input': {
      ml: 5,
      display: 'flex',
      '& .MuiSelect-select': {
        p: '5px'
      },
      '& .sow-list-item-text-input': {
        width: '50px',
        ml: '5px',
        '& .MuiInputBase-input': {
          p: '5px'
        }
      }
    }
  }
}

export const taskListContainer = {
  display: 'flex',
  gap: 5,
  mb: 5,
  overflow: 'hidden',

  border: '1px solid #ecedee',
  borderRadius: '5px',
  p: 3,
  '& thead': {
    '& .MuiTableCell-root': {
      p: 0,
      px: 1
    }
  },
  '& tbody': {
    '& .MuiTableCell-root, .MuiTableCell-body:not(.MuiTableCell-sizeSmall):not(.MuiTableCell-paddingCheckbox):not(.MuiTableCell-paddingNone), :first-child':
      {
        p: 0,
        px: 1
      },
    '& .estimated-hours-sec': {
      pl: '1px'
    }
  },
  '& .team-select': {
    width: '150px'
  },
  '& .MuiSelect-select': {
    p: 1
  },
  '& .MuiInputBase-input': {
    p: 1,
    textAlign: 'center '
  },
  '& .item-type-common': {
    padding: '0px 20px',
    borderRadius: '15px',
    width: '130px',
    textAlign: 'center',
    border: '1px solid transparent'
  },
  '& .item-type-hive': {
    border: '3px solid #9333ea'
  },
  '& .item-type-sow': {
    background: '#215a6c',
    color: '#fff'
  },
  '& .item-type-deliverable': {
    background: '#c6dbe1',
    color: '#215a6c'
  },
  '& .item-type-task': {
    background: '#ffc8a9',
    color: '#215a6c'
  },
  '& .item-type-subtask': {
    background: '#ffe5a0',
    color: '#215a6c'
  }
}

export const deliverableNoteAddButtonSx: SxProps = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '30px',
  width: '30px',
  p: '0',
  ml: '15px',
  background: '#9333ea',
  minWidth: 'auto',
  color: '#fff',
  borderRadius: '50%',
  cursor: 'pointer',
  '&:hover': {
    background: '#7e22ce'
  }
}

export const deliverableNoteItemSx: SxProps = {
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',

  gap: 5,
  mb: '30px'
}

export const deliverableNoteRemoveButtonSx: SxProps = {
  position: 'absolute',
  top: '-20px',
  right: '20px',
  background: '#FF4C51',
  color: '#fff',
  '&:hover': { background: '#FF4C51' }
}
export const sectionTitleSx: SxProps = { fontSize: '20px', fontWeight: '600', color: '#158ddf', mb: 2 }
export const sectionSubTitleSx: SxProps = {
  display: 'flex',
  alignItems: 'center',
  fontSize: '14px',
  fontWeight: '600',
  color: '#777',
  mb: 4
}

export const sectionTitleAddButtonSx: SxProps = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '30px',
  width: '30px',
  p: '0',
  ml: '15px',
  background: '#9333ea',
  minWidth: 'auto',
  color: '#fff',
  borderRadius: '50%',
  cursor: 'pointer',
  '&:hover': {
    background: '#7e22ce'
  }
}

export const serviceQuestionItemSx: SxProps = {
  width: 'calc(50% - 30px)',
  display: 'flex',
  flexWrap: 'wrap',
  position: 'relative',
  gap: 2,
  mb: '15px',
  padding: '15px',
  m: '15px',
  border: '1px solid #ecedee',
  borderRadius: '5px'
}

export const teamReviewBoxSx: SxProps = {
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.1)',
  mb: '25px',
  borderRadius: '10px',
  '&::before': { display: 'none' },
  '& .team-review-box-title': {
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',
    fontWeight: '600',
    color: '#777',
    mb: '10px'
  },

  '& .team-review-content-box': {
    height: '300px',
    overflow: 'hidden',
    overflowY: 'scroll'
  },
  '& .team-review-team-need-box': {
    display: 'flex',
    flexWrap: 'wrap',
    '& .team-review-team-need-item': {
      display: 'flex',
      alignItems: 'center',
      width: '50%',
      paddingRight: '10px',
      mb: '10px',
      // ':last-child': {
      //   paddingRight: 0,
      //   paddingLeft: '10px'
      // },
      // '& .team-review-team-need-item-title': {
      //   display: 'flex',
      //   width: '140px'
      // },
      '& .team-review-team-need-item-input': {
        //width: 'calc(100% - 140px)',
        width: '100%'
        // '& .MuiSelect-select': {
        //   p: '10px'
        // }
      }
    }
  }
}

export const sowEstimationAccordionSectionSx: SxProps = {
  mb: 5,
  boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.1)',
  borderRadius: '10px',
  '&.Mui-expanded': { boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.1)' },
  '&::before': { display: 'none' },
  '& .section-title': {
    fontSize: '16px',
    fontWeight: '600',
    textAlign: 'center',
    color: '#777'
  }
}

export const sowAddButtonSx: SxProps = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '30px',
  width: '30px',
  p: '0',
  ml: '15px',
  background: '#9333ea',
  minWidth: 'auto',
  color: '#fff',
  borderRadius: '50%',
  cursor: 'pointer',
  '&:hover': {
    background: '#7e22ce'
  }
}

export const sowRemoveButtonSx: SxProps = {
  height: '30px',
  width: '30px',
  p: '0',
  background: '#FF4C51',
  minWidth: 'auto',
  color: '#fff',
  borderRadius: '50%',
  cursor: 'pointer',
  '&:hover': {
    background: '#d32f2f'
  }
}
