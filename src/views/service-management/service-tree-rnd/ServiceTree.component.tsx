import ClearIcon from '@material-ui/icons/Clear'
import AddIcon from '@mui/icons-material/Add'
import BrowserUpdatedIcon from '@mui/icons-material/BrowserUpdated'
import DeleteIcon from '@mui/icons-material/Delete'
import EditNoteIcon from '@mui/icons-material/EditNote'
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove'
import { Box, Button, Checkbox, Modal } from '@mui/material'
import type { TreeDataNode, TreeProps } from 'antd'
import { Tree } from 'antd'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Dropdown, ServiceDropdownTree } from 'src/@core/components/dropdown'
import Preloader from 'src/@core/components/preloader'
import { RichTextEditor } from 'src/@core/components/rich-text-editor'
import apiRequest from 'src/@core/utils/axios-config'
import Swal from 'sweetalert2'
import { EServiceFormType, transformServiceTree } from './ServiceTree.decorator'

export default function ServiceTreeComponent() {
  const [serviceTreeData, setServiceTreeData] = useState<any>([])
  const [serviceModalOpen, setServiceModalOpen] = useState(false)
  const handleServiceModalOpen = () => setServiceModalOpen(true)
  const handleServiceModalClose = () => setServiceModalOpen(false)
  const [formType, setFormType] = useState<EServiceFormType>()

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
        setServiceTreeData((prevState: []) => {
          const updatedList: any = [...prevState]
          const editedServiceIndex = updatedList.findIndex(
            (item: any) => item['_id'] === serviceEditDataId // Replace 'id' with the actual identifier of your item
          )
          if (editedServiceIndex !== -1) {
            updatedList[editedServiceIndex] = res?.data
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
        setServiceTreeData((prevState: []) => [...prevState, res?.data])
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
          setServiceTreeData((prevState: []) => {
            const updatedList: any = [...prevState]
            const editedServiceIndex = updatedList.findIndex(
              (item: any) => item['_id'] === serviceGroupEditDataId // Replace 'id' with the actual identifier of your item
            )
            if (editedServiceIndex !== -1) {
              updatedList[editedServiceIndex] = res?.data
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
          setServiceTreeData((prevState: []) => [...prevState, ...res?.data])
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
          setServiceTreeData((prevState: []) => {
            const updatedList: any = [...prevState]
            const editedServiceIndex = updatedList.findIndex(
              (item: any) => item['_id'] === serviceSOWEditDataId // Replace 'id' with the actual identifier of your item
            )
            if (editedServiceIndex !== -1) {
              updatedList[editedServiceIndex] = res?.data
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
          setServiceTreeData((prevState: []) => [...prevState, ...res?.data])
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
          setServiceTreeData((prevState: []) => {
            const updatedList: any = [...prevState]
            const editedServiceIndex = updatedList.findIndex(
              (item: any) => item['_id'] === serviceDeliverableEditDataId // Replace 'id' with the actual identifier of your item
            )
            if (editedServiceIndex !== -1) {
              updatedList[editedServiceIndex] = res?.data
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
          setServiceTreeData((prevState: []) => [...prevState, ...res?.data])
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
        setClickupTaskList(res?.data)
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
          setServiceTreeData((prevState: []) => {
            const updatedList: any = [...prevState]
            const editedServiceIndex = updatedList.findIndex(
              (item: any) => item['_id'] === serviceTaskEditDataId // Replace 'id' with the actual identifier of your item
            )
            if (editedServiceIndex !== -1) {
              updatedList[editedServiceIndex] = res?.data
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
            setServiceTreeData(res?.data)
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

  const getList = async () => {
    try {
      const response = await apiRequest.get(`/service-tree?per_page=1000`)
      const services = response?.data?.services || []
      setServiceTreeData(transformServiceTree(services, 'service'))
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    getList()
  }, [])

  const onDragEnter: TreeProps['onDragEnter'] = info => {
    //console.log(info)
    // expandedKeys, set it when controlled is needed
    // setExpandedKeys(info.expandedKeys)
  }

  const onDrop: TreeProps['onDrop'] = (info: any) => {
    const dragNode = info.dragNode
    const dropKey = info.node.key
    const dragKey = info.dragNode.key
    const dropPos = info.node.pos.split('-')
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]) // the drop position relative to the drop node, inside 0, top -1, bottom 1
    if (dragNode?.type === 'service') {
      apiRequest
        .put(`/services/${dragNode?.id}`, {
          ...info?.dragNode,
          projectTypeId: dragNode?.projectType?.id,
          order: dropPosition == -1 ? dropPosition + 1 : 1
        })
        .then(res => {
          getList()
        })
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
    const data = [...serviceTreeData]

    // Find dragObject
    let dragObj: TreeDataNode
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1)
      dragObj = item
    })

    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, item => {
        item.children = item.children || []

        // where to insert. New item was inserted to the start of the array in this example, but can be anywhere
        item.children.unshift(dragObj)
      })
    } else {
      let ar: TreeDataNode[] = []
      let i: number
      loop(data, dropKey, (_item, index, arr) => {
        ar = arr
        i = index
      })
      if (dropPosition === -1) {
        // Drop on the top of the drop node
        ar.splice(i!, 0, dragObj!)
      } else {
        // Drop on the bottom of the drop node
        ar.splice(i! + 1, 0, dragObj!)
      }
    }
    setServiceTreeData(data)
  }

  console.log(serviceTreeData)

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
            <Tree
              className='draggable-tree'
              draggable={{
                nodeDraggable(node: any) {
                  return node?.['type'] == 'service'
                }
              }}
              blockNode
              onDragEnter={onDragEnter}
              onDrop={onDrop}
              treeData={serviceTreeData}

              // allowDrop={(node: any, dropPosition: any) => {
              //   console.log(node?.dragNode?.type)
              //   if (node?.dragNode?.type === node?.dropNode?.type) {
              //     return true
              //   } else {
              //     return false
              //   }
              // }}

              // titleRender={node => {
              //   return <>Hello</>
              // }}
            />
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
                      <RichTextEditor
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
                                  <RichTextEditor
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
                                  <RichTextEditor
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
                                  <RichTextEditor
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
                                          <RichTextEditor
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
                                          <RichTextEditor
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
                                                        <RichTextEditor
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
                                          <RichTextEditor
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
          </Box>
        </Modal>
      </Box>
    </>
  )
}
