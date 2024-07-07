import AddIcon from '@material-ui/icons/Add'
import ClearIcon from '@material-ui/icons/Clear'
import CheckIcon from '@mui/icons-material/Check'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
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
import { TProjectSOWScopeOfWorkFormViewProps } from './ProjectSOWScopeOfWork.decorator'

export default function ProjectSOWScopeOfWorkFormView(props: TProjectSOWScopeOfWorkFormViewProps) {
  const {
    scopeOfWorkData,
    selectedScopeOfWorkData,
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
    handleRemoveSow
  } = props

  return (
    <Box>
      <Box sx={{ ...sectionTitleSx, display: 'flex' }}>
        Scope Of Work
        <Box
          sx={sowAddButtonSx}
          onClick={() => {
            handleServiceSOWModalOpen()
          }}
        >
          <AddIcon fontSize='small' />
        </Box>
      </Box>
      <Box sx={scopeOfWorkListContainer}>
        <Box sx={scopeOfWorkListSx}>
          {scopeOfWorkData?.map((scopeOfWork: any, index: number) => {
            return (
              <Box className={'sow-list-item'} key={index + Math.random()}>
                <Box className={'sow-list-item-sl'}>{index + 1}</Box>
                <Box className={'sow-list-item-type'}>
                  <Box
                    className={`item-type-common item-type-sow ${
                      !scopeOfWork?.['additionalServiceId'] ? 'item-type-hive' : ''
                    }`}
                  >
                    SOW
                  </Box>
                </Box>
                <Box className={'sow-list-item-check'}>
                  <Checkbox
                    onChange={handleScopeOfWorkCheckbox}
                    value={scopeOfWork?.['id']}
                    checked={selectedScopeOfWorkData?.includes(scopeOfWork?.['id'])}
                  />
                </Box>
                <Box
                  className={'sow-list-item-title'}
                  sx={{
                    color: !scopeOfWork?.['additionalServiceId'] ? '#903fe8' : '',
                    opacity: selectedScopeOfWorkData?.includes(scopeOfWork?.['id']) ? 1 : 0.5
                  }}
                  component={selectedScopeOfWorkData?.includes(scopeOfWork?.['id']) ? 'span' : 'del'}
                >
                  {scopeOfWork?.['title']}
                </Box>
                <Button
                  sx={{
                    ml: '5px',
                    p: '2px',
                    minWidth: 0,
                    border: '2px solid #7e22ce',
                    borderRadius: '5px'
                  }}
                  onClick={() => handleSOWOnEdit(scopeOfWork)}
                >
                  <EditIcon sx={{ color: '#7e22ce', height: '14px !important', width: '14px !important' }} />
                </Button>
              </Box>
            )
          })}
          {/* selectedAdditionalServiceData */}
        </Box>
      </Box>
      <Box>
        <Box sx={sectionTitleSx}>Add Services</Box>
        <Box sx={{ py: 0, px: 5 }}>
          {serviceGroupByProjectTypeId(serviceList)?.map((projectType: any, index: number) => (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, fontWeight: '600' }} key={index + Math.random()}>
              <Box sx={{ mr: 2, color: '#777' }}>{projectType?.projectTypeName}</Box>
              <Box sx={{ my: 3 }}>
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
                      mb: 1,
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
                          fontSize: '18px',
                          mr: 1
                        }}
                      />
                    ) : (
                      <></>
                    )}
                    {service.name}
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
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
                  {/* <Box
                    sx={{
                      width: '100%'
                    }}
                  >
                    <label className='block text-sm'>
                      <TextField
                        label={'Order'}
                        name='serial'
                        value={scopeOfWorkFormData?.serial}
                        onChange={handleScopeOfWorkInputChange}
                        placeholder={`Order`}
                        fullWidth
                      />
                      {!!errorMessage?.['Order'] &&
                        errorMessage?.['Order']?.map((message: any, index: number) => {
                          return (
                            <span key={index + Math.random()} className='text-xs text-red-600 dark:text-red-400'>
                              {message}
                            </span>
                          )
                        })}
                    </label>
                  </Box> */}
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
                                handleScopeOfWorkMultipleInputChange(index, e)
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
