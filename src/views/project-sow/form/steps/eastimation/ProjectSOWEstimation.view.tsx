import AddIcon from '@material-ui/icons/Add'
import ClearIcon from '@material-ui/icons/Clear'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import SyncIcon from '@mui/icons-material/Sync'
import {
  Accordion,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  Stack,
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
  sowAddButtonSx,
  sowRemoveButtonSx,
  taskListContainer,
  teamReviewBoxSx
} from 'src/views/project-sow/ProjectSOW.style'
import {
  calculateTotalHoursForAllSOWs,
  calculateTotalInternalCostForAllSOWs,
  TProjectSOWEstimationFormViewProps
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
    taskList,
    handleUpdateTaskCheckUnCheckForSOWOnChange,
    handleUpdateTaskCheckUnCheckForDeliverablesOnChange,
    handleUpdateTaskEstimateHoursOnChange,
    handleUpdateTaskCheckUnCheckForTaskOnChange,
    handleUpdateTaskCheckUnCheckForParentTaskOnChange,
    handleUpdateTaskAssignOnChange,
    handleUpdateTaskCheckUnCheckForServiceOnChange,
    serviceTaskModalOpen,
    handleTaskInputChange,
    handleAddNewTask,
    handleTaskMultipleInputChange,
    handleRemoveTask,
    handleTaskSaveOnClick,
    handleTaskOnClear,
    handleTaskOnEdit,
    handleServiceTaskModalClose,
    taskEditId,
    taskFormData,
    additionalServiceData,
    deliverableData,
    phaseData,
    scopeOfWorkData,
    handleGenerateTaskWithAI
  } = props

  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ ...formTitleSx, mt: 0 }}>Estimation - {projectSOWFormData?.projectName}</Box>

        <Accordion sx={teamReviewBoxSx} defaultExpanded={true}>
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

        <Accordion sx={teamReviewBoxSx} defaultExpanded={true}>
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

        <Accordion sx={teamReviewBoxSx} defaultExpanded={true}>
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
        <Accordion sx={teamReviewBoxSx} defaultExpanded={true}>
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
        <Accordion sx={teamReviewBoxSx} defaultExpanded={true}>
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
                        {phaseData
                          ?.filter((phase: any) => !phase?.additionalServiceId)
                          ?.map((phase: any, index: number) => {
                            return (
                              <>
                                <TableRow key={phase.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                  <TableCell scope='row'>
                                    <Checkbox value={phase?.id} checked={phase?.isChecked} disabled />
                                  </TableCell>
                                  <TableCell align='right'>
                                    <Box className={`item-type-common item-type-phase item-type-hive`}>Phase</Box>
                                  </TableCell>
                                  <TableCell align='left'>
                                    <Box
                                      className='md-editor-preview'
                                      dangerouslySetInnerHTML={{ __html: phase?.title }}
                                    ></Box>
                                  </TableCell>
                                  <TableCell></TableCell>
                                  <TableCell align='center' className={'estimated-hours-sec item-type-phase'}>
                                    {/* {calculateTotalHoursForScopeOfWorks(phase)}h */}
                                  </TableCell>
                                  <TableCell></TableCell>
                                  <TableCell align='center' className={'item-type-phase'}>
                                    {/* ${calculateTotalInternalCostForScopeOfWorks(phase)} */}
                                  </TableCell>
                                  <TableCell align='center' className={'item-type-phase'}>
                                    $0.00
                                  </TableCell>
                                </TableRow>
                                <>
                                  {scopeOfWorkData
                                    ?.filter((sow: any) => sow?.phaseId == phase?.id)
                                    ?.map((scopeOfWork: any, index: number) => {
                                      return (
                                        <>
                                          <TableRow
                                            key={scopeOfWork.name}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                          >
                                            <TableCell scope='row'>
                                              <Checkbox
                                                value={scopeOfWork?.id}
                                                checked={scopeOfWork?.isChecked}
                                                disabled
                                              />
                                            </TableCell>
                                            <TableCell align='right'>
                                              <Box className={`item-type-common item-type-sow  item-type-hive`}>
                                                SOW
                                              </Box>
                                            </TableCell>
                                            <TableCell align='left'>
                                              <Box
                                                className='md-editor-preview'
                                                dangerouslySetInnerHTML={{ __html: scopeOfWork?.title }}
                                              ></Box>
                                            </TableCell>
                                            <TableCell></TableCell>
                                            <TableCell align='center' className={'estimated-hours-sec item-type-sow'}>
                                              {/* {calculateTotalHoursForScopeOfWorks(scopeOfWork)}h */}
                                            </TableCell>
                                            <TableCell></TableCell>
                                            <TableCell align='center' className={'item-type-sow'}>
                                              {/* ${calculateTotalInternalCostForScopeOfWorks(scopeOfWork)} */}
                                            </TableCell>
                                            <TableCell align='center' className={'item-type-sow'}>
                                              $0.00
                                            </TableCell>
                                          </TableRow>
                                          {deliverableData
                                            ?.filter(
                                              (deliverable: any) => deliverable?.scopeOfWorkId == scopeOfWork?.id
                                            )
                                            ?.map((deliverable: any, deliverableIndex: number) => {
                                              return (
                                                <>
                                                  <TableRow
                                                    key={deliverableIndex}
                                                    className='task-item'
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                  >
                                                    <TableCell scope='row'>
                                                      <Checkbox
                                                        value={deliverable?.['id']}
                                                        checked={deliverable?.isChecked}
                                                        disabled
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
                                                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <Box
                                                          className='md-editor-preview'
                                                          dangerouslySetInnerHTML={{ __html: deliverable?.title }}
                                                        ></Box>
                                                        <Button
                                                          className='common-task-list-item-btn'
                                                          onClick={() => handleGenerateTaskWithAI(deliverable?.id)}
                                                          disabled={deliverable?.['isPreloading']}
                                                        >
                                                          <SyncIcon />
                                                        </Button>
                                                        {deliverable?.['isPreloading'] && (
                                                          <Stack spacing={0} sx={{ height: '10px', width: '10px' }}>
                                                            <CircularProgress color='secondary' size={14} />
                                                          </Stack>
                                                        )}
                                                      </Box>
                                                    </TableCell>
                                                    <TableCell></TableCell>
                                                    <TableCell
                                                      align='center'
                                                      className={'estimated-hours-sec item-type-deliverable'}
                                                    >
                                                      {/* {calculateTotalHoursForDeliverable(deliverable)}h */}
                                                      {taskList
                                                        ?.reduce((acc: number, task: any) => {
                                                          if (
                                                            task?.isChecked &&
                                                            task?.deliverableId == deliverable?.id
                                                          ) {
                                                            return acc + Number(task?.estimateHours)
                                                          } else {
                                                            return acc + 0
                                                          }
                                                        }, 0)
                                                        .toFixed(2)}
                                                    </TableCell>
                                                    <TableCell></TableCell>
                                                    <TableCell align='center' className={'item-type-deliverable'}>
                                                      {/* ${calculateTotalInternalCostForDeliverable(deliverable)} */}
                                                      {taskList?.length &&
                                                        `$${taskList
                                                          ?.reduce((acc: number, task: any) => {
                                                            if (
                                                              task?.isChecked &&
                                                              task?.deliverableId == deliverable?.id
                                                            ) {
                                                              return (
                                                                acc +
                                                                Number(task?.estimateHours ?? 0) *
                                                                  Number(task?.associate?.hourlyRate ?? 0)
                                                              )
                                                            } else {
                                                              return acc + 0
                                                            }
                                                          }, 0)
                                                          .toFixed(2)}`}
                                                    </TableCell>
                                                    <TableCell align='center' className={'item-type-deliverable'}>
                                                      $0.00
                                                    </TableCell>
                                                  </TableRow>
                                                  {taskList
                                                    ?.filter((task: any) => task?.deliverableId == deliverable?.id)
                                                    ?.map((task: any, taskIndex: number) => {
                                                      const subtasks = taskList?.filter(
                                                        (subtask: any) => subtask?.estimationTasksParentId == task?.id
                                                      )

                                                      return (
                                                        <>
                                                          <TableRow
                                                            key={taskIndex}
                                                            className={'task-item'}
                                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                          >
                                                            <TableCell scope='row'>
                                                              <Checkbox
                                                                onChange={() => {
                                                                  !subtasks?.length
                                                                    ? handleUpdateTaskCheckUnCheckForTaskOnChange(
                                                                        task?.['id'],
                                                                        !task?.['isChecked']
                                                                      )
                                                                    : handleUpdateTaskCheckUnCheckForParentTaskOnChange(
                                                                        subtasks,
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
                                                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                <Box
                                                                  className='md-editor-preview'
                                                                  dangerouslySetInnerHTML={{
                                                                    __html: task?.title
                                                                  }}
                                                                ></Box>
                                                                <Button
                                                                  className='common-task-list-item-btn'
                                                                  onClick={() => handleTaskOnEdit(task)}
                                                                >
                                                                  <EditIcon />
                                                                </Button>
                                                              </Box>
                                                            </TableCell>
                                                            <TableCell>
                                                              {!!task?.['isChecked'] && !subtasks?.length && (
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
                                                              className={subtasks?.length ? 'item-type-task' : ''}
                                                            >
                                                              {!!task?.['isChecked'] && !subtasks?.length ? (
                                                                <TextField
                                                                  className={'common-task-list-item-text-input'}
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
                                                                subtasks
                                                                  ?.reduce((acc: number, subTask: any) => {
                                                                    if (subTask?.isChecked) {
                                                                      return acc + Number(subTask?.estimateHours)
                                                                    } else {
                                                                      return acc + 0
                                                                    }
                                                                  }, 0)
                                                                  .toFixed(2)
                                                              )}
                                                            </TableCell>
                                                            <TableCell></TableCell>
                                                            <TableCell
                                                              align='center'
                                                              className={subtasks?.length ? 'item-type-task' : ''}
                                                            >
                                                              {!!task?.['isChecked'] && subtasks?.length
                                                                ? `$${subtasks
                                                                    ?.reduce((acc: number, subTask: any) => {
                                                                      if (subTask?.isChecked) {
                                                                        return (
                                                                          acc +
                                                                          Number(subTask?.estimateHours ?? 0) *
                                                                            Number(subTask?.associate?.hourlyRate ?? 0)
                                                                        )
                                                                      } else {
                                                                        return acc + 0
                                                                      }
                                                                    }, 0)
                                                                    .toFixed(2)}`
                                                                : Number(task?.estimateHours ?? 0) *
                                                                  Number(task?.associate?.hourlyRate ?? 0)}
                                                            </TableCell>
                                                            <TableCell
                                                              align='center'
                                                              className={subtasks?.length ? 'item-type-task' : ''}
                                                            >
                                                              {!!task?.['isChecked'] && `$0.00`}
                                                            </TableCell>
                                                          </TableRow>
                                                          {subtasks?.map((subTask: any, subTaskIndex: number) => {
                                                            return (
                                                              <TableRow
                                                                key={subTaskIndex}
                                                                className={'task-item'}
                                                                sx={{
                                                                  '&:last-child td, &:last-child th': { border: 0 }
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
                                                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                    <Box
                                                                      className='md-editor-preview'
                                                                      dangerouslySetInnerHTML={{
                                                                        __html: subTask?.title
                                                                      }}
                                                                    ></Box>

                                                                    <Button
                                                                      className='common-task-list-item-btn'
                                                                      onClick={() => handleTaskOnEdit(subTask)}
                                                                    >
                                                                      <EditIcon />
                                                                    </Button>
                                                                  </Box>
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
                                                                        className={'common-task-list-item-text-input'}
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
                                                                  {!!subTask?.['isChecked'] &&
                                                                    `$${(
                                                                      Number(subTask?.associate?.hourlyRate ?? 0) *
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
                                            })}
                                        </>
                                      )
                                    })}
                                </>
                              </>
                            )
                          })}
                      </TableBody>
                      <TableFooter>
                        <TableRow sx={{ fontWeight: 'bold', fontSize: '16px' }}>
                          <TableCell colSpan={3}></TableCell>
                          <TableCell align='right'>Total</TableCell>
                          <TableCell align='center'>
                            {calculateTotalHoursForAllSOWs(
                              taskList?.filter((task: any) => !task?.additionalServiceId && task?.isChecked)
                            )}
                          </TableCell>
                          <TableCell align='center'></TableCell>
                          <TableCell align='center'>
                            $
                            {calculateTotalInternalCostForAllSOWs(
                              taskList?.filter((task: any) => !task?.additionalServiceId && task?.isChecked)
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

        <Accordion sx={teamReviewBoxSx} defaultExpanded={true}>
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
                {additionalServiceData?.map((additionalService: any, additionalServiceIndex: number) => {
                  return (
                    <Box key={additionalServiceIndex}>
                      <Box sx={sectionSubTitleSx} component={'label'}>
                        <Checkbox value={true} checked={true} sx={{ p: 0, mr: 2 }} disabled />
                        {additionalService?.service_info?.name}
                      </Box>
                      <Box sx={{ ...taskListContainer }}>
                        <Box sx={{ width: '100%' }}>
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
                                {phaseData
                                  ?.filter((phase: any) => phase?.additionalServiceId)
                                  ?.map((phase: any, index: number) => {
                                    return (
                                      <>
                                        <TableRow
                                          key={phase.name}
                                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                          <TableCell scope='row'>
                                            <Checkbox value={phase?.id} checked={phase?.isChecked} disabled />
                                          </TableCell>
                                          <TableCell align='right'>
                                            <Box className={`item-type-common item-type-phase item-type-hive`}>
                                              Phase
                                            </Box>
                                          </TableCell>
                                          <TableCell align='left'>
                                            <Box
                                              className='md-editor-preview'
                                              dangerouslySetInnerHTML={{ __html: phase?.title }}
                                            ></Box>
                                          </TableCell>
                                          <TableCell></TableCell>
                                          <TableCell align='center' className={'estimated-hours-sec item-type-phase'}>
                                            {/* {calculateTotalHoursForScopeOfWorks(phase)}h */}
                                          </TableCell>
                                          <TableCell></TableCell>
                                          <TableCell align='center' className={'item-type-phase'}>
                                            {/* ${calculateTotalInternalCostForScopeOfWorks(phase)} */}
                                          </TableCell>
                                          <TableCell align='center' className={'item-type-phase'}>
                                            $0.00
                                          </TableCell>
                                        </TableRow>
                                        <>
                                          {scopeOfWorkData
                                            ?.filter((sow: any) => sow?.phaseId == phase?.id)
                                            ?.map((scopeOfWork: any, index: number) => {
                                              return (
                                                <>
                                                  <TableRow
                                                    key={scopeOfWork.name}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                  >
                                                    <TableCell scope='row'>
                                                      <Checkbox
                                                        value={scopeOfWork?.id}
                                                        checked={scopeOfWork?.isChecked}
                                                        disabled
                                                      />
                                                    </TableCell>
                                                    <TableCell align='right'>
                                                      <Box className={`item-type-common item-type-sow  item-type-hive`}>
                                                        SOW
                                                      </Box>
                                                    </TableCell>
                                                    <TableCell align='left'>
                                                      <Box
                                                        className='md-editor-preview'
                                                        dangerouslySetInnerHTML={{ __html: scopeOfWork?.title }}
                                                      ></Box>
                                                    </TableCell>
                                                    <TableCell></TableCell>
                                                    <TableCell
                                                      align='center'
                                                      className={'estimated-hours-sec item-type-sow'}
                                                    >
                                                      {/* {calculateTotalHoursForScopeOfWorks(scopeOfWork)}h */}
                                                    </TableCell>
                                                    <TableCell></TableCell>
                                                    <TableCell align='center' className={'item-type-sow'}>
                                                      {/* ${calculateTotalInternalCostForScopeOfWorks(scopeOfWork)} */}
                                                    </TableCell>
                                                    <TableCell align='center' className={'item-type-sow'}>
                                                      $0.00
                                                    </TableCell>
                                                  </TableRow>
                                                  {deliverableData
                                                    ?.filter(
                                                      (deliverable: any) =>
                                                        deliverable?.scopeOfWorkId == scopeOfWork?.id
                                                    )
                                                    ?.map((deliverable: any, deliverableIndex: number) => {
                                                      return (
                                                        <>
                                                          <TableRow
                                                            key={deliverableIndex}
                                                            className='task-item'
                                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                          >
                                                            <TableCell scope='row'>
                                                              <Checkbox
                                                                value={deliverable?.['id']}
                                                                checked={deliverable?.isChecked}
                                                                disabled
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
                                                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                <Box
                                                                  className='md-editor-preview'
                                                                  dangerouslySetInnerHTML={{
                                                                    __html: deliverable?.title
                                                                  }}
                                                                ></Box>
                                                                <Button
                                                                  className='common-task-list-item-btn'
                                                                  onClick={() =>
                                                                    handleGenerateTaskWithAI(deliverable?.id)
                                                                  }
                                                                  disabled={deliverable?.['isPreloading']}
                                                                >
                                                                  <SyncIcon />
                                                                </Button>
                                                                {deliverable?.['isPreloading'] && (
                                                                  <Stack
                                                                    spacing={0}
                                                                    sx={{ height: '10px', width: '10px' }}
                                                                  >
                                                                    <CircularProgress color='secondary' size={14} />
                                                                  </Stack>
                                                                )}
                                                              </Box>
                                                            </TableCell>
                                                            <TableCell></TableCell>
                                                            <TableCell
                                                              align='center'
                                                              className={'estimated-hours-sec item-type-deliverable'}
                                                            >
                                                              {/* {calculateTotalHoursForDeliverable(deliverable)}h */}
                                                              {taskList
                                                                ?.reduce((acc: number, task: any) => {
                                                                  if (
                                                                    task?.isChecked &&
                                                                    task?.deliverableId == deliverable?.id
                                                                  ) {
                                                                    return acc + Number(task?.estimateHours)
                                                                  } else {
                                                                    return acc + 0
                                                                  }
                                                                }, 0)
                                                                .toFixed(2)}
                                                            </TableCell>
                                                            <TableCell></TableCell>
                                                            <TableCell
                                                              align='center'
                                                              className={'item-type-deliverable'}
                                                            >
                                                              {/* ${calculateTotalInternalCostForDeliverable(deliverable)} */}
                                                              {taskList?.length &&
                                                                `$${taskList
                                                                  ?.reduce((acc: number, task: any) => {
                                                                    if (
                                                                      task?.isChecked &&
                                                                      task?.deliverableId == deliverable?.id
                                                                    ) {
                                                                      return (
                                                                        acc +
                                                                        Number(task?.estimateHours ?? 0) *
                                                                          Number(task?.associate?.hourlyRate ?? 0)
                                                                      )
                                                                    } else {
                                                                      return acc + 0
                                                                    }
                                                                  }, 0)
                                                                  .toFixed(2)}`}
                                                            </TableCell>
                                                            <TableCell
                                                              align='center'
                                                              className={'item-type-deliverable'}
                                                            >
                                                              $0.00
                                                            </TableCell>
                                                          </TableRow>
                                                          {taskList
                                                            ?.filter(
                                                              (task: any) => task?.deliverableId == deliverable?.id
                                                            )
                                                            ?.map((task: any, taskIndex: number) => {
                                                              const subtasks = taskList?.filter(
                                                                (subtask: any) =>
                                                                  subtask?.estimationTasksParentId == task?.id
                                                              )

                                                              return (
                                                                <>
                                                                  <TableRow
                                                                    key={taskIndex}
                                                                    className={'task-item'}
                                                                    sx={{
                                                                      '&:last-child td, &:last-child th': { border: 0 }
                                                                    }}
                                                                  >
                                                                    <TableCell scope='row'>
                                                                      <Checkbox
                                                                        onChange={() => {
                                                                          !subtasks?.length
                                                                            ? handleUpdateTaskCheckUnCheckForTaskOnChange(
                                                                                task?.['id'],
                                                                                !task?.['isChecked']
                                                                              )
                                                                            : handleUpdateTaskCheckUnCheckForParentTaskOnChange(
                                                                                subtasks,
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
                                                                        sx={{ display: 'flex', alignItems: 'center' }}
                                                                      >
                                                                        <Box
                                                                          className='md-editor-preview'
                                                                          dangerouslySetInnerHTML={{
                                                                            __html: task?.title
                                                                          }}
                                                                        ></Box>
                                                                        <Button
                                                                          className='common-task-list-item-btn'
                                                                          onClick={() => handleTaskOnEdit(task)}
                                                                        >
                                                                          <EditIcon />
                                                                        </Button>
                                                                      </Box>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                      {!!task?.['isChecked'] && !subtasks?.length && (
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
                                                                      className={
                                                                        subtasks?.length ? 'item-type-task' : ''
                                                                      }
                                                                    >
                                                                      {!!task?.['isChecked'] && !subtasks?.length ? (
                                                                        <TextField
                                                                          className={'common-task-list-item-text-input'}
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
                                                                        subtasks
                                                                          ?.reduce((acc: number, subTask: any) => {
                                                                            if (subTask?.isChecked) {
                                                                              return (
                                                                                acc + Number(subTask?.estimateHours)
                                                                              )
                                                                            } else {
                                                                              return acc + 0
                                                                            }
                                                                          }, 0)
                                                                          .toFixed(2)
                                                                      )}
                                                                    </TableCell>
                                                                    <TableCell></TableCell>
                                                                    <TableCell
                                                                      align='center'
                                                                      className={
                                                                        subtasks?.length ? 'item-type-task' : ''
                                                                      }
                                                                    >
                                                                      {!!task?.['isChecked'] && subtasks?.length
                                                                        ? `$${subtasks
                                                                            ?.reduce((acc: number, subTask: any) => {
                                                                              if (subTask?.isChecked) {
                                                                                return (
                                                                                  acc +
                                                                                  Number(subTask?.estimateHours ?? 0) *
                                                                                    Number(
                                                                                      subTask?.associate?.hourlyRate ??
                                                                                        0
                                                                                    )
                                                                                )
                                                                              } else {
                                                                                return acc + 0
                                                                              }
                                                                            }, 0)
                                                                            .toFixed(2)}`
                                                                        : Number(task?.estimateHours ?? 0) *
                                                                          Number(task?.associate?.hourlyRate ?? 0)}
                                                                    </TableCell>
                                                                    <TableCell
                                                                      align='center'
                                                                      className={
                                                                        subtasks?.length ? 'item-type-task' : ''
                                                                      }
                                                                    >
                                                                      {!!task?.['isChecked'] && `$0.00`}
                                                                    </TableCell>
                                                                  </TableRow>
                                                                  {subtasks?.map(
                                                                    (subTask: any, subTaskIndex: number) => {
                                                                      return (
                                                                        <TableRow
                                                                          key={subTaskIndex}
                                                                          className={'task-item'}
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
                                                                              sx={{
                                                                                display: 'flex',
                                                                                alignItems: 'center'
                                                                              }}
                                                                            >
                                                                              <Box
                                                                                className='md-editor-preview'
                                                                                dangerouslySetInnerHTML={{
                                                                                  __html: subTask?.title
                                                                                }}
                                                                              ></Box>

                                                                              <Button
                                                                                className='common-task-list-item-btn'
                                                                                onClick={() =>
                                                                                  handleTaskOnEdit(subTask)
                                                                                }
                                                                              >
                                                                                <EditIcon />
                                                                              </Button>
                                                                            </Box>
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
                                                                                  <MenuItem
                                                                                    value={item?.id}
                                                                                    key={item?.id}
                                                                                  >
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
                                                                                  className={
                                                                                    'common-task-list-item-text-input'
                                                                                  }
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
                                                                            {!!subTask?.['isChecked'] &&
                                                                              `$${(
                                                                                Number(
                                                                                  subTask?.associate?.hourlyRate ?? 0
                                                                                ) * Number(subTask?.estimateHours)
                                                                              ).toFixed(2)}`}
                                                                          </TableCell>
                                                                          <TableCell align='center'>
                                                                            {!!task?.['isChecked'] && `$0.00`}
                                                                          </TableCell>
                                                                        </TableRow>
                                                                      )
                                                                    }
                                                                  )}
                                                                </>
                                                              )
                                                            })}
                                                        </>
                                                      )
                                                    })}
                                                </>
                                              )
                                            })}
                                        </>
                                      </>
                                    )
                                  })}
                              </TableBody>
                              <TableFooter>
                                <TableRow sx={{ fontWeight: 'bold', fontSize: '16px' }}>
                                  <TableCell colSpan={3}></TableCell>
                                  <TableCell align='right'>Total</TableCell>
                                  <TableCell align='center'>
                                    {calculateTotalHoursForAllSOWs(
                                      taskList?.filter((task: any) => task?.additionalServiceId && task?.isChecked)
                                    )}
                                  </TableCell>
                                  <TableCell align='center'></TableCell>
                                  <TableCell align='center'>
                                    $
                                    {calculateTotalInternalCostForAllSOWs(
                                      taskList?.filter((task: any) => task?.additionalServiceId && task?.isChecked)
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
                        {calculateTotalHoursForAllSOWs(taskList?.filter((task: any) => task?.isChecked))}
                      </TableCell>
                      <TableCell align='center'></TableCell>
                      <TableCell align='center'>
                        {calculateTotalInternalCostForAllSOWs(taskList?.filter((task: any) => task?.isChecked))}
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
      <Modal
        open={serviceTaskModalOpen}
        onClose={handleServiceTaskModalClose}
        aria-labelledby='service-task-modal-title'
        aria-describedby='service-task-modal-description'
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
            <h2 id='service-task-modal-title' className='my-6 text-xl font-semibold text-gray-700 dark:text-gray-200'>
              {taskEditId ? 'Update' : 'Add'} Task
            </h2>
          </Box>
          <form>
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 5, mb: 5 }}>
              {!taskEditId && (
                <Box
                  sx={{
                    width: '100%',
                    '& .MuiInputBase-root': {
                      border: errorMessage?.['serviceId'] ? '1px solid #dc2626' : ''
                    }
                  }}
                ></Box>
              )}

              {taskEditId ? (
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
                        value={taskFormData?.title}
                        onChange={handleTaskInputChange}
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
                    Task
                    <Box
                      sx={sowAddButtonSx}
                      onClick={() => {
                        handleAddNewTask()
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
                    {taskFormData?.tasks?.map((task: any, index: number) => {
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
                              value={task?.title}
                              onChange={e => {
                                handleTaskMultipleInputChange(e, index)
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
                              value={task?.serial}
                              onChange={e => {
                                handleTaskMultipleInputChange(e, index)
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
                                handleRemoveTask(index)
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
                  handleServiceTaskModalClose()
                }}
                type='button'
                className='px-4 py-2 mr-3 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-red-600 border border-transparent rounded-lg active:bg-red-600 hover:bg-red-700 focus:outline-none focus:shadow-outline-red'
              >
                <ClearIcon /> Cancel
              </button>
              <button
                type='button'
                onClick={() => {
                  handleTaskSaveOnClick()
                }}
                className='px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-green-600 border border-transparent rounded-lg active:bg-green-600 hover:bg-green-700 focus:outline-none focus:shadow-outline-green'
              >
                <AddIcon />
                {taskEditId ? 'Update' : 'Save'}
              </button>
            </Box>
          </form>
        </Box>
      </Modal>
    </Box>
  )
}
