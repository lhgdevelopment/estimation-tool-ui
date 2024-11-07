import { dateTime } from '@core/utils/dateTime'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import SearchIcon from '@mui/icons-material/Search'
import {
  Box,
  Button,
  Drawer,
  IconButton,
  Input,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText
} from '@mui/material'
import { ChangeEvent, useState } from 'react'

type Bookmark = {
  id: number
  title: string
  updated_at: string
  conversationDetailId: number
}

type BookmarkDrawerProps = {
  open: boolean
  onClose: () => void
  bookmarkList: Bookmark[]
  onEditBookmark: (bookmark: Bookmark) => void
  onRemoveBookmark: (id: number) => void
  onBookmarkClick: (messageId: number) => void
}

const BookmarkDrawer: React.FC<BookmarkDrawerProps> = ({
  open,
  onClose,
  bookmarkList,
  onEditBookmark,
  onRemoveBookmark,
  onBookmarkClick
}) => {
  const [searchText, setSearchText] = useState<string>('')

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
  }

  // Filter bookmarks based on search input
  const filteredBookmarks = bookmarkList?.filter(bookmark =>
    bookmark.title.toLowerCase().includes(searchText.toLowerCase())
  )

  // Function to highlight matching text
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

  return (
    <Drawer open={open} onClose={onClose} anchor='right'>
      <Box sx={{ width: '250px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Box
          sx={{
            boxShadow: '0px 1px 5px -3px #334'
          }}
        >
          <Box
            sx={{
              padding: '10px',
              color: '#333',
              textAlign: 'center',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
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
                    secondary={dateTime.formatDateTime(bookmark?.updated_at)}
                    primaryTypographyProps={{ fontSize: '14px' }}
                    secondaryTypographyProps={{ fontSize: '12px' }}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      onClick={e => {
                        e.stopPropagation()
                        onEditBookmark(bookmark)
                      }}
                    >
                      <EditIcon sx={{ fontSize: '18px' }} />
                    </IconButton>
                    <IconButton
                      onClick={e => {
                        e.stopPropagation()
                        onRemoveBookmark(bookmark.id)
                      }}
                      color='error'
                    >
                      <DeleteIcon sx={{ fontSize: '18px' }} />
                    </IconButton>
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

export default BookmarkDrawer
