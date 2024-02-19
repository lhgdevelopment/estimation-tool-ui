import AddIcon from '@mui/icons-material/Add'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import EditIcon from '@mui/icons-material/Edit'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Box, Button } from '@mui/material'
import { TreeItem } from '@mui/x-tree-view/TreeItem'
import { TreeView } from '@mui/x-tree-view/TreeView'
import { useEffect, useState } from 'react'
import apiRequest from 'src/@core/utils/axios-config'

export default function ServiceTreeComponent() {
  const [listData, setListData] = useState<any>([])

  const getList = () => {
    apiRequest.get(`/service-tree?per_page=1000`).then(res => {
      setListData(res.data.services)
    })
  }

  useEffect(() => {
    getList()
  }, [])

  console.log(listData)

  return (
    <>
      <Box className='container px-6 mx-auto'>
        <Box component={'h1'} className='mt-5 mb-4 text-xl font-semibold text-gray-600 dark:text-gray-300'>
          Service
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
          </Box>
        </Box>
      </Box>
    </>
  )
}
