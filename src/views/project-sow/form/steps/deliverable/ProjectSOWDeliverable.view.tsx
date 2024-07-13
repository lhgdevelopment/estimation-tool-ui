import { Box, Checkbox, TextField } from '@mui/material'
import 'md-editor-rt/lib/style.css'
import { getShortStringNumber } from 'src/@core/utils/utils'
import {
  deliverableNoteItemSx,
  scopeOfWorkListContainer,
  scopeOfWorkListSx,
  sectionSubTitleSx,
  sectionTitleSx,
  serviceQuestionItemSx
} from 'src/views/project-sow/ProjectSOW.style'
import { scopeOfWorkGroupByAdditionalServiceId } from '../../ProjectSOWForm.decorator'
import {
  serviceDeliverableGroupByScopeOfWorkId,
  TProjectSOWDeliverableFormViewProps
} from './ProjectSOWDeliverable.decorator'

export default function ProjectSOWDeliverableFormView(props: TProjectSOWDeliverableFormViewProps) {
  const {
    deliverableData,
    handleDeliverableCheckboxBySow,
    isSowCheckedInDeliverable,
    selectedDeliverableData,
    handleDeliverableCheckbox,
    serviceQuestionList,
    deliverableServiceQuestionData,
    handleServiceQuestionInputChange,
    deliverableNotesData,
    handleNotesInputChange,
    isServiceCheckedInDeliverable,
    handleDeliverableCheckboxByService
  } = props

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Box sx={sectionTitleSx}>Deliverable</Box>
      <Box sx={scopeOfWorkListContainer}>
        <Box sx={scopeOfWorkListSx}>
          {serviceDeliverableGroupByScopeOfWorkId(
            deliverableData?.filter((deliverable: any) => !deliverable?.additionalServiceId)
          )?.map((scopeOfWork: any, index: number) => {
            return (
              <Box key={index + 'deliverable'}>
                <Box className={'sow-list-item'} component={'label'}>
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
                      onChange={() => {
                        handleDeliverableCheckboxBySow(scopeOfWork?.deliverables)
                      }}
                      value={scopeOfWork?.id}
                      checked={isSowCheckedInDeliverable(scopeOfWork?.deliverables, selectedDeliverableData)}
                    />
                  </Box>
                  <Box className={'sow-list-item-title'}>{scopeOfWork?.title}</Box>
                </Box>
                {scopeOfWork?.deliverables?.map((deliverable: any, deliverableIndex: number) => {
                  return (
                    <Box className={'sow-list-item'} key={deliverableIndex} component={'label'}>
                      <Box className={'sow-list-item-sl'}>{`${index + 1}.${deliverableIndex + 1}`}</Box>
                      <Box className={'sow-list-item-type'}>
                        <Box className={'item-type-common item-type-deliverable'}>Deliverable</Box>
                      </Box>
                      <Box className={'sow-list-item-check'}>
                        <Checkbox
                          onChange={handleDeliverableCheckbox}
                          value={deliverable?.['id']}
                          checked={selectedDeliverableData?.includes(deliverable?.['id'])}
                        />
                      </Box>
                      <Box className={'sow-list-item-title'}>{deliverable?.['title']}</Box>
                    </Box>
                  )
                })}
              </Box>
            )
          })}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', mt: 5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 5 }}>
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
      <Box sx={{ display: 'flex', flexDirection: 'column', mt: 5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 5 }}>
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
          {scopeOfWorkGroupByAdditionalServiceId(
            serviceDeliverableGroupByScopeOfWorkId(
              deliverableData?.filter((deliverable: any) => !!deliverable?.additionalServiceId)
            )
          )?.map((additionalService: any, additionalServiceIndex: number) => {
            return (
              <Box key={additionalServiceIndex}>
                <Box sx={sectionSubTitleSx} component={'label'}>
                  <Checkbox
                    onChange={() => {
                      handleDeliverableCheckboxByService(additionalService)
                    }}
                    value={additionalService?.id}
                    checked={isServiceCheckedInDeliverable(additionalService, selectedDeliverableData)}
                    sx={{ p: 0, mr: 2 }}
                  />
                  {additionalService?.name}
                </Box>
                <Box sx={scopeOfWorkListContainer}>
                  <Box sx={scopeOfWorkListSx}>
                    {additionalService?.scope_of_works?.map((scopeOfWork: any, scopeOfWorkIndex: number) => {
                      return (
                        <Box key={scopeOfWorkIndex}>
                          <Box className={'sow-list-item'} component={'label'}>
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
                                onChange={() => {
                                  handleDeliverableCheckboxBySow(scopeOfWork?.deliverables)
                                }}
                                value={scopeOfWork?.id}
                                checked={isSowCheckedInDeliverable(scopeOfWork?.deliverables, selectedDeliverableData)}
                              />
                            </Box>
                            <Box className={'sow-list-item-title'}>{scopeOfWork?.title}</Box>
                          </Box>
                          {scopeOfWork?.deliverables?.map((deliverable: any, deliverableIndex: number) => {
                            return (
                              <Box className={'sow-list-item'} key={deliverableIndex} component={'label'}>
                                <Box className={'sow-list-item-type'}>
                                  <Box className={'item-type-common item-type-deliverable'}>Deliverable</Box>
                                </Box>
                                <Box className={'sow-list-item-check'}>
                                  <Checkbox
                                    onChange={handleDeliverableCheckbox}
                                    value={deliverable?.['id']}
                                    checked={selectedDeliverableData?.includes(deliverable?.['id'])}
                                  />
                                </Box>
                                <Box className={'sow-list-item-title'}>{deliverable?.['title']}</Box>
                              </Box>
                            )
                          })}
                        </Box>
                      )
                    })}
                  </Box>
                </Box>
              </Box>
            )
          })}
        </Box>
      </Box>
    </Box>
  )
}
