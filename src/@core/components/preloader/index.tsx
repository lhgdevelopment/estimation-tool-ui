// Preloader.js
import Box from '@mui/material/Box'

const Preloader = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100%',
        width: '100%',
        zIndex: '9999',
        background: '#dbdbdbcf',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Box>
        <Box sx={{ height: '50px', width: '50px' }} component={'img'} src={'/gif/hive-assist-loader.gif'} />
      </Box>
    </Box>
  )
}

export default Preloader
