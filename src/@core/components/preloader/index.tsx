// Preloader.js
import Box from '@mui/material/Box'
import { useEffect, useState } from 'react'

type TPreloaderProps = {
  close: boolean
}

const Preloader = (props: TPreloaderProps) => {
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

      if (newProgress < 100) {
        // Only update counter when progress is not complete
        setCounter(Math.floor(newProgress))
      }

      setProgress(newProgress)

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
        '& .percent': {
          position: 'relative'
        },
        '& svg': {
          position: 'relative',
          width: '210px',
          height: '210px',
          transform: 'rotate(-90deg)'
        },
        '& circle': {
          width: '100%',
          height: '100%',
          fill: 'none',
          stroke: '#f0f0f0',
          strokeWidth: '10',
          strokeLinecap: 'round',

          '&:last-of-type': {
            strokeDasharray: '625px',
            strokeDashoffset: `calc(625px - (625px * ${counter}) / 100)`,
            stroke: '#3498db'
          }
        },
        '& .number': {
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontWeight: '600',
          fontSize: '3.5rem',
          '& h3': {
            color: '#fff',
            '& span': {
              fontSize: '2rem'
            }
          }
        }
      }}
    >
      <Box>
        <div className='percent'>
          <svg>
            <circle cx='105' cy='105' r='100'></circle>
            <circle cx='105' cy='105' r='100'></circle>
          </svg>
          <div className='number'>
            <h3>
              {counter}
              <span>%</span>
            </h3>
          </div>
        </div>
      </Box>
    </Box>
  )
}

export default Preloader
