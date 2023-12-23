// Preloader.js
import Box from '@mui/material/Box'
import { useEffect, useState } from 'react'

type TPreloade = {
  close: boolean
}
const Preloader = (props: TPreloade) => {
  const { close } = props
  const [progress, setProgress] = useState(0)
  const [counter, setCounter] = useState(0)
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    const duration = 5000
    const startTime = Date.now()

    const updateProgress = () => {
      const currentTime = Date.now()
      const elapsedTime = currentTime - startTime
      const newProgress = (elapsedTime / duration) * 100

      setProgress(newProgress)
      setCounter(Math.floor(newProgress))

      if (elapsedTime < duration && !closing) {
        requestAnimationFrame(updateProgress)
      } else {
        if (close) {
          setClosing(true)
        }
      }
    }

    const animationFrame = requestAnimationFrame(updateProgress)

    return () => {
      cancelAnimationFrame(animationFrame)
    }
  }, [close, closing])

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'fixed',
        width: '100%',
        height: '100%',
        zIndex: '99999',
        background: '#000000b5',
        top: '0',
        left: '0',
        opacity: closing ? 0 : 1,
        pointerEvents: closing ? 'none' : 'auto',
        transition: 'opacity 0.5s ease',
        '& svg': {
          width: '114px',
          height: '114px'
        },
        '& .bg': {
          fill: '#1a49b0',
          strokeWidth: '10px',
          stroke: '#1A2C34'
        },
        '& .meter': {
          fill: 'none',
          strokeWidth: '10px',
          strokeLinecap: 'round',
          transform: 'rotate(-90deg)',
          transformOrigin: '50% 50%',
          strokeDasharray: '360',
          strokeDashoffset: 360 - 360 * (progress / 100),
          stroke: '#7e3af2',
          animation: closing ? 'none' : 'progress 1s ease-out'
        },
        '& .counter': {
          fill: '#fff',
          fontSize: '24px',
          dominantBaseline: 'middle',
          textAnchor: 'middle'
        }
      }}
    >
      <Box>
        <svg>
          <circle className='bg' cx='57' cy='57' r='52' />
          <circle className='meter' cx='57' cy='57' r={52} />
          <text className='counter' x='57' y='57'>
            {counter}%
          </text>
        </svg>
      </Box>
    </Box>
  )
}

export default Preloader
