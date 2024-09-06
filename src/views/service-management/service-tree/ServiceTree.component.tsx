import ClearIcon from '@material-ui/icons/Clear'
import AddIcon from '@mui/icons-material/Add'
import BrowserUpdatedIcon from '@mui/icons-material/BrowserUpdated'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import EditNoteIcon from '@mui/icons-material/EditNote'
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove'
import { Box, Button, Checkbox, Modal } from '@mui/material'
import { Tree, TreeDataNode, type TreeProps } from 'antd'
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import { Dropdown, DropdownRef, ServiceDropdownTree } from 'src/@core/components/dropdown'
import Preloader from 'src/@core/components/preloader'
import { RichTextEditor } from 'src/@core/components/rich-text-editor'
import { useToastSnackbar } from 'src/@core/hooks/useToastSnackbar'
import apiRequest from 'src/@core/utils/axios-config'
import Swal from 'sweetalert2'
import {
  EServiceFormType,
  addButtonSx,
  deleteButtonSx,
  editButtonSx,
  transformServiceTree,
  treeButtonContainerSx,
  treeTitleSx
} from './ServiceTree.decorator'

const { DirectoryTree } = Tree
export default function ServiceTreeComponent() {
  const { showSnackbar } = useToastSnackbar()
  const [serviceTreeData, setServiceTreeData] = useState<any>([])
  const [serviceModalOpen, setServiceModalOpen] = useState<boolean>(false)
  const [expendendKeys, setExpandedKeys] = useState<any>([])
  const handleServiceModalOpen = () => {
    setServiceModalOpen(true)
    setErrorMessage({})
  }
  const handleServiceModalClose = () => {
    setServiceModalOpen(false)
    setErrorMessage({})
  }
  const [employeeRolesModalOpen, setEmployeeRolesModalOpen] = useState<boolean>(false)
  const handleEmployeeRolesModalOpen = () => {
    setEmployeeRolesModalOpen(true)
    setErrorMessage({})
  }
  const handleEmployeeRolesModalClose = () => {
    setEmployeeRolesModalOpen(false)
    setErrorMessage({})
  }
  const employeeRolesDropdownRef = useRef<DropdownRef>(null)
  const [formType, setFormType] = useState<EServiceFormType>()
  const [defaultExpandedKeys, setDefaultExpandedKeys] = useState<string[]>(['Development_1050'])

  const serviceDefaultData = {
    name: '',
    order: '',
    projectTypeId: ''
  }
  const serviceGroupDefaultData = {
    serviceId: '',
    name: '',
    order: '',
    groups: [{ name: '', order: '' }]
  }

  const serviceSOWDefaultData = {
    serviceGroupId: '',
    name: '',
    order: '',
    scopes: [{ name: '', order: '' }]
  }

  const serviceDeliverableDefaultData = {
    serviceScopeId: '',
    name: '',
    order: '',
    deliverables: [{ name: '', order: '' }]
  }

  const serviceTaskDefaultData = {
    tasks: [
      {
        name: '',
        employeeRoleId: '',
        cost: '',
        description: '',
        order: ''
      }
    ],
    name: '',
    employeeRoleId: '',
    order: '',
    cost: '',
    description: '',
    serviceDeliverableId: '',
    parentTaskId: ''
  }

  const employeeRolesDefaultData = {
    name: '',
    average_hourly: ''
  }

  const [serviceFormData, setServiceFormData] = useState(serviceDefaultData)
  const [serviceGroupFormData, setServiceGroupFormData] = useState(serviceGroupDefaultData)
  const [serviceSOWFormData, setServiceSOWFormData] = useState(serviceSOWDefaultData)
  const [serviceDeliverableFormData, setServiceDeliverableFormData] = useState(serviceDeliverableDefaultData)
  const [serviceTaskFormData, setServiceTaskFormData] = useState(serviceTaskDefaultData)
  const [isShowParentTaskField, setIsShowParentTaskField] = useState(true)
  const [employeeRolesFor, setEmployeeRolesFor] = useState(0)

  const [serviceEditDataId, setServiceEditDataId] = useState<null | string>(null)
  const [serviceGroupEditDataId, setServiceGroupEditDataId] = useState<null | string>(null)
  const [serviceSOWEditDataId, setServiceSOWEditDataId] = useState<null | string>(null)
  const [serviceDeliverableEditDataId, setServiceDeliverableEditDataId] = useState<null | string>(null)
  const [serviceTaskEditDataId, setServiceTaskEditDataId] = useState<null | string>(null)
  const [employeeRolesFormData, setEmployeeRolesFormData] = useState(employeeRolesDefaultData)
  const [errorMessage, setErrorMessage] = useState<any>({})

  const [isPullingTaskFromClickup, setIsPullingTaskFromClickup] = useState<boolean>(false)
  const [isFatchFromClickUp, setIsFatchFromClickUp] = useState<boolean>(false)
  const [clickupLink, setClickupLink] = useState('')
  const [clickupTaskList, setClickupTaskList] = useState<any[]>([])

  const handleReachText = (value: string, field: string, formData: any, setFormData: Dispatch<SetStateAction<any>>) => {
    setFormData((prevState: any) => ({
      ...prevState,
      [field]: value
    }))
  }

  const handleMultipleReachTextChange = (
    value: string,
    field: string,
    index = -1,
    formData: any,
    setFormData: Dispatch<SetStateAction<any>>,
    subArr: string
  ) => {
    if (index != -1) {
      const subArrData = formData?.[subArr]
      subArrData[index][field] = value

      console.log(formData?.[subArr])
      console.log({ subArrData })

      // setFormData((prevState: any) => ({
      //   ...prevState,
      //   [subArr]: [...subArrData]
      // }))
    } else {
      setFormData((prevState: any) => ({
        ...prevState,
        [field]: value
      }))
    }
  }

  const handleMultipleTaskFieldChange = (value: any, field: string, index = -1) => {
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

  const handleTextChange = (e: React.ChangeEvent<any>, formData: any, setFormData: Dispatch<SetStateAction<any>>) => {
    setFormData((prevState: any) => ({
      ...prevState,
      [e?.target?.name]: e?.target?.value
    }))
  }

  const handleMultipleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    formData: any,
    setFormData: Dispatch<SetStateAction<any>>,
    index = -1,
    subArr: string
  ): void => {
    const subArrData = [...formData[subArr]]

    if (subArrData && subArrData[index]) {
      subArrData[index][e.target.name] = e.target.value
      setFormData((prevState: any) => ({
        ...prevState,
        [subArr]: [...subArrData]
      }))
    }
  }

  const handleMultipleSelectChange = (
    e: any,
    formData: any,
    setFormData: Dispatch<SetStateAction<any>>,
    index = -1,
    subArr: string
  ): void => {
    const subArrData = [...formData[subArr]]

    if (subArrData && subArrData[index]) {
      subArrData[index][e.target.name] = e.target.value
      setFormData((prevState: any) => ({
        ...prevState,
        [subArr]: [...subArrData]
      }))
    }
  }

  const handleSelectChange = (e: any, formData: any, setFormData: Dispatch<SetStateAction<any>>) => {
    setFormData((prevState: any) => ({
      ...prevState,
      [e?.target?.name]: e?.target?.value
    }))
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

  const addSubField = (formData: any, setFormData: Dispatch<SetStateAction<any>>, subArr: string, data: any) => {
    console.log({ formData })
    console.log({ subArr })
    console.log({ data })
    console.log([...formData?.[subArr], ...data])

    setFormData({
      ...formData,
      [subArr]: [...formData?.[subArr], ...data]
    })
    //console.log(formData)
  }

  const removeNameField = (
    index: number,
    formData: any,
    setFormData: Dispatch<SetStateAction<any>>,
    subArr: string
  ) => {
    const subArrData = formData?.[subArr]
    subArrData.splice(index, 1)
    setFormData({
      ...formData,
      [subArr]: subArrData
    })
  }

  const handleServiceEditButton = (e: any, data: any, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    console.log(data)

    setServiceFormData({
      name: data?.['name'],
      order: data?.['order'],
      projectTypeId: data?.['projectType']?.['id']
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
      order: data?.order || '',
      groups: serviceGroupDefaultData.groups
    })
    setServiceGroupEditDataId(id)
    handleServiceModalOpen()
    setFormType(EServiceFormType.GROUP)
  }

  const handleServiceSOWEditButton = (e: any, data: any, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    setServiceSOWFormData({
      serviceGroupId: data?.groupId || '',
      name: data?.name || '',
      order: data?.order || '',
      scopes: serviceSOWDefaultData.scopes
    })
    setServiceSOWEditDataId(id)
    handleServiceModalOpen()
    setFormType(EServiceFormType.SOW)
  }

  const handleServiceDeliverableEditButton = (e: any, data: any, id: string) => {
    e.preventDefault()
    e.stopPropagation()

    setServiceDeliverableFormData({
      serviceScopeId: data?.scopeId || '',
      name: data?.name || '',
      order: data?.order || '',
      deliverables: serviceDeliverableDefaultData.deliverables
    })
    setServiceDeliverableEditDataId(id)
    handleServiceModalOpen()
    setFormType(EServiceFormType.DELIVARABLE)
  }

  const handleServiceTaskEditButton = (e: any, data: any, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    console.log(data)

    setIsShowParentTaskField(!!data?.taskId)
    setServiceTaskFormData({
      serviceDeliverableId: data?.deliverableId || '',
      parentTaskId: data?.taskId || '',

      name: data?.name || '',
      order: data?.order,
      cost: data?.cost || '',
      employeeRoleId: data?.employeeRoleId || '',
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
      apiRequest
        .put(`/services/${serviceEditDataId}`, serviceFormData)
        .then(res => {
          showSnackbar('Updated Successfully!', { variant: 'success' })
          onServiceClear()
          handleServiceModalClose()
          console.log(res)

          // getTree()
        })
        .catch(error => {
          setErrorMessage(error?.response?.data?.errors)

          showSnackbar(error?.response?.data?.message, { variant: 'error' })
        })
    } else {
      apiRequest
        .post('/services', serviceFormData)
        .then(res => {
          // Swal.fire({
          //   title: 'Created Successfully!',
          //   icon: 'success',
          //   timer: 500,
          //   timerProgressBar: true,
          //   showConfirmButton: false
          // })
          showSnackbar('Created Successfully!', { variant: 'success' })
          onServiceClear()
          handleServiceModalClose()
          console.log(res)

          // setServiceTreeData((prevState: []) => transformServiceTree([...prevState, { ...res?.data }], 'service'))

          getTree()
        })
        .catch(error => {
          console.log(error)
          console.log(errorMessage)
          setErrorMessage(error?.response?.data?.errors)
          showSnackbar(error?.response?.data?.message, { variant: 'error' })
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
          showSnackbar('Updated Successfully!', { variant: 'success' })
          onServiceGroupClear()
          handleServiceModalClose()
          getTree()
        })
        .catch(error => {
          setErrorMessage(error?.response?.data?.errors)
          showSnackbar(error?.response?.data?.message, { variant: 'error' })
        })
    } else {
      apiRequest
        .post('/service-groups', {
          groups: [...serviceGroupFormData?.groups],
          serviceId: serviceGroupFormData?.serviceId
        })
        .then(res => {
          setServiceTreeData((prevState: []) => [...prevState, ...res?.data])
          showSnackbar('Created Successfully!', { variant: 'success' })
          onServiceGroupClear()
          handleServiceModalClose()
          getTree()
        })
        .catch(error => {
          setErrorMessage(error?.response?.data?.errors)
          showSnackbar(error?.response?.data?.message, { variant: 'error' })
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
          showSnackbar('Updated Successfully!', { variant: 'success' })
          onServiceSOWClear()
          handleServiceModalClose()
          getTree()
        })
        .catch(error => {
          setErrorMessage(error?.response?.data?.errors)
          showSnackbar(error?.response?.data?.message, { variant: 'error' })
        })
    } else {
      apiRequest
        .post('/service-scopes', serviceSOWFormData)
        .then(res => {
          showSnackbar('Created Successfully!', { variant: 'success' })
          onServiceSOWClear()
          handleServiceModalClose()
          getTree()
        })
        .catch(error => {
          setErrorMessage(error?.response?.data?.errors)
          showSnackbar(error?.response?.data?.message, { variant: 'error' })
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
          showSnackbar('Updated Successfully!', { variant: 'success' })
          onServiceDeliverableClear()
          handleServiceModalClose()
          getTree()
        })
        .catch(error => {
          setErrorMessage(error?.response?.data?.errors)
          showSnackbar(error?.response?.data?.message, { variant: 'error' })
        })
    } else {
      apiRequest
        .post('/service-deliverables', serviceDeliverableFormData)
        .then(res => {
          showSnackbar('Created Successfully!', { variant: 'success' })
          onServiceDeliverableClear()
          handleServiceModalClose()
          getTree()
        })
        .catch(error => {
          setErrorMessage(error?.response?.data?.errors)
          showSnackbar(error?.response?.data?.message, { variant: 'error' })
        })
    }
  }

  const onServiceDelete = (id: string) => {
    Swal.fire({
      title: 'Are You sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showConfirmButton: true,
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#dc2626',
      showCancelButton: true,
      cancelButtonText: 'No, cancel!'
    }).then(res => {
      if (res.isConfirmed) {
        apiRequest.delete(`/services/${id}`).then(res => {
          Swal.fire({
            title: 'Deleted Successfully!',
            icon: 'success',
            timer: 1000,
            timerProgressBar: true,
            showConfirmButton: false
          })
          getTree()
        })
      }
    })
  }

  const onServiceGroupDelete = (id: string) => {
    Swal.fire({
      title: 'Are You sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showConfirmButton: true,
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#dc2626',
      showCancelButton: true,
      cancelButtonText: 'No, cancel!'
    }).then(res => {
      if (res.isConfirmed) {
        apiRequest.delete(`/service-groups/${id}`).then(res => {
          Swal.fire({
            title: 'Deleted Successfully!',
            icon: 'success',
            timer: 1000,
            timerProgressBar: true,
            showConfirmButton: false
          })
          getTree()
        })
      }
    })
  }

  const onServiceScopeDelete = (id: string) => {
    Swal.fire({
      title: 'Are You sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showConfirmButton: true,
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#dc2626',
      showCancelButton: true,
      cancelButtonText: 'No, cancel!'
    }).then(res => {
      if (res.isConfirmed) {
        apiRequest.delete(`/service-scopes/${id}`).then(res => {
          Swal.fire({
            title: 'Deleted Successfully!',
            icon: 'success',
            timer: 1000,
            timerProgressBar: true,
            showConfirmButton: false
          })
          getTree()
        })
      }
    })
  }

  const onServiceDeliverableDelete = (id: string) => {
    Swal.fire({
      title: 'Are You sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showConfirmButton: true,
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#dc2626',
      showCancelButton: true,
      cancelButtonText: 'No, cancel!'
    }).then(res => {
      if (res.isConfirmed) {
        apiRequest.delete(`/service-deliverables/${id}`).then(res => {
          Swal.fire({
            title: 'Deleted Successfully!',
            icon: 'success',
            timer: 1000,
            timerProgressBar: true,
            showConfirmButton: false
          })
          getTree()
        })
      }
    })
  }

  const onServiceDeliverableTaskDelete = (id: string) => {
    Swal.fire({
      title: 'Are You sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showConfirmButton: true,
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#dc2626',
      showCancelButton: true,
      cancelButtonText: 'No, cancel!'
    }).then(res => {
      if (res.isConfirmed) {
        apiRequest.delete(`/service-deliverable-tasks/${id}`).then(res => {
          Swal.fire({
            title: 'Deleted Successfully!',
            icon: 'success',
            timer: 1000,
            timerProgressBar: true,
            showConfirmButton: false
          })
          getTree()
        })
      }
    })
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
        setClickupTaskList(res?.data)
      })
      .catch(error => {
        setErrorMessage(error?.response?.data?.errors)
        showSnackbar(error?.message, { variant: 'error' })
      })
  }

  const onServiceTaskSubmit = (e: React.FormEvent<any>) => {
    setErrorMessage({})
    e.preventDefault()
    if (serviceTaskEditDataId) {
      apiRequest
        .put(`/service-deliverable-tasks/${serviceTaskEditDataId}`, serviceTaskFormData)
        .then(res => {
          showSnackbar('Updated Successfully!', { variant: 'success' })
          onServiceTaskClear()
          handleServiceModalClose()
          getTree()
        })
        .catch(error => {
          setErrorMessage(error?.response?.data?.errors)
          showSnackbar(error?.response?.data?.message, { variant: 'error' })
        })
    } else {
      apiRequest
        .post('/service-deliverable-tasks', serviceTaskFormData)
        .then(res => {
          showSnackbar('Created Successfully!', { variant: 'success' })
          onServiceTaskClear()
          getTree()
        })
        .catch(error => {
          setErrorMessage(error?.response?.data?.errors)
          showSnackbar(error?.response?.data?.message, { variant: 'error' })
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

  const getTree = async () => {
    await apiRequest
      .get(`/service-tree?per_page=500`)
      .then(res => {
        const services = res?.data?.services || []
        setServiceTreeData(transformServiceTree(services, 'service'))
      })
      .catch(error => {
        showSnackbar(error?.message, { variant: 'error' })
      })
  }

  const onEmployeeRolesSubmit = (e: React.FormEvent<any>) => {
    e.preventDefault()
    apiRequest
      .post('/employee-roles', employeeRolesFormData)
      .then(res => {
        showSnackbar('Successfully Created!', { variant: 'success' })
        onEmployeeRolesClear()
        const tasks = serviceTaskFormData.tasks
        tasks[employeeRolesFor] = {
          ...tasks[employeeRolesFor],
          employeeRoleId: res.data.id
        }
        setServiceTaskFormData(prevState => ({
          ...prevState,
          ...tasks
        }))
        if (employeeRolesDropdownRef.current && typeof employeeRolesDropdownRef.current.refreshList === 'function') {
          employeeRolesDropdownRef.current.refreshList()
        } else {
          console.warn('employeeRolesDropdownRef is not set or not a valid Dropdown instance.')
        }
      })
      .catch(error => {
        setErrorMessage(error?.response?.data?.errors)
        showSnackbar(error?.response?.data?.message, { variant: 'error' })
      })
  }

  const onEmployeeRolesClear = () => {
    setEmployeeRolesFormData(employeeRolesDefaultData)
    setErrorMessage({})
    handleEmployeeRolesModalClose()
  }

  useEffect(() => {
    getTree()
  }, [])

  const onDragEnter: TreeProps['onDragEnter'] = info => {
    //console.log(info)
    // expandedKeys, set it when controlled is needed
    // setExpandedKeys(info.expandedKeys)
  }

  const onDrop = (info: any) => {
    let position = info.dropPosition
    const { dragNode, node, dropToGap, dragNodesKeys } = info
    const dropKey = node.key
    const dragKey = dragNode.key
    const dropPos = node.pos.split('-')
    if (position == -1) {
      position = 0
    } else {
      if (!dropToGap) {
        position = position + 1
      }
    }

    if (position == dragNode.order) {
      return
    }

    const loop = (
      data: TreeDataNode[],
      key: React.Key,
      callback: (node: TreeDataNode, i: number, data: TreeDataNode[]) => void
    ) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data)
        }
        if (data[i].children) {
          loop(data[i].children!, key, callback)
        }
      }
    }
    const initialServiceTreeData = [...serviceTreeData]
    const updateServiceTreeData = [...serviceTreeData]

    // Find dragObject
    let dragObj: TreeDataNode
    loop(updateServiceTreeData, dragKey, (item, index, arr) => {
      arr.splice(index, 1)
      dragObj = item
    })

    let ar: TreeDataNode[] = []
    let i: number
    loop(updateServiceTreeData, dropKey, (_item, index, arr) => {
      ar = arr
      i = index
    })
    if (position === -1) {
      // Drop on the top of the drop node
      ar.splice(i!, 0, dragObj!)
    } else {
      // Drop on the bottom of the drop node
      ar.splice(i! + 1, 0, dragObj!)
    }
    setServiceTreeData(updateServiceTreeData)

    if (dragNode.type == 'service') {
      apiRequest
        .put(`/services/${dragNode.id}`, {
          name: dragNode.name,
          projectTypeId: dragNode.projectType.id,
          order: position
        })
        .then(res => {
          showSnackbar('Updated Successfully', { variant: 'success' })
        })
        .catch(error => {
          console.log(error)

          showSnackbar(error?.message, { variant: 'error' })

          setServiceTreeData(initialServiceTreeData)
        })
    }

    if (dragNode.type == 'group') {
      apiRequest
        .put(`/service-groups/${dragNode.id}`, {
          ...dragNode,
          order: position
        })
        .then(res => {
          showSnackbar('Updated Successfully', { variant: 'success' })
        })
        .catch(error => {
          showSnackbar(error?.message, { variant: 'error' })
          setServiceTreeData(initialServiceTreeData)
        })
    }
    if (dragNode.type == 'sow') {
      apiRequest
        .put(`/service-scopes/${dragNode.id}`, {
          ...dragNode,
          serviceGroupId: dragNode.groupId,
          order: position
        })
        .then(res => {
          showSnackbar('Updated Successfully', { variant: 'success' })
        })
        .catch(error => {
          showSnackbar(error?.message, { variant: 'error' })
          setServiceTreeData(initialServiceTreeData)
        })
    }

    if (dragNode.type == 'deliverable') {
      apiRequest
        .put(`/service-deliverables/${dragNode.id}`, {
          ...dragNode,

          order: position
        })
        .then(res => {
          showSnackbar('Updated Successfully', { variant: 'success' })
        })
        .catch(error => {
          showSnackbar(error?.message, { variant: 'error' })
          setServiceTreeData(initialServiceTreeData)
        })
    }
    if (dragNode.type == 'task' || dragNode.type == 'sub_task') {
      apiRequest
        .put(`/service-deliverable-tasks/${dragNode.id}`, {
          ...dragNode,
          serviceDeliverableId: dragNode.deliverableId,
          parentTaskId: dragNode.taskId ? dragNode.taskId : '',
          order: position
        })
        .then(res => {
          showSnackbar('Updated Successfully', { variant: 'success' })
        })
        .catch(error => {
          showSnackbar(error?.message, { variant: 'error' })
          setServiceTreeData(initialServiceTreeData)
        })
    }

    // setDefaultExpandedKeys([dragNode.key])
  }

  return (
    <>
      <Box className='container px-6 mx-auto'>
        <Box
          component={'h1'}
          className='mt-5 mb-4 text-xl font-semibold text-gray-600 dark:text-gray-300'
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          Service
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '40px',
              width: '40px',
              p: '0',
              ml: '20px',
              background: '#9333ea',
              minWidth: 'auto',
              color: '#fff',
              borderRadius: '50%',
              cursor: 'pointer',
              '&:hover': {
                background: '#7e22ce'
              }
            }}
            onClick={() => {
              handleServiceModalOpen()
              setFormType(EServiceFormType.SERVICE)
            }}
          >
            <AddIcon />
          </Box>
        </Box>

        <Box>
          <Box sx={{ flexGrow: 1 }}>
            <DirectoryTree
              className='draggable-tree'
              draggable={true}
              blockNode
              onDragEnter={onDragEnter}
              onDrop={onDrop}
              defaultExpandAll
              treeData={serviceTreeData}
              multiple
              expandedKeys={expendendKeys}
              onExpand={(expanded: any) => {
                setExpandedKeys([...expanded])
              }}
              allowDrop={(options: any) => {
                if (options?.dragNode?.type === options?.dropNode?.type) {
                  if (
                    options?.dropNode?.type == 'group' &&
                    options?.dragNode?.serviceId === options?.dropNode?.serviceId
                  ) {
                    return options
                  } else if (
                    options?.dropNode?.type == 'sow' &&
                    options?.dragNode?.groupId === options?.dropNode?.groupId
                  ) {
                    return options
                  } else if (
                    options?.dropNode?.type == 'deliverable' &&
                    options?.dragNode?.scopeId === options?.dropNode?.scopeId
                  ) {
                    return options
                  } else if (
                    options?.dropNode?.type == 'task' &&
                    options?.dragNode?.deliverableId === options?.dropNode?.deliverableId
                  ) {
                    return options
                  }

                  return options
                } else {
                  return false
                }
              }}
              titleRender={(node: any) => {
                if (node?.['type'] == 'service') {
                  return (
                    <Box sx={treeTitleSx}>
                      <Box title={''} dangerouslySetInnerHTML={{ __html: node?.title as string }}></Box>
                      <Box sx={treeButtonContainerSx}>
                        <Button
                          onClick={e => {
                            handleServiceEditButton(e, node, node?.['id'])
                          }}
                          sx={editButtonSx}
                        >
                          <EditIcon fontSize='small' />
                        </Button>
                        <Button
                          onClick={e => {
                            onServiceDelete(node?.['id'])
                          }}
                          sx={deleteButtonSx}
                        >
                          <DeleteIcon fontSize='small' />
                        </Button>
                        <Button
                          onClick={e => {
                            e.preventDefault()
                            e.stopPropagation()
                            console.log(node)

                            handleServiceModalOpen()
                            setFormType(EServiceFormType.GROUP)
                            setServiceGroupFormData(prevState => ({ ...prevState, serviceId: node.id }))
                          }}
                          sx={addButtonSx}
                        >
                          <AddIcon fontSize='small' /> Add Group
                        </Button>
                      </Box>
                    </Box>
                  )
                } else if (node?.['type'] == 'group') {
                  return (
                    <Box component={'span'} sx={treeTitleSx}>
                      <Box component={'span'} dangerouslySetInnerHTML={{ __html: node?.title as string }}></Box>
                      <Box component={'span'} sx={treeButtonContainerSx}>
                        <Button
                          onClick={e => {
                            handleServiceGroupEditButton(e, node, node?.['id'])
                          }}
                          sx={editButtonSx}
                        >
                          <EditIcon fontSize='small' />
                        </Button>
                        <Button
                          onClick={e => {
                            onServiceGroupDelete(node?.['id'])
                          }}
                          sx={deleteButtonSx}
                        >
                          <DeleteIcon fontSize='small' />
                        </Button>
                        <Button
                          onClick={e => {
                            e.preventDefault()
                            e.stopPropagation()
                            handleServiceModalOpen()
                            setFormType(EServiceFormType.SOW)
                            setServiceSOWFormData(prevState => ({ ...prevState, serviceGroupId: node.id }))
                          }}
                          sx={addButtonSx}
                        >
                          <AddIcon fontSize='small' /> Add SOW
                        </Button>
                      </Box>
                    </Box>
                  )
                } else if (node?.['type'] == 'sow') {
                  return (
                    <Box component={'span'} sx={treeTitleSx}>
                      <Box component={'span'} dangerouslySetInnerHTML={{ __html: node?.title as string }}></Box>
                      <Box component={'span'} sx={treeButtonContainerSx}>
                        <Button
                          onClick={e => {
                            handleServiceSOWEditButton(e, node, node?.['id'])
                          }}
                          sx={editButtonSx}
                        >
                          <EditIcon fontSize='small' />
                        </Button>
                        <Button
                          onClick={e => {
                            onServiceScopeDelete(node?.['id'])
                          }}
                          sx={deleteButtonSx}
                        >
                          <DeleteIcon fontSize='small' />
                        </Button>
                        <Button
                          onClick={e => {
                            e.preventDefault()
                            e.stopPropagation()
                            handleServiceModalOpen()
                            setFormType(EServiceFormType.DELIVARABLE)
                            setServiceDeliverableFormData(prevState => ({ ...prevState, serviceScopeId: node.id }))
                          }}
                          sx={addButtonSx}
                        >
                          <AddIcon fontSize='small' /> Add Deliverable
                        </Button>
                      </Box>
                    </Box>
                  )
                } else if (node?.['type'] == 'deliverable') {
                  return (
                    <Box component={'span'} sx={treeTitleSx}>
                      <Box component={'span'} dangerouslySetInnerHTML={{ __html: node?.title as string }}></Box>
                      <Box component={'span'} sx={treeButtonContainerSx}>
                        <Button
                          onClick={e => {
                            handleServiceDeliverableEditButton(e, node, node?.['id'])
                          }}
                          sx={editButtonSx}
                        >
                          <EditIcon fontSize='small' />
                        </Button>
                        <Button
                          onClick={e => {
                            onServiceDeliverableDelete(node?.['id'])
                          }}
                          sx={deleteButtonSx}
                        >
                          <DeleteIcon fontSize='small' />
                        </Button>
                        <Button
                          onClick={e => {
                            console.log(node)
                            e.preventDefault()
                            e.stopPropagation()
                            handleServiceModalOpen()
                            setFormType(EServiceFormType.TASK)
                            setServiceTaskFormData(prevState => ({
                              ...prevState,
                              serviceDeliverableId: node.id
                            }))
                          }}
                          sx={addButtonSx}
                        >
                          <AddIcon fontSize='small' /> Add Task
                        </Button>
                      </Box>
                    </Box>
                  )
                } else if (node?.['type'] == 'task' || node?.['type'] == 'sub_task') {
                  return (
                    <Box component={'span'} sx={treeTitleSx}>
                      <Box component={'span'} dangerouslySetInnerHTML={{ __html: node?.title as string }}></Box>
                      <Box component={'span'} sx={treeButtonContainerSx}>
                        <Button
                          onClick={e => {
                            handleServiceTaskEditButton(e, node, node?.['id'])
                          }}
                          sx={editButtonSx}
                        >
                          <EditIcon fontSize='small' />
                        </Button>
                      </Box>
                      <Button
                        onClick={e => {
                          onServiceDeliverableTaskDelete(node?.['id'])
                        }}
                        sx={deleteButtonSx}
                      >
                        <DeleteIcon fontSize='small' />
                      </Button>
                      <Button
                        onClick={e => {
                          console.log(node)

                          e.preventDefault()
                          e.stopPropagation()
                          handleServiceModalOpen()
                          setFormType(EServiceFormType.TASK)
                          setServiceTaskFormData(prevState => ({
                            ...prevState,
                            serviceDeliverableId: node.deliverableId,
                            parentTaskId: node.id
                          }))
                        }}
                        sx={addButtonSx}
                      >
                        <AddIcon fontSize='small' />
                        Add Sub Task
                      </Button>
                    </Box>
                  )
                }

                return <Box component={'span'}>{node?.title}</Box>
              }}
            />
          </Box>
        </Box>

        <Modal
          open={serviceModalOpen}
          onClose={handleServiceModalClose}
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
                      <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Project Type</span>
                      <Dropdown
                        url={'project-type'}
                        name='projectTypeId'
                        value={serviceFormData.projectTypeId}
                        onChange={e => handleSelectChange(e, serviceFormData, setServiceFormData)}
                      />
                      {!!errorMessage?.['projectTypeId'] &&
                        errorMessage?.['projectTypeId']?.map((message: any, index: number) => {
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
                      <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Name</span>

                      <RichTextEditor
                        value={serviceFormData.name}
                        onBlur={newContent => handleReachText(newContent, 'name', serviceFormData, setServiceFormData)}
                      />
                      {!!errorMessage?.['name'] &&
                        errorMessage?.['name']?.map((message: any, index: number) => {
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
                      <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Order</span>
                      <input
                        className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                        placeholder='Examples: 1'
                        name='order'
                        value={serviceFormData.order}
                        onChange={e => {
                          handleTextChange(e, serviceFormData, setServiceFormData)
                        }}
                      />
                      {!!errorMessage?.['order'] &&
                        errorMessage?.['order']?.map((message: any, index: number) => {
                          return (
                            <span key={index} className='text-xs text-red-600 dark:text-red-400'>
                              {message}
                            </span>
                          )
                        })}
                    </label>
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
                      <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Service</span>
                      <Dropdown
                        url={'services'}
                        name='serviceId'
                        value={serviceGroupFormData.serviceId}
                        onChange={e => {
                          handleSelectChange(e, serviceGroupFormData, setServiceGroupFormData)
                        }}
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

                {serviceGroupEditDataId ? (
                  <>
                    <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
                      <Box sx={{ width: '100%' }}>
                        <label className='block text-sm'>
                          <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Name</span>

                          <RichTextEditor
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
                        </label>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
                      <Box sx={{ width: '100%' }}>
                        <label className='block text-sm'>
                          <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Order</span>
                          <input
                            className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                            placeholder='Examples: 1'
                            name='order'
                            value={serviceGroupFormData.order}
                            onChange={e => {
                              handleTextChange(e, serviceGroupFormData, setServiceGroupFormData)
                            }}
                          />
                          {!!errorMessage?.['order'] &&
                            errorMessage?.['order']?.map((message: any, index: number) => {
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
                      flexDirection: 'column'
                    }}
                  >
                    <>
                      {serviceGroupFormData.groups?.map((group, index) => (
                        <Box
                          key={index}
                          sx={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            p: '20px',
                            border: '2px solid #9333ea'
                          }}
                        >
                          <Box sx={{ width: '100%' }}>
                            <Box sx={{ width: '100%', display: 'flex', gap: 5, mb: 5 }}>
                              <Box sx={{ width: '100%' }}>
                                <label className='block text-sm'>
                                  <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Name</span>
                                </label>

                                <Box sx={{ width: '100%' }}>
                                  <RichTextEditor
                                    value={group.name}
                                    onBlur={newContent =>
                                      handleMultipleReachTextChange(
                                        newContent,
                                        'name',
                                        index,
                                        serviceGroupFormData,
                                        setServiceGroupFormData,
                                        'groups'
                                      )
                                    }
                                  />
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
                            <Box sx={{ width: '100%', display: 'flex', gap: 5, mb: 5 }}>
                              <Box sx={{ width: '100%' }}>
                                <label className='block text-sm'>
                                  <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Order</span>
                                  <input
                                    className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                                    placeholder='Examples: 1'
                                    name='order'
                                    value={group.order}
                                    onChange={e => {
                                      handleMultipleTextChange(
                                        e,
                                        serviceGroupFormData,
                                        setServiceGroupFormData,
                                        index,
                                        'groups'
                                      )
                                    }}
                                  />
                                </label>
                              </Box>
                            </Box>
                          </Box>
                          <Button
                            type='button'
                            onClick={() =>
                              removeNameField(index, serviceGroupFormData, setServiceGroupFormData, 'groups')
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
                      ))}
                    </>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        type='button'
                        onClick={() => {
                          addSubField(
                            serviceGroupFormData,
                            setServiceGroupFormData,
                            'groups',
                            serviceGroupDefaultData.groups
                          )
                        }}
                        className='px-4 py-2 mr-3 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-blue'
                      >
                        <AddIcon /> Add Another Group
                      </button>
                    </Box>
                  </Box>
                )}

                <Box className='my-4 text-right'>
                  <button
                    onClick={onServiceGroupClear}
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
                      <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Service Group</span>
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

                {serviceSOWEditDataId ? (
                  <>
                    <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
                      <Box sx={{ width: '100%' }}>
                        <label className='block text-sm'>
                          <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Name</span>
                        </label>
                        <RichTextEditor
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
                    <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
                      <Box sx={{ width: '100%' }}>
                        <label className='block text-sm'>
                          <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Order</span>
                          <input
                            className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                            placeholder='Examples: 1'
                            name='order'
                            value={serviceSOWFormData.order}
                            onChange={e => {
                              handleTextChange(e, serviceSOWFormData, setServiceSOWFormData)
                            }}
                          />
                          {!!errorMessage?.['order'] &&
                            errorMessage?.['order']?.map((message: any, index: number) => {
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
                      flexDirection: 'column'
                    }}
                  >
                    <>
                      {serviceSOWFormData.scopes?.map((scope, index) => (
                        <Box
                          key={index}
                          sx={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            p: '20px',
                            padding: '24px'
                          }}
                        >
                          <Box sx={{ width: '100%' }}>
                            <Box sx={{ width: '100%', display: 'flex', gap: 5, mb: 5 }}>
                              <Box sx={{ width: '100%' }}>
                                <label className='block text-sm'>
                                  <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Name</span>
                                </label>

                                <Box sx={{ width: '100%' }}>
                                  <RichTextEditor
                                    value={scope.name}
                                    onBlur={newContent =>
                                      handleMultipleReachTextChange(
                                        newContent,
                                        'name',
                                        index,
                                        serviceSOWFormData,
                                        setServiceSOWFormData,
                                        'scopes'
                                      )
                                    }
                                  />
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
                            <Box sx={{ width: '100%', display: 'flex', gap: 5, mb: 5 }}>
                              <Box sx={{ width: '100%' }}>
                                <label className='block text-sm'>
                                  <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Order</span>
                                  <input
                                    className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                                    placeholder='Examples: 1'
                                    name='order'
                                    value={scope.order}
                                    onChange={e => {
                                      handleMultipleTextChange(
                                        e,
                                        serviceSOWFormData,
                                        setServiceSOWFormData,
                                        index,
                                        'scopes'
                                      )
                                    }}
                                  />
                                </label>
                              </Box>
                            </Box>
                          </Box>
                          <Button
                            type='button'
                            onClick={() => removeNameField(index, serviceSOWFormData, setServiceSOWFormData, 'scopes')}
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
                      ))}
                    </>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        type='button'
                        onClick={() => {
                          addSubField(serviceSOWFormData, setServiceSOWFormData, 'scopes', serviceSOWDefaultData.scopes)
                        }}
                        className='px-4 py-2 mr-3 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-blue'
                      >
                        <AddIcon /> Add Another Scope
                      </button>
                    </Box>
                  </Box>
                )}
                <Box className='my-4 text-right'>
                  <button
                    onClick={onServiceSOWClear}
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
                      <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Service Scope</span>
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

                {serviceDeliverableEditDataId ? (
                  <>
                    <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
                      <Box sx={{ width: '100%' }}>
                        <label className='block text-sm'>
                          <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Name</span>
                        </label>
                        <RichTextEditor
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
                    <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
                      <Box sx={{ width: '100%' }}>
                        <label className='block text-sm'>
                          <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Order</span>
                          <input
                            className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                            placeholder='Examples: 1'
                            name='order'
                            value={serviceDeliverableFormData.order}
                            onChange={e => {
                              handleTextChange(e, serviceDeliverableFormData, setServiceDeliverableFormData)
                            }}
                          />
                          {!!errorMessage?.['order'] &&
                            errorMessage?.['order']?.map((message: any, index: number) => {
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
                      flexDirection: 'column'
                    }}
                  >
                    <>
                      {serviceDeliverableFormData.deliverables?.map((deliverable, index) => (
                        <Box
                          key={index}
                          sx={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            p: '20px',
                            borderRadius: '5px'
                          }}
                        >
                          <Box sx={{ width: '100%' }}>
                            <Box sx={{ width: '100%', display: 'flex', gap: 5, mb: 5 }}>
                              <Box sx={{ width: '100%' }}>
                                <label className='block text-sm'>
                                  <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Name</span>
                                </label>

                                <Box sx={{ width: '100%' }}>
                                  <RichTextEditor
                                    value={deliverable.name}
                                    onBlur={newContent =>
                                      handleMultipleReachTextChange(
                                        newContent,
                                        'name',
                                        index,
                                        serviceDeliverableFormData,
                                        setServiceDeliverableFormData,
                                        'deliverables'
                                      )
                                    }
                                  />
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
                            <Box sx={{ width: '100%', display: 'flex', gap: 5, mb: 5 }}>
                              <Box sx={{ width: '100%' }}>
                                <label className='block text-sm'>
                                  <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Order</span>
                                  <input
                                    className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                                    placeholder='Examples: 1'
                                    name='order'
                                    value={deliverable.order}
                                    onChange={e => {
                                      handleMultipleTextChange(
                                        e,
                                        serviceDeliverableFormData,
                                        setServiceDeliverableFormData,
                                        index,
                                        'deliverables'
                                      )
                                    }}
                                  />
                                </label>
                              </Box>
                            </Box>
                          </Box>
                          <Button
                            type='button'
                            onClick={() =>
                              removeNameField(
                                index,
                                serviceDeliverableFormData,
                                setServiceDeliverableFormData,
                                'deliverables'
                              )
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
                      ))}
                    </>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        type='button'
                        onClick={() => {
                          addSubField(
                            serviceDeliverableFormData,
                            setServiceDeliverableFormData,
                            'deliverables',
                            serviceDeliverableDefaultData.deliverables
                          )
                        }}
                        className='px-4 py-2 mr-3 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-blue'
                      >
                        <AddIcon /> Add Another Deliverable
                      </button>
                    </Box>
                  </Box>
                )}
                <Box className='my-4 text-right'>
                  <button
                    onClick={onServiceDeliverableClear}
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
                      <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Fetch Task From Clickup</span>
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
                            <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Clickup Link</span>
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
                                        <RichTextEditor
                                          value={clickupTask.name}
                                          onBlur={newContent =>
                                            handleMultipleTaskFieldChange(newContent, 'name', index)
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
                                        <RichTextEditor
                                          value={clickupTask.name}
                                          onBlur={newContent =>
                                            handleMultipleTaskFieldChange(newContent, 'name', index)
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
                                                  <span className='flex text-gray-700 dark:text-gray-400 mb-1'>
                                                    Name
                                                  </span>
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
                                                      <RichTextEditor
                                                        value={subTask.name}
                                                        onBlur={newContent =>
                                                          handleMultipleTaskFieldChange(newContent, 'name', index)
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
                                                          <span className='flex text-gray-700 dark:text-gray-400 mb-1'>
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
                                                          <span className='flex text-gray-700 dark:text-gray-400 mb-1'>
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
                            <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Service Deliverable</span>
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
                        {isShowParentTaskField && (
                          <Box
                            sx={{
                              width: '50%',
                              '& .MuiInputBase-root': {
                                border: errorMessage?.['parentTaskId'] ? '1px solid #dc2626' : ''
                              }
                            }}
                          >
                            <label className='block text-sm'>
                              <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Parent Task</span>
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
                        )}
                      </Box>

                      {serviceTaskEditDataId ? (
                        <>
                          <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
                            <Box sx={{ width: '100%' }}>
                              <label className='block text-sm'>
                                <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Name</span>
                              </label>
                              <RichTextEditor
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
                            <Box sx={{ width: '100%' }}>
                              <label className='block text-sm'>
                                <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Order</span>
                                <input
                                  className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                                  placeholder='Examples: 1'
                                  name='order'
                                  value={serviceTaskFormData.order}
                                  onChange={e => {
                                    handleTextChange(e, serviceTaskFormData, setServiceTaskFormData)
                                  }}
                                />
                                {!!errorMessage?.['order'] &&
                                  errorMessage?.['order']?.map((message: any, index: number) => {
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
                                <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Employee Role</span>
                              </label>
                              <Dropdown
                                url={`employee-roles`}
                                name='employeeRoleId'
                                value={serviceTaskFormData.employeeRoleId}
                                onChange={e => {
                                  handleSelectChange(e, serviceTaskFormData, setServiceTaskFormData)
                                }}
                              />
                              {!!errorMessage?.['employeeRoleId'] &&
                                errorMessage?.['employeeRoleId']?.map((message: any, index: number) => {
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
                                <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Hour</span>
                                <input
                                  className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                                  placeholder='Examples: 50.00'
                                  name='cost'
                                  value={serviceTaskFormData.cost}
                                  onChange={e => {
                                    handleTextChange(e, serviceTaskFormData, setServiceTaskFormData)
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
                                <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Description</span>
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
                                    <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Name</span>
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
                                        <RichTextEditor
                                          value={task.name}
                                          onBlur={newContent =>
                                            handleMultipleTaskFieldChange(newContent, 'name', index)
                                          }
                                        />
                                        {!!errorMessage?.[`tasks.${index}.name`] &&
                                          errorMessage?.[`tasks.${index}.name`]?.map((message: any, index: number) => {
                                            return (
                                              <span key={index} className='text-xs text-red-600 dark:text-red-400'>
                                                {String(message).replaceAll('tasks.0.', '')}
                                              </span>
                                            )
                                          })}
                                      </Box>
                                      <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
                                        <Box sx={{ width: '100%' }}>
                                          <label className='block text-sm'>
                                            <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Order</span>
                                            <input
                                              className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                                              placeholder='Examples: 1'
                                              name='order'
                                              value={task.order}
                                              onChange={e => {
                                                handleMultipleTaskFieldChange(e.target.value, 'order', index)
                                              }}
                                            />
                                          </label>
                                        </Box>
                                      </Box>
                                      <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
                                        <Box sx={{ width: '100%' }}>
                                          <label className='block text-sm'>
                                            <span className='flex text-gray-700 dark:text-gray-400 mb-1'>
                                              Employee Role
                                            </span>
                                          </label>
                                          <Dropdown
                                            ref={employeeRolesDropdownRef}
                                            url={`employee-roles`}
                                            name='employeeRoleId'
                                            value={task.employeeRoleId}
                                            onChange={e => {
                                              handleMultipleTaskFieldChange(e.target.value, 'employeeRoleId', index)
                                            }}
                                            isAddNewButton={true}
                                            onAddNew={() => {
                                              handleEmployeeRolesModalOpen()
                                              setEmployeeRolesFor(index)
                                            }}
                                            syncOnOpen={true}
                                          />
                                        </Box>
                                      </Box>
                                      <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
                                        <Box sx={{ width: '50%' }}>
                                          <label className='block text-sm'>
                                            <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Hour</span>
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
                                            <span className='flex text-gray-700 dark:text-gray-400 mb-1'>
                                              Description
                                            </span>
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
                              <AddIcon /> Add Another Task
                            </button>
                          </Box>
                        </Box>
                      )}
                      <Box className='my-4 text-right'>
                        <button
                          onClick={onServiceTaskClear}
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
        </Modal>
        <Modal
          open={employeeRolesModalOpen}
          onClose={handleEmployeeRolesModalClose}
          aria-labelledby='employee-roles-modal-title'
          aria-describedby='employee-roles-modal-description'
          sx={{
            width: '100%',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Box
            sx={{
              width: '50%',
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
                width: '100%',
                overflowY: 'auto',
                p: '50px',
                maxHeight: '100%',
                '& form': { width: '100%', display: 'flex', flexDirection: 'column' }
              }}
            >
              <Box sx={{ mb: '20px' }}>
                <h2 className='my-6 text-xl font-semibold text-gray-700 dark:text-gray-200'>Add Employee Roles</h2>
                <Box className='p-5 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800'>
                  <form
                    onSubmit={e => {
                      onEmployeeRolesSubmit(e)
                    }}
                  >
                    <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
                      <Box sx={{ width: '100%' }}>
                        <label className='block text-sm'>
                          <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Role Name</span>
                          <input
                            className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                            placeholder='Enter role name'
                            name='name'
                            value={employeeRolesFormData.name}
                            onChange={e => {
                              handleTextChange(e, employeeRolesFormData, setEmployeeRolesFormData)
                            }}
                          />
                          {!!errorMessage?.['name'] &&
                            errorMessage?.['name']?.map((message: any, index: number) => {
                              return (
                                <span key={index} className='text-xs text-red-600 dark:text-red-400'>
                                  {message}
                                </span>
                              )
                            })}
                        </label>
                      </Box>
                      <Box sx={{ width: '100%' }}>
                        <label className='block text-sm'>
                          <span className='flex text-gray-700 dark:text-gray-400 mb-1'>Hourly Rate</span>
                          <input
                            className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                            placeholder='Enter hourly rate'
                            name='average_hourly'
                            value={employeeRolesFormData.average_hourly}
                            onChange={e => {
                              handleTextChange(e, employeeRolesFormData, setEmployeeRolesFormData)
                            }}
                            type='number'
                          />
                          {!!errorMessage?.['average_hourly'] &&
                            errorMessage?.['average_hourly']?.map((message: any, index: number) => {
                              return (
                                <span key={index} className='text-xs text-red-600 dark:text-red-400'>
                                  {message}
                                </span>
                              )
                            })}
                        </label>
                      </Box>
                    </Box>

                    <Box className='my-4 text-right'>
                      <button
                        onClick={onEmployeeRolesClear}
                        type='button'
                        className='px-4 py-2 mr-3 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-red-600 border border-transparent rounded-lg active:bg-red-600 hover:bg-red-700 focus:outline-none focus:shadow-outline-red'
                      >
                        Close <ClearIcon />
                      </button>
                      <button
                        type='submit'
                        className='px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-green-600 border border-transparent rounded-lg active:bg-green-600 hover:bg-green-700 focus:outline-none focus:shadow-outline-green'
                      >
                        Save <AddIcon />
                      </button>
                    </Box>
                  </form>
                </Box>
              </Box>
            </Box>
          </Box>
        </Modal>
      </Box>
    </>
  )
}
