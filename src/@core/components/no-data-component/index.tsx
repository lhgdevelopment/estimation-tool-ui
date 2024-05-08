import { Box } from '@mui/material'

type TNoDataComponentProps = {
  preload?: boolean
}
export default function NoDataComponent(props: TNoDataComponentProps) {
  const { preload = false } = props

  if (preload) {
    return (
      <Box
        sx={{
          padding: '27px',
          textAlign: 'center',
          color: '#dd2828',
          fontSize: '20px'
        }}
      >
        No Data Found!
      </Box>
    )
  } else {
    return <></>
  }
}
