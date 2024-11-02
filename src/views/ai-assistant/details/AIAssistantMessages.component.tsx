import CopyToClipboard from '@core/components/copy-to-clipboard'
import { dateTime } from '@core/utils/dateTime'
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd'
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded'
import EditIcon from '@mui/icons-material/Edit'
import HiveIcon from '@mui/icons-material/Hive'
import { Avatar, Box, Tooltip } from '@mui/material'
import { marked } from 'marked'
import { MdPreview } from 'md-editor-rt'
import 'md-editor-rt/lib/preview.css'
import { useState } from 'react'

type TAIAssistantMessagesComponentProps = {
  message: any
  index: number
  isWaiting?: boolean
  onRegenerate?: () => void
  onEdit?: (data: any) => void
}
const renderer = new marked.Renderer()
const linkRenderer = renderer.link
renderer.link = (href, title, text) => {
  const html = linkRenderer.call(renderer, href, title, text)

  return html.replace(/^<a /, '<a target="_blank" rel="nofollow" ')
}
renderer.listitem = (text, task, checked) => {
  return `<li>${String(text).replace(/<p>|<\/p>/g, '')}</li>`
}

export default function AIAssistantMessagesComponent(props: TAIAssistantMessagesComponentProps) {
  const { message, index, isWaiting = false, onRegenerate, onEdit } = props

  const [bookmarkedFlush, setBookmarkFlush] = useState<any>(null)

  const handleBookmarkClick = (id: any) => {
    setBookmarkFlush(id)
    setTimeout(() => setBookmarkFlush(null), 2000)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        mb: '30px'
      }}
    >
      <Box
        sx={{
          mr: '10px'
        }}
      >
        {message?.role === 'system' ? (
          <Avatar sx={{ width: 32, height: 32, border: '1px solid #9333ea', backgroundColor: '#9333ea' }}>
            <HiveIcon sx={{ color: '#fff' }} />
          </Avatar>
        ) : (
          <Avatar sx={{ width: 32, height: 32, border: '1px solid #ddd' }} src={message?.user?.image}>
            {message?.user?.name ? message?.user?.name[0] : 'U'}
          </Avatar>
        )}
      </Box>
      <Box sx={{ width: '100%' }}>
        <Box
          className='text-gray-600 dark-d:text-gray-400'
          sx={{ fontWeight: 600, color: message?.role === 'system' ? '#9333ea' : '' }}
        >
          {message?.role === 'system' ? `Hive AI` : message?.user?.name ? message?.user?.name : 'You'}
        </Box>
        {message?.role === 'user' && message?.prompt?.name && (
          <Box sx={{ display: 'flex' }}>
            <Box sx={{ fontSize: '12px', color: '#fff', background: '#999', p: '2px 10px', borderRadius: '5px' }}>
              {message?.prompt?.name}
            </Box>
          </Box>
        )}

        <Box sx={{ width: '100%', lineHeight: 'normal', mt: 2, borderRadius: 1, overflow: 'hidden' }}>
          {isWaiting ? (
            <Box
              sx={{
                height: '14px',
                width: '14px',
                borderRadius: '50%',
                m: '5px'
              }}
            >
              <Box
                sx={{
                  height: '100%',
                  width: '100%'
                }}
                component={'img'}
                src='/gif/hive-assist-loader.gif'
              ></Box>
            </Box>
          ) : message?.message_content ? (
            // <Box
            //   className='md-editor-preview'
            //   sx={{
            //     p: 4,
            //     wordBreak: 'auto-phrase',
            //     textAlign: 'justify'
            //   }}
            //   dangerouslySetInnerHTML={{ __html: message?.message_content }}
            // ></Box>
            <MdPreview editorId={'message'} modelValue={message?.message_content} />
          ) : (
            <> </>
          )}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: '10px' }}>
          {message?.role === 'system' ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              {!!message?.message_content && (
                <CopyToClipboard
                  textToCopy={message?.message_content}
                  title=''
                  tooltipTitle='Copy'
                  tooltipPlacement='top'
                  sx={{
                    p: 0,
                    background: 'transparent',
                    color: '#9b9b9b',

                    '& svg': {
                      fontSize: '18px',
                      m: 0
                    },
                    ':hover': {
                      background: 'transparent',
                      color: '#000'
                    },
                    ':focus': { outline: 0, outlineOffset: 0, boxShadow: 0 }
                  }}
                />
              )}

              {/* {onRegenerate && (
              <Tooltip title='Regenerate'>
                <Box
                  component={'button'}
                  sx={{
                    color: '#9b9b9b',
                    ':hover': {
                      color: '#000'
                    }
                  }}
                  onClick={onRegenerate}
                >
                  <ReplayIcon sx={{ fontSize: '18px' }} />
                </Box>
              </Tooltip>
            )} */}

              {onEdit && (
                <Tooltip placement='top' title='Edit'>
                  <Box
                    component={'button'}
                    sx={{
                      color: '#9b9b9b',
                      ':hover': {
                        color: '#000'
                      }
                    }}
                    onClick={() => {
                      onEdit(message)
                    }}
                  >
                    <EditIcon sx={{ fontSize: '18px' }} />
                  </Box>
                </Tooltip>
              )}

              <Tooltip placement='top' title={bookmarkedFlush == message?.id ? 'Bookmark Added!' : 'Bookmark'}>
                <Box
                  component={'button'}
                  sx={{
                    color: '#9b9b9b',
                    ':hover': {
                      color: '#000'
                    }
                  }}
                  onClick={() => {
                    handleBookmarkClick(message?.id)
                  }}
                >
                  {bookmarkedFlush == message?.id ? (
                    <BookmarkAddedIcon sx={{ fontSize: '18px', color: '#000' }} />
                  ) : (
                    <BookmarkAddIcon sx={{ fontSize: '18px' }} />
                  )}
                </Box>
              </Tooltip>
            </Box>
          ) : (
            <Box></Box>
          )}
          <Box>
            {/* <Tooltip title={dateTime.formatDateTime(message?.created_at)}>
                <Box sx={{ fontSize: '12px', color: '#fff', background: '#333', p: '2px 10px', borderRadius: '5px' }}>
                  {{dateTime.humanReadableDiff(message?.created_at)} }

              </Tooltip> */}

            <Box sx={{ fontSize: '12px', color: '#fff', background: '#333', p: '2px 10px', borderRadius: '5px' }}>
              {dateTime.formatDateTime(message?.created_at)}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
