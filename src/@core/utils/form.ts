import { SelectChangeEvent } from '@mui/material'
import { Dispatch, SetStateAction } from 'react'

export const handleFormInputChange = (e: any, formData: any, setFormData: Dispatch<SetStateAction<any>>) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value
  })
}

export const handleFormSelectChange = (
  e: SelectChangeEvent<any>,
  formData: any,
  setFormData: Dispatch<SetStateAction<any>>
) => {
  setFormData({
    ...formData,
    [e?.target?.name]: e?.target?.value
  })
}
