import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
  Accordion,
  Box,
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  TextField
} from '@mui/material'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import { MdPreview } from 'md-editor-rt'
import 'md-editor-rt/lib/style.css'
import { Dropdown } from 'src/@core/components/dropdown'
import {
  formTitleSx,
  sectionSubTitleSx,
  taskListContainer,
  teamReviewBoxSx
} from 'src/views/project-sow/ProjectSOW.style'
import { scopeOfWorkGroupByAdditionalServiceId } from '../../ProjectSOWForm.decorator'
import {
  calculateTotalHoursForAllSOWs,
  calculateTotalHoursForDeliverable,
  calculateTotalHoursForScopeOfWorks,
  calculateTotalInternalCostForAllSOWs,
  calculateTotalInternalCostForDeliverable,
  calculateTotalInternalCostForScopeOfWorks,
  TProjectSOWEstimationFormViewProps,
  transformSubTaskTaskDeliverablesSowsData
} from './ProjectSOWEstimation.decorator'

export default function ProjectSOWEstimationFormView(props: TProjectSOWEstimationFormViewProps) {
  const {
    handleDeliverableCheckboxBySow,
    handleDeliverableCheckbox,
    projectSOWFormData,
    errorMessage,
    problemGoalText,
    overviewText,
    handleUpdateTeamAssignOnChange,
    employeeRoleData,
    associatedUserWithRole,
    teamUserList,
    tasksList,
    handleUpdateTaskCheckUnCheckForSOWOnChange,
    handleUpdateTaskCheckUnCheckForDeliverablesOnChange,
    handleUpdateTaskEstimateHoursOnChange,
    handleUpdateTaskCheckUnCheckForTaskOnChange,
    handleUpdateTaskCheckUnCheckForParentTaskOnChange,
    handleUpdateTaskAssignOnChange,
    handleUpdateTaskCheckUnCheckForServiceOnChange
  } = props

  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ ...formTitleSx, mt: 0 }}>Estimation - {projectSOWFormData?.projectName}</Box>

        <Accordion sx={teamReviewBoxSx}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls='client-information-content'
            id='client-information-header'
          >
            Client Information
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
              <Box sx={{ width: '30%' }}>
                <TextField
                  id='outlined-multiline-flexible'
                  label='Company Name'
                  className={`block w-full text-sm dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input ${
                    errorMessage?.['projectName'] ? 'border-red-600' : 'dark:border-gray-600'
                  }`}
                  name='company'
                  value={projectSOWFormData.company}
                  disabled
                />
                {!!errorMessage?.['company'] &&
                  errorMessage?.['company']?.map((message: any, index: number) => {
                    return (
                      <span key={index} className='text-xs text-red-600 dark:text-red-400'>
                        {message}
                      </span>
                    )
                  })}
              </Box>
              <Box sx={{ width: '70%' }}>
                <TextField
                  id='outlined-multiline-flexible'
                  label='Website'
                  className={`block w-full text-sm dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input ${
                    errorMessage?.['projectName'] ? 'border-red-600' : 'dark:border-gray-600 '
                  }`}
                  name='clientWebsite'
                  value={projectSOWFormData.clientWebsite}
                  disabled
                />
              </Box>
            </Box>
            <Box className='team-review-box-title'>Project Details</Box>
            <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
              <Box sx={{ width: '30%' }}>
                <Dropdown
                  label={'Services'}
                  url={'services'}
                  name='serviceId'
                  value={projectSOWFormData.serviceId}
                  disabled
                />
              </Box>
              <Box sx={{ width: '70%' }}>
                <TextField
                  id='outlined-multiline-flexible'
                  label='Project Name'
                  className={`block w-full text-sm dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input ${
                    errorMessage?.['projectName'] ? 'border-red-600' : 'dark:border-gray-600 '
                  }`}
                  name='projectName'
                  value={projectSOWFormData.projectName}
                  disabled
                />
              </Box>
            </Box>
            <Box className='team-review-box-title'>Qualifying Meeting Transcripts</Box>
            <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
              <Box sx={{ width: '50%' }}>
                <TextField
                  id='outlined-multiline-flexible'
                  label='Meeting Transcripts'
                  className={`block w-full text-sm dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input ${
                    errorMessage?.['projectName'] ? 'border-red-600' : 'dark:border-gray-600 '
                  }`}
                  name='projectName'
                  value={''}
                  disabled
                />
              </Box>
              <Box sx={{ width: '50%' }}>
                <TextField
                  id='outlined-multiline-flexible'
                  label='Meeting Transcripts'
                  className={`block w-full text-sm dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input ${
                    errorMessage?.['projectName'] ? 'border-red-600' : 'dark:border-gray-600 '
                  }`}
                  name='projectName'
                  value={''}
                  disabled
                />
              </Box>
            </Box>
            <Box className='team-review-box-title'>Account Manager Notes</Box>
            <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
              <Box sx={{ width: '50%' }}>
                <TextField
                  id='outlined-multiline-flexible'
                  label='Account Manager Notes'
                  className={`block w-full text-sm dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input ${
                    errorMessage?.['projectName'] ? 'border-red-600' : 'dark:border-gray-600 '
                  }`}
                  name='projectName'
                  value={''}
                  disabled
                />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
              <Box sx={{ width: '100%' }}>
                <Box
                  component={'textarea'}
                  id='outlined-multiline-flexible'
                  className={`block w-full text-sm dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input ${
                    errorMessage?.['projectName'] ? 'border-red-600' : 'dark:border-gray-600 '
                  }`}
                  name='projectName'
                  rows={5}
                />
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>

        <Accordion sx={teamReviewBoxSx}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls='problemAndGoal-content'
            id='problemAndGoal-header'
          >
            Problem & Goals
          </AccordionSummary>
          <AccordionDetails>
            <MdPreview modelValue={problemGoalText} />
          </AccordionDetails>
        </Accordion>

        <Accordion sx={teamReviewBoxSx}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls='problemAndGoal-content'
            id='problemAndGoal-header'
          >
            Project Overview
          </AccordionSummary>
          <AccordionDetails>
            <MdPreview modelValue={overviewText} />
          </AccordionDetails>
        </Accordion>
        <Accordion sx={teamReviewBoxSx}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls='problemAndGoal-content'
            id='problemAndGoal-header'
          >
            Project Team Needed
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ ...teamReviewBoxSx, p: '15px' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box className='team-review-team-need-box'>
                  {employeeRoleData?.map((employeeRole: any, index: number) => {
                    return (
                      <Box className='team-review-team-need-item' key={index + 'team'}>
                        <Box className='team-review-team-need-item-input'>
                          <FormControl fullWidth>
                            <InputLabel id='associateId-label'>{employeeRole?.name}</InputLabel>
                            <Select
                              labelId='associateId-label'
                              id='associateId'
                              onChange={event => {
                                handleUpdateTeamAssignOnChange(employeeRole?.id, Number(event?.target?.value))
                              }}
                              value={
                                associatedUserWithRole?.find((item: any) => item?.employeeRoleId === employeeRole?.id)
                                  ?.associateId || ''
                              }
                              name={`associateId_${employeeRole?.id}`}
                              label={employeeRole?.name}
                            >
                              {teamUserList?.map((item: any) => (
                                <MenuItem value={item?.id} key={item?.id}>
                                  {item?.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Box>
                      </Box>
                    )
                  })}
                </Box>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
        <Accordion sx={teamReviewBoxSx}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls='problemAndGoal-content'
            id='problemAndGoal-header'
          >
            SOWs, Deliverables, Tasks, and Subtasks
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              {/* <Box sx={sectionTitleSx}>SOWs, Deliverables, Tasks, and Subtasks</Box> */}
              <Box sx={{ ...taskListContainer }}>
                <Box>
                  <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
                    <Table sx={{ width: '100%' }} aria-label='sticky table' stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ width: '25px', p: 0 }}></TableCell>
                          <TableCell align='right' sx={{ width: '145px' }}></TableCell>
                          <TableCell align='center' sx={{ width: 'calc(100% - 615px)' }}>
                            Deliverable & Timeline
                          </TableCell>
                          <TableCell align='center'>Team Member</TableCell>
                          <TableCell align='center'>Hours</TableCell>
                          <TableCell align='center'>Timeline</TableCell>
                          <TableCell align='center'>Internal</TableCell>
                          <TableCell align='center'>Retails</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {transformSubTaskTaskDeliverablesSowsData(
                          tasksList?.filter((task: any) => !task?.additionalServiceId)
                        )?.map((scope_of_work: any, index: number) => {
                          return (
                            <>
                              <TableRow
                                key={scope_of_work.name}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                              >
                                <TableCell scope='row'>
                                  <Checkbox
                                    onChange={event => {
                                      handleUpdateTaskCheckUnCheckForSOWOnChange(
                                        scope_of_work?.deliverables,
                                        event?.target?.checked
                                      )
                                      handleDeliverableCheckboxBySow(scope_of_work?.deliverables)
                                    }}
                                    value={scope_of_work?.id}
                                    checked={scope_of_work?.deliverables?.some((deliverable: any) => {
                                      return deliverable?.tasks?.some((task: any) => task?.isChecked)
                                    })}
                                  />
                                </TableCell>
                                <TableCell align='right'>
                                  <Box className={`item-type-common item-type-sow  item-type-hive`}>SOW</Box>
                                </TableCell>
                                <TableCell align='left'>
                                  <Box dangerouslySetInnerHTML={{ __html: scope_of_work?.title }}></Box>
                                </TableCell>
                                <TableCell></TableCell>
                                <TableCell align='center' className={'estimated-hours-sec item-type-sow'}>
                                  {calculateTotalHoursForScopeOfWorks(scope_of_work)}h
                                </TableCell>
                                <TableCell></TableCell>
                                <TableCell align='center' className={'item-type-sow'}>
                                  ${calculateTotalInternalCostForScopeOfWorks(scope_of_work)}
                                </TableCell>
                                <TableCell align='center' className={'item-type-sow'}>
                                  $0.00
                                </TableCell>
                              </TableRow>
                              {scope_of_work?.deliverables?.map((deliverable: any, deliverableIndex: number) => {
                                return (
                                  <>
                                    <TableRow
                                      key={deliverableIndex}
                                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                      <TableCell scope='row'>
                                        <Checkbox
                                          onChange={event => {
                                            handleDeliverableCheckbox(event)
                                            handleUpdateTaskCheckUnCheckForDeliverablesOnChange(
                                              deliverable?.tasks,
                                              event.target.checked
                                            )
                                          }}
                                          value={deliverable?.['id']}
                                          checked={deliverable?.tasks?.filter((task: any) => task?.isChecked).length}
                                        />
                                      </TableCell>
                                      <TableCell align='right'>
                                        <Box className={`item-type-common item-type-deliverable item-type-hive`}>
                                          Deliverable
                                        </Box>
                                      </TableCell>
                                      <TableCell align='left'>
                                        <Box dangerouslySetInnerHTML={{ __html: deliverable?.title }}></Box>{' '}
                                      </TableCell>
                                      <TableCell></TableCell>
                                      <TableCell align='center' className={'estimated-hours-sec item-type-deliverable'}>
                                        {calculateTotalHoursForDeliverable(deliverable)}h
                                      </TableCell>
                                      <TableCell></TableCell>
                                      <TableCell align='center' className={'item-type-deliverable'}>
                                        ${calculateTotalInternalCostForDeliverable(deliverable)}
                                      </TableCell>
                                      <TableCell align='center' className={'item-type-deliverable'}>
                                        $0.00
                                      </TableCell>
                                    </TableRow>

                                    {deliverable?.tasks?.map((task: any, taskIndex: number) => {
                                      return (
                                        <>
                                          <TableRow
                                            key={taskIndex}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                          >
                                            <TableCell scope='row'>
                                              <Checkbox
                                                onChange={() => {
                                                  !task?.['sub_tasks']?.length
                                                    ? handleUpdateTaskCheckUnCheckForTaskOnChange(
                                                        task?.['id'],
                                                        !task?.['isChecked']
                                                      )
                                                    : handleUpdateTaskCheckUnCheckForParentTaskOnChange(
                                                        task?.['sub_tasks'],
                                                        task?.['id'],
                                                        !task?.['isChecked']
                                                      )
                                                }}
                                                value={task?.['id']}
                                                checked={!!task?.['isChecked']}
                                              />
                                            </TableCell>
                                            <TableCell align='right'>
                                              <Box className={`item-type-common item-type-task item-type-hive`}>
                                                Task
                                              </Box>
                                            </TableCell>
                                            <TableCell align='left'>
                                              <Box dangerouslySetInnerHTML={{ __html: task?.title }}></Box>{' '}
                                            </TableCell>
                                            <TableCell>
                                              {!!task?.['isChecked'] && !task?.['sub_tasks']?.length && (
                                                <Select
                                                  className={'team-select'}
                                                  labelId='associateId-label'
                                                  id='associateId'
                                                  onChange={event => {
                                                    handleUpdateTaskAssignOnChange(
                                                      task?.['id'],
                                                      Number(event?.target?.value)
                                                    )
                                                  }}
                                                  name={`associateId_${task?.['id']}`}
                                                  value={task?.associateId}
                                                  sx={{ width: '200px' }}
                                                >
                                                  {teamUserList?.map((item: any) => (
                                                    <MenuItem value={item?.id} key={item?.id}>
                                                      {item?.name}
                                                    </MenuItem>
                                                  ))}
                                                </Select>
                                              )}
                                            </TableCell>
                                            <TableCell
                                              align='center'
                                              className={task?.['sub_tasks']?.length ? 'item-type-task' : ''}
                                            >
                                              {!!task?.['isChecked'] && !task?.['sub_tasks']?.length ? (
                                                <TextField
                                                  className={'sow-list-item-text-input'}
                                                  value={task?.estimateHours}
                                                  sx={{ width: '100px' }}
                                                  onChange={event => {
                                                    handleUpdateTaskEstimateHoursOnChange(
                                                      task?.id,
                                                      Number(event?.target?.value)
                                                    )
                                                  }}
                                                  name={`estimateHours_${task?.id}`}
                                                  inputProps={{
                                                    maxLength: 3,
                                                    pattern: '[0-9]*'
                                                  }}
                                                />
                                              ) : (
                                                task?.sub_tasks
                                                  ?.reduce((acc: number, subTask: any) => {
                                                    if (subTask?.isChecked) {
                                                      return acc + Number(subTask?.estimateHours)
                                                    } else {
                                                      return acc + 0
                                                    }
                                                  }, 0)
                                                  .toFixed(2)
                                              )}
                                              h
                                            </TableCell>
                                            <TableCell></TableCell>
                                            <TableCell
                                              align='center'
                                              className={task?.['sub_tasks']?.length ? 'item-type-task' : ''}
                                            >
                                              {!!task?.['isChecked'] &&
                                                task?.['sub_tasks']?.length &&
                                                `$${task?.sub_tasks
                                                  ?.reduce((acc: number, subTask: any) => {
                                                    if (subTask?.isChecked) {
                                                      return acc + Number(subTask?.estimateHours * subTask?.hourlyRate)
                                                    } else {
                                                      return acc + 0
                                                    }
                                                  }, 0)
                                                  .toFixed(2)}`}
                                            </TableCell>
                                            <TableCell
                                              align='center'
                                              className={task?.['sub_tasks']?.length ? 'item-type-task' : ''}
                                            >
                                              {!!task?.['isChecked'] && `$0.00`}
                                            </TableCell>
                                          </TableRow>
                                          {task?.sub_tasks?.map((subTask: any, subTaskIndex: number) => {
                                            return (
                                              <TableRow
                                                key={subTaskIndex}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                              >
                                                <TableCell scope='row'>
                                                  <Checkbox
                                                    onChange={() => {
                                                      handleUpdateTaskCheckUnCheckForTaskOnChange(
                                                        subTask?.['id'],
                                                        !subTask?.['isChecked']
                                                      )
                                                    }}
                                                    value={subTask?.['id']}
                                                    checked={!!subTask?.['isChecked']}
                                                  />
                                                </TableCell>
                                                <TableCell align='right'>
                                                  <Box className={`item-type-common item-type-subtask item-type-hive`}>
                                                    Subtask
                                                  </Box>
                                                </TableCell>
                                                <TableCell align='left'>
                                                  <Box dangerouslySetInnerHTML={{ __html: subTask?.title }}></Box>{' '}
                                                </TableCell>
                                                <TableCell>
                                                  {!!subTask?.['isChecked'] && (
                                                    <Select
                                                      className={'team-select'}
                                                      labelId='associateId-label'
                                                      id='associateId'
                                                      onChange={event => {
                                                        handleUpdateTaskAssignOnChange(
                                                          subTask?.['id'],
                                                          Number(event?.target?.value)
                                                        )
                                                      }}
                                                      name={`associateId_${subTask?.['id']}`}
                                                      value={subTask?.associateId}
                                                      sx={{ width: '200px' }}
                                                    >
                                                      {teamUserList?.map((item: any) => (
                                                        <MenuItem value={item?.id} key={item?.id}>
                                                          {item?.name}
                                                        </MenuItem>
                                                      ))}
                                                    </Select>
                                                  )}
                                                </TableCell>
                                                <TableCell>
                                                  {!!subTask?.['isChecked'] && !subTask?.['sub_tasks']?.length && (
                                                    <TextField
                                                      className={'sow-list-item-text-input'}
                                                      value={subTask?.estimateHours}
                                                      sx={{ width: '100px' }}
                                                      onChange={event => {
                                                        handleUpdateTaskEstimateHoursOnChange(
                                                          subTask?.id,
                                                          Number(event?.target?.value)
                                                        )
                                                      }}
                                                      name={`estimateHours_${subTask?.id}`}
                                                      inputProps={{
                                                        maxLength: 3,
                                                        pattern: '[0-9]*'
                                                      }}
                                                    />
                                                  )}
                                                </TableCell>
                                                <TableCell></TableCell>
                                                <TableCell align='center'>
                                                  {!!task?.['isChecked'] &&
                                                    `$${(
                                                      Number(task?.associate?.hourlyRate ?? 0) *
                                                      Number(subTask?.estimateHours)
                                                    ).toFixed(2)}`}
                                                </TableCell>
                                                <TableCell align='center'>{!!task?.['isChecked'] && `$0.00`}</TableCell>
                                              </TableRow>
                                            )
                                          })}
                                        </>
                                      )
                                    })}
                                  </>
                                )
                              })}
                            </>
                          )
                        })}
                      </TableBody>
                      <TableFooter>
                        <TableRow sx={{ fontWeight: 'bold', fontSize: '16px' }}>
                          <TableCell sx={{ p: 0 }} colSpan={3}></TableCell>
                          <TableCell align='right'>Total</TableCell>
                          <TableCell align='center'>
                            {calculateTotalHoursForAllSOWs(
                              transformSubTaskTaskDeliverablesSowsData(
                                tasksList?.filter((task: any) => task?.additionalServiceId)
                              )
                            )}
                          </TableCell>
                          <TableCell align='center'></TableCell>
                          <TableCell align='center'>
                            $
                            {calculateTotalInternalCostForAllSOWs(
                              transformSubTaskTaskDeliverablesSowsData(
                                tasksList?.filter((task: any) => task?.additionalServiceId)
                              )
                            )}
                          </TableCell>
                          <TableCell align='center'>$0.00</TableCell>
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </TableContainer>
                </Box>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>

        <Accordion sx={teamReviewBoxSx}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls='problemAndGoal-content'
            id='problemAndGoal-header'
          >
            Added Services
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              {/* <Box sx={sectionTitleSx}>Added Services</Box> */}
              <Box>
                {scopeOfWorkGroupByAdditionalServiceId(
                  transformSubTaskTaskDeliverablesSowsData(tasksList?.filter((task: any) => task?.additionalServiceId))
                )?.map((additionalService: any, additionalServiceIndex: number) => {
                  return (
                    <Box key={additionalServiceIndex}>
                      <Box sx={sectionSubTitleSx} component={'label'}>
                        <Checkbox
                          onChange={event => {
                            handleUpdateTaskCheckUnCheckForServiceOnChange(
                              additionalService?.scope_of_works,
                              event.target.checked
                            )
                          }}
                          value={additionalService?.id}
                          checked={
                            additionalService?.scope_of_works.flatMap((scope_of_work: any) =>
                              scope_of_work?.deliverables?.flatMap((deliverable: any) =>
                                deliverable?.tasks?.filter((task: any) => task?.isChecked)
                              )
                            ).length
                          }
                          sx={{ p: 0, mr: 2 }}
                        />

                        {additionalService?.name}
                      </Box>
                      <Box sx={taskListContainer}>
                        <Box>
                          <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
                            <Table sx={{ width: '100%' }} aria-label='sticky table' stickyHeader>
                              <TableHead>
                                <TableRow>
                                  <TableCell></TableCell>
                                  <TableCell align='right'></TableCell>
                                  <TableCell align='center'>Deliverable & Timeline</TableCell>
                                  <TableCell align='center'>Team Member</TableCell>
                                  <TableCell align='center'>Hours</TableCell>
                                  <TableCell align='center'>Timeline</TableCell>
                                  <TableCell align='center'>Internal</TableCell>
                                  <TableCell align='center'>Retails</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {additionalService?.scope_of_works?.map((scope_of_work: any, index: number) => {
                                  return (
                                    <>
                                      <TableRow
                                        key={scope_of_work.name}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                      >
                                        <TableCell scope='row'>
                                          <Checkbox
                                            onChange={event => {
                                              handleUpdateTaskCheckUnCheckForSOWOnChange(
                                                scope_of_work?.deliverables,
                                                event?.target?.checked
                                              )
                                              handleDeliverableCheckboxBySow(scope_of_work?.deliverables)
                                            }}
                                            value={scope_of_work?.id}
                                            checked={scope_of_work?.deliverables?.some((deliverable: any) => {
                                              return deliverable?.tasks?.some((task: any) => task?.isChecked)
                                            })}
                                          />
                                        </TableCell>
                                        <TableCell align='right'>
                                          <Box className={`item-type-common item-type-sow  item-type-hive`}>SOW</Box>
                                        </TableCell>
                                        <TableCell align='left'>
                                          <Box dangerouslySetInnerHTML={{ __html: scope_of_work?.title }}></Box>
                                        </TableCell>
                                        <TableCell></TableCell>
                                        <TableCell align='center' className={'estimated-hours-sec item-type-sow'}>
                                          {calculateTotalHoursForScopeOfWorks(scope_of_work)}h
                                        </TableCell>
                                        <TableCell></TableCell>
                                        <TableCell align='center' className={'item-type-sow'}>
                                          ${calculateTotalInternalCostForScopeOfWorks(scope_of_work)}
                                        </TableCell>
                                        <TableCell align='center' className={'item-type-sow'}>
                                          $0.00
                                        </TableCell>
                                      </TableRow>
                                      {scope_of_work?.deliverables?.map(
                                        (deliverable: any, deliverableIndex: number) => {
                                          return (
                                            <>
                                              <TableRow
                                                key={deliverableIndex}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                              >
                                                <TableCell scope='row'>
                                                  <Checkbox
                                                    onChange={event => {
                                                      handleDeliverableCheckbox(event)
                                                      handleUpdateTaskCheckUnCheckForDeliverablesOnChange(
                                                        deliverable?.tasks,
                                                        event.target.checked
                                                      )
                                                    }}
                                                    value={deliverable?.['id']}
                                                    checked={
                                                      deliverable?.tasks?.filter((task: any) => task?.isChecked).length
                                                    }
                                                  />
                                                </TableCell>
                                                <TableCell align='right'>
                                                  <Box
                                                    className={`item-type-common item-type-deliverable item-type-hive`}
                                                  >
                                                    Deliverable
                                                  </Box>
                                                </TableCell>
                                                <TableCell align='left'>
                                                  <Box
                                                    dangerouslySetInnerHTML={{
                                                      __html: deliverable?.title
                                                    }}
                                                  ></Box>{' '}
                                                </TableCell>
                                                <TableCell></TableCell>
                                                <TableCell
                                                  align='center'
                                                  className={'estimated-hours-sec item-type-deliverable'}
                                                >
                                                  {calculateTotalHoursForDeliverable(deliverable)}h
                                                </TableCell>
                                                <TableCell></TableCell>
                                                <TableCell align='center' className={'item-type-deliverable'}>
                                                  ${calculateTotalInternalCostForDeliverable(deliverable)}
                                                </TableCell>
                                                <TableCell align='center' className={'item-type-deliverable'}>
                                                  $0.00
                                                </TableCell>
                                              </TableRow>

                                              {deliverable?.tasks?.map((task: any, taskIndex: number) => {
                                                return (
                                                  <>
                                                    <TableRow
                                                      key={taskIndex}
                                                      sx={{
                                                        '&:last-child td, &:last-child th': { border: 0 }
                                                      }}
                                                    >
                                                      <TableCell scope='row'>
                                                        <Checkbox
                                                          onChange={() => {
                                                            !task?.['sub_tasks']?.length
                                                              ? handleUpdateTaskCheckUnCheckForTaskOnChange(
                                                                  task?.['id'],
                                                                  !task?.['isChecked']
                                                                )
                                                              : handleUpdateTaskCheckUnCheckForParentTaskOnChange(
                                                                  task?.['sub_tasks'],
                                                                  task?.['id'],
                                                                  !task?.['isChecked']
                                                                )
                                                          }}
                                                          value={task?.['id']}
                                                          checked={!!task?.['isChecked']}
                                                        />
                                                      </TableCell>
                                                      <TableCell align='right'>
                                                        <Box
                                                          className={`item-type-common item-type-task item-type-hive`}
                                                        >
                                                          Task
                                                        </Box>
                                                      </TableCell>
                                                      <TableCell align='left'>
                                                        <Box
                                                          dangerouslySetInnerHTML={{
                                                            __html: task?.title
                                                          }}
                                                        ></Box>
                                                      </TableCell>
                                                      <TableCell>
                                                        {!!task?.['isChecked'] && !task?.['sub_tasks']?.length && (
                                                          <Select
                                                            className={'team-select'}
                                                            labelId='associateId-label'
                                                            id='associateId'
                                                            onChange={event => {
                                                              handleUpdateTaskAssignOnChange(
                                                                task?.['id'],
                                                                Number(event?.target?.value)
                                                              )
                                                            }}
                                                            name={`associateId_${task?.['id']}`}
                                                            value={task?.associateId}
                                                            sx={{ width: '200px' }}
                                                          >
                                                            {teamUserList?.map((item: any) => (
                                                              <MenuItem value={item?.id} key={item?.id}>
                                                                {item?.name}
                                                              </MenuItem>
                                                            ))}
                                                          </Select>
                                                        )}
                                                      </TableCell>
                                                      <TableCell
                                                        align='center'
                                                        className={task?.['sub_tasks']?.length ? 'item-type-task' : ''}
                                                      >
                                                        {!!task?.['isChecked'] && !task?.['sub_tasks']?.length ? (
                                                          <TextField
                                                            className={'sow-list-item-text-input'}
                                                            value={task?.estimateHours}
                                                            sx={{ width: '100px' }}
                                                            onChange={event => {
                                                              handleUpdateTaskEstimateHoursOnChange(
                                                                task?.id,
                                                                Number(event?.target?.value)
                                                              )
                                                            }}
                                                            name={`estimateHours_${task?.id}`}
                                                            inputProps={{
                                                              maxLength: 3,
                                                              pattern: '[0-9]*'
                                                            }}
                                                          />
                                                        ) : (
                                                          task?.sub_tasks
                                                            ?.reduce((acc: number, subTask: any) => {
                                                              if (subTask?.isChecked) {
                                                                return acc + subTask?.estimateHours
                                                              } else {
                                                                return acc + 0
                                                              }
                                                            }, 0)
                                                            .toFixed(2)
                                                        )}
                                                        h
                                                      </TableCell>
                                                      <TableCell></TableCell>
                                                      <TableCell
                                                        align='center'
                                                        className={task?.['sub_tasks']?.length ? 'item-type-task' : ''}
                                                      >
                                                        {!!task?.['isChecked'] &&
                                                          task?.['sub_tasks']?.length &&
                                                          `$${task?.sub_tasks
                                                            ?.reduce((acc: number, subTask: any) => {
                                                              if (subTask?.isChecked) {
                                                                return (
                                                                  acc +
                                                                  Number(subTask?.estimateHours * subTask?.hourlyRate)
                                                                )
                                                              } else {
                                                                return acc + 0
                                                              }
                                                            }, 0)
                                                            .toFixed(2)}`}
                                                      </TableCell>
                                                      <TableCell
                                                        align='center'
                                                        className={task?.['sub_tasks']?.length ? 'item-type-task' : ''}
                                                      >
                                                        {!!task?.['isChecked'] && `$0.00`}
                                                      </TableCell>
                                                    </TableRow>
                                                    {task?.sub_tasks?.map((subTask: any, subTaskIndex: number) => {
                                                      return (
                                                        <TableRow
                                                          key={subTaskIndex}
                                                          sx={{
                                                            '&:last-child td, &:last-child th': {
                                                              border: 0
                                                            }
                                                          }}
                                                        >
                                                          <TableCell scope='row'>
                                                            <Checkbox
                                                              onChange={() => {
                                                                handleUpdateTaskCheckUnCheckForTaskOnChange(
                                                                  subTask?.['id'],
                                                                  !subTask?.['isChecked']
                                                                )
                                                              }}
                                                              value={subTask?.['id']}
                                                              checked={!!subTask?.['isChecked']}
                                                            />
                                                          </TableCell>
                                                          <TableCell align='right'>
                                                            <Box
                                                              className={`item-type-common item-type-subtask item-type-hive`}
                                                            >
                                                              Subtask
                                                            </Box>
                                                          </TableCell>
                                                          <TableCell align='left'>
                                                            <Box
                                                              dangerouslySetInnerHTML={{
                                                                __html: subTask?.title
                                                              }}
                                                            ></Box>
                                                          </TableCell>
                                                          <TableCell>
                                                            {!!subTask?.['isChecked'] && (
                                                              <Select
                                                                className={'team-select'}
                                                                labelId='associateId-label'
                                                                id='associateId'
                                                                onChange={event => {
                                                                  handleUpdateTaskAssignOnChange(
                                                                    subTask?.['id'],
                                                                    Number(event?.target?.value)
                                                                  )
                                                                }}
                                                                name={`associateId_${subTask?.['id']}`}
                                                                value={subTask?.associateId}
                                                                sx={{ width: '200px' }}
                                                              >
                                                                {teamUserList?.map((item: any) => (
                                                                  <MenuItem value={item?.id} key={item?.id}>
                                                                    {item?.name}
                                                                  </MenuItem>
                                                                ))}
                                                              </Select>
                                                            )}
                                                          </TableCell>
                                                          <TableCell>
                                                            {!!subTask?.['isChecked'] &&
                                                              !subTask?.['sub_tasks']?.length && (
                                                                <TextField
                                                                  className={'sow-list-item-text-input'}
                                                                  value={subTask?.estimateHours}
                                                                  sx={{ width: '100px' }}
                                                                  onChange={event => {
                                                                    handleUpdateTaskEstimateHoursOnChange(
                                                                      subTask?.id,
                                                                      Number(event?.target?.value)
                                                                    )
                                                                  }}
                                                                  name={`estimateHours_${subTask?.id}`}
                                                                  inputProps={{
                                                                    maxLength: 3,
                                                                    pattern: '[0-9]*'
                                                                  }}
                                                                />
                                                              )}
                                                          </TableCell>
                                                          <TableCell></TableCell>
                                                          <TableCell align='center'>
                                                            {!!task?.['isChecked'] &&
                                                              `$${Number(
                                                                Number(task?.associate?.hourlyRate) *
                                                                  Number(subTask?.estimateHours)
                                                              ).toFixed(2)}`}
                                                          </TableCell>
                                                          <TableCell align='center'>
                                                            {!!task?.['isChecked'] && `$0.00`}
                                                          </TableCell>
                                                        </TableRow>
                                                      )
                                                    })}
                                                  </>
                                                )
                                              })}
                                            </>
                                          )
                                        }
                                      )}
                                    </>
                                  )
                                })}
                              </TableBody>
                              <TableFooter>
                                <TableRow sx={{ fontWeight: 'bold', fontSize: '16px' }}>
                                  <TableCell sx={{ p: 0 }}></TableCell>
                                  <TableCell align='right'></TableCell>
                                  <TableCell align='center'></TableCell>
                                  <TableCell align='right'>Total</TableCell>
                                  <TableCell align='center'>
                                    {calculateTotalHoursForAllSOWs(
                                      transformSubTaskTaskDeliverablesSowsData(
                                        tasksList?.filter((task: any) => !task?.additionalServiceId)
                                      )
                                    )}
                                  </TableCell>
                                  <TableCell align='center'></TableCell>
                                  <TableCell align='center'>
                                    $
                                    {calculateTotalInternalCostForAllSOWs(
                                      transformSubTaskTaskDeliverablesSowsData(
                                        tasksList?.filter((task: any) => !task?.additionalServiceId)
                                      )
                                    )}
                                  </TableCell>
                                  <TableCell align='center'>$0.00</TableCell>
                                </TableRow>
                              </TableFooter>
                            </Table>
                          </TableContainer>
                        </Box>
                      </Box>
                    </Box>
                  )
                })}
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>

        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ ...taskListContainer }}>
            <Box>
              <TableContainer component={Paper} sx={{ maxHeight: 42 }}>
                <Table sx={{ width: '100%' }} aria-label='sticky table' stickyHeader>
                  <TableHead sx={{ opacity: 0 }}>
                    <TableRow>
                      <TableCell sx={{ width: '25px', p: 0 }}></TableCell>
                      <TableCell align='right' sx={{ width: '145px' }}></TableCell>
                      <TableCell align='center' sx={{ width: 'calc(100% - 615px)' }}>
                        Deliverable & Timeline Deliverable & Timeline Deliverable & Timeline Deliverable & Timeline
                      </TableCell>
                      <TableCell align='center'>Team Member</TableCell>
                      <TableCell align='center'>Hours</TableCell>
                      <TableCell align='center'>Timeline</TableCell>
                      <TableCell align='center'>Internal</TableCell>
                      <TableCell align='center'>Retails</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableFooter>
                    <TableRow sx={{ fontWeight: 'bold', fontSize: '16px' }}>
                      <TableCell sx={{ p: 0 }} colSpan={3}></TableCell>
                      <TableCell align='right'>Total</TableCell>
                      <TableCell align='center'>
                        {calculateTotalHoursForAllSOWs(transformSubTaskTaskDeliverablesSowsData(tasksList))}
                      </TableCell>
                      <TableCell align='center'></TableCell>
                      <TableCell align='center'>
                        {console.log(tasksList)}$
                        {calculateTotalInternalCostForAllSOWs(transformSubTaskTaskDeliverablesSowsData(tasksList))}
                      </TableCell>
                      <TableCell align='center'>$0.00</TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
