import AddIcon from '@material-ui/icons/Add'
import ClearIcon from '@material-ui/icons/Clear'
import CheckIcon from '@mui/icons-material/Check'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import SyncIcon from '@mui/icons-material/Sync'
import { Box, Button, Checkbox, CircularProgress, Modal, Stack, TextField } from '@mui/material'
import 'md-editor-rt/lib/style.css'
import { Dropdown } from '@core/components/dropdown'
import {
  scopeOfWorkListContainer,
  scopeOfWorkListSx,
  sectionTitleSx,
  sowAddButtonSx,
  sowRemoveButtonSx
} from 'src/views/project-sow/ProjectSOW.style'
import { TProjectSOWScopeOfWorkFormViewProps } from './ProjectSOWScopeOfWork.decorator'

export default function ProjectSOWScopeOfWorkFormView(props: TProjectSOWScopeOfWorkFormViewProps) {
  const {
    scopeOfWorkData,
    handleServiceSOWModalOpen,
    handleScopeOfWorkCheckbox,
    handleSOWOnEdit,
    serviceGroupByProjectTypeId,
    selectedAdditionalServiceData,
    handleAdditionalServiceSelection,
    serviceList,
    serviceSOWModalOpen,
    handleServiceSOWModalClose,
    errorMessage,
    scopeOfWorkEditId,
    scopeOfWorkFormData,
    handleScopeOfWorkInputChange,
    handleSOWSaveOnClick,
    handleScopeOfWorkSelectChange,
    handleAddNewSow,
    scopeOfWorkPhaseList,
    handleScopeOfWorkMultipleInputChange,
    handleRemoveSow,
    handleScopeOfWorkSlOnChange,
    slInputRefs,
    phaseDataList,
    handlePhaseCheckbox,
    handleServicePhaseModalOpen,
    handlePhaseOnEdit,
    servicePhaseModalOpen,
    handleServicePhaseModalClose,
    phaseEditId,
    phaseFormData,
    handlePhaseInputChange,
    handlePhaseSaveOnClick,
    handlePhaseSelectChange,
    handleAddNewPhase,
    handlePhaseMultipleInputChange,
    handleRemovePhase,
    handlePhaseSlOnChange,
    handlePhaseOnClear,
    handleSOWOnClear,
    phaseSlInputRefs,
    handleGenerateSOWWithAI
  } = props

  return (
    <Box>
      <Box sx={{ ...sectionTitleSx, display: 'flex' }}>
        Phase & Scope Of Work
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
          {phaseDataList
            ?.filter((phase: any) => !phase?.['additionalServiceId'])
            ?.map((phase: any, index: number) => {
              return (
                <>
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
                        disabled={phase?.['isPreloading']}
                      />
                    </Box>
                    <Box className={'common-task-list-item-type'}>
                      <Box
                        className={`item-type-common item-type-phase ${
                          !phase?.['additionalServiceId'] ? 'item-type-hive' : ''
                        }`}
                      >
                        Phase
                      </Box>
                    </Box>
                    <Box className={'common-task-list-item-check'}>
                      <Checkbox
                        onChange={event => {
                          handlePhaseCheckbox(
                            event,
                            phase?.['id'],
                            scopeOfWorkData?.filter((sow: any) => sow?.phaseId == phase?.id).map((sow: any) => sow?.id)
                          )
                        }}
                        value={phase?.['id']}
                        checked={phase?.['isChecked']}
                        disabled={phase?.['isPreloading']}
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
                    {!scopeOfWorkData?.filter((sow: any) => sow?.phaseId == phase?.id)?.length && (
                      <Button
                        className='common-task-list-item-btn'
                        onClick={() => handleGenerateSOWWithAI(phase?.id)}
                        disabled={phase?.['isPreloading']}
                      >
                        <SyncIcon />
                      </Button>
                    )}

                    {phase?.['isPreloading'] && (
                      <Stack spacing={0} sx={{ height: '10px', width: '10px' }}>
                        <CircularProgress color='secondary' size={14} />
                      </Stack>
                    )}
                  </Box>
                  <>
                    {scopeOfWorkData
                      ?.filter((sow: any) => sow?.phaseId == phase?.id)
                      ?.map((scopeOfWork: any, index: number) => {
                        return (
                          <Box className={'common-task-list-item'} key={index + Math.random()}>
                            <Box className={'common-task-list-item-sl'}>
                              <Box className={'common-task-list-item-sl'}>
                                <input
                                  ref={el => (slInputRefs.current[scopeOfWork.id] = el)}
                                  className={'common-task-list-item-sl-number'}
                                  value={scopeOfWork?.['serial']}
                                  onChange={event => {
                                    const serial = parseInt(event.target.value ?? 0, 10)
                                    handleScopeOfWorkSlOnChange(serial, scopeOfWork?.['id'])
                                  }}
                                  type={'number'}
                                  disabled={scopeOfWork?.['isPreloading']}
                                />
                              </Box>
                            </Box>
                            <Box className={'common-task-list-item-type'}>
                              <Box
                                className={`item-type-common item-type-sow ${
                                  !scopeOfWork?.['additionalServiceId'] ? 'item-type-hive' : ''
                                }`}
                              >
                                SOW
                              </Box>
                            </Box>
                            <Box className={'common-task-list-item-check'}>
                              <Checkbox
                                onChange={event => handleScopeOfWorkCheckbox(event, scopeOfWork?.['id'])}
                                value={scopeOfWork?.['id']}
                                checked={scopeOfWork?.['isChecked']}
                                disabled={scopeOfWork?.['isPreloading']}
                              />
                            </Box>
                            <Box
                              className={'common-task-list-item-title'}
                              sx={{
                                color: !scopeOfWork?.['additionalServiceId'] ? '#903fe8' : '',
                                opacity: scopeOfWork?.['isChecked'] ? 1 : 0.5
                              }}
                              component={scopeOfWork?.['isChecked'] ? 'span' : 'del'}
                            >
                              {scopeOfWork?.['title']}
                            </Box>

                            <Button className='common-task-list-item-btn' onClick={() => handleSOWOnEdit(scopeOfWork)}>
                              <EditIcon />
                            </Button>
                            {scopeOfWork?.['isPreloading'] && (
                              <Stack spacing={0} sx={{ height: '10px', width: '10px' }}>
                                <CircularProgress color='secondary' size={14} />
                              </Stack>
                            )}
                          </Box>
                        )
                      })}
                  </>
                </>
              )
            })}
          {/* selectedAdditionalServiceData */}
        </Box>
      </Box>

      <Box>
        <Box sx={sectionTitleSx}>Add Services</Box>
        <Box sx={{ py: 0, px: 5 }}>
          {serviceGroupByProjectTypeId(serviceList)?.map((projectType: any, index: number) => (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 2,
                fontWeight: '600',
                border: '1px dotted #31a0f64a',
                p: '2px 10px'
              }}
              key={index + Math.random()}
            >
              <Box sx={{ width: '220px', mr: 2, color: '#777', fontWeight: 'normal' }}>
                {projectType?.projectTypeName}
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}>
                {projectType?.services?.map((service: any) => (
                  <Box
                    sx={{
                      position: 'relative',
                      display: 'flex',
                      p: '5px 25px',
                      borderRadius: '15px',
                      fontSize: '14px',
                      lineHeight: '14px',
                      background: '#afaeb3',
                      color: '#fff',
                      cursor: 'pointer',
                      my: '2px',
                      mr: 1,
                      '&.selected': {
                        background: '#31A0F6'
                      }
                    }}
                    key={index + Math.random()}
                    className={`${selectedAdditionalServiceData?.includes(service?.id) ? 'selected' : ''}`}
                    onClick={() => {
                      handleAdditionalServiceSelection(service?.id)
                    }}
                  >
                    {selectedAdditionalServiceData.includes(service?.id) ? (
                      <CheckIcon
                        sx={{
                          position: 'absolute',
                          top: '50%',
                          left: '5px',
                          transform: 'translate(0, -50%)',
                          fontSize: '18px'
                        }}
                      />
                    ) : (
                      <></>
                    )}
                    <Box
                      sx={{ ml: 1 }}
                      className='md-editor-preview'
                      dangerouslySetInnerHTML={{ __html: service?.name }}
                    ></Box>
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
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
      <Modal
        open={serviceSOWModalOpen}
        onClose={handleServiceSOWModalClose}
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
              {scopeOfWorkEditId ? 'Update' : 'Add'} Scope of Work
            </h2>
          </Box>

          <form>
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 5, mb: 5 }}>
              {!scopeOfWorkEditId && (
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
                      value={scopeOfWorkFormData.phaseId}
                      onChange={handleScopeOfWorkSelectChange}
                      dataList={scopeOfWorkPhaseList}
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

              {scopeOfWorkEditId ? (
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
                        value={scopeOfWorkFormData?.title}
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
                    SOW
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
                    {scopeOfWorkFormData?.scopeOfWorks?.map((scopeOfWork: any, index: number) => {
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
                              value={scopeOfWork?.title}
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
                              value={scopeOfWork?.serial}
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
                onClick={handleServiceSOWModalClose}
                type='button'
                className='px-4 py-2 mr-3 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-red-600 border border-transparent rounded-lg active:bg-red-600 hover:bg-red-700 focus:outline-none focus:shadow-outline-red'
              >
                <ClearIcon /> Cancel
              </button>
              <button
                type='button'
                onClick={handleSOWSaveOnClick}
                className='px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-green-600 border border-transparent rounded-lg active:bg-green-600 hover:bg-green-700 focus:outline-none focus:shadow-outline-green'
              >
                <AddIcon />
                {scopeOfWorkEditId ? 'Update' : 'Save'}
              </button>
            </Box>
          </form>
        </Box>
      </Modal>
    </Box>
  )
}
