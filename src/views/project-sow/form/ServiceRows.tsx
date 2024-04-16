import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { TableBody } from '@mui/material'
import Box from '@mui/material/Box'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import Table from '@mui/material/Table'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import * as React from 'react'

export default function ServiceRow(props: { service: any }) {
  const { service } = props
  const [serviceOpen, setServiceOpen] = React.useState<any>(null)
  const [groupOpen, setGroupOpen] = React.useState<any>(null)
  const [sowOpen, setSOWOpen] = React.useState<any>(null)
  const [openDeliverable, setDeliverableOpen] = React.useState<any>(null)
  const [openTask, setTaskOpen] = React.useState<any>(null)
  const handleServiceOnclick = (id: any) => {
    setServiceOpen((prevOpen: any) => (prevOpen === id ? null : id))
  }

  const handleGroupOnclick = (id: any) => {
    setGroupOpen((prevOpen: any) => (prevOpen === id ? null : id))
  }

  const handleSOWOnclick = (id: any) => {
    setSOWOpen((prevOpen: any) => (prevOpen === id ? null : id))
  }

  const handleDeliverableOnclick = (id: any) => {
    setDeliverableOpen((prevOpen: any) => (prevOpen === id ? null : id))
  }
  const handleTaskOnclick = (id: any) => {
    setTaskOpen((prevOpen: any) => (prevOpen === id ? null : id))
  }

  //console.log(service)
  console.log(open)

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          {!!service.groups.length && (
            <IconButton
              aria-label='expand row'
              size='small'
              onClick={() => {
                handleServiceOnclick(service.id)
              }}
            >
              {!(serviceOpen == service.id) ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          )}
        </TableCell>

        <TableCell component='th' scope='row' dangerouslySetInnerHTML={{ __html: service.name }}></TableCell>
        <TableCell>
          <input
            className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
            placeholder=''
            name='name'
          />
        </TableCell>
        <TableCell>
          <input
            className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
            placeholder=''
            name='name'
          />
        </TableCell>
        <TableCell>
          <input
            className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
            placeholder=''
            name='name'
          />
        </TableCell>
        <TableCell>
          <input
            className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
            placeholder=''
            name='name'
          />
        </TableCell>
        <TableCell>
          <input
            className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
            placeholder=''
            name='name'
          />
        </TableCell>
        <TableCell>
          <input
            className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
            placeholder=''
            name='name'
          />
        </TableCell>
        <TableCell>
          <input
            className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
            placeholder=''
            name='name'
          />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
          <Collapse in={!!(serviceOpen == service.id)} timeout='auto' unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant='h6' gutterBottom component='div'>
                Groups
              </Typography>
              <Table size='small' aria-label='group'>
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Deliverable & Timeline</TableCell>
                    <TableCell>Team Member</TableCell>
                    <TableCell>Hours</TableCell>
                    <TableCell>Timeline</TableCell>
                    <TableCell>Internal</TableCell>
                    <TableCell>Retail</TableCell>
                    <TableCell>Josh</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {service.groups.map((group: any) => (
                    <>
                      <TableRow key={group.id}>
                        <TableCell>
                          {!!group.sows.length && (
                            <IconButton
                              aria-label='expand row'
                              size='small'
                              onClick={() => {
                                handleGroupOnclick('grp' + service.id + group.id)
                              }}
                            >
                              {!!(groupOpen == 'grp' + service.id + group.id) ? (
                                <KeyboardArrowUpIcon />
                              ) : (
                                <KeyboardArrowDownIcon />
                              )}
                            </IconButton>
                          )}
                        </TableCell>
                        <TableCell
                          component='th'
                          scope='row'
                          dangerouslySetInnerHTML={{ __html: group.name }}
                        ></TableCell>
                        <TableCell>
                          <input
                            className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                            placeholder=''
                            name='name'
                          />
                        </TableCell>
                        <TableCell>
                          <input
                            className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                            placeholder=''
                            name='name'
                          />
                        </TableCell>
                        <TableCell>
                          <input
                            className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                            placeholder=''
                            name='name'
                          />
                        </TableCell>
                        <TableCell>
                          <input
                            className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                            placeholder=''
                            name='name'
                          />
                        </TableCell>
                        <TableCell>
                          <input
                            className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                            placeholder=''
                            name='name'
                          />
                        </TableCell>
                        <TableCell>
                          <input
                            className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                            placeholder=''
                            name='name'
                          />
                        </TableCell>
                        <TableCell>
                          <input
                            className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                            placeholder=''
                            name='name'
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
                          <Collapse in={!!(groupOpen == 'grp' + service.id + group.id)} timeout='auto' unmountOnExit>
                            <Box sx={{ margin: 1 }}>
                              <Typography variant='h6' gutterBottom component='div'>
                                SOWs
                              </Typography>
                              <Table size='small' aria-label='group'>
                                <TableHead>
                                  <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Deliverable & Timeline</TableCell>
                                    <TableCell>Team Member</TableCell>
                                    <TableCell>Hours</TableCell>
                                    <TableCell>Timeline</TableCell>
                                    <TableCell>Internal</TableCell>
                                    <TableCell>Retail</TableCell>
                                    <TableCell>Josh</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {group.sows.map((sow: any) => (
                                    <>
                                      <TableRow key={sow.id}>
                                        <TableCell>
                                          {!!sow.deliverables.length && (
                                            <IconButton
                                              aria-label='expand row'
                                              size='small'
                                              onClick={() => {
                                                handleSOWOnclick('sow' + service.id + group.id + sow.id)
                                              }}
                                            >
                                              {!!(sowOpen == 'sow' + service.id + group.id + sow.id) ? (
                                                <KeyboardArrowUpIcon />
                                              ) : (
                                                <KeyboardArrowDownIcon />
                                              )}
                                            </IconButton>
                                          )}
                                        </TableCell>
                                        <TableCell
                                          component='th'
                                          scope='row'
                                          dangerouslySetInnerHTML={{ __html: sow.name }}
                                        ></TableCell>
                                        <TableCell>
                                          <input
                                            className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                                            placeholder=''
                                            name='name'
                                          />
                                        </TableCell>
                                        <TableCell>
                                          <input
                                            className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                                            placeholder=''
                                            name='name'
                                          />
                                        </TableCell>
                                        <TableCell>
                                          <input
                                            className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                                            placeholder=''
                                            name='name'
                                          />
                                        </TableCell>
                                        <TableCell>
                                          <input
                                            className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                                            placeholder=''
                                            name='name'
                                          />
                                        </TableCell>
                                        <TableCell>
                                          <input
                                            className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                                            placeholder=''
                                            name='name'
                                          />
                                        </TableCell>
                                        <TableCell>
                                          <input
                                            className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                                            placeholder=''
                                            name='name'
                                          />
                                        </TableCell>
                                        <TableCell>
                                          <input
                                            className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                                            placeholder=''
                                            name='name'
                                          />
                                        </TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
                                          <Collapse
                                            in={!!(sowOpen == 'sow' + service.id + group.id + sow.id)}
                                            timeout='auto'
                                            unmountOnExit
                                          >
                                            <Box sx={{ margin: 1 }}>
                                              <Typography variant='h6' gutterBottom component='div'>
                                                Deliverables
                                              </Typography>
                                              <Table size='small' aria-label='group'>
                                                <TableHead>
                                                  <TableRow>
                                                    <TableCell>Name</TableCell>
                                                    <TableCell>Deliverable & Timeline</TableCell>
                                                    <TableCell>Team Member</TableCell>
                                                    <TableCell>Hours</TableCell>
                                                    <TableCell>Timeline</TableCell>
                                                    <TableCell>Internal</TableCell>
                                                    <TableCell>Retail</TableCell>
                                                    <TableCell>Josh</TableCell>
                                                  </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                  {sow.deliverables.map((deliverable: any) => (
                                                    <TableRow key={deliverable.id}>
                                                      <TableCell
                                                        component='th'
                                                        scope='row'
                                                        dangerouslySetInnerHTML={{ __html: deliverable.name }}
                                                      ></TableCell>
                                                      <TableCell>
                                                        <input
                                                          className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                                                          placeholder=''
                                                          name='name'
                                                        />
                                                      </TableCell>
                                                      <TableCell>
                                                        <input
                                                          className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                                                          placeholder=''
                                                          name='name'
                                                        />
                                                      </TableCell>
                                                      <TableCell>
                                                        <input
                                                          className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                                                          placeholder=''
                                                          name='name'
                                                        />
                                                      </TableCell>
                                                      <TableCell>
                                                        <input
                                                          className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                                                          placeholder=''
                                                          name='name'
                                                        />
                                                      </TableCell>
                                                      <TableCell>
                                                        <input
                                                          className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                                                          placeholder=''
                                                          name='name'
                                                        />
                                                      </TableCell>
                                                      <TableCell>
                                                        <input
                                                          className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                                                          placeholder=''
                                                          name='name'
                                                        />
                                                      </TableCell>
                                                      <TableCell>
                                                        <input
                                                          className='block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                                                          placeholder=''
                                                          name='name'
                                                        />
                                                      </TableCell>
                                                    </TableRow>
                                                  ))}
                                                </TableBody>
                                              </Table>
                                            </Box>
                                          </Collapse>
                                        </TableCell>
                                      </TableRow>
                                    </>
                                  ))}
                                </TableBody>
                              </Table>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  )
}
