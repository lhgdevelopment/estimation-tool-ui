import React, { ChangeEvent, DragEvent, useState } from 'react'
import { CircularProgress } from '@mui/material'
import apiRequest from '../../utils/axios-config'
import Box from '@mui/material/Box'
import { multipleImageShow } from '../../styles/libs/common-style'
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault'
import InputLabel from '@mui/material/InputLabel'

type FileUploaderProps = React.InputHTMLAttributes<HTMLInputElement> & {
  onUpload: (urls: string[]) => void
  label?: string
  name?: string
  accept?: string
  multiple?: boolean
  value?: string[]
}
type FileListState = Record<string, string[]>
const FileUploader = (props: FileUploaderProps) => {
  const {
    onUpload,
    accept = '.jpg, .jpeg, .png, .gif, .pdf',
    name = '',
    multiple = true,
    label = '',
    value = []
  } = props
  const [loading, setLoading] = useState<boolean>(false)
  const [dragging, setDragging] = useState<boolean>(false)
  const [fileList, setFileList] = useState<FileListState>({ [name]: value || [] })

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files) as File[]

      try {
        setLoading(true)

        for (const file of selectedFiles) {
          const formData = new FormData()
          formData.append('files', file)

          const response = await apiRequest.post('files/upload', formData)

          response.data?.map((file: any, index: number) => {
            setFileList(prevState => {
              return { [name]: [...prevState[name], file.url] }
            })
          })
        }

        onUpload(fileList?.[name])
      } catch (error) {
        console.error('Error uploading files:', error)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(true)
  }

  const handleDragLeave = () => {
    setDragging(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(false)

    if (e.dataTransfer.files) {
      const droppedFiles = Array.from(e.dataTransfer.files) as File[]
      handleFileChange({
        target: {
          files: droppedFiles
        }
      } as unknown as ChangeEvent<HTMLInputElement>)
    }
  }
  const handleUploadOnRemove = (index: number) => {
    const updatedFileList: string[] = fileList?.[name]?.[name].filter((item, i) => i !== index)
    setFileList(updatedFileList)
  }

  return (
    <div>
      {label && <label>{label}</label>}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          border: '2px dashed #cccccc',
          borderRadius: '4px',
          textAlign: 'center',
          cursor: 'pointer',
          background: dragging ? '#f5f5f5' : 'transparent',
          marginTop: '8px',
          position: 'relative',
          height: '100px'
        }}
      >
        <input
          type='file'
          id='file-input'
          onChange={handleFileChange}
          {...props}
          style={{ display: 'none' }}
          accept={accept}
          multiple={multiple}
        />
        <InputLabel
          htmlFor='file-input'
          sx={{
            position: 'absolute',

            /* padding: '20px', */
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <p>Drag & Drop files here or click to select files</p>
        </InputLabel>
      </div>
      {loading && <CircularProgress size={24} />}
      <Box>
        {!!fileList?.[name]?.length && (
          <Box sx={multipleImageShow}>
            {fileList?.[name]?.map((url: string, index: number) => (
              <Box key={index} className={'img'}>
                <img src={url} alt='Attachments' key={index} />
                <DisabledByDefaultIcon
                  className='cancelIcon'
                  onClick={() => {
                    handleUploadOnRemove(index)
                  }}
                />
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </div>
  )
}

export default FileUploader
