import ClearIcon from '@material-ui/icons/Clear'
import AddIcon from '@mui/icons-material/Add'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import EditIcon from '@mui/icons-material/Edit'
import EditNoteIcon from '@mui/icons-material/EditNote'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Box, Button, Modal } from '@mui/material'
import { TreeItem } from '@mui/x-tree-view/TreeItem'
import { TreeView } from '@mui/x-tree-view/TreeView'
import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Dropdown } from 'src/@core/components/dropdown'
import { RootState } from 'src/@core/store/reducers'
import apiRequest from 'src/@core/utils/axios-config'
import Swal from 'sweetalert2'

export default function ServiceTreeComponent() {
  const [listData, setListData] = useState<any>([])
  const [serviceModalOpen, setServiceModalOpen] = useState(false)
  const handleServiceModalOpen = () => setServiceModalOpen(true)
  const handleServiceModalClose = () => setServiceModalOpen(false)
  const [serviceEditDataId, setServiceEditDataId] = useState<null | string>(null)
  const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false })
  const isDark = useSelector((state: RootState) => state.theme.isDark)
  const nameEditorRef = useRef(null)

  const serviceDefaultData = {
    name: '',
    projectTypeId: ''
  }

  const [serviceFormData, setServiceFormData] = useState(serviceDefaultData)

  const handleReachText = (value: string, field: string) => {
    setServiceFormData({
      ...serviceFormData,
      [field]: value
    })
  }

  const handleChange = (e: React.ChangeEvent<any>) => {
    setServiceFormData({
      ...serviceFormData,
      [e.target.name]: e.target.value
    })
  }

  const handleSelectChange = (e: any) => {
    setServiceFormData({
      ...serviceFormData,
      [e?.target?.name]: e?.target?.value
    })
  }

  const handleServiceEditButton = (e: any, data: any, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    console.log(data)

    setServiceFormData({
      name: data?.['name'],
      projectTypeId: data?.['projectTypeId']
    })
    setServiceEditDataId(id)
    handleServiceModalOpen()
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

  const onServiceClear = () => {
    setServiceFormData(prevState => ({ ...serviceDefaultData }))
    setServiceEditDataId(null)
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
            onClick={handleServiceModalOpen}
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
                    sx={{ p: 1, border: '1px solid #9333ea', my: 1 }}
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
                          sx={{ p: 1, border: '1px solid #9333ea', my: 1 }}
                          label={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Box dangerouslySetInnerHTML={{ __html: group?.name }}></Box>
                              <Box sx={{ width: '240px' }}>
                                <Button
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
                                sx={{ p: 1, border: '1px solid #9333ea', my: 1 }}
                                label={
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Box dangerouslySetInnerHTML={{ __html: sow?.name }}></Box>
                                    <Box sx={{ width: '240px' }}>
                                      <Button
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
                                      sx={{ p: 1, border: '1px solid #9333ea', my: 1 }}
                                      label={
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                          <Box dangerouslySetInnerHTML={{ __html: deliverable?.name }}></Box>
                                          <Box sx={{ width: '240px' }}>
                                            <Button
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
                                            sx={{ p: 1, border: '1px solid #9333ea', my: 1 }}
                                            label={
                                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Box dangerouslySetInnerHTML={{ __html: task?.name }}></Box>
                                                <Box sx={{ width: '240px' }}>
                                                  <Button
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
                  sx={{ display: 'flex', width: '50%' }}
                >
                  <form onSubmit={onServiceSubmit}>
                    <Box sx={{ display: 'flex', gap: 5, mb: 5 }}>
                      <Box sx={{ width: '100%' }}>
                        <label className='block text-sm'>
                          <span className='text-gray-700 dark:text-gray-400'>Project Type</span>
                          <Dropdown
                            url={'project-type'}
                            name='projectTypeId'
                            value={serviceFormData.projectTypeId}
                            onChange={handleSelectChange}
                            optionConfig={{ id: 'id', title: 'name' }}
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
                          onBlur={newContent => handleReachText(newContent, 'name')}
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
                </Box>
              </Box>
            </Modal>
          </Box>
        </Box>
      </Box>
    </>
  )
}
