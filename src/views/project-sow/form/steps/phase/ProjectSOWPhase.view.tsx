import AddIcon from '@material-ui/icons/Add'
import ClearIcon from '@material-ui/icons/Clear'
import DeleteIcon from '@mui/icons-material/Delete'
import { Box, Button, Checkbox, CircularProgress, Modal, Stack, TextField } from '@mui/material'
import 'md-editor-rt/lib/style.css'
import {
  scopeOfWorkListContainer,
  scopeOfWorkListSx,
  sectionTitleSx,
  sowAddButtonSx,
  sowRemoveButtonSx
} from 'src/views/project-sow/ProjectSOW.style'
import { TProjectSOWPhaseFormViewProps } from './ProjectSOWPhase.decorator'

import EditIcon from '@mui/icons-material/Edit'

export default function ProjectSOWPhaseFormView(props: TProjectSOWPhaseFormViewProps) {
  const {
    phaseData,
    handleServicePhaseModalOpen,
    handlePhaseCheckbox,
    handlePhaseOnEdit,
    servicePhaseModalOpen,
    handleServicePhaseModalClose,
    errorMessage,
    phaseEditId,
    phaseFormData,
    handlePhaseInputChange,
    handlePhaseSaveOnClick,
    handlePhaseSelectChange,
    handleAddNewPhase,
    handlePhaseMultipleInputChange,
    handleRemovePhase,
    handlePhaseSlOnChange,
    slInputRefs
  } = props

  return (
    <Box>
      <Box sx={{ ...sectionTitleSx, display: 'flex' }}>
        Phase
        <Box
          sx={sowAddButtonSx}
          onClick={() => {
            handleServicePhaseModalOpen()
          }}
        >
          <AddIcon fontSize='small' />
        </Box>
      </Box>
      <Box sx={scopeOfWorkListContainer}>
        <Box sx={scopeOfWorkListSx}>
          {phaseData?.map((phase: any, index: number) => {
            return (
              <Box className={'common-task-list-item'} key={index + Math.random()}>
                <Box className={'common-task-list-item-sl'}>
                  <input
                    ref={el => (slInputRefs.current[phase.id] = el)}
                    className={'common-task-list-item-sl-number'}
                    value={phase?.['serial']}
                    onChange={event => {
                      const serial = parseInt(event.target.value ?? 0, 10)
                      handlePhaseSlOnChange(serial, phase?.['id'])
                    }}
                    type={'number'}
                  />
                </Box>
                <Box className={'common-task-list-item-type'}>
                  <Box className={`item-type-common item-type-phase`}>Phase</Box>
                </Box>
                <Box className={'common-task-list-item-check'}>
                  <Checkbox
                    onChange={event => {
                      handlePhaseCheckbox(event, phase?.['id'])
                    }}
                    value={phase?.['id']}
                    checked={phase?.['isChecked']}
                  />
                </Box>
                <Box
                  className={'common-task-list-item-title'}
                  sx={{
                    color: !phase?.['additionalServiceId'] ? '#903fe8' : '',
                    opacity: phase?.['isChecked'] ? 1 : 0.5
                  }}
                  component={phase?.['isChecked'] ? 'span' : 'del'}
                >
                  {phase?.['title']}
                </Box>
                <Button className='common-task-list-item-btn' onClick={() => handlePhaseOnEdit(phase)}>
                  <EditIcon />
                </Button>
                {phase?.['isPreloading'] && (
                  <Stack spacing={0} sx={{ height: '10px', width: '10px' }}>
                    <CircularProgress color='secondary' size={12} />
                  </Stack>
                )}
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
              {phaseEditId ? 'Update' : 'Add'} Phase
            </h2>
          </Box>

          <form>
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 5, mb: 5 }}>
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
                        onChange={handlePhaseInputChange}
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
                        handleAddNewPhase()
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
                                handlePhaseMultipleInputChange(e, index)
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
                                handlePhaseMultipleInputChange(e, index)
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
                                handleRemovePhase(index)
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
