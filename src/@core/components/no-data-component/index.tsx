import { Box } from '@mui/material'

type TNoDataComponentProps = {
  data: any[]
}
export default function NoDataComponent(props: TNoDataComponentProps) {
  const { data = [] } = props

  if (!data?.length) {
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
