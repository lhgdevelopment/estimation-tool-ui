import { useToastSnackbar } from '@core/hooks/useToastSnackbar'
import { dateTime } from '@core/utils/dateTime'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import LinkIcon from '@mui/icons-material/Link'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import SearchIcon from '@mui/icons-material/Search'
import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Input,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Menu,
  MenuItem,
  MenuProps
} from '@mui/material'
import { alpha, styled } from '@mui/material/styles'
import { useRouter } from 'next/router'
import * as React from 'react'
import { ChangeEvent, useState } from 'react'

type Bookmark = {
  id: number
  title: string
  updated_at: string
  conversationDetailId: number
}

type ReplyThreadDrawerProps = {
  open: boolean
  onClose: () => void
  bookmarkList: Bookmark[]
  onEditBookmark: (bookmark: Bookmark) => void
  onRemoveBookmark: (id: number) => void
  onBookmarkClick: (messageId: number) => void
}

const ReplyThreadDrawer: React.FC<ReplyThreadDrawerProps> = ({
  open,
  onClose,
  bookmarkList,
  onEditBookmark,
  onRemoveBookmark,
  onBookmarkClick
}) => {
  const router = useRouter()
  const { showSnackbar } = useToastSnackbar()
  const [searchText, setSearchText] = useState<string>('')
  const [menuAnchor, setMenuAnchor] = useState<{ [key: number]: HTMLElement | null }>({})

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
  }

  const filteredBookmarks = bookmarkList?.filter(bookmark =>
    bookmark.title.toLowerCase().includes(searchText.toLowerCase())
  )

  const getHighlightedText = (text: string, highlight: string) => {
    if (!highlight) return text
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'))

    return parts.map((part, index) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <span key={index} style={{ backgroundColor: '#ffeb3b', fontWeight: 'bold' }}>
          {part}
        </span>
      ) : (
        part
      )
    )
  }

  const handleCopyUrl = (bookmarkId: number, conversationDetailId: number) => {
    const url = new URL(window.location.origin + router.asPath)
    url.searchParams.delete('conversationDetailId')

    url.searchParams.set('conversationDetailId', conversationDetailId.toString())

    navigator.clipboard.writeText(url.toString()).then(() => {
      showSnackbar('URL Copied!', { variant: 'success' })
    })

    handleBookmarkMenuClose(bookmarkId)
  }

  const handleBookmarkMenuClick = (event: React.MouseEvent<HTMLElement>, bookmarkId: number) => {
    setMenuAnchor(prevState => ({
      ...prevState,
      [bookmarkId]: event.currentTarget
    }))
  }

  const handleBookmarkMenuClose = (bookmarkId: number) => {
    setMenuAnchor(prevState => ({
      ...prevState,
      [bookmarkId]: null
    }))
  }

  const StyledMenu = styled((props: MenuProps) => (
    <Menu
      elevation={0}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right'
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      {...props}
    />
  ))(({ theme }) => ({
    '& .MuiPaper-root': {
      borderRadius: 6,
      marginTop: theme.spacing(1),
      minWidth: 120,
      color: 'rgb(55, 65, 81)',
      boxShadow:
        'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
      '& .MuiMenu-list': {
        padding: '4px 0'
      },
      '& .MuiMenuItem-root': {
        fontSize: 14,
        '& .MuiSvgIcon-root': {
          fontSize: 16,
          color: theme.palette.text.secondary,
          marginRight: theme.spacing(1.5)
        },
        '&:active': {
          backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity)
        }
      }
    }
  }))

  return (
    <Drawer open={open} onClose={onClose} anchor='right'>
      <Box sx={{ width: '320px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Box sx={{ boxShadow: '0px 1px 5px -3px #334' }}>
          <Box sx={{ padding: '10px', color: '#333', textAlign: 'center', fontSize: '14px', fontWeight: '600' }}>
            Saved Bookmark List
          </Box>
          <Box>
            <Input
              placeholder='Search bookmarks...'
              startAdornment={<SearchIcon />}
              value={searchText}
              onChange={handleSearchChange}
              fullWidth
              sx={{ px: 1 }}
            />
          </Box>
        </Box>
        <Box sx={{ height: 'calc(100vh - 114px)', overflow: 'auto' }}>
          {!!filteredBookmarks.length ? (
            <List sx={{ width: '100%', bgcolor: 'background.paper', py: 1, mt: 1 }}>
              {filteredBookmarks.map(bookmark => (
                <ListItem
                  key={bookmark.id}
                  sx={{ py: 0, cursor: 'pointer' }}
                  onClick={() => onBookmarkClick(bookmark.conversationDetailId)}
                >
                  <ListItemText
                    primary={getHighlightedText(bookmark.title, searchText)}
                    secondary={dateTime.formatDateTime(bookmark.updated_at)}
                    primaryTypographyProps={{ fontSize: '14px' }}
                    secondaryTypographyProps={{ fontSize: '12px' }}
                  />
                  <ListItemSecondaryAction>
                    <IconButton onClick={event => handleBookmarkMenuClick(event, bookmark.id)}>
                      <MoreVertIcon sx={{ fontSize: '20px' }} />
                    </IconButton>
                    <StyledMenu
                      id={`bookmark-menu-${bookmark.id}`}
                      anchorEl={menuAnchor[bookmark.id]}
                      open={Boolean(menuAnchor[bookmark.id])}
                      onClose={() => handleBookmarkMenuClose(bookmark.id)}
                      MenuListProps={{
                        'aria-labelledby': `bookmark-menu-button-${bookmark.id}`
                      }}
                    >
                      <MenuItem onClick={() => handleCopyUrl(bookmark.id, bookmark.conversationDetailId)} disableRipple>
                        <LinkIcon />
                        Copy URL
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          handleBookmarkMenuClose(bookmark.id)
                          onEditBookmark(bookmark)
                        }}
                        disableRipple
                      >
                        <EditIcon />
                        Edit
                      </MenuItem>
                      <Divider sx={{ my: 0.5 }} />
                      <MenuItem
                        onClick={() => {
                          handleBookmarkMenuClose(bookmark.id)
                          onRemoveBookmark(bookmark.id)
                        }}
                        disableRipple
                        sx={{ color: '#f44336' }}
                      >
                        <DeleteIcon sx={{ color: '#f44336 !important' }} />
                        Delete
                      </MenuItem>
                    </StyledMenu>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          ) : (
            <Box
              sx={{
                height: 'calc(100vh - 100px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <BookmarkBorderIcon />
              <Box sx={{ fontSize: '14px' }}>No matching bookmarks found</Box>
            </Box>
          )}
        </Box>
        <Box>
          <Button variant='contained' color='error' onClick={onClose} fullWidth sx={{ borderRadius: 0 }}>
            Close
          </Button>
        </Box>
      </Box>
    </Drawer>
  )
}

export default ReplyThreadDrawer
