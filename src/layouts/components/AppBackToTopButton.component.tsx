import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { Box } from '@mui/material'
import { useEffect, useState } from 'react'

export default function AppBackToTopButton() {
  const [isVisible, setIsVisible] = useState<boolean>(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <Box
      className={`fixed bottom-4 right-4 rounded-full p-2 outline-none transition-opacity duration-200 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={scrollToTop}
      style={{ zIndex: 999 }}
      sx={{
        background: '#9333ea',
        color: '#fff',
        height: '40px',
        width: '40px',
        padding: '0',
        margin: '0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer'
      }}
    >
      <KeyboardArrowUpIcon />
    </Box>
  )
}
