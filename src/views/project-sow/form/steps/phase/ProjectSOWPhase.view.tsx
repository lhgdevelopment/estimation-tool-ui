import AddIcon from '@material-ui/icons/Add'
import ClearIcon from '@material-ui/icons/Clear'
import DeleteIcon from '@mui/icons-material/Delete'
import { Box, Button, Checkbox, Modal, TextField } from '@mui/material'
import 'md-editor-rt/lib/style.css'
import { Dropdown } from 'src/@core/components/dropdown'
import {
  scopeOfWorkListContainer,
  scopeOfWorkListSx,
  sectionTitleSx,
  sowAddButtonSx,
  sowRemoveButtonSx
} from 'src/views/project-sow/ProjectSOW.style'
import { TProjectSOWPhaseFormViewProps } from './ProjectSOWPhase.decorator'

export default function ProjectSOWPhaseFormView(props: TProjectSOWPhaseFormViewProps) {
  const {
    phaseData,
    selectedScopeOfWorkData,
    handleServicePhaseModalOpen,
    handleScopeOfWorkCheckbox,
    handlePhaseOnEdit,
    serviceGroupByProjectTypeId,
    selectedAdditionalServiceData,
    handleAdditionalServiceSelection,
    serviceList,
    servicePhaseModalOpen,
    handleServicePhaseModalClose,
    errorMessage,
    phaseEditId,
    phaseFormData,
    handleScopeOfWorkInputChange,
    handlePhaseSaveOnClick,
    handleScopeOfWorkSelectChange,
    handleAddNewSow,
    phasePhaseList,
    handleScopeOfWorkMultipleInputChange,
    handleRemoveSow
  } = props

  return (
    <Box>
      <Box sx={{ ...sectionTitleSx, display: 'flex' }}>
        Phase
        {/* <Box
          sx={sowAddButtonSx}
          onClick={() => {
            handleServicePhaseModalOpen()
          }}
        >
          <AddIcon fontSize='small' />
        </Box> */}
      </Box>
      <Box sx={scopeOfWorkListContainer}>
        <Box sx={scopeOfWorkListSx}>
          {phaseData?.map((phase: any, index: number) => {
            return (
              <Box className={'sow-list-item'} key={index + Math.random()}>
                <Box className={'sow-list-item-sl'}>{index + 1}</Box>
                <Box className={'sow-list-item-type'}>
                  <Box
                    className={`item-type-common item-type-sow ${
                      !phase?.['additionalServiceId'] ? 'item-type-hive' : ''
                    }`}
                  >
                    Phase
                  </Box>
                </Box>
                <Box className={'sow-list-item-check'}>
                  <Checkbox
                    onChange={handleScopeOfWorkCheckbox}
                    value={phase?.['id']}
                    checked={selectedScopeOfWorkData?.includes(phase?.['id'])}
                  />
                </Box>
                <Box
                  className={'sow-list-item-title'}
                  sx={{
                    color: !phase?.['additionalServiceId'] ? '#903fe8' : '',
                    opacity: selectedScopeOfWorkData?.includes(phase?.['id']) ? 1 : 0.5
                  }}
                  component={selectedScopeOfWorkData?.includes(phase?.['id']) ? 'span' : 'del'}
                >
                  {phase?.['title']}
                </Box>
                {/* <Button
                  sx={{
                    ml: '5px',
                    p: '2px',
                    minWidth: 0,
                    border: '2px solid #7e22ce',
                    borderRadius: '5px'
                  }}
                  onClick={() => handlePhaseOnEdit(phase)}
                >
                  <EditIcon sx={{ color: '#7e22ce', height: '14px !important', width: '14px !important' }} />
                </Button> */}
              </Box>
            )
          })}
          {/* selectedAdditionalServiceData */}
        </Box>
      </Box>

      <Modal
        open={servicePhaseModalOpen}
        onClose={handleServicePhaseModalClose}
        aria-labelledby='service-modal-title'
        aria-describedby='service-modal-description'
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Box
          className='p-5 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800'
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '50%',
            overflowY: 'auto',
            p: '50px',
            maxHeight: '100%',
            '& form': { width: '100%', display: 'flex', flexDirection: 'column' }
          }}
        >
          <Box sx={{ mb: '20px' }}>
            <h2 id='service-modal-title' className='my-6 text-xl font-semibold text-gray-700 dark:text-gray-200'>
              {phaseEditId ? 'Update' : 'Add'} Scope of Work
            </h2>
          </Box>

          <form>
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 5, mb: 5 }}>
              {!phaseEditId && (
                <Box
                  sx={{
                    width: '100%',
                    '& .MuiInputBase-root': {
                      border: errorMessage?.['serviceId'] ? '1px solid #dc2626' : ''
                    }
                  }}
                >
                  <label className='block text-sm'>
                    <Dropdown
                      name='phaseId'
                      value={phaseFormData.phaseId}
                      onChange={handleScopeOfWorkSelectChange}
                      dataList={phasePhaseList}
                      label={'Phase'}
                    />
                    {!!errorMessage?.['phaseId'] &&
                      errorMessage?.['phaseId']?.map((message: any, index: number) => {
                        return (
                          <span key={index + Math.random()} className='text-xs text-red-600 dark:text-red-400'>
                            {message}
                          </span>
                        )
                      })}
                  </label>
                </Box>
              )}

              {phaseEditId ? (
                <>
                  <Box
                    sx={{
                      width: '100%'
                    }}
                  >
                    <label className='block text-sm'>
                      <TextField
                        label={'Title'}
                        name='title'
                        value={phaseFormData?.title}
                        onChange={handleScopeOfWorkInputChange}
                        placeholder={`Title`}
                        fullWidth
                      />
                      {!!errorMessage?.['title'] &&
                        errorMessage?.['title']?.map((message: any, index: number) => {
                          return (
                            <span key={index + Math.random()} className='text-xs text-red-600 dark:text-red-400'>
                              {message}
                            </span>
                          )
                        })}
                    </label>
                  </Box>
                </>
              ) : (
                <Box sx={{ width: '100%' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      fontSize: '20px',
                      fontWeight: 600,
                      color: '#158ddf',
                      marginBottom: '0.5rem'
                    }}
                  >
                    Phase
                    <Box
                      sx={sowAddButtonSx}
                      onClick={() => {
                        handleAddNewSow()
                      }}
                    >
                      <AddIcon fontSize='small' />
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      width: '100%'
                    }}
                  >
                    {phaseFormData?.phases?.map((phase: any, index: number) => {
                      return (
                        <Box
                          key={index}
                          sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '5px',
                            width: '100%',
                            marginBottom: '15px',
                            border: '1px solid #ddd',
                            padding: '10px',
                            borderRadius: '5px'
                          }}
                        >
                          <Box
                            sx={{
                              width: 'calc(100% - 140px)'
                            }}
                          >
                            <TextField
                              label={'Title'}
                              name='title'
                              value={phase?.title}
                              onChange={e => {
                                handleScopeOfWorkMultipleInputChange(e, index)
                              }}
                              placeholder={`Title`}
                              fullWidth
                            />
                            {!!errorMessage?.['title'] &&
                              errorMessage?.['title']?.map((message: any, index: number) => {
                                return (
                                  <span key={index + Math.random()} className='text-xs text-red-600 dark:text-red-400'>
                                    {message}
                                  </span>
                                )
                              })}
                          </Box>
                          <Box
                            sx={{
                              width: '100px'
                            }}
                          >
                            <TextField
                              label={'Order'}
                              name='serial'
                              value={phase?.serial}
                              onChange={e => {
                                handleScopeOfWorkMultipleInputChange(e, index)
                              }}
                              placeholder={`Order`}
                              fullWidth
                            />
                            {!!errorMessage?.['serial'] &&
                              errorMessage?.['serial']?.map((message: any, index: number) => {
                                return (
                                  <span key={index + Math.random()} className='text-xs text-red-600 dark:text-red-400'>
                                    {message}
                                  </span>
                                )
                              })}
                          </Box>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '30px'
                            }}
                          >
                            <Button
                              onClick={e => {
                                handleRemoveSow(index)
                              }}
                              sx={sowRemoveButtonSx}
                            >
                              <DeleteIcon fontSize='small' />
                            </Button>
                          </Box>
                        </Box>
                      )
                    })}
                  </Box>
                </Box>
              )}
            </Box>

            <Box className='my-4 text-right'>
              <button
                onClick={handleServicePhaseModalClose}
                type='button'
                className='px-4 py-2 mr-3 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-red-600 border border-transparent rounded-lg active:bg-red-600 hover:bg-red-700 focus:outline-none focus:shadow-outline-red'
              >
                <ClearIcon /> Cancel
              </button>
              <button
                type='button'
                onClick={handlePhaseSaveOnClick}
                className='px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-green-600 border border-transparent rounded-lg active:bg-green-600 hover:bg-green-700 focus:outline-none focus:shadow-outline-green'
              >
                <AddIcon />
                {phaseEditId ? 'Update' : 'Save'}
              </button>
            </Box>
          </form>
        </Box>
      </Modal>
    </Box>
  )
}
