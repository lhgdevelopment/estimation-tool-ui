import ClearIcon from '@material-ui/icons/Clear'
import AddIcon from '@mui/icons-material/Add'
import BrowserUpdatedIcon from '@mui/icons-material/BrowserUpdated'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import EditNoteIcon from '@mui/icons-material/EditNote'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove'
import { Box, Button, Checkbox, Modal } from '@mui/material'
import { TreeItem } from '@mui/x-tree-view/TreeItem'
import { TreeView } from '@mui/x-tree-view/TreeView'
import dynamic from 'next/dynamic'
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Dropdown, ServiceDropdownTree } from 'src/@core/components/dropdown'
import Preloader from 'src/@core/components/preloader'
import { RootState } from 'src/@core/store/reducers'
import apiRequest from 'src/@core/utils/axios-config'
import Swal from 'sweetalert2'

enum EServiceFormType {
  'SERVICE' = 'SERVICE',
  'GROUP' = 'GROUP',
  'SOW' = 'SOW',
  'DELIVARABLE' = 'DELIVARABLE',
  'TASK' = 'TASK'
}
export default function ServiceTreeComponent() {
  const [listData, setListData] = useState<any>([])
  const [serviceModalOpen, setServiceModalOpen] = useState(false)
  const handleServiceModalOpen = () => setServiceModalOpen(true)
  const handleServiceModalClose = () => setServiceModalOpen(false)
  const [formType, setFormType] = useState<EServiceFormType>()

  const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false })
  const isDark = useSelector((state: RootState) => state.theme.isDark)
  const nameEditorRef = useRef(null)

  const [serviceEditDataId, setServiceEditDataId] = useState<null | string>(null)
  const [serviceGroupEditDataId, setServiceGroupEditDataId] = useState<null | string>(null)
  const [serviceSOWEditDataId, setServiceSOWEditDataId] = useState<null | string>(null)
  const [serviceDeliverableEditDataId, setServiceDeliverableEditDataId] = useState<null | string>(null)
  const [serviceTaskEditDataId, setServiceTaskEditDataId] = useState<null | string>(null)
  const [errorMessage, setErrorMessage] = useState<any>({})

  const serviceDefaultData = {
    name: '',
    order: '',
    projectTypeId: ''
  }
  const serviceGroupDefaultData = {
    serviceId: '',
    name: '',
    order: '',
    names: ['']
  }

  const serviceSOWDefaultData = {
    serviceGroupId: '',
    name: '',
    order: '',
    names: ['']
  }

  const serviceDeliverableDefaultData = {
    serviceScopeId: '',
    name: '',
    order: '',
    names: ['']
  }

  const serviceTaskDefaultData = {
    tasks: [
      {
        name: '',
        cost: '',
        description: ''
      }
    ],
    name: '',
    order: '',
    cost: '',
    description: '',
    serviceDeliverableId: '',
    parentTaskId: ''
  }

  const [serviceFormData, setServiceFormData] = useState(serviceDefaultData)
  const [serviceGroupFormData, setServiceGroupFormData] = useState(serviceGroupDefaultData)
  const [serviceSOWFormData, setServiceSOWFormData] = useState(serviceSOWDefaultData)
  const [serviceDeliverableFormData, setServiceDeliverableFormData] = useState(serviceDeliverableDefaultData)
  const [serviceTaskFormData, setServiceTaskFormData] = useState(serviceTaskDefaultData)

  const [isPullingTaskFromClickup, setIsPullingTaskFromClickup] = useState(false)
  const [isFatchFromClickUp, setIsFatchFromClickUp] = useState(false)
  const [clickupLink, setClickupLink] = useState('')
  const [clickupTaskList, setClickupTaskList] = useState<any[]>([])

  const handleReachText = (value: string, field: string, formData: any, setFormData: Dispatch<SetStateAction<any>>) => {
    setFormData({
      ...formData,
      [field]: value
    })
  }

  const handleMultipleNameReachText = (
    value: string,
    field: string,
    index = -1,
    formData: any,
    setFormData: Dispatch<SetStateAction<any>>
  ) => {
    if (index != -1) {
      const names = [...formData.names]
      names[index] = value
      setFormData({
        ...formData,
        names: names
      })
    } else {
      setFormData({
        ...formData,
        [field]: value
      })
    }
  }

  const handleMultipleTaskReachText = (value: string, field: string, index = -1) => {
    if (index !== -1) {
      const tasks: any = [...serviceTaskFormData.tasks]
      if (typeof tasks[index] === 'object') {
        tasks[index][field] = value
        setServiceTaskFormData({
          ...serviceTaskFormData,
          tasks: [...tasks]
        })
      }
    } else {
      setServiceTaskFormData({
        ...serviceTaskFormData,
        [field]: value
      })
    }
  }

  const handleChange = (e: React.ChangeEvent<any>, formData: any, setFormData: Dispatch<SetStateAction<any>>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleTaskMultipleTextChange = (e: React.ChangeEvent<any>, index = -1) => {
    const { name, value } = e.target

    if (index != -1) {
      const tasks: any = [...serviceTaskFormData.tasks]
      if (typeof tasks[index] === 'object') {
        tasks[index][name] = value
        setServiceTaskFormData({
          ...serviceTaskFormData,
          tasks: [...tasks]
        })
      }
    } else {
      setServiceTaskFormData({
        ...serviceTaskFormData,
        [name]: value
      })
    }
  }

  const handleSelectChange = (e: any, formData: any, setFormData: Dispatch<SetStateAction<any>>) => {
    setFormData({
      ...formData,
      [e?.target?.name]: e?.target?.value
    })
  }

  const addNameField = (formData: any, setFormData: Dispatch<SetStateAction<any>>) => {
    setFormData({
      ...formData,
      names: [...formData.names, '']
    })
  }

  const removeNameField = (index: number, formData: any, setFormData: Dispatch<SetStateAction<any>>) => {
    const names = [...formData.names]
    names.splice(index, 1)
    setFormData({
      ...formData,
      names: names
    })
  }

  const handleServiceEditButton = (e: any, data: any, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    console.log(data)

    setServiceFormData({
      name: data?.['name'],
      order: data?.['order'],
      projectTypeId: data?.['projectTypeId']
    })
    setServiceEditDataId(id)
    handleServiceModalOpen()
    setFormType(EServiceFormType.SERVICE)
  }

  const handleServiceGroupEditButton = (e: any, data: any, id: string) => {
    e.preventDefault()
    e.stopPropagation()

    setServiceGroupFormData({
      serviceId: data?.serviceId || '',
      name: data?.name || '',
      order: data?.order,
      names: data?.names || ['']
    })
    setServiceGroupEditDataId(id)
    handleServiceModalOpen()
    setFormType(EServiceFormType.GROUP)
  }

  const handleServiceSOWEditButton = (e: any, data: any, id: string) => {
    e.preventDefault()
    e.stopPropagation()

    setServiceSOWFormData({
      serviceGroupId: data?.serviceGroupId || '',
      name: data?.name || '',
      order: data?.order,
      names: data?.names || ['']
    })
    setServiceSOWEditDataId(id)
    handleServiceModalOpen()
    setFormType(EServiceFormType.SOW)
  }

  const handleServiceDeliverableEditButton = (e: any, data: any, id: string) => {
    e.preventDefault()
    e.stopPropagation()

    setServiceDeliverableFormData({
      serviceScopeId: data?.serviceScopeId || '',
      name: data?.name || '',
      order: data?.order,
      names: data?.names || ['']
    })
    setServiceDeliverableEditDataId(id)
    handleServiceModalOpen()
    setFormType(EServiceFormType.DELIVARABLE)
  }

  const handleServiceTaskEditButton = (e: any, data: any, id: string) => {
    e.preventDefault()
    e.stopPropagation()

    setServiceTaskFormData({
      serviceDeliverableId: data?.serviceDeliverableId || '',
      parentTaskId: data?.parentTaskId || '',

      name: data?.name || '',
      order: data?.order,
      cost: data?.cost || '',
      description: data?.description || '',
      tasks: serviceTaskDefaultData.tasks
    })
    setServiceTaskEditDataId(id)
    handleServiceModalOpen()
    setFormType(EServiceFormType.TASK)
  }

  const onServiceSubmit = (e: React.FormEvent<any>) => {
    e.preventDefault()
    if (serviceEditDataId) {
      apiRequest.put(`/services/${serviceEditDataId}`, serviceFormData).then(res => {
        setListData((prevState: []) => {
          const updatedList: any = [...prevState]
          const editedServiceIndex = updatedList.findIndex(
            (item: any) => item['_id'] === serviceEditDataId // Replace 'id' with the actual identifier of your item
          )
          if (editedServiceIndex !== -1) {
            updatedList[editedServiceIndex] = res.data
          }
          Swal.fire({
            title: 'Data Updated Successfully!',
            icon: 'success',
            timer: 1000,
            timerProgressBar: true,
            showConfirmButton: false
          })

          return updatedList
        })
        onServiceClear()
        handleServiceModalClose()
      })
    } else {
      apiRequest.post('/services', serviceFormData).then(res => {
        setListData((prevState: []) => [...prevState, res.data])
        Swal.fire({
          title: 'Data Created Successfully!',
          icon: 'success',
          timer: 1000,
          timerProgressBar: true,
          showConfirmButton: false
        })
        onServiceClear()
        handleServiceModalClose()
      })
    }
  }

  const onServiceGroupSubmit = (e: React.FormEvent<any>) => {
    setErrorMessage({})
    e.preventDefault()
    if (serviceGroupEditDataId) {
      apiRequest
        .put(`/service-groups/${serviceGroupEditDataId}`, serviceGroupFormData)
        .then(res => {
          setListData((prevState: []) => {
            const updatedList: any = [...prevState]
            const editedServiceIndex = updatedList.findIndex(
              (item: any) => item['_id'] === serviceGroupEditDataId // Replace 'id' with the actual identifier of your item
            )
            if (editedServiceIndex !== -1) {
              updatedList[editedServiceIndex] = res.data
            }
            Swal.fire({
              title: 'Data Updated Successfully!',
              icon: 'success',
              timer: 1000,
              timerProgressBar: true,
              showConfirmButton: false
            })

            return updatedList
          })
          onServiceGroupClear()
        })
        .catch(error => {
          setErrorMessage(error?.response?.data?.errors)
        })
    } else {
      apiRequest
        .post('/service-groups', serviceGroupFormData)
        .then(res => {
          setListData((prevState: []) => [...prevState, ...res.data])
          Swal.fire({
            title: 'Data Created Successfully!',
            icon: 'success',
            timer: 1000,
            timerProgressBar: true,
            showConfirmButton: false
          })
          onServiceGroupClear()
        })
        .catch(error => {
          setErrorMessage(error?.response?.data?.errors)
        })
    }
  }

  const onServiceSOWSubmit = (e: React.FormEvent<any>) => {
    setErrorMessage({})
    e.preventDefault()
    if (serviceSOWEditDataId) {
      apiRequest
        .put(`/service-scopes/${serviceSOWEditDataId}`, serviceSOWFormData)
        .then(res => {
          setListData((prevState: []) => {
            const updatedList: any = [...prevState]
            const editedServiceIndex = updatedList.findIndex(
              (item: any) => item['_id'] === serviceSOWEditDataId // Replace 'id' with the actual identifier of your item
            )
            if (editedServiceIndex !== -1) {
              updatedList[editedServiceIndex] = res.data
            }
            Swal.fire({
              title: 'Data Updated Successfully!',
              icon: 'success',
              timer: 1000,
              timerProgressBar: true,
              showConfirmButton: false
            })

            return updatedList
          })
          onServiceSOWClear()
        })
        .catch(error => {
          setErrorMessage(error?.response?.data?.errors)
        })
    } else {
      apiRequest
        .post('/service-scopes', serviceSOWFormData)
        .then(res => {
          setListData((prevState: []) => [...prevState, ...res.data])
          Swal.fire({
            title: 'Data Created Successfully!',
            icon: 'success',
            timer: 1000,
            timerProgressBar: true,
            showConfirmButton: false
          })
          onServiceSOWClear()
        })
        .catch(error => {
          setErrorMessage(error?.response?.data?.errors)
        })
    }
  }

  const onServiceDeliverableSubmit = (e: React.FormEvent<any>) => {
    setErrorMessage({})
    e.preventDefault()
    if (serviceDeliverableEditDataId) {
      apiRequest
        .put(`/service-deliverables/${serviceDeliverableEditDataId}`, serviceDeliverableFormData)
        .then(res => {
          setListData((prevState: []) => {
            const updatedList: any = [...prevState]
            const editedServiceIndex = updatedList.findIndex(
              (item: any) => item['_id'] === serviceDeliverableEditDataId // Replace 'id' with the actual identifier of your item
            )
            if (editedServiceIndex !== -1) {
              updatedList[editedServiceIndex] = res.data
            }
            Swal.fire({
              title: 'Data Updated Successfully!',
              icon: 'success',
              timer: 1000,
              timerProgressBar: true,
              showConfirmButton: false
            })

            return updatedList
          })
          onServiceDeliverableClear()
        })
        .catch(error => {
          setErrorMessage(error?.response?.data?.errors)
        })
    } else {
      apiRequest
        .post('/service-deliverables', serviceDeliverableFormData)
        .then(res => {
          setListData((prevState: []) => [...prevState, ...res.data])
          Swal.fire({
            title: 'Data Created Successfully!',
            icon: 'success',
            timer: 1000,
            timerProgressBar: true,
            showConfirmButton: false
          })
          onServiceDeliverableClear()
        })
        .catch(error => {
          setErrorMessage(error?.response?.data?.errors)
        })
    }
  }

  const addTaskFields = () => {
    if (serviceTaskFormData.tasks?.[0]) {
      setServiceTaskFormData({
        ...serviceTaskFormData,
        tasks: [...serviceTaskFormData.tasks, serviceTaskDefaultData.tasks[0]] // Add an empty string to the tasks array
      })
    } else {
      setServiceTaskFormData({
        ...serviceTaskFormData,
        tasks: serviceTaskDefaultData.tasks
      })
    }
  }

  const removeTasksFields = (index: number) => {
    const tasks = [...serviceTaskFormData.tasks]
    tasks.splice(index, 1)
    setServiceTaskFormData({
      ...serviceTaskFormData,
      tasks: tasks
    })
  }

  const handleFetchTaskFromClickup = () => {
    setIsPullingTaskFromClickup(true)
    const data = {
      clickupLink
    }
    apiRequest
      .post('/clickup/list', data)
      .then(res => {
        setClickupTaskList(res.data)
      })
      .catch(error => {
        setErrorMessage(error?.response?.data?.errors)
      })
  }

  const onServiceTaskSubmit = (e: React.FormEvent<any>) => {
    setErrorMessage({})
    e.preventDefault()
    if (serviceTaskEditDataId) {
      apiRequest
        .put(`/service-deliverable-tasks/${serviceTaskEditDataId}`, serviceTaskFormData)
        .then(res => {
          setListData((prevState: []) => {
            const updatedList: any = [...prevState]
            const editedServiceIndex = updatedList.findIndex(
              (item: any) => item['_id'] === serviceTaskEditDataId // Replace 'id' with the actual identifier of your item
            )
            if (editedServiceIndex !== -1) {
              updatedList[editedServiceIndex] = res.data
            }
            Swal.fire({
              title: 'Data Updated Successfully!',
              icon: 'success',
              timer: 1000,
              timerProgressBar: true,
              showConfirmButton: false
            })

            return updatedList
          })
          onServiceTaskClear()
        })
        .catch(error => {
          setErrorMessage(error?.response?.data?.errors)
        })
    } else {
      apiRequest
        .post('/service-deliverable-tasks', serviceTaskFormData)
        .then(res => {
          apiRequest.get(`/service-deliverable-tasks?page=${1}`).then(res => {
            setListData(res.data)
          })

          Swal.fire({
            title: 'Data Created Successfully!',
            icon: 'success',
            timer: 1000,
            timerProgressBar: true,
            showConfirmButton: false
          })
          onServiceTaskClear()
        })
        .catch(error => {
          setErrorMessage(error?.response?.data?.errors)
        })
    }
  }

  const onServiceClear = () => {
    setServiceFormData(prevState => ({ ...serviceDefaultData }))
    setServiceEditDataId(null)
    handleServiceModalClose()
  }

  const onServiceGroupClear = () => {
    setServiceGroupFormData(prevState => ({ ...serviceGroupDefaultData }))
    setServiceGroupEditDataId(null)
    handleServiceModalClose()
  }

  const onServiceSOWClear = () => {
    setServiceSOWFormData(prevState => ({ ...serviceSOWDefaultData }))
    setServiceSOWEditDataId(null)
    handleServiceModalClose()
  }

  const onServiceDeliverableClear = () => {
    setServiceDeliverableFormData(prevState => ({ ...serviceDeliverableDefaultData }))
    setServiceDeliverableEditDataId(null)
    handleServiceModalClose()
  }

  const onServiceTaskClear = () => {
    setServiceTaskFormData(prevState => ({ ...serviceTaskDefaultData }))
    setServiceTaskEditDataId(null)
    handleServiceModalClose()
  }

  const getList = () => {
    apiRequest.get(`/service-tree?per_page=1000`).then(res => {
      setListData(res.data.services)
    })
  }

  useEffect(() => {
    getList()
  }, [])

  return (
    <>
      <Box className='container px-6 mx-auto'>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box component={'h1'} className='mt-5 mb-4 text-xl font-semibold text-gray-600 dark:text-gray-300'>
            Service
          </Box>
          <Button
            onClick={() => {
              handleServiceModalOpen()
              setFormType(EServiceFormType.SERVICE)
            }}
            sx={{
              fontSize: '12px',
              textTransform: 'none',
              padding: '2px 10px',
              border: '1px solid #9333ea',
              lineHeight: 'normal',
              color: '#9333ea',
              mx: '5px',
              '&:hover': {
                background: '#9333ea',
                color: '#fff'
              }
            }}
          >
            <AddIcon sx={{ fontSize: '18px' }} /> Add Service
          </Button>
        </Box>
        <Box>
          <Box sx={{ flexGrow: 1 }}>
            <TreeView
              aria-label='file system navigator'
              defaultCollapseIcon={<ExpandMoreIcon />}
              defaultExpandIcon={<ChevronRightIcon />}
            >
              {listData?.map((service: any, index: number) => {
                return (
                  <TreeItem
                    nodeId={`service-${index}`}
                    key={index}
                    sx={{ p: 1, my: 1 }}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box dangerouslySetInnerHTML={{ __html: service?.name }}></Box>
                        <Box sx={{ width: '240px' }}>
                          <Button
                            onClick={e => {
                              handleServiceEditButton(e, service, service?.id)
                            }}
                            sx={{
                              minWidth: 'auto',
                              fontSize: '12px',
                              textTransform: 'none',
                              padding: '2px',
                              border: '1px solid #9333ea',
                              lineHeight: 'normal',
                              color: '#9333ea',
                              mx: '5px',
                              '&:hover': {
                                background: '#9333ea',
                                color: '#fff'
                              }
                            }}
                          >
                            <EditIcon sx={{ fontSize: '18px' }} />
                          </Button>
                          <Button
                            onClick={e => {
                              e.preventDefault()
                              e.stopPropagation()
                              handleServiceModalOpen()
                              setFormType(EServiceFormType.GROUP)
                            }}
                            sx={{
                              fontSize: '12px',
                              textTransform: 'none',
                              padding: '2px 10px',
                              border: '1px solid #9333ea',
                              lineHeight: 'normal',
                              color: '#9333ea',
                              mx: '5px',
                              '&:hover': {
                                background: '#9333ea',
                                color: '#fff'
                              }
                            }}
                          >
                            <AddIcon sx={{ fontSize: '18px' }} /> Add Group
                          </Button>
                        </Box>
                      </Box>
                    }
                  >
                    {service?.groups?.map((group: any, groupIndex: number) => {
                      return (
                        <TreeItem
                          nodeId={`group-${index}+${groupIndex}`}
                          key={groupIndex}
                          sx={{ p: 1, my: 1 }}
                          label={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Box dangerouslySetInnerHTML={{ __html: group?.name }}></Box>
                              <Box sx={{ width: '240px' }}>
                                <Button
                                  onClick={e => {
                                    handleServiceGroupEditButton(e, group, group?.id)
                                  }}
                                  sx={{
                                    minWidth: 'auto',
                                    fontSize: '12px',
                                    textTransform: 'none',
                                    padding: '2px',
                                    border: '1px solid #9333ea',
                                    lineHeight: 'normal',
                                    color: '#9333ea',
                                    mx: '5px',
                                    '&:hover': {
                                      background: '#9333ea',
                                      color: '#fff'
                                    }
                                  }}
                                >
                                  <EditIcon sx={{ fontSize: '18px' }} />
                                </Button>
                                <Button
                                  onClick={e => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    handleServiceModalOpen()
                                    setFormType(EServiceFormType.SOW)
                                  }}
                                  sx={{
                                    fontSize: '12px',
                                    textTransform: 'none',
                                    padding: '2px 10px',
                                    border: '1px solid #9333ea',
                                    lineHeight: 'normal',
                                    color: '#9333ea',
                                    mx: '5px',
                                    '&:hover': {
                                      background: '#9333ea',
                                      color: '#fff'
                                    }
                                  }}
                                >
                                  <AddIcon sx={{ fontSize: '18px' }} /> Add SOW
                                </Button>
                              </Box>
                            </Box>
                          }
                        >
                          {group?.sows?.map((sow: any, sowIndex: number) => {
                            return (
                              <TreeItem
                                nodeId={`sow-${groupIndex}+${sowIndex}`}
                                key={sowIndex}
                                sx={{ p: 1, my: 1 }}
                                label={
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Box dangerouslySetInnerHTML={{ __html: sow?.name }}></Box>
                                    <Box sx={{ width: '240px' }}>
                                      <Button
                                        onClick={e => {
                                          handleServiceSOWEditButton(e, sow, sow?.id)
                                        }}
                                        sx={{
                                          minWidth: 'auto',
                                          fontSize: '12px',
                                          textTransform: 'none',
                                          padding: '2px',
                                          border: '1px solid #9333ea',
                                          lineHeight: 'normal',
                                          color: '#9333ea',
                                          mx: '5px',
                                          '&:hover': {
                                            background: '#9333ea',
                                            color: '#fff'
                                          }
                                        }}
                                      >
                                        <EditIcon sx={{ fontSize: '18px' }} />
                                      </Button>
                                      <Button
                                        onClick={e => {
                                          e.preventDefault()
                                          e.stopPropagation()
                                          handleServiceModalOpen()
                                          setFormType(EServiceFormType.DELIVARABLE)
                                        }}
                                        sx={{
                                          fontSize: '12px',
                                          textTransform: 'none',
                                          padding: '2px 10px',
                                          border: '1px solid #9333ea',
                                          lineHeight: 'normal',
                                          color: '#9333ea',
                                          mx: '5px',
                                          '&:hover': {
                                            background: '#9333ea',
                                            color: '#fff'
                                          }
                                        }}
                                      >
                                        <AddIcon sx={{ fontSize: '18px' }} /> Add Deliverable
                                      </Button>
                                    </Box>
                                  </Box>
                                }
                              >
                                {sow?.deliverables?.map((deliverable: any, deliverableIndex: number) => {
                                  return (
                                    <TreeItem
                                      nodeId={`deliverable-${sowIndex}+${deliverableIndex}`}
                                      key={deliverableIndex}
                                      sx={{ p: 1, my: 1 }}
                                      label={
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                          <Box dangerouslySetInnerHTML={{ __html: deliverable?.name }}></Box>
                                          <Box sx={{ width: '240px' }}>
                                            <Button
                                              onClick={e => {
                                                handleServiceDeliverableEditButton(e, deliverable, deliverable?.id)
                                              }}
                                              sx={{
                                                minWidth: 'auto',
                                                fontSize: '12px',
                                                textTransform: 'none',
                                                padding: '2px',
                                                border: '1px solid #9333ea',
                                                lineHeight: 'normal',
                                                color: '#9333ea',
                                                mx: '5px',
                                                '&:hover': {
                                                  background: '#9333ea',
                                                  color: '#fff'
                                                }
                                              }}
                                            >
                                              <EditIcon sx={{ fontSize: '18px' }} />
                                            </Button>
                                            <Button
                                              onClick={e => {
                                                e.preventDefault()
                                                e.stopPropagation()
                                                handleServiceModalOpen()
                                                setFormType(EServiceFormType.TASK)
                                              }}
                                              sx={{
                                                fontSize: '12px',
                                                textTransform: 'none',
                                                padding: '2px 10px',
                                                border: '1px solid #9333ea',
                                                lineHeight: 'normal',
                                                color: '#9333ea',
                                                mx: '5px',
                                                '&:hover': {
                                                  background: '#9333ea',
                                                  color: '#fff'
                                                }
                                              }}
                                            >
                                              <AddIcon sx={{ fontSize: '18px' }} /> Add Task
                                            </Button>
                                          </Box>
                                        </Box>
                                      }
                                    >
                                      {deliverable?.tasks?.map((task: any, taskIndex: number) => {
                                        return (
                                          <TreeItem
                                            nodeId={`task-${deliverableIndex}+${taskIndex}`}
                                            key={taskIndex}
                                            sx={{ p: 1, my: 1 }}
                                            label={
                                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Box dangerouslySetInnerHTML={{ __html: task?.name }}></Box>
                                                <Box sx={{ width: '240px' }}>
                                                  <Button
                                                    onClick={e => {
                                                      handleServiceTaskEditButton(e, task, task?.id)
                                                    }}
                                                    sx={{
                                                      minWidth: 'auto',
                                                      fontSize: '12px',
                                                      textTransform: 'none',
                                                      padding: '2px',
                                                      border: '1px solid #9333ea',
                                                      lineHeight: 'normal',
                                                      color: '#9333ea',
                                                      mx: '5px',
                                                      '&:hover': {
                                                        background: '#9333ea',
                                                        color: '#fff'
                                                      }
                                                    }}
                                                  >
                                                    <EditIcon sx={{ fontSize: '18px' }} />
                                                  </Button>
                                                </Box>
                                              </Box>
                                            }
                                          ></TreeItem>
                                        )
                                      })}
                                    </TreeItem>
                                  )
                                })}
                              </TreeItem>
                            )
                          })}
                        </TreeItem>
                      )
                    })}
                  </TreeItem>
                )
              })}
            </TreeView>
          </Box>
        </Box>

        <Modal
          open={serviceModalOpen}
          onClose={handleServiceModalOpen}
          aria-labelledby='modal-modal-title'
          aria-describedby='modal-modal-description'
        >
          <Box
            sx={{
              width: '100%',
              height: '100vh',
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
                <h2 id='modal-title'>
                  {formType === EServiceFormType.SERVICE && <>{serviceEditDataId ? 'Update' : 'Add'} Service</>}
                  {formType === EServiceFormType.GROUP && <>{serviceGroupEditDataId ? 'Update' : 'Add'} Group</>}
                  {formType === EServiceFormType.SOW && <>{serviceSOWEditDataId ? 'Update' : 'Add'} Scope</>}
                  {formType === EServiceFormType.DELIVARABLE && (
                    <>{serviceDeliverableEditDataId ? 'Update' : 'Add'} Deliverable</>
                  )}
                  {formType === EServiceFormType.TASK && <>{serviceTaskEditDataId ? 'Update' : 'Add'} Task</>}
                </h2>
              </Box>
              {formType === EServiceFormType.SERVICE && (
                <form onSubmit={onServiceSubmit}>
                  <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
                    <Box sx={{ width: '100%' }}>
                      <label className='block text-sm'>
                        <span className='text-gray-700 dark:text-gray-400'>Project Type</span>
                        <Dropdown
                          url={'project-type'}
                          name='projectTypeId'
                          value={serviceFormData.projectTypeId}
                          onChange={e => handleSelectChange(e, serviceFormData, setServiceFormData)}
                          optionConfig={{ id: 'id', title: 'name' }}
                        />
                      </label>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
                    <Box sx={{ width: '100%' }}>
                      <label className='block text-sm'>
                        <span className='text-gray-700 dark:text-gray-400'>Order</span>
                        <input
                          className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                          placeholder='Examples: 1'
                          name='order'
                          value={serviceFormData.order}
                          onChange={e => {
                            handleChange(e, serviceFormData, setServiceFormData)
                          }}
                        />
                      </label>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
                    <Box sx={{ width: '100%' }}>
                      <label className='block text-sm'>
                        <span className='text-gray-700 dark:text-gray-400'>Name</span>
                      </label>
                      <JoditEditor
                        ref={nameEditorRef}
                        config={{ enter: 'br', theme: isDark ? 'dark' : '' }}
                        value={serviceFormData.name}
                        onBlur={newContent => handleReachText(newContent, 'name', serviceFormData, setServiceFormData)}
                      />
                    </Box>
                  </Box>
                  <Box className='my-4 text-right'>
                    <button
                      onClick={onServiceClear}
                      type='button'
                      className='px-4 py-2 mr-3 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-red-600 border border-transparent rounded-lg active:bg-red-600 hover:bg-red-700 focus:outline-none focus:shadow-outline-red'
                    >
                      Close <ClearIcon />
                    </button>
                    <button
                      type='submit'
                      className='px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-green-600 border border-transparent rounded-lg active:bg-green-600 hover:bg-green-700 focus:outline-none focus:shadow-outline-green'
                    >
                      {serviceEditDataId ? 'Update ' : 'Save '}

                      {serviceEditDataId ? <EditNoteIcon /> : <AddIcon />}
                    </button>
                  </Box>
                </form>
              )}

              {formType === EServiceFormType.GROUP && (
                <form onSubmit={onServiceGroupSubmit}>
                  <Box sx={{ display: 'flex', width: '100%', gap: 5, mb: 5 }}>
                    <Box
                      sx={{
                        width: '100%',
                        '& .MuiInputBase-root': {
                          border: errorMessage?.['serviceId'] ? '1px solid #dc2626' : ''
                        }
                      }}
                    >
                      <label className='block text-sm'>
                        <span className='text-gray-700 dark:text-gray-400'>Service</span>
                        <Dropdown
                          url={'services'}
                          name='serviceId'
                          value={serviceGroupFormData.serviceId}
                          onChange={e => {
                            handleSelectChange(e, serviceGroupFormData, setServiceGroupFormData)
                          }}
                          optionConfig={{ id: 'id', title: 'name' }}
                        />
                        {!!errorMessage?.['serviceId'] &&
                          errorMessage?.['serviceId']?.map((message: any, index: number) => {
                            return (
                              <span key={index} className='text-xs text-red-600 dark:text-red-400'>
                                {message}
                              </span>
                            )
                          })}
                      </label>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
                    <Box sx={{ width: '100%' }}>
                      <label className='block text-sm'>
                        <span className='text-gray-700 dark:text-gray-400'>Order</span>
                        <input
                          className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                          placeholder='Examples: 1'
                          name='order'
                          value={serviceGroupFormData.order}
                          onChange={e => {
                            handleChange(e, serviceGroupFormData, setServiceGroupFormData)
                          }}
                        />
                      </label>
                    </Box>
                  </Box>
                  {serviceGroupEditDataId ? (
                    <>
                      <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
                        <Box sx={{ width: '100%' }}>
                          <label className='block text-sm'>
                            <span className='text-gray-700 dark:text-gray-400'>Name</span>
                          </label>
                          <JoditEditor
                            ref={nameEditorRef}
                            config={{ enter: 'br', theme: isDark ? 'dark' : '' }}
                            value={serviceGroupFormData.name}
                            onBlur={newContent =>
                              handleReachText(newContent, 'name', serviceGroupFormData, setServiceGroupFormData)
                            }
                          />
                          {!!errorMessage?.['name'] &&
                            errorMessage?.['name']?.map((message: any, index: number) => {
                              return (
                                <span key={index} className='text-xs text-red-600 dark:text-red-400'>
                                  {message}
                                </span>
                              )
                            })}
                        </Box>
                      </Box>
                    </>
                  ) : (
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 5,
                        mb: 5,
                        flexDirection: 'column',
                        border: '2px solid #9333ea',
                        padding: '24px',
                        borderRadius: '5px'
                      }}
                    >
                      <>
                        {serviceGroupFormData.names?.map((name, index) => (
                          <Box key={index} sx={{ width: '100%', display: 'flex', gap: 5, mb: 5 }}>
                            <Box sx={{ width: '100%' }}>
                              <label className='block text-sm'>
                                <span className='text-gray-700 dark:text-gray-400'>Name</span>
                              </label>
                              <Box
                                className='block text-sm'
                                sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                              >
                                <Box sx={{ width: '100%' }}>
                                  <JoditEditor
                                    ref={nameEditorRef}
                                    config={{ enter: 'br', theme: isDark ? 'dark' : '' }}
                                    value={name}
                                    onBlur={newContent =>
                                      handleMultipleNameReachText(
                                        newContent,
                                        'name',
                                        index,
                                        serviceGroupFormData,
                                        setServiceGroupFormData
                                      )
                                    }
                                  />
                                </Box>
                                <Button
                                  type='button'
                                  onClick={() => removeNameField(index, serviceGroupFormData, setServiceGroupFormData)}
                                  className='mt-1 p-0 bg-red-500 text-white rounded-md'
                                  sx={{
                                    p: 0,
                                    border: '1px solid #dc2626',
                                    borderRadius: '50%',
                                    minWidth: 'auto',
                                    height: '35px',
                                    width: '35px',
                                    color: '#dc2626',
                                    ml: 2,
                                    '&:hover': {
                                      background: '#dc2626',
                                      color: '#fff'
                                    }
                                  }}
                                >
                                  <DeleteIcon />
                                </Button>
                              </Box>
                              {!!errorMessage?.[`names.${index}`] &&
                                errorMessage?.[`names.${index}`]?.map((message: any, index: number) => {
                                  return (
                                    <span key={index} className='text-xs text-red-600 dark:text-red-400'>
                                      {String(message).replaceAll('names.0', 'name')}
                                    </span>
                                  )
                                })}
                            </Box>
                          </Box>
                        ))}
                      </>

                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                          type='button'
                          onClick={() => {
                            addNameField(serviceGroupFormData, setServiceGroupFormData)
                          }}
                          className='px-4 py-2 mr-3 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-blue'
                        >
                          <AddIcon /> Add Another Name
                        </button>
                      </Box>
                    </Box>
                  )}
                  <Box className='my-4 text-right'>
                    <button
                      onClick={onServiceClear}
                      type='button'
                      className='px-4 py-2 mr-3 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-red-600 border border-transparent rounded-lg active:bg-red-600 hover:bg-red-700 focus:outline-none focus:shadow-outline-red'
                    >
                      Close <ClearIcon />
                    </button>
                    <button
                      type='submit'
                      className='px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-green-600 border border-transparent rounded-lg active:bg-green-600 hover:bg-green-700 focus:outline-none focus:shadow-outline-green'
                    >
                      {serviceGroupEditDataId ? 'Update ' : 'Save '}

                      {serviceGroupEditDataId ? <EditNoteIcon /> : <AddIcon />}
                    </button>
                  </Box>
                </form>
              )}

              {formType === EServiceFormType.SOW && (
                <form onSubmit={onServiceSOWSubmit}>
                  <Box sx={{ display: 'flex', width: '100%', gap: 5, mb: 5 }}>
                    <Box
                      sx={{
                        width: '100%',
                        '& .MuiInputBase-root': {
                          border: errorMessage?.['serviceId'] ? '1px solid #dc2626' : ''
                        }
                      }}
                    >
                      <label className='block text-sm'>
                        <span className='text-gray-700 dark:text-gray-400'>Service Group</span>
                        <ServiceDropdownTree
                          name='serviceGroupId'
                          value={serviceSOWFormData.serviceGroupId}
                          onChange={e => {
                            handleSelectChange(e, serviceSOWFormData, setServiceSOWFormData)
                          }}
                          type='groups'
                        />
                        {!!errorMessage?.['serviceGroupId'] &&
                          errorMessage?.['serviceGroupId']?.map((message: any, index: number) => {
                            return (
                              <span key={index} className='text-xs text-red-600 dark:text-red-400'>
                                {message}
                              </span>
                            )
                          })}
                      </label>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
                    <Box sx={{ width: '100%' }}>
                      <label className='block text-sm'>
                        <span className='text-gray-700 dark:text-gray-400'>Order</span>
                        <input
                          className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                          placeholder='Examples: 1'
                          name='order'
                          value={serviceSOWFormData.order}
                          onChange={e => {
                            handleChange(e, serviceSOWFormData, setServiceSOWFormData)
                          }}
                        />
                      </label>
                    </Box>
                  </Box>
                  {serviceSOWEditDataId ? (
                    <>
                      <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
                        <Box sx={{ width: '100%' }}>
                          <label className='block text-sm'>
                            <span className='text-gray-700 dark:text-gray-400'>Name</span>
                          </label>
                          <JoditEditor
                            ref={nameEditorRef}
                            config={{ enter: 'br', theme: isDark ? 'dark' : '' }}
                            value={serviceSOWFormData.name}
                            onBlur={newContent =>
                              handleReachText(newContent, 'name', serviceSOWFormData, setServiceSOWFormData)
                            }
                          />
                          {!!errorMessage?.['name'] &&
                            errorMessage?.['name']?.map((message: any, index: number) => {
                              return (
                                <span key={index} className='text-xs text-red-600 dark:text-red-400'>
                                  {message}
                                </span>
                              )
                            })}
                        </Box>
                      </Box>
                    </>
                  ) : (
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 5,
                        mb: 5,
                        flexDirection: 'column',
                        border: '2px solid #9333ea',
                        padding: '24px',
                        borderRadius: '5px'
                      }}
                    >
                      <>
                        {serviceSOWFormData.names?.map((name, index) => (
                          <Box key={index} sx={{ width: '100%', display: 'flex', gap: 5, mb: 5 }}>
                            <Box sx={{ width: '100%' }}>
                              <label className='block text-sm'>
                                <span className='text-gray-700 dark:text-gray-400'>Name</span>
                              </label>
                              <Box
                                className='block text-sm'
                                sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                              >
                                <Box sx={{ width: '100%' }}>
                                  <JoditEditor
                                    ref={nameEditorRef}
                                    config={{ enter: 'br', theme: isDark ? 'dark' : '' }}
                                    value={name}
                                    onBlur={newContent =>
                                      handleMultipleNameReachText(
                                        newContent,
                                        'name',
                                        index,
                                        serviceSOWFormData,
                                        setServiceSOWFormData
                                      )
                                    }
                                  />
                                </Box>
                                <Button
                                  type='button'
                                  onClick={() => removeNameField(index, serviceSOWFormData, setServiceSOWFormData)}
                                  className='mt-1 p-0 bg-red-500 text-white rounded-md'
                                  sx={{
                                    p: 0,
                                    border: '1px solid #dc2626',
                                    borderRadius: '50%',
                                    minWidth: 'auto',
                                    height: '35px',
                                    width: '35px',
                                    color: '#dc2626',
                                    ml: 2,
                                    '&:hover': {
                                      background: '#dc2626',
                                      color: '#fff'
                                    }
                                  }}
                                >
                                  <DeleteIcon />
                                </Button>
                              </Box>
                              {!!errorMessage?.[`names.${index}`] &&
                                errorMessage?.[`names.${index}`]?.map((message: any, index: number) => {
                                  return (
                                    <span key={index} className='text-xs text-red-600 dark:text-red-400'>
                                      {String(message).replaceAll('names.0', 'name')}
                                    </span>
                                  )
                                })}
                            </Box>
                          </Box>
                        ))}
                      </>

                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                          type='button'
                          onClick={() => {
                            addNameField(serviceSOWFormData, setServiceSOWFormData)
                          }}
                          className='px-4 py-2 mr-3 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-blue'
                        >
                          <AddIcon /> Add Another Name
                        </button>
                      </Box>
                    </Box>
                  )}
                  <Box className='my-4 text-right'>
                    <button
                      onClick={onServiceClear}
                      type='button'
                      className='px-4 py-2 mr-3 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-red-600 border border-transparent rounded-lg active:bg-red-600 hover:bg-red-700 focus:outline-none focus:shadow-outline-red'
                    >
                      Close <ClearIcon />
                    </button>
                    <button
                      type='submit'
                      className='px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-green-600 border border-transparent rounded-lg active:bg-green-600 hover:bg-green-700 focus:outline-none focus:shadow-outline-green'
                    >
                      {serviceSOWEditDataId ? 'Update ' : 'Save '}

                      {serviceSOWEditDataId ? <EditNoteIcon /> : <AddIcon />}
                    </button>
                  </Box>
                </form>
              )}

              {formType === EServiceFormType.DELIVARABLE && (
                <form onSubmit={onServiceDeliverableSubmit}>
                  <Box sx={{ display: 'flex', width: '100%', gap: 5, mb: 5 }}>
                    <Box
                      sx={{
                        width: '100%',
                        '& .MuiInputBase-root': {
                          border: errorMessage?.['serviceId'] ? '1px solid #dc2626' : ''
                        }
                      }}
                    >
                      <label className='block text-sm'>
                        <span className='text-gray-700 dark:text-gray-400'>Service Scope</span>
                        <ServiceDropdownTree
                          name='serviceScopeId'
                          value={serviceDeliverableFormData.serviceScopeId}
                          onChange={e => {
                            handleSelectChange(e, serviceDeliverableFormData, setServiceDeliverableFormData)
                          }}
                          type='sows'
                        />
                        {!!errorMessage?.['serviceScopeId'] &&
                          errorMessage?.['serviceScopeId']?.map((message: any, index: number) => {
                            return (
                              <span key={index} className='text-xs text-red-600 dark:text-red-400'>
                                {message}
                              </span>
                            )
                          })}
                      </label>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
                    <Box sx={{ width: '100%' }}>
                      <label className='block text-sm'>
                        <span className='text-gray-700 dark:text-gray-400'>Order</span>
                        <input
                          className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                          placeholder='Examples: 1'
                          name='order'
                          value={serviceDeliverableFormData.order}
                          onChange={e => {
                            handleChange(e, serviceDeliverableFormData, setServiceDeliverableFormData)
                          }}
                        />
                      </label>
                    </Box>
                  </Box>
                  {serviceDeliverableEditDataId ? (
                    <>
                      <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
                        <Box sx={{ width: '100%' }}>
                          <label className='block text-sm'>
                            <span className='text-gray-700 dark:text-gray-400'>Name</span>
                          </label>
                          <JoditEditor
                            ref={nameEditorRef}
                            config={{ enter: 'br', theme: isDark ? 'dark' : '' }}
                            value={serviceDeliverableFormData.name}
                            onBlur={newContent =>
                              handleReachText(
                                newContent,
                                'name',
                                serviceDeliverableFormData,
                                setServiceDeliverableFormData
                              )
                            }
                          />
                          {!!errorMessage?.['name'] &&
                            errorMessage?.['name']?.map((message: any, index: number) => {
                              return (
                                <span key={index} className='text-xs text-red-600 dark:text-red-400'>
                                  {message}
                                </span>
                              )
                            })}
                        </Box>
                      </Box>
                    </>
                  ) : (
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 5,
                        mb: 5,
                        flexDirection: 'column',
                        border: '2px solid #9333ea',
                        padding: '24px',
                        borderRadius: '5px'
                      }}
                    >
                      <>
                        {serviceDeliverableFormData.names?.map((name, index) => (
                          <Box key={index} sx={{ width: '100%', display: 'flex', gap: 5, mb: 5 }}>
                            <Box sx={{ width: '100%' }}>
                              <label className='block text-sm'>
                                <span className='text-gray-700 dark:text-gray-400'>Name</span>
                              </label>
                              <Box
                                className='block text-sm'
                                sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                              >
                                <Box sx={{ width: '100%' }}>
                                  <JoditEditor
                                    ref={nameEditorRef}
                                    config={{ enter: 'br', theme: isDark ? 'dark' : '' }}
                                    value={name}
                                    onBlur={newContent =>
                                      handleMultipleNameReachText(
                                        newContent,
                                        'name',
                                        index,
                                        serviceDeliverableFormData,
                                        setServiceDeliverableFormData
                                      )
                                    }
                                  />
                                </Box>
                                <Button
                                  type='button'
                                  onClick={() =>
                                    removeNameField(index, serviceDeliverableFormData, setServiceDeliverableFormData)
                                  }
                                  className='mt-1 p-0 bg-red-500 text-white rounded-md'
                                  sx={{
                                    p: 0,
                                    border: '1px solid #dc2626',
                                    borderRadius: '50%',
                                    minWidth: 'auto',
                                    height: '35px',
                                    width: '35px',
                                    color: '#dc2626',
                                    ml: 2,
                                    '&:hover': {
                                      background: '#dc2626',
                                      color: '#fff'
                                    }
                                  }}
                                >
                                  <DeleteIcon />
                                </Button>
                              </Box>
                              {!!errorMessage?.[`names.${index}`] &&
                                errorMessage?.[`names.${index}`]?.map((message: any, index: number) => {
                                  return (
                                    <span key={index} className='text-xs text-red-600 dark:text-red-400'>
                                      {String(message).replaceAll('names.0', 'name')}
                                    </span>
                                  )
                                })}
                            </Box>
                          </Box>
                        ))}
                      </>

                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                          type='button'
                          onClick={() => {
                            addNameField(serviceDeliverableFormData, setServiceDeliverableFormData)
                          }}
                          className='px-4 py-2 mr-3 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-blue'
                        >
                          <AddIcon /> Add Another Name
                        </button>
                      </Box>
                    </Box>
                  )}
                  <Box className='my-4 text-right'>
                    <button
                      onClick={onServiceClear}
                      type='button'
                      className='px-4 py-2 mr-3 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-red-600 border border-transparent rounded-lg active:bg-red-600 hover:bg-red-700 focus:outline-none focus:shadow-outline-red'
                    >
                      Close <ClearIcon />
                    </button>
                    <button
                      type='submit'
                      className='px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-green-600 border border-transparent rounded-lg active:bg-green-600 hover:bg-green-700 focus:outline-none focus:shadow-outline-green'
                    >
                      {serviceDeliverableEditDataId ? 'Update ' : 'Save '}

                      {serviceDeliverableEditDataId ? <EditNoteIcon /> : <AddIcon />}
                    </button>
                  </Box>
                </form>
              )}
              {formType === EServiceFormType.TASK && (
                <Box className='p-5 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800'>
                  <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
                    <Box
                      sx={{
                        width: '100%',
                        '& .MuiInputBase-root': {
                          border: errorMessage?.['serviceDeliverableId'] ? '1px solid #dc2626' : ''
                        }
                      }}
                    >
                      <label className='block text-sm'>
                        <Checkbox
                          value={isFatchFromClickUp}
                          onChange={e => {
                            setIsFatchFromClickUp(e.target.checked)
                          }}
                        />
                        <span className='text-gray-700 dark:text-gray-400'>Fetch Task From Clickup</span>
                      </label>
                    </Box>
                  </Box>
                  {isFatchFromClickUp ? (
                    <>
                      {!!isPullingTaskFromClickup && <Preloader close={!!clickupTaskList?.length} />}
                      <Box>
                        <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
                          <Box sx={{ width: '100%' }}>
                            <label className='block text-sm'>
                              <span className='text-gray-700 dark:text-gray-400'>Clickup Link</span>
                              <input
                                className={`block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input ${
                                  !!clickupTaskList?.length ? 'opacity-50' : ''
                                }`}
                                placeholder='Enter clickup task link'
                                name='clickupLink'
                                value={clickupLink}
                                onChange={e => {
                                  setClickupLink(e.target.value)
                                }}
                                disabled={!!clickupTaskList?.length}
                              />
                              {!!errorMessage?.['clickupLink'] &&
                                errorMessage?.['clickupLink']?.map((message: any, index: number) => {
                                  return (
                                    <span key={index} className='text-xs text-red-600 dark:text-red-400'>
                                      {message}
                                    </span>
                                  )
                                })}
                            </label>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
                          <Box sx={{ width: '100%', textAlign: 'right' }}>
                            <button
                              type='button'
                              className={`px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-green-600 border border-transparent rounded-lg active:bg-green-600 hover:bg-green-700 focus:outline-none focus:shadow-outline-green ${
                                !!clickupTaskList?.length ? 'opacity-50' : ''
                              }`}
                              onClick={() => {
                                handleFetchTaskFromClickup()
                              }}
                              disabled={!!clickupTaskList?.length}
                            >
                              Click Here Fetch Task From Clickup
                              <BrowserUpdatedIcon sx={{ ml: 2 }} />
                            </button>
                          </Box>
                        </Box>
                      </Box>

                      {!!clickupTaskList?.length && (
                        <Box>
                          <form onSubmit={onServiceTaskSubmit}>
                            {clickupTaskList.map((clickupTask: any, index: number) => {
                              return (
                                <>
                                  <Box>
                                    <Box
                                      sx={{
                                        display: 'flex',
                                        gap: 5,
                                        mb: 5,
                                        flexDirection: 'column',
                                        border: '2px solid #9333ea',
                                        padding: '24px',
                                        borderRadius: '5px'
                                      }}
                                    >
                                      <Box
                                        sx={{
                                          width: '100%',
                                          display: 'flex',
                                          flexDirection: 'column',
                                          gap: 5,
                                          mb: 5
                                        }}
                                      >
                                        <Box sx={{ width: '100%' }}>
                                          <JoditEditor
                                            ref={nameEditorRef}
                                            config={{ enter: 'br', theme: isDark ? 'dark' : '' }}
                                            value={clickupTask.name}
                                            onBlur={newContent =>
                                              handleMultipleTaskReachText(newContent, 'name', index)
                                            }
                                          />
                                          {/* {!!errorMessage?.[`tasks.${index}.name`] &&
                                  errorMessage?.[`tasks.${index}.name`]?.map((message: any, index: number) => {
                                    return (
                                      <span key={index} className='text-xs text-red-600 dark:text-red-400'>
                                        {String(message).replaceAll('tasks.0.', '')}
                                      </span>
                                    )
                                  })} */}
                                        </Box>
                                        <Box sx={{ width: '100%' }}>
                                          <JoditEditor
                                            ref={nameEditorRef}
                                            config={{ enter: 'br', theme: isDark ? 'dark' : '' }}
                                            value={clickupTask.name}
                                            onBlur={newContent =>
                                              handleMultipleTaskReachText(newContent, 'name', index)
                                            }
                                          />
                                          {/* {!!errorMessage?.[`tasks.${index}.name`] &&
                                  errorMessage?.[`tasks.${index}.name`]?.map((message: any, index: number) => {
                                    return (
                                      <span key={index} className='text-xs text-red-600 dark:text-red-400'>
                                        {String(message).replaceAll('tasks.0.', '')}
                                      </span>
                                    )
                                  })} */}
                                        </Box>
                                      </Box>

                                      {!!clickupTask?.subTasks?.length &&
                                        clickupTask?.subTasks?.map((subTask: any, subTasksIndex: number) => {
                                          return (
                                            <Box
                                              sx={{
                                                display: 'flex',
                                                gap: 5,
                                                mb: 5,
                                                flexDirection: 'column',
                                                border: '2px solid #9333ea',
                                                padding: '24px',
                                                borderRadius: '5px'
                                              }}
                                              key={subTasksIndex}
                                            >
                                              <Box sx={{ width: '100%', display: 'flex', gap: 5, mb: 5 }}>
                                                <Box sx={{ width: '100%' }}>
                                                  <label className='block text-sm'>
                                                    <span className='text-gray-700 dark:text-gray-400'>Name</span>
                                                  </label>
                                                  <Box
                                                    className='block text-sm'
                                                    sx={{
                                                      width: '100%',
                                                      display: 'flex',
                                                      alignItems: 'center',
                                                      justifyContent: 'center'
                                                    }}
                                                  >
                                                    <Box
                                                      sx={{
                                                        width: '100%',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        gap: 5,
                                                        mb: 5
                                                      }}
                                                    >
                                                      <Box sx={{ width: '100%' }}>
                                                        <JoditEditor
                                                          ref={nameEditorRef}
                                                          config={{ enter: 'br', theme: isDark ? 'dark' : '' }}
                                                          value={subTask.name}
                                                          onBlur={newContent =>
                                                            handleMultipleTaskReachText(newContent, 'name', index)
                                                          }
                                                        />
                                                        {!!errorMessage?.[`tasks.${index}.name`] &&
                                                          errorMessage?.[`tasks.${index}.name`]?.map(
                                                            (message: any, index: number) => {
                                                              return (
                                                                <span
                                                                  key={index}
                                                                  className='text-xs text-red-600 dark:text-red-400'
                                                                >
                                                                  {String(message).replaceAll('tasks.0.', '')}
                                                                </span>
                                                              )
                                                            }
                                                          )}
                                                      </Box>
                                                      <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
                                                        <Box sx={{ width: '50%' }}>
                                                          <label className='block text-sm'>
                                                            <span className='text-gray-700 dark:text-gray-400'>
                                                              Hour
                                                            </span>
                                                            <input
                                                              className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                                                              placeholder='Examples: 50.00'
                                                              name='cost'
                                                              value={subTask.cost}
                                                              onChange={e => {
                                                                handleTaskMultipleTextChange(e, index)
                                                              }}
                                                            />
                                                            {!!errorMessage?.[`tasks.${index}.cost`] &&
                                                              errorMessage?.[`tasks.${index}.cost`]?.map(
                                                                (message: any, index: number) => {
                                                                  return (
                                                                    <span
                                                                      key={index}
                                                                      className='text-xs text-red-600 dark:text-red-400'
                                                                    >
                                                                      {String(message).replaceAll('tasks.0.', '')}
                                                                    </span>
                                                                  )
                                                                }
                                                              )}
                                                          </label>
                                                        </Box>
                                                        <Box sx={{ width: '50%' }}>
                                                          <label className='block text-sm'>
                                                            <span className='text-gray-700 dark:text-gray-400'>
                                                              Description
                                                            </span>
                                                            <input
                                                              className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                                                              placeholder='Examples: Company logo for header'
                                                              name='description'
                                                              value={subTask.description}
                                                              onChange={e => {
                                                                handleTaskMultipleTextChange(e, index)
                                                              }}
                                                            />
                                                            {!!errorMessage?.[`tasks.${index}.description`] &&
                                                              errorMessage?.[`tasks.${index}.description`]?.map(
                                                                (message: any, index: number) => {
                                                                  return (
                                                                    <span
                                                                      key={index}
                                                                      className='text-xs text-red-600 dark:text-red-400'
                                                                    >
                                                                      {String(message).replaceAll('tasks.0.', '')}
                                                                    </span>
                                                                  )
                                                                }
                                                              )}
                                                          </label>
                                                        </Box>
                                                      </Box>
                                                    </Box>
                                                  </Box>
                                                </Box>
                                              </Box>
                                            </Box>
                                          )
                                        })}
                                    </Box>
                                  </Box>
                                </>
                              )
                            })}

                            <Box className='my-4 text-right'>
                              <button
                                onClick={onServiceTaskClear}
                                type='button'
                                className='px-4 py-2 mr-3 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-red-600 border border-transparent rounded-lg active:bg-red-600 hover:bg-red-700 focus:outline-none focus:shadow-outline-red'
                              >
                                {serviceTaskEditDataId ? 'Cancel ' : 'Clear '}
                                {serviceTaskEditDataId ? <ClearIcon /> : <PlaylistRemoveIcon />}
                              </button>
                              <button
                                type='submit'
                                className='px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-green-600 border border-transparent rounded-lg active:bg-green-600 hover:bg-green-700 focus:outline-none focus:shadow-outline-green'
                              >
                                {serviceTaskEditDataId ? 'Update ' : 'Save '}
                                {serviceTaskEditDataId ? <EditNoteIcon /> : <AddIcon />}
                              </button>
                            </Box>
                          </form>
                        </Box>
                      )}
                    </>
                  ) : (
                    <>
                      <form onSubmit={onServiceTaskSubmit}>
                        <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
                          <Box
                            sx={{
                              width: '50%',
                              '& .MuiInputBase-root': {
                                border: errorMessage?.['serviceDeliverableId'] ? '1px solid #dc2626' : ''
                              }
                            }}
                          >
                            <label className='block text-sm'>
                              <span className='text-gray-700 dark:text-gray-400'>Service Deliverable</span>
                              <ServiceDropdownTree
                                name='serviceDeliverableId'
                                value={serviceTaskFormData.serviceDeliverableId}
                                onChange={e => {
                                  handleSelectChange(e, serviceTaskFormData, setServiceTaskFormData)
                                }}
                                type='deliverables'
                              />
                              {!!errorMessage?.['serviceDeliverableId'] &&
                                errorMessage?.['serviceDeliverableId']?.map((message: any, index: number) => {
                                  return (
                                    <span key={index} className='text-xs text-red-600 dark:text-red-400'>
                                      {message}
                                    </span>
                                  )
                                })}
                            </label>
                          </Box>
                          <Box
                            sx={{
                              width: '50%',
                              '& .MuiInputBase-root': {
                                border: errorMessage?.['parentTaskId'] ? '1px solid #dc2626' : ''
                              }
                            }}
                          >
                            <label className='block text-sm'>
                              <span className='text-gray-700 dark:text-gray-400'>Parent Task</span>
                              <Dropdown
                                url={`service-deliverable-tasks?serviceDeliverableId=${serviceTaskFormData.serviceDeliverableId}`}
                                name='parentTaskId'
                                value={serviceTaskFormData.parentTaskId}
                                onChange={e => {
                                  handleSelectChange(e, serviceTaskFormData, setServiceTaskFormData)
                                }}
                              />
                              {!!errorMessage?.['parentTaskId'] &&
                                errorMessage?.['parentTaskId']?.map((message: any, index: number) => {
                                  return (
                                    <span key={index} className='text-xs text-red-600 dark:text-red-400'>
                                      {message}
                                    </span>
                                  )
                                })}
                            </label>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
                          <Box sx={{ width: '100%' }}>
                            <label className='block text-sm'>
                              <span className='text-gray-700 dark:text-gray-400'>Order</span>
                              <input
                                className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                                placeholder='Examples: 1'
                                name='order'
                                value={serviceTaskFormData.order}
                                onChange={e => {
                                  handleChange(e, serviceTaskFormData, setServiceTaskFormData)
                                }}
                              />
                            </label>
                          </Box>
                        </Box>
                        {serviceTaskEditDataId ? (
                          <>
                            <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
                              <Box sx={{ width: '100%' }}>
                                <label className='block text-sm'>
                                  <span className='text-gray-700 dark:text-gray-400'>Name</span>
                                </label>
                                <JoditEditor
                                  ref={nameEditorRef}
                                  config={{ enter: 'br', theme: isDark ? 'dark' : '' }}
                                  value={serviceTaskFormData.name}
                                  onBlur={newContent =>
                                    handleReachText(newContent, 'name', serviceTaskFormData, setServiceTaskFormData)
                                  }
                                />
                                {!!errorMessage?.['name'] &&
                                  errorMessage?.['name']?.map((message: any, index: number) => {
                                    return (
                                      <span key={index} className='text-xs text-red-600 dark:text-red-400'>
                                        {message}
                                      </span>
                                    )
                                  })}
                              </Box>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
                              <Box sx={{ width: '50%' }}>
                                <label className='block text-sm'>
                                  <span className='text-gray-700 dark:text-gray-400'>Hour</span>
                                  <input
                                    className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                                    placeholder='Examples: 50.00'
                                    name='cost'
                                    value={serviceTaskFormData.cost}
                                    onChange={e => {
                                      handleChange(e, serviceTaskFormData, setServiceTaskFormData)
                                    }}
                                  />
                                  {!!errorMessage?.['cost'] &&
                                    errorMessage?.['cost']?.map((message: any, index: number) => {
                                      return (
                                        <span key={index} className='text-xs text-red-600 dark:text-red-400'>
                                          {message}
                                        </span>
                                      )
                                    })}
                                </label>
                              </Box>
                              <Box sx={{ width: '50%' }}>
                                <label className='block text-sm'>
                                  <span className='text-gray-700 dark:text-gray-400'>Description</span>
                                  <input
                                    className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                                    placeholder='Examples: Company logo for header'
                                    name='description'
                                    value={serviceTaskFormData.description}
                                    onChange={e => {
                                      handleTaskMultipleTextChange(e)
                                    }}
                                  />
                                  {!!errorMessage?.['description'] &&
                                    errorMessage?.['description']?.map((message: any, index: number) => {
                                      return (
                                        <span key={index} className='text-xs text-red-600 dark:text-red-400'>
                                          {message}
                                        </span>
                                      )
                                    })}
                                </label>
                              </Box>
                            </Box>
                          </>
                        ) : (
                          <Box
                            sx={{
                              display: 'flex',
                              gap: 5,
                              mb: 5,
                              flexDirection: 'column',
                              border: '2px solid #9333ea',
                              padding: '24px',
                              borderRadius: '5px'
                            }}
                          >
                            <>
                              {serviceTaskFormData.tasks?.map((task: any, index: number) => (
                                <Box key={index} sx={{ width: '100%', display: 'flex', gap: 5, mb: 5 }}>
                                  <Box sx={{ width: '100%' }}>
                                    <label className='block text-sm'>
                                      <span className='text-gray-700 dark:text-gray-400'>Name</span>
                                    </label>
                                    <Box
                                      className='block text-sm'
                                      sx={{
                                        width: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                      }}
                                    >
                                      <Box
                                        sx={{
                                          width: '100%',
                                          display: 'flex',
                                          flexDirection: 'column',
                                          gap: 5,
                                          mb: 5
                                        }}
                                      >
                                        <Box sx={{ width: '100%' }}>
                                          <JoditEditor
                                            ref={nameEditorRef}
                                            config={{ enter: 'br', theme: isDark ? 'dark' : '' }}
                                            value={task.name}
                                            onBlur={newContent =>
                                              handleMultipleTaskReachText(newContent, 'name', index)
                                            }
                                          />
                                          {!!errorMessage?.[`tasks.${index}.name`] &&
                                            errorMessage?.[`tasks.${index}.name`]?.map(
                                              (message: any, index: number) => {
                                                return (
                                                  <span key={index} className='text-xs text-red-600 dark:text-red-400'>
                                                    {String(message).replaceAll('tasks.0.', '')}
                                                  </span>
                                                )
                                              }
                                            )}
                                        </Box>
                                        <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
                                          <Box sx={{ width: '50%' }}>
                                            <label className='block text-sm'>
                                              <span className='text-gray-700 dark:text-gray-400'>Hour</span>
                                              <input
                                                className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                                                placeholder='Examples: 50.00'
                                                name='cost'
                                                value={task.cost}
                                                onChange={e => {
                                                  handleTaskMultipleTextChange(e, index)
                                                }}
                                              />
                                              {!!errorMessage?.[`tasks.${index}.cost`] &&
                                                errorMessage?.[`tasks.${index}.cost`]?.map(
                                                  (message: any, index: number) => {
                                                    return (
                                                      <span
                                                        key={index}
                                                        className='text-xs text-red-600 dark:text-red-400'
                                                      >
                                                        {String(message).replaceAll('tasks.0.', '')}
                                                      </span>
                                                    )
                                                  }
                                                )}
                                            </label>
                                          </Box>
                                          <Box sx={{ width: '50%' }}>
                                            <label className='block text-sm'>
                                              <span className='text-gray-700 dark:text-gray-400'>Description</span>
                                              <input
                                                className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                                                placeholder='Examples: Company logo for header'
                                                name='description'
                                                value={task.description}
                                                onChange={e => {
                                                  handleTaskMultipleTextChange(e, index)
                                                }}
                                              />
                                              {!!errorMessage?.[`tasks.${index}.description`] &&
                                                errorMessage?.[`tasks.${index}.description`]?.map(
                                                  (message: any, index: number) => {
                                                    return (
                                                      <span
                                                        key={index}
                                                        className='text-xs text-red-600 dark:text-red-400'
                                                      >
                                                        {String(message).replaceAll('tasks.0.', '')}
                                                      </span>
                                                    )
                                                  }
                                                )}
                                            </label>
                                          </Box>
                                        </Box>
                                      </Box>
                                      <Button
                                        type='button'
                                        onClick={() => removeTasksFields(index)}
                                        className='mt-1 p-0 bg-red-500 text-white rounded-md'
                                        sx={{
                                          p: 0,
                                          border: '1px solid #dc2626',
                                          borderRadius: '50%',
                                          minWidth: 'auto',
                                          height: '35px',
                                          width: '35px',
                                          color: '#dc2626',
                                          ml: 2,
                                          '&:hover': {
                                            background: '#dc2626',
                                            color: '#fff'
                                          }
                                        }}
                                      >
                                        <DeleteIcon />
                                      </Button>
                                    </Box>
                                  </Box>
                                </Box>
                              ))}
                            </>

                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                              <button
                                type='button'
                                onClick={addTaskFields}
                                className='px-4 py-2 mr-3 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-blue'
                              >
                                <AddIcon /> Add Another Name
                              </button>
                            </Box>
                          </Box>
                        )}
                        <Box className='my-4 text-right'>
                          <button
                            onClick={onServiceClear}
                            type='button'
                            className='px-4 py-2 mr-3 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-red-600 border border-transparent rounded-lg active:bg-red-600 hover:bg-red-700 focus:outline-none focus:shadow-outline-red'
                          >
                            Close <ClearIcon />
                          </button>
                          <button
                            type='submit'
                            className='px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-green-600 border border-transparent rounded-lg active:bg-green-600 hover:bg-green-700 focus:outline-none focus:shadow-outline-green'
                          >
                            {serviceTaskEditDataId ? 'Update ' : 'Save '}

                            {serviceTaskEditDataId ? <EditNoteIcon /> : <AddIcon />}
                          </button>
                        </Box>
                      </form>
                    </>
                  )}
                </Box>
              )}
            </Box>
          </Box>
        </Modal>
      </Box>
    </>
  )
}
