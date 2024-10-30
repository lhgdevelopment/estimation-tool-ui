import { Dropdown } from '@core/components/dropdown'
import Preloader from '@core/components/preloader'
import { getShortStringNumber } from '@core/utils/utils'
import AddIcon from '@material-ui/icons/Add'
import ClearIcon from '@material-ui/icons/Clear'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import SyncIcon from '@mui/icons-material/Sync'
import { Box, Button, Checkbox, CircularProgress, Modal, Stack, TextField, Tooltip } from '@mui/material'
import 'md-editor-rt/lib/style.css'
import {
  deliverableNoteItemSx,
  scopeOfWorkListContainer,
  scopeOfWorkListSx,
  sectionSubTitleSx,
  sectionTitleSx,
  serviceQuestionItemSx,
  sowAddButtonSx,
  sowRemoveButtonSx
} from 'src/views/project-sow/ProjectSOW.style'
import { TProjectSOWDeliverableFormViewProps } from './ProjectSOWDeliverable.decorator'

export default function ProjectSOWDeliverableFormView(props: TProjectSOWDeliverableFormViewProps) {
  const {
    preload,
    deliverableDataList,
    handleSowCheckbox,
    isSowCheckedInDeliverable,
    selectedDeliverableData,
    handleDeliverableCheckbox,
    serviceQuestionList,
    deliverableServiceQuestionData,
    handleServiceQuestionInputChange,
    deliverableNotesData,
    handleNotesInputChange,
    isServiceCheckedInDeliverable,
    handleDeliverableCheckboxByService,
    errorMessage,
    scopeOfWorkEditId,
    serviceSOWModalOpen,
    scopeOfWorkFormData,
    scopeOfWorkPhaseList,
    handleScopeOfWorkSelectChange,
    handleServiceSOWModalClose,
    handleScopeOfWorkInputChange,
    handleAddNewSow,
    handleScopeOfWorkMultipleInputChange,
    handleRemoveSow,
    handleSOWSaveOnClick,
    handleSOWOnEdit,
    handleSOWOnClear,
    handleAddNewDeliverable,
    handleDeliverableInputChange,
    handleRemoveDeliverable,
    handleDeliverableMultipleInputChange,
    handleDeliverableOnClear,
    handleDeliverableOnEdit,
    handleDeliverableSaveOnClick,
    serviceDeliverableModalOpen,
    handleServiceDeliverableModalClose,
    deliverableEditId,
    deliverableFormData,
    handleServiceDeliverableModalOpen,
    problemGoalId,
    scopeOfWorkData,
    phaseDataList,
    handleGenerateSOWWithAI,
    additionalServiceData
  } = props

  console.log({ scopeOfWorkData })

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      {preload && <Preloader />}
      <Box sx={{ ...sectionTitleSx, display: 'flex' }}>
        Deliverables
        <Box
          sx={sowAddButtonSx}
          onClick={() => {
            handleServiceDeliverableModalOpen()
          }}
        >
          <AddIcon fontSize='small' />
        </Box>
      </Box>
      <Box sx={scopeOfWorkListContainer}>
        <Box sx={scopeOfWorkListSx}>
          {phaseDataList
            ?.filter((phase: any) => !phase?.additionalServiceId)
            ?.map((phase: any, index: number) => {
              return (
                <>
                  <Box className={'common-task-list-item'} key={index + Math.random()}>
                    <Box className={'common-task-list-item-sl'}>
                      <input
                        className={'common-task-list-item-sl-number'}
                        value={phase?.['serial']}
                        type={'number'}
                        disabled
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
                      <Checkbox value={phase?.['id']} checked={phase?.['isChecked']} disabled />
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
                  </Box>
                  <>
                    {scopeOfWorkData
                      ?.filter((sow: any) => sow?.phaseId == phase?.id && !sow?.additionalServiceId)
                      ?.map((scopeOfWork: any, index: number) => {
                        return (
                          <>
                            <Box className={'common-task-list-item'} key={index + Math.random()}>
                              <Box className={'common-task-list-item-sl'}>
                                <Box className={'common-task-list-item-sl'}>
                                  <input
                                    className={'common-task-list-item-sl-number'}
                                    value={scopeOfWork?.['serial']}
                                    type={'number'}
                                    disabled
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
                                <Checkbox value={scopeOfWork?.['id']} checked={scopeOfWork?.['isChecked']} disabled />
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

                              {!deliverableDataList?.filter(
                                (deliverable: any) =>
                                  deliverable?.scopeOfWorkId == scopeOfWork?.id && !deliverable?.additionalServiceId
                              )?.length && (
                                <Tooltip placement='top' title='Generate SOW with AI'>
                                  <Button
                                    className='common-task-list-item-sync-btn'
                                    onClick={() => handleGenerateSOWWithAI(scopeOfWork?.id)}
                                  >
                                    <SyncIcon />
                                  </Button>
                                </Tooltip>
                              )}

                              {scopeOfWork?.['isPreloading'] && (
                                <Stack spacing={0} sx={{ height: '10px', width: '10px' }}>
                                  <CircularProgress color='secondary' size={14} />
                                </Stack>
                              )}
                            </Box>
                            {deliverableDataList
                              ?.filter(
                                (deliverable: any) =>
                                  deliverable?.scopeOfWorkId == scopeOfWork?.id && !deliverable?.additionalServiceId
                              )
                              ?.map((deliverable: any, deliverableIndex: number) => {
                                return (
                                  <Box className={'common-task-list-item'} key={deliverableIndex} component={'label'}>
                                    <Box className={'common-task-list-item-sl'}>
                                      <input
                                        className={'common-task-list-item-sl-number'}
                                        value={`${index + 1}.${deliverableIndex + 1}`}
                                        disabled
                                      />
                                    </Box>
                                    <Box className={'common-task-list-item-type'}>
                                      <Box
                                        className={`item-type-common item-type-deliverable ${
                                          !scopeOfWork?.['additionalServiceId'] ? 'item-type-hive' : ''
                                        }`}
                                      >
                                        Deliverable
                                      </Box>
                                    </Box>
                                    <Box className={'common-task-list-item-check'}>
                                      <Checkbox
                                        onChange={handleDeliverableCheckbox}
                                        value={deliverable?.['id']}
                                        checked={selectedDeliverableData?.includes(deliverable?.['id'])}
                                      />
                                    </Box>
                                    <Box className={'common-task-list-item-title'}>{deliverable?.['title']}</Box>
                                    <Tooltip placement='top' title='Edit Deliverable'>
                                      <Button
                                        className='common-task-list-item-btn'
                                        onClick={() => handleDeliverableOnEdit(deliverable)}
                                      >
                                        <EditIcon />
                                      </Button>
                                    </Tooltip>
                                  </Box>
                                )
                              })}
                          </>
                        )
                      })}
                  </>
                </>
              )
            })}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', mt: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0 }}>
          <Box sx={sectionTitleSx}>Service Question</Box>
        </Box>
        <Box sx={{ width: '100%', display: 'flex', flexWrap: 'wrap' }}>
          {serviceQuestionList?.map((serviceQuestion: any, index: number) => {
            return (
              <Box sx={serviceQuestionItemSx} key={index + 'question'}>
                <Box sx={{ width: '100%' }}>
                  <Box component='label' sx={{ mb: 2 }}>
                    {`#${index + 1}. ${serviceQuestion.title} `}
                  </Box>
                  <TextField
                    name='answer'
                    value={
                      deliverableServiceQuestionData?.find((item: any) => item?.questionId === serviceQuestion?.id)
                        ?.answer
                    }
                    onChange={e => {
                      handleServiceQuestionInputChange(e.target.value, serviceQuestion?.id)
                    }}
                    placeholder={`#${index + 1}. Service Related Questions Answer`}
                    fullWidth
                  />
                </Box>
              </Box>
            )
          })}
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', mt: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0 }}>
          <Box sx={sectionTitleSx}>Project Notes</Box>
        </Box>

        <Box>
          {deliverableNotesData?.map((deliverableNote: any, index: number) => {
            return (
              <Box sx={deliverableNoteItemSx} key={index + 'deliverable'}>
                <Box sx={{ width: '100%' }}>
                  <TextField
                    label={'Meeting Link'}
                    name='noteLink'
                    value={deliverableNote?.noteLink}
                    onChange={e => {
                      handleNotesInputChange(index, e)
                    }}
                    placeholder={`${getShortStringNumber(
                      index + 1
                    )} Meeting Link: https://tldv.io/app/meetings/unique-meeting-id/`}
                    fullWidth
                  />
                </Box>
                <Box sx={{ width: '100%' }}>
                  <TextField
                    label={'Note'}
                    name='note'
                    value={deliverableNote?.note}
                    onChange={e => {
                      handleNotesInputChange(index, e)
                    }}
                    placeholder={`Type any additional notes here that will help the estimating team`}
                    fullWidth
                  />
                </Box>
              </Box>
            )
          })}
        </Box>
      </Box>
      <Box>
        <Box sx={sectionTitleSx}>Added Services</Box>
        <Box>
          {additionalServiceData?.map((additionalService: any, additionalServiceIndex: number) => {
            return (
              <Box key={additionalServiceIndex}>
                <Box sx={sectionSubTitleSx} component={'label'}>
                  <Checkbox value={additionalService?.service_info?.id} checked={true} sx={{ p: 0, mr: 2 }} disabled />
                  {additionalService?.service_info?.name}
                </Box>
                <Box sx={scopeOfWorkListContainer}>
                  <Box sx={scopeOfWorkListSx}>
                    {phaseDataList
                      ?.filter((phase: any) => phase?.additionalServiceId == additionalService?.service_info?.id)
                      ?.map((phase: any, index: number) => {
                        return (
                          <>
                            <Box className={'common-task-list-item'} key={index + Math.random()}>
                              <Box className={'common-task-list-item-sl'}>
                                <input
                                  className={'common-task-list-item-sl-number'}
                                  value={phase?.['serial']}
                                  type={'number'}
                                  disabled
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
                                <Checkbox value={phase?.['id']} checked={phase?.['isChecked']} disabled />
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
                            </Box>
                            <>
                              {scopeOfWorkData
                                ?.filter((sow: any) => sow?.phaseId == phase?.id)
                                ?.map((scopeOfWork: any, index: number) => {
                                  return (
                                    <>
                                      <Box className={'common-task-list-item'} key={index + Math.random()}>
                                        <Box className={'common-task-list-item-sl'}>
                                          <Box className={'common-task-list-item-sl'}>
                                            <input
                                              className={'common-task-list-item-sl-number'}
                                              value={scopeOfWork?.['serial']}
                                              type={'number'}
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
                                            onChange={e => {
                                              handleSowCheckbox(
                                                e,
                                                scopeOfWork?.id,
                                                deliverableDataList
                                                  ?.filter(
                                                    (deliverable: any) => deliverable?.scopeOfWorkId == scopeOfWork?.id
                                                  )
                                                  ?.map((deliverable: any) => Number(deliverable?.id)) ?? []
                                              )
                                            }}
                                            value={scopeOfWork?.['id']}
                                            checked={scopeOfWork?.['isChecked']}
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
                                        {!deliverableDataList?.filter(
                                          (deliverable: any) => deliverable?.scopeOfWorkId == scopeOfWork?.id
                                        )?.length &&
                                          !scopeOfWork?.additionalServiceId && (
                                            <Button
                                              className='common-task-list-item-sync-btn'
                                              onClick={() => handleGenerateSOWWithAI(scopeOfWork?.id)}
                                            >
                                              <SyncIcon />
                                            </Button>
                                          )}
                                        <Tooltip placement='top' title='Edit Scope of Work'>
                                          <Button
                                            className='common-task-list-item-btn'
                                            onClick={() => handleSOWOnEdit(scopeOfWork)}
                                          >
                                            <EditIcon />
                                          </Button>
                                        </Tooltip>

                                        {scopeOfWork?.['isPreloading'] && (
                                          <Stack spacing={0} sx={{ height: '10px', width: '10px' }}>
                                            <CircularProgress color='secondary' size={14} />
                                          </Stack>
                                        )}
                                      </Box>
                                      {deliverableDataList
                                        ?.filter((deliverable: any) => deliverable?.scopeOfWorkId == scopeOfWork?.id)
                                        ?.map((deliverable: any, deliverableIndex: number) => {
                                          return (
                                            <Box
                                              className={'common-task-list-item'}
                                              key={deliverableIndex}
                                              component={'label'}
                                            >
                                              <Box className={'common-task-list-item-sl'}>
                                                <input
                                                  className={'common-task-list-item-sl-number'}
                                                  value={`${index + 1}.${deliverableIndex + 1}`}
                                                  disabled
                                                />
                                              </Box>
                                              <Box className={'common-task-list-item-type'}>
                                                <Box
                                                  className={`item-type-common item-type-deliverable ${
                                                    !scopeOfWork?.['additionalServiceId'] ? 'item-type-hive' : ''
                                                  }`}
                                                >
                                                  Deliverable
                                                </Box>
                                              </Box>
                                              <Box className={'common-task-list-item-check'}>
                                                <Checkbox
                                                  onChange={handleDeliverableCheckbox}
                                                  value={deliverable?.['id']}
                                                  checked={selectedDeliverableData?.includes(deliverable?.['id'])}
                                                />
                                              </Box>
                                              <Box className={'common-task-list-item-title'}>
                                                {deliverable?.['title']}
                                              </Box>
                                              <Tooltip placement='top' title='Edit Deliverable'>
                                                <Button
                                                  className='common-task-list-item-btn'
                                                  onClick={() => handleDeliverableOnEdit(deliverable)}
                                                >
                                                  <EditIcon />
                                                </Button>
                                              </Tooltip>
                                            </Box>
                                          )
                                        })}
                                    </>
                                  )
                                })}
                            </>
                          </>
                        )
                      })}
                  </Box>
                </Box>
              </Box>
            )
          })}
        </Box>
      </Box>

      <Modal
        open={serviceDeliverableModalOpen}
        onClose={handleServiceDeliverableModalClose}
        aria-labelledby='service-deliverable-modal-title'
        aria-describedby='service-deliverable-modal-description'
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Box
          className='p-5 mb-8 bg-white rounded-lg shadow-md dark-d:bg-gray-800'
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
            <h2
              id='service-deliverable-modal-title'
              className='my-6 text-xl font-semibold text-gray-700 dark-d:text-gray-200'
            >
              {deliverableEditId ? 'Update' : 'Add'} Deliverable
            </h2>
          </Box>
          <form>
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 5, mb: 5 }}>
              {!deliverableEditId && (
                <Box
                  sx={{
                    width: '100%',
                    '& .MuiInputBase-root': {
                      border: errorMessage?.['serviceId'] ? '1px solid #dc2626' : ''
                    }
                  }}
                >
                  {/* <label className='block text-sm'>
                    <Dropdown
                      name='phaseId'
                      value={deliverableFormData.phaseId}
                      onChange={handleDeliverableSelectChange}
                      dataList={sowPhaseList}
                      label={'Phase'}
                    />
                    {!!errorMessage?.['phaseId'] &&
                      errorMessage?.['phaseId']?.map((message: any, index: number) => {
                        return (
                          <span key={index + Math.random()} className='text-xs text-red-600 dark-d:text-red-400'>
                            {message}
                          </span>
                        )
                      })}
                  </label> */}
                </Box>
              )}

              {deliverableEditId ? (
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
                        value={deliverableFormData?.title}
                        onChange={handleDeliverableInputChange}
                        placeholder={`Title`}
                        fullWidth
                      />
                      {!!errorMessage?.['title'] &&
                        errorMessage?.['title']?.map((message: any, index: number) => {
                          return (
                            <span key={index + Math.random()} className='text-xs text-red-600 dark-d:text-red-400'>
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
                    Deliverable
                    <Box
                      sx={sowAddButtonSx}
                      onClick={() => {
                        handleAddNewDeliverable()
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
                    {deliverableFormData?.deliverables?.map((deliverable: any, index: number) => {
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
                          <Box sx={{ display: 'flex', width: '100%' }}>
                            <Box
                              sx={{
                                width: 'calc(100% - 40px)',
                                mb: 2,
                                mr: 1
                              }}
                            >
                              <Dropdown
                                label={'Scope Of Work'}
                                dataList={scopeOfWorkData}
                                name='scopeOfWorkId'
                                value={deliverable.scopeOfWorkId}
                                onChange={e => {
                                  handleDeliverableMultipleInputChange(e, index)
                                }}
                                optionConfig={{ title: 'title', id: 'id' }}
                              />
                              {!!errorMessage?.['deliverables']?.[index]?.['scopeOfWorkId'] &&
                                errorMessage?.['deliverables']?.[index]?.['scopeOfWorkId']?.map(
                                  (message: any, index: number) => {
                                    return (
                                      <span
                                        key={index + Math.random()}
                                        className='text-xs text-red-600 dark-d:text-red-400'
                                      >
                                        {message}
                                      </span>
                                    )
                                  }
                                )}
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
                                  handleRemoveDeliverable(index)
                                }}
                                sx={sowRemoveButtonSx}
                              >
                                <DeleteIcon fontSize='small' />
                              </Button>
                            </Box>
                          </Box>
                          <Box sx={{ display: 'flex', width: '100%' }}>
                            <Box
                              sx={{
                                width: 'calc(100% - 100px)'
                              }}
                            >
                              <TextField
                                label={'Title'}
                                name='title'
                                value={deliverable?.title}
                                onChange={e => {
                                  handleDeliverableMultipleInputChange(e, index)
                                }}
                                placeholder={`Title`}
                                fullWidth
                              />
                              {!!!!errorMessage?.['deliverables']?.[index]?.['title'] &&
                                errorMessage?.['deliverables']?.[index]?.['title']?.map(
                                  (message: any, index: number) => {
                                    return (
                                      <span
                                        key={index + Math.random()}
                                        className='text-xs text-red-600 dark-d:text-red-400'
                                      >
                                        {message}
                                      </span>
                                    )
                                  }
                                )}
                            </Box>
                            <Box
                              sx={{
                                width: '100px'
                              }}
                            >
                              <TextField
                                label={'Order'}
                                name='serial'
                                value={deliverable?.serial}
                                onChange={e => {
                                  handleDeliverableMultipleInputChange(e, index)
                                }}
                                placeholder={`Order`}
                                fullWidth
                              />
                              {!!errorMessage?.['serial'] &&
                                errorMessage?.['serial']?.map((message: any, index: number) => {
                                  return (
                                    <span
                                      key={index + Math.random()}
                                      className='text-xs text-red-600 dark-d:text-red-400'
                                    >
                                      {message}
                                    </span>
                                  )
                                })}
                            </Box>
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
                onClick={() => {
                  handleServiceDeliverableModalClose()
                }}
                type='button'
                className='px-4 py-2 mr-3 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-red-600 border border-transparent rounded-lg active:bg-red-600 hover:bg-red-700 focus:outline-none focus:shadow-outline-red'
              >
                <ClearIcon /> Cancel
              </button>
              <button
                type='button'
                onClick={() => {
                  handleDeliverableSaveOnClick()
                }}
                className='px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-green-600 border border-transparent rounded-lg active:bg-green-600 hover:bg-green-700 focus:outline-none focus:shadow-outline-green'
              >
                <AddIcon />
                {deliverableEditId ? 'Update' : 'Save'}
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
          className='p-5 mb-8 bg-white rounded-lg shadow-md dark-d:bg-gray-800'
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
            <h2 id='service-modal-title' className='my-6 text-xl font-semibold text-gray-700 dark-d:text-gray-200'>
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
                          <span key={index + Math.random()} className='text-xs text-red-600 dark-d:text-red-400'>
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
                            <span key={index + Math.random()} className='text-xs text-red-600 dark-d:text-red-400'>
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
                                  <span
                                    key={index + Math.random()}
                                    className='text-xs text-red-600 dark-d:text-red-400'
                                  >
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
                                  <span
                                    key={index + Math.random()}
                                    className='text-xs text-red-600 dark-d:text-red-400'
                                  >
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
                onClick={() => {
                  handleServiceSOWModalClose()
                }}
                type='button'
                className='px-4 py-2 mr-3 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-red-600 border border-transparent rounded-lg active:bg-red-600 hover:bg-red-700 focus:outline-none focus:shadow-outline-red'
              >
                <ClearIcon /> Cancel
              </button>
              <button
                type='button'
                onClick={() => {
                  handleSOWSaveOnClick()
                }}
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
