import ClearIcon from '@material-ui/icons/Clear'
import AddIcon from '@mui/icons-material/Add'
import EditNoteIcon from '@mui/icons-material/EditNote'
import { Box, Modal } from '@mui/material'
import dynamic from 'next/dynamic'
import React from 'react'
import { Dropdown } from 'src/@core/components/dropdown'

type TServiceTreeFormModalComponentProps = {
  serviceModalOpen: boolean
  handleServiceModalOpen: () => boolean
  onServiceSubmit: (e: React.FormEvent<any>) => void
  serviceFormData: any
}
export default function ServiceTreeFormModalComponent(props: TServiceTreeFormModalComponentProps) {
  const { handleServiceModalOpen, onServiceSubmit, serviceModalOpen } = props
  const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false })
  const isDark = useSelector((state: RootState) => state.theme.isDark)
  const nameEditorRef = useRef(null)

  return (
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
        <Box className='p-5 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800' sx={{ display: 'flex', width: '50%' }}>
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
  )
}
